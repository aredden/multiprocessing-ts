"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json_utils_1 = __importDefault(require("./json-utils"));
const jobFns = {};
const isPromise = (obj) => obj && typeof obj.then === 'function';
function processData(argList, jobId, index) {
    function sendErr(err) {
        if (process.send)
            process.send({
                jobId: jobId,
                error: err.message,
                stack: err.stack,
            });
    }
    function sendSucess(res, offset) {
        if (process.send)
            process.send({
                jobId: jobId,
                index: index + offset,
                result: json_utils_1.default.safeStringify(res),
                jobDone: offset === argList.length - 1,
            });
    }
    function handlePromise(promise, offset) {
        return promise.then((res) => sendSucess(res, offset), sendErr);
    }
    try {
        const fn = jobFns[jobId];
        argList.forEach((args, offset) => {
            const res = fn(args);
            return isPromise(res) ? handlePromise(res, offset) : sendSucess(res, offset);
        });
    }
    catch (err) {
        return sendErr(err);
    }
}
process.on('message', (data) => {
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
        let fn;
        eval('fn =' + data.fnStr); // eslint-disable-line
        jobFns[data.jobId] = fn;
    }
});
//# sourceMappingURL=../src/src/worker.js.map