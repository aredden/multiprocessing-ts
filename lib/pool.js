'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const json_utils_1 = __importDefault(require('./json-utils'));
const worker_wrapper_1 = __importDefault(require('./worker-wrapper'));
const bluebird_1 = __importDefault(require('bluebird'));
const os_1 = __importDefault(require('os'));
const has_1 = __importDefault(require('lodash/has'));
class Pool {
	constructor(numWorkers) {
		numWorkers = numWorkers || os_1.default.cpus().length;
		this.queue = [];
		this.closed = false;
		this.workers = Array.from(new Array(numWorkers)).map(() => new worker_wrapper_1.default());
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
	define(name, fnOrModulePath, options) {
		if ((0, has_1.default)(this, name)) {
			throw new Error(`Pool already has a property "${String(name)}"`);
		}
		this[name] = {
			map: (arg) => this.map(arg, fnOrModulePath, options),
			apply: (arg) => this.apply(arg, fnOrModulePath, options),
		};
	}
	// Applies single argument to a function and returns result via a Promise
	apply(arg, fnOrModulePath, options) {
		return this.map([arg], fnOrModulePath, options).spread((result) => result);
	}
	map(arr, fnOrModulePath, options) {
		return new bluebird_1.default((resolve, reject) =>
			this._queuePush(arr, fnOrModulePath, options, (err, data) => (err ? reject(err) : resolve(data)))
		);
	}
	_queuePush(arr, fnOrModulePath, options, cb) {
		options = options || {};
		const chunksize = typeof options === 'number' ? options : options.chunksize;
		if (this.closed) {
			return cb(new Error('Pool has been closed'), null);
		}
		this._assertIsUsableFnOrModulePath(fnOrModulePath);
		if (!arr || !arr.length) {
			return cb(null, []);
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
	_registerJobWithWorkers(job) {
		const result = [];
		let tasksRemaining = job.arr.length;
		let jobTerminated = false;
		this.workers.forEach((worker) => {
			worker.registerJob(job.id, job.fnOrModulePath, job.options, (err, data) => {
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
				result[data.index] = json_utils_1.default.safeParse(data.result);
				if (job.options && job.options.onResult) {
					job.options.onResult(result[data.index], data.index);
				}
				tasksRemaining -= 1;
				if (tasksRemaining <= 0) {
					worker.deregisterJob(job.id);
					return job.cb(null, result);
				}
			});
		});
	}
	_assertIsUsableFnOrModulePath(fnOrModulePath) {
		if (typeof fnOrModulePath !== 'function' && typeof fnOrModulePath !== 'string') {
			throw new Error('fnOrModulePath must be a function or a string');
		}
	}
	_getNextJobId() {
		return this._nextJobId++;
	}
}
exports.default = Pool;
//# sourceMappingURL=../src/src/pool.js.map
