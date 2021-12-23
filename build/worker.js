"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var json_utils_1 = __importDefault(require("./json-utils"));
var jobFns = {};
var isPromise = function isPromise(obj) {
    return obj && typeof obj.then === 'function';
};
function processData(argList, jobId, index) {
    function sendErr(err) {
        if (process.send) process.send({
            jobId: jobId,
            error: err.message,
            stack: err.stack
        });
    }
    function sendSucess(res, offset) {
        if (process.send) process.send({
            jobId: jobId,
            index: index + offset,
            result: json_utils_1.default.safeStringify(res),
            jobDone: offset === argList.length - 1
        });
    }
    function handlePromise(promise, offset) {
        return promise.then(function (res) {
            return sendSucess(res, offset);
        }, sendErr);
    }
    try {
        var fn = jobFns[jobId];
        argList.forEach(function (args, offset) {
            var res = fn(args);
            return isPromise(res) ? handlePromise(res, offset) : sendSucess(res, offset);
        });
    } catch (err) {
        return sendErr(err);
    }
}
process.on('message', function (data) {
    if (data.argList) {
        processData(json_utils_1.default.safeParse(data.argList), data.jobId, data.index);
    }
    if (data.deregisterJob) {
        delete jobFns[data.jobId];
        return;
    }
    if (data.modulePath) {
        jobFns[data.jobId] = require(data.modulePath);
    }
    if (data.fnStr) {
        var fn = void 0;
        eval('fn =' + data.fnStr); // eslint-disable-line
        jobFns[data.jobId] = fn;
    }
});
//# sourceMappingURL=../src/src/worker.js.map