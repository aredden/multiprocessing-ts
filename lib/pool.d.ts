import WorkerWrapper from './worker-wrapper';
import P from 'bluebird';
import type { Job, JobOptions, FNOrModulePath } from '.';
export default class Pool<T = any> {
    [x: PropertyKey]: any;
    queue: Job<T>[];
    closed: boolean;
    workers: WorkerWrapper[];
    readyWorkers: WorkerWrapper[];
    _nextJobId: number;
    constructor(numWorkers: number);
    close(): void;
    terminate(): void;
    define<M = CallableFunction>(name: PropertyKey, fnOrModulePath: FNOrModulePath<M>, options?: any): void;
    apply<T = any, R = T, M = CallableFunction>(arg: T, fnOrModulePath: FNOrModulePath<M>, options?: any): P<R>;
    map<T = any, R = T, M = CallableFunction | string>(arr: T[], fnOrModulePath: FNOrModulePath<M>, options?: any): P<R[]>;
    _queuePush<T = any, R = T, M = CallableFunction | string>(arr: T[], fnOrModulePath: FNOrModulePath<M>, options?: JobOptions, cb?: {
        (err: any, data: any): void;
        (arg0: Error, arg1: any[]): any;
    }): false | void;
    _queueTick(): void;
    _registerJobWithWorkers<T = any, R = T, M = CallableFunction>(job: Job<T, R, any, typeof Function>): void;
    _assertIsUsableFnOrModulePath(fnOrModulePath: FNOrModulePath<any>): void;
    _getNextJobId(): number;
}
