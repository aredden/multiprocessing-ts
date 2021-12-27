/// <reference types="node" />
import { ChildProcess } from 'child_process';
import type { Job, FNOrModulePath, JobOptions } from '.';
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
    registerJob<T = any, R = T, M = string | CallableFunction | any>(jobId: string, fnOrModulePath: FNOrModulePath<M>, options: JobOptions, callback: (err: Error | null | undefined, data?: {
        index: number;
        result: R;
    }) => void): void;
    deregisterJob(jobId: string | number): void;
    terminateImmediately(): void;
    terminateAfterJobsComplete(): void;
    startJobTimeout(job: Job): void;
}
