/// <reference types="node" />
import { ChildProcess } from 'child_process';
declare type Job = {
    callback: (...args: any[]) => void;
    fnOrModulePath: string | ((...args: any[]) => void);
    timeout: number;
    options: object;
    terminated: boolean;
};
export default class WorkerWrapper {
    process: ChildProcess | null;
    runningJobs: number;
    terminated: boolean;
    registeredJobs: Record<string, Job>;
    fnOrModulePaths: object;
    timeout: NodeJS.Timeout | null;
    constructor();
    startWorkerProcess(): void;
    runJob<T>(jobId: string | number, index: number, argList: T[]): void;
    registerJob<T, R>(jobId: string, fnOrModulePath: ((...args: T[]) => R) | string, options: {
        timeout?: number;
    }, callback: (...args: R[]) => void): void;
    deregisterJob(jobId: string | number): void;
    terminateImmediately(): void;
    terminateAfterJobsComplete(): void;
    startJobTimeout(job: Job): void;
}
export {};
//# sourceMappingURL=../src/src/worker-wrapper.d.ts.map