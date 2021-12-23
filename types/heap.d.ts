declare type WorkerData = {
    elem: any;
    data?: any;
    child?: any;
    next?: any;
};
export default class Heap {
    root: any;
    len: number;
    constructor();
    popMax(): any;
    insert(elem: any, data: any): number;
    link(parent: {
        child?: any;
        elem?: number;
        data?: any;
        next?: any;
    }, child: {
        child?: any;
        elem?: number;
        data?: any;
        next?: any;
    }): void;
    merge(heap1: WorkerData, heap2: WorkerData): WorkerData;
    mergePairs(heapLL: WorkerData): WorkerData | undefined;
}
export {};
//# sourceMappingURL=../src/src/heap.d.ts.map