"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var json_utils_1 = __importDefault(require("./json-utils"));
var allWorkers = [];
process.on('exit', function () {
    return allWorkers.forEach(function (worker) {
        return worker.process.kill();
    });
});
function makeError(errorMsg, stack) {
    var err = new Error(errorMsg);
    err.stack = stack;
    return err;
}

var WorkerWrapper = function () {
    function WorkerWrapper() {
        _classCallCheck(this, WorkerWrapper);

        // @ts-ignore
        this.process = null;
        this.runningJobs = 0;
        this.terminated = false;
        this.registeredJobs = {};
        this.fnOrModulePaths = {};
        // @ts-ignore
        this.timeout = null;
        this.startWorkerProcess();
        allWorkers.push(this);
    }

    _createClass(WorkerWrapper, [{
        key: "startWorkerProcess",
        value: function startWorkerProcess() {
            var _this = this;

            this.process = (0, child_process_1.fork)(__dirname + "/worker.js");
            for (var regJobId in this.registeredJobs) {
                if (this.registeredJobs.hasOwnProperty(regJobId)) {
                    var job = this.registeredJobs[regJobId];
                    this.registerJob(regJobId, job.fnOrModulePath, {}, job.callback);
                }
            }
            this.process.on('message', function (data) {
                if (!_this.registeredJobs || !_this.registeredJobs[data.jobId]) {
                    throw new Error('No job was registered for: ' + data.jobId);
                }
                var job = _this.registeredJobs[data.jobId];
                if (job.terminated) {
                    return;
                }
                clearTimeout(_this.timeout);
                var err = null;
                if (data.error) {
                    err = makeError(data.error, data.stack);
                }
                job.callback(err, data);
                if (data.jobDone) {
                    _this.runningJobs -= 1;
                } else if (job.timeout > 0) {
                    _this.startJobTimeout(job);
                }
                if (_this.terminated && _this.runningJobs === 0) {
                    _this.process.disconnect();
                }
            });
        }
    }, {
        key: "runJob",
        value: function runJob(jobId, index, argList) {
            if (this.terminated) {
                return;
            } // TODO: should this be an error?
            this.process.send({
                jobId: jobId,
                index: index,
                argList: json_utils_1.default.safeStringify(argList)
            });
            this.runningJobs += 1;
            if (!this.registeredJobs) {
                console.log('warning no registered jobs for jobId', jobId);
                return;
            }
            var job = this.registeredJobs[jobId];
            if (job.timeout > 0) {
                this.startJobTimeout(job);
            }
        }
    }, {
        key: "registerJob",
        value: function registerJob(jobId, fnOrModulePath, options, callback) {
            var timeout = (options ? options.timeout : null) || -1;
            if (this.terminated) {
                return;
            } // TODO: should this be an error?
            if (!this.registeredJobs) {
                console.error('No jobs registered');
                return;
            }
            this.registeredJobs[jobId] = { callback: callback, fnOrModulePath: fnOrModulePath, timeout: timeout, options: options, terminated: false };
            var modulePath = typeof fnOrModulePath === 'string' ? fnOrModulePath : null;
            var fnStr = typeof fnOrModulePath === 'function' ? fnOrModulePath.toString() : null;
            this.process.send({
                jobId: jobId,
                modulePath: modulePath,
                fnStr: fnStr
            });
        }
    }, {
        key: "deregisterJob",
        value: function deregisterJob(jobId) {
            if (this.terminated) {
                return;
            } // TODO: should this be an error?
            if (this.registeredJobs) {
                delete this.registeredJobs[jobId];
                this.process.send({
                    jobId: jobId,
                    deregisterJob: true
                });
            }
        }
    }, {
        key: "terminateImmediately",
        value: function terminateImmediately() {
            this.terminated = true;
            this.process.disconnect();
            for (var cbName in this.registeredJobs) {
                if (this.registeredJobs.hasOwnProperty(cbName)) {
                    this.registeredJobs[cbName].callback(new Error('Pool was closed'), null);
                }
            }
        }
    }, {
        key: "terminateAfterJobsComplete",
        value: function terminateAfterJobsComplete() {
            this.terminated = true;
            if (this.runningJobs === 0) {
                this.process.disconnect();
            }
        }
    }, {
        key: "startJobTimeout",
        value: function startJobTimeout(job) {
            var _this2 = this;

            this.timeout = setTimeout(function () {
                job.terminated = true;
                _this2.process.kill();
                _this2.startWorkerProcess();
                job.callback(new Error('Task timed out'), null);
            }, job.timeout);
        }
    }]);

    return WorkerWrapper;
}();

exports.default = WorkerWrapper;
//# sourceMappingURL=../src/src/worker-wrapper.js.map