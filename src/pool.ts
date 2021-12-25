import jsonUtils from './json-utils';
import WorkerWrapper from './worker-wrapper';
import P from 'bluebird';
import os from 'os';
import has from 'lodash/has';

export default class Pool {
	[x: PropertyKey]: any;
	queue: any[];
	closed: boolean;
	workers: any[];
	readyWorkers: any;
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

	define(name: PropertyKey, fnOrModulePath: (arg: any) => unknown | string, options?: any) {
		if (has(this, name)) {
			throw new Error(`Pool already has a property "${String(name)}"`);
		}
		this[name] = {
			map: (arg: any) => this.map(arg, fnOrModulePath, options),
			apply: (arg: any) => this.apply(arg, fnOrModulePath, options),
		};
	}

	// Applies single argument to a function and returns result via a Promise
	apply<T = any, R = T>(arg: T, fnOrModulePath: (arg: T) => R | string, options?: any): P<R> {
		return this.map<T, R>([arg], fnOrModulePath, options).spread((result) => result);
	}

	map<T = any, R = T>(arr: T[], fnOrModulePath: any, options?: any) {
		return new P<R[]>((resolve, reject) =>
			this._queuePush(arr, fnOrModulePath, options, (err: any, data: any) =>
				err ? reject(err) : resolve(data)
			)
		);
	}

	_queuePush(
		arr: string | any[],
		fnOrModulePath: any,
		options?: { chunksize?: any },
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

		const job = {
			id: this._getNextJobId(),
			arr: arr,
			fnOrModulePath: fnOrModulePath,
			chunksize: chunksize || Math.ceil(arr.length / this.workers.length),
			cb: cb,
			nextIndex: 0,
			options: options,
		};
		this._registerJobWithWorkers(job);
		this.queue.push(job);
		this._queueTick();
	}

	_queueTick() {
		while (this.queue.length && this.readyWorkers.length) {
			const job = this.queue[0];
			const chunk = job.arr.slice(job.nextIndex, job.nextIndex + job.chunksize);
			this.readyWorkers.pop().runJob(job.id, job.nextIndex, chunk);
			job.nextIndex += job.chunksize;
			if (job.nextIndex >= job.arr.length) {
				this.queue.shift();
			}
		}
	}

	_registerJobWithWorkers(job: {
		id: any;
		arr: any;
		fnOrModulePath: any;
		chunksize?: any;
		cb?: any;
		nextIndex?: number;
		options?: any;
	}) {
		const result: any[] = [];
		let tasksRemaining = job.arr.length;
		let jobTerminated = false;
		this.workers.forEach((worker) => {
			worker.registerJob(
				job.id,
				job.fnOrModulePath,
				job.options,
				(err: any, data: { index: number; result: any }) => {
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

					result[data.index] = jsonUtils.safeParse(data.result);
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

	_assertIsUsableFnOrModulePath(fnOrModulePath: any) {
		if (typeof fnOrModulePath !== 'function' && typeof fnOrModulePath !== 'string') {
			throw new Error('fnOrModulePath must be a function or a string');
		}
	}

	_getNextJobId() {
		return this._nextJobId++;
	}
}
