import Pool from './pool';
import Heap from './heap';
import P from 'bluebird';
import type { JobOptions } from 'index';
export default class PriorityQueue {
    numReadyWorkers: number;
    pool: Pool;
    heap: Heap;
    constructor(numWorkers: number);
    push<T = any, R = any>(arg: T, priority: number, fnOrModulePath: (arg: T) => R | string, options?: JobOptions): P<R>;
    _tick(): void;
    _processTask(task: {
        args: [arg1: any, arg2: any, arg3: any];
        resolve?: (value: any) => unknown;
        reject?: (value: any) => unknown;
    }): void;
}
