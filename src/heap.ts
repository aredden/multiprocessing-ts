const newHeapNode = (elem: any, data: any, child: any = null, next: any = null) => ({
	elem: elem,
	data: data,
	child: child,
	next: next,
});

type WorkerData = { elem: any; data?: any; child?: any; next?: any };

export default class Heap {
	root: any;
	len: number;
	constructor() {
		this.root = null;
		this.len = 0;
	}

	popMax() {
		if (!this.len) {
			return null;
		}
		const max = this.root;
		this.len -= 1;
		this.root = this.mergePairs(this.root.child);
		return max;
	}

	insert(elem: any, data: any) {
		this.root = this.merge(this.root, newHeapNode(elem, data));
		return ++this.len;
	}

	link(
		parent: { child?: any; elem?: number; data?: any; next?: any },
		child: { child?: any; elem?: number; data?: any; next?: any }
	) {
		const firstChild = parent.child;
		parent.child = child;
		child.next = firstChild;
	}

	merge(heap1: WorkerData, heap2: WorkerData) {
		if (!heap1 || !heap2) {
			return heap1 || heap2;
		}

		if (heap1.elem > heap2.elem) {
			this.link(heap1, heap2);
			return heap1;
		}

		this.link(heap2, heap1);
		return heap2;
	}

	mergePairs(heapLL: WorkerData) {
		const paired: WorkerData[] = [];
		while (heapLL && heapLL.next) {
			const heap1 = heapLL;
			const heap2 = heap1.next;
			heapLL = heap2.next;
			paired.push(this.merge(heap1, heap2));
		}
		if (heapLL) {
			paired.push(heapLL);
		}

		let newRoot = paired.pop();
		while (paired.length) {
			const heap = paired.pop();
			if (!heap || !newRoot) {
				throw new Error(
					`heap or newRoot shouldn't be empty, but it is... newRoot: ${JSON.stringify(
						newRoot
					)}, heap: ${JSON.stringify(heap)}`
				);
				break;
			}
			newRoot = this.merge(heap, newRoot);
		}

		return newRoot;
	}
}
