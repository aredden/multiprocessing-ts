import jsonUtils from './json-utils';
import WorkerWrapper from './worker-wrapper';
import P from 'bluebird';
import os from 'os';
import has from 'lodash/has';
import type { Job, JobOptions, FNOrModulePath } from '.';

export default class Pool<T = any> {
	[x: PropertyKey]: any;
	queue: Job<T>[];
	closed: boolean;
	workers: WorkerWrapper[];
	readyWorkers: WorkerWrapper[];
	_nextJobId: number;
	constructor(numWorkers: number) {
		numWorkers = numWorkers || os.cpus().length;

		this.queue = [];
		this.closed = false;
		this.workers = Array.from(new Array(numWorkers)).map(() => new WorkerWrapper());
		this.readyWorkers = this.workers.slice();
		this._nextJobId = 0;
	}

	// Prevents any more tasks from being submitted to the pool.
	// Once all the tasks have been completed the worker processes will exit.
	close() {
		this.closed = true;
		this.workers.forEach((worker) => worker.terminateAfterJobsComplete());
	}

	// Stops the worker processes immediately without completing outstanding work.
	terminate() {
		this.closed = true;
		this.workers.forEach((worker) => worker.terminateImmediately());
	}

	define<M = CallableFunction>(name: PropertyKey, fnOrModulePath: FNOrModulePath<M>, options?: any) {
		if (has(this, name)) {
			throw new Error(`Pool already has a property "${String(name)}"`);
		}
		this[name] = {
			map: (arg: any) => this.map(arg, fnOrModulePath, options),
			apply: (arg: any) => this.apply(arg, fnOrModulePath, options),
		};
	}

	// Applies single argument to a function and returns result via a Promise
	apply<T = any, R = T, M = CallableFunction>(
		arg: T,
		fnOrModulePath: FNOrModulePath<M>,
		options?: any
	): P<R> {
		return this.map<T, R, M>([arg], fnOrModulePath, options).spread((result) => result);
	}

	map<T = any, R = T, M = CallableFunction | string>(
		arr: T[],
		fnOrModulePath: FNOrModulePath<M>,
		options?: any
	) {
		return new P<R[]>((resolve, reject) =>
			this._queuePush(arr, fnOrModulePath, options, (err: any, data: any) =>
				err ? reject(err) : resolve(data)
			)
		);
	}

	_queuePush<T = any, R = T, M = CallableFunction | string>(
		arr: T[],
		fnOrModulePath: FNOrModulePath<M>,
		options?: JobOptions,
		cb?: { (err: any, data: any): void; (arg0: Error, arg1: any[]): any }
	) {
		options = options || {};
		const chunksize = typeof options === 'number' ? options : options.chunksize;

		if (this.closed) {
			return cb !== undefined && cb(new Error('Pool has been closed'), null);
		}
		this._assertIsUsableFnOrModulePath(fnOrModulePath);
		if (!arr || !arr.length) {
			return cb !== undefined && cb(null, []);
		}

		const job: Job<T, R, CallableFunction | string, typeof Function> = {
			id: this._getNextJobId(),
			arr: arr,
			fnOrModulePath: fnOrModulePath,
			chunksize: chunksize || Math.ceil(arr.length / this.workers.length),
			cb: cb,
			nextIndex: 0,
			options: options,
		} as any;
		this._registerJobWithWorkers<T, R, M>(job);
		this.queue.push(job as any);
		this._queueTick();
	}

	_queueTick() {
		while (this.queue.length && this.readyWorkers.length) {
			const job = this.queue[0];
			const chunk = job.arr.slice(job.nextIndex, (job.nextIndex as number) + (job.chunksize as number));

			this.readyWorkers.pop()?.runJob(job.id, job.nextIndex as number, chunk);
			job.nextIndex = job.nextIndex as number;
			job.nextIndex += job.chunksize as number;

			if (job.nextIndex >= job.arr.length) {
				this.queue.shift();
			}
		}
	}

	_registerJobWithWorkers<T = any, R = T, M = CallableFunction>(job: Job<T, R, any, typeof Function>) {
		const result: R[] = [];
		let tasksRemaining = job.arr?.length ? job.arr.length : 0;
		let jobTerminated = false;
		this.workers.forEach((worker) => {
			worker.registerJob<T, R>(
				typeof job.id === 'number' ? String(job.id) : job.id,
				job.fnOrModulePath as FNOrModulePath<M>,
				job.options ? job.options : {},
				(err: Error | null | undefined, data: { index: number; result: R } | undefined) => {
					this.readyWorkers.push(worker);
					this._queueTick();

					if (jobTerminated) {
						return worker.deregisterJob(job.id);
					}

					if (err) {
						worker.deregisterJob(job.id);
						jobTerminated = true;
						return job.cb(err, null);
					}
					if (!data) {
						throw 'No data returned from worker.';
					}
					if (typeof data.result === 'string') {
						result[data.index] = jsonUtils.safeParse(data.result);
					}
					if (job.options && job.options.onResult) {
						job.options.onResult(result[data.index], data.index);
					}
					tasksRemaining -= 1;
					if (tasksRemaining <= 0) {
						worker.deregisterJob(job.id);
						return job.cb(null, result);
					}
				}
			);
		});
	}

	_assertIsUsableFnOrModulePath(fnOrModulePath: FNOrModulePath<any>) {
		if (typeof fnOrModulePath !== 'function' && typeof fnOrModulePath !== 'string') {
			throw new Error('fnOrModulePath must be a function or a string');
		}
	}

	_getNextJobId() {
		return this._nextJobId++;
	}
}
