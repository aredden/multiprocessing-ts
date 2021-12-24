declare type WorkerData<E = any, D = any, C = any, N = any> = {
    elem: E;
    data?: D;
    child?: C;
    next?: N;
};
export default class Heap {
    root: WorkerData['elem'];
    len: number;
    constructor();
    popMax(): any;
    insert(elem: WorkerData['elem'], data: WorkerData['data']): number;
    link(parent: WorkerData, child: WorkerData): void;
    merge(heap1: WorkerData, heap2: WorkerData): WorkerData<any, any, any, any>;
    mergePairs(heapLL: WorkerData): WorkerData<any, any, any, any> | undefined;
}
export {};
