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
    define(name: PropertyKey, fnOrModulePath: (arg: any) => unknown | string, options: any): void;
    apply(arg: any, fnOrModulePath: (arg: any) => any | string, options: any): P<any>;
    map(arr: any[], fnOrModulePath: any, options: any): P<any[]>;
    _queuePush(arr: string | any[], fnOrModulePath: any, options: {
        chunksize?: any;
    }, cb: {
        (err: any, data: any): void;
        (arg0: Error, arg1: any[]): any;
    }): void;
    _queueTick(): void;
    _registerJobWithWorkers(job: {
        id: any;
        arr: any;
        fnOrModulePath: any;
        chunksize?: any;
        cb: any;
        nextIndex?: number;
        options: any;
    }): void;
    _assertIsUsableFnOrModulePath(fnOrModulePath: any): void;
    _getNextJobId(): number;
}
//# sourceMappingURL=../src/src/pool.d.ts.map