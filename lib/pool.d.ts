import P from 'bluebird';
export default class Pool {
    [x: PropertyKey]: any;
    queue: any[];
    closed: boolean;
    workers: any[];
    readyWorkers: any;
    _nextJobId: number;
    constructor(numWorkers: number);
    close(): void;
    terminate(): void;
    define(name: PropertyKey, fnOrModulePath: (arg: any) => unknown | string, options?: any): void;
    apply<T = any, R = T>(arg: T, fnOrModulePath: (arg: T) => R | string, options?: any): P<R>;
    map<T = any, R = T>(arr: T[], fnOrModulePath: any, options?: any): P<R[]>;
    _queuePush(arr: string | any[], fnOrModulePath: any, options?: {
        chunksize?: any;
    }, cb?: {
        (err: any, data: any): void;
        (arg0: Error, arg1: any[]): any;
    }): false | void;
    _queueTick(): void;
    _registerJobWithWorkers(job: {
        id: any;
        arr: any;
        fnOrModulePath: any;
        chunksize?: any;
        cb?: any;
        nextIndex?: number;
        options?: any;
    }): void;
    _assertIsUsableFnOrModulePath(fnOrModulePath: any): void;
    _getNextJobId(): number;
}
