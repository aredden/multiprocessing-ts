/// <reference types="node" />
import { ChildProcess } from 'child_process';
declare type Job = {
    callback: Function;
    fnOrModulePath: string | Function;
    timeout: number;
    options: object;
    terminated: boolean;
};
export default class WorkerWrapper {
    process: ChildProcess;
    runningJobs: number;
    terminated: boolean;
    registeredJobs: Record<string, Job>;
    fnOrModulePaths: object;
    timeout: NodeJS.Timeout;
    constructor();
    startWorkerProcess(): void;
    runJob(jobId: string | number, index: any, argList: any): void;
    registerJob(jobId: string, fnOrModulePath: Function | string, options: {
        timeout?: number;
    }, callback: Function): void;
    deregisterJob(jobId: string | number): void;
    terminateImmediately(): void;
    terminateAfterJobsComplete(): void;
    startJobTimeout(job: Job): void;
}
export {};
//# sourceMappingURL=../src/src/worker-wrapper.d.ts.map