'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const newHeapNode = (elem, data, child, next) => {
	return {
		elem: elem,
		data: data,
		child: child,
		next: next,
	};
};
class Heap {
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
	insert(elem, data) {
		this.root = this.merge(this.root, newHeapNode(elem, data));
		return ++this.len;
	}
	link(parent, child) {
		const firstChild = parent.child;
		parent.child = child;
		child.next = firstChild;
	}
	merge(heap1, heap2) {
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
	mergePairs(heapLL) {
		const paired = [];
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
exports.default = Heap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhcC5qcyIsInNvdXJjZVJvb3QiOiIuL3NyYy8iLCJzb3VyY2VzIjpbImhlYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLFdBQVcsR0FLYSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBTSxFQUFFLElBQUssRUFBRSxFQUFFO0lBQzNELE9BQU87UUFDTixJQUFJLEVBQUUsSUFBSTtRQUNWLElBQUksRUFBRSxJQUFJO1FBQ1YsS0FBSyxFQUFFLEtBQUs7UUFDWixJQUFJLEVBQUUsSUFBSTtLQUNWLENBQUM7QUFDSCxDQUFDLENBQUM7QUFJRixNQUFxQixJQUFJO0lBR3hCO1FBQ0MsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDZCxDQUFDO0lBRUQsTUFBTTtRQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ2QsT0FBTyxJQUFJLENBQUM7U0FDWjtRQUNELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QyxPQUFPLEdBQUcsQ0FBQztJQUNaLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBd0IsRUFBRSxJQUF3QjtRQUN4RCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxXQUFXLENBQXVDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2pHLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ25CLENBQUM7SUFFRCxJQUFJLENBQUMsTUFBa0IsRUFBRSxLQUFpQjtRQUN6QyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLEtBQUssQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBaUIsRUFBRSxLQUFpQjtRQUN6QyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3JCLE9BQU8sS0FBSyxJQUFJLEtBQUssQ0FBQztTQUN0QjtRQUVELElBQUksS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxFQUFFO1lBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLE9BQU8sS0FBSyxDQUFDO1NBQ2I7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixPQUFPLEtBQUssQ0FBQztJQUNkLENBQUM7SUFFRCxVQUFVLENBQUMsTUFBa0I7UUFDNUIsTUFBTSxNQUFNLEdBQWlCLEVBQUUsQ0FBQztRQUNoQyxPQUFPLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFO1lBQzdCLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUNyQixNQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ3pCLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUN0QztRQUNELElBQUksTUFBTSxFQUFFO1lBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNwQjtRQUVELElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMzQixPQUFPLE1BQU0sQ0FBQyxNQUFNLEVBQUU7WUFDckIsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQzFCLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQ2QsNkRBQTZELElBQUksQ0FBQyxTQUFTLENBQzFFLE9BQU8sQ0FDUCxXQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FDbEMsQ0FBQztnQkFDRixNQUFNO2FBQ047WUFDRCxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7U0FDcEM7UUFFRCxPQUFPLE9BQU8sQ0FBQztJQUNoQixDQUFDO0NBQ0Q7QUF2RUQsdUJBdUVDIn0=
