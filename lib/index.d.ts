import Pool from './pool';
import PriorityQueue from './priority-queue';
import Heap from './heap';
export { Heap, PriorityQueue, Pool };
export declare type FNOrModulePath<T> = T extends CallableFunction ? T : string;
export declare type WorkerData<E = any, D = any, C = any, N = any> = {
    elem: E;
    data?: D;
    child?: C;
    next?: N;
};
export declare type CB<R, N = undefined> = N extends undefined ? undefined : {
    (err: any | null, data: R | null): void;
    (arg0: Error | null, arg1: R[] | null): any;
};
export declare type Job<T = any, R = T, M = CallableFunction | string, N = undefined> = {
    callback: (...args: R[]) => void;
    fnOrModulePath: FNOrModulePath<M>;
    timeout: number;
    options?: JobOptions;
    terminated: boolean;
    chunksize?: number;
    arr: Array<T>;
    id: string | number;
    cb: CB<R, N>;
    nextIndex?: number;
};
export declare type JobOptions<R = any> = {
    chunksize?: number;
    timeout?: number;
    onResult?: (result: R, index?: string | number) => unknown;
};
