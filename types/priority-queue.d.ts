import P from 'bluebird';
export default class PriorityQueue {
    numReadyWorkers: any;
    pool: any;
    heap: any;
    constructor(numWorkers: number);
    push(arg: any, priority: any, fnOrModulePath: Function | string, options: any): P<unknown>;
    _tick(): void;
    _processTask(task: {
        args: any;
        resolve: any;
        reject: any;
    }): void;
}
//# sourceMappingURL=../src/src/priority-queue.d.ts.map