'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const child_process_1 = require('child_process');
const json_utils_1 = __importDefault(require('./json-utils'));
const has_1 = __importDefault(require('lodash/has'));
const allWorkers = [];
process.on('exit', () => allWorkers.forEach((worker) => worker.process?.kill()));
function makeError(errorMsg, stack) {
	const err = new Error(errorMsg);
	err.stack = stack;
	return err;
}
class WorkerWrapper {
	constructor() {
		this.process = null;
		this.runningJobs = 0;
		this.terminated = false;
		this.registeredJobs = {};
		this.fnOrModulePaths = {};
		this.timeout = null;
		this.startWorkerProcess();
		allWorkers.push(this);
	}
	startWorkerProcess() {
		this.process = (0, child_process_1.fork)(`${__dirname}/worker.js`);
		for (const regJobId in this.registeredJobs) {
			if ((0, has_1.default)(this.registeredJobs, regJobId)) {
				const job = this.registeredJobs[regJobId];
				this.registerJob(regJobId, job.fnOrModulePath, {}, job.callback);
			}
		}
		this.process.on('message', (data) => {
			if (!this.registeredJobs || !this.registeredJobs[data.jobId]) {
				throw new Error('No job was registered for: ' + data.jobId);
			}
			const job = this.registeredJobs[data.jobId];
			if (job.terminated) {
				return;
			}
			if (this.timeout) {
				clearTimeout(this.timeout);
			}
			let err = null;
			if (data.error) {
				err = makeError(data.error, data.stack);
			}
			job.callback(err, data);
			if (data.jobDone) {
				this.runningJobs -= 1;
			} else if (job.timeout > 0) {
				this.startJobTimeout(job);
			}
			if (this.terminated && this.runningJobs === 0 && this.process) {
				this.process.disconnect();
			}
		});
	}
	runJob(jobId, index, argList) {
		if (this.terminated) {
			return;
		} // TODO: should this be an error?
		this.process?.send({
			jobId: jobId,
			index: index,
			argList: json_utils_1.default.safeStringify(argList),
		});
		this.runningJobs += 1;
		if (!this.registeredJobs) {
			console.log('warning no registered jobs for jobId', jobId);
			return;
		}
		const job = this.registeredJobs[jobId];
		if (job.timeout > 0) {
			this.startJobTimeout(job);
		}
	}
	registerJob(jobId, fnOrModulePath, options, callback) {
		const timeout = (options ? options.timeout : null) || -1;
		if (this.terminated) {
			return;
		} // TODO: should this be an error?
		if (!this.registeredJobs) {
			console.error('No jobs registered');
			return;
		}
		this.registeredJobs[jobId] = { callback, fnOrModulePath, timeout, options, terminated: false };
		const modulePath = typeof fnOrModulePath === 'string' ? fnOrModulePath : null;
		const fnStr = typeof fnOrModulePath === 'function' ? fnOrModulePath.toString() : null;
		this.process?.send({
			jobId: jobId,
			modulePath: modulePath,
			fnStr: fnStr,
		});
	}
	deregisterJob(jobId) {
		if (this.terminated) {
			return;
		} // TODO: should this be an error?
		if (this.registeredJobs) {
			delete this.registeredJobs[jobId];
			this.process?.send({
				jobId: jobId,
				deregisterJob: true,
			});
		}
	}
	terminateImmediately() {
		this.terminated = true;
		this.process?.disconnect();
		for (const cbName in this.registeredJobs) {
			if ((0, has_1.default)(this.registeredJobs, cbName)) {
				this.registeredJobs[cbName].callback(new Error('Pool was closed'), null);
			}
		}
	}
	terminateAfterJobsComplete() {
		this.terminated = true;
		if (this.runningJobs === 0) {
			if (this.process?.connected) {
				this.process.disconnect();
			}
		}
	}
	startJobTimeout(job) {
		this.timeout = setTimeout(() => {
			job.terminated = true;
			this.process?.kill();
			this.startWorkerProcess();
			job.callback(new Error('Task timed out'), null);
		}, job.timeout);
	}
}
exports.default = WorkerWrapper;
