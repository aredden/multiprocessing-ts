import Pool from './pool';
import Heap from './heap';
import P from 'bluebird';

export default class PriorityQueue {
	numReadyWorkers: any;
	pool: any;
	heap: any;

	constructor(numWorkers: number) {
		this.numReadyWorkers = numWorkers;
		// @ts-ignore
		this.pool = new Pool(numWorkers);
		this.heap = new Heap();
	}

	push(arg: any, priority: any, fnOrModulePath: Function | string, options: any) {
		return new P((resolve, reject) => {
			this.heap.insert(priority, {
				args: [arg, fnOrModulePath, options],
				resolve: resolve,
				reject: reject,
			});
			this._tick();
		});
	}

	_tick() {
		while (this.numReadyWorkers && this.heap.len) {
			this.numReadyWorkers -= 1;
			this._processTask(this.heap.popMax().data);
		}
	}

	_processTask(task: { args: any; resolve: any; reject: any }) {
		this.pool
			.apply(...task.args)
			.then(task.resolve, task.reject)
			.then(() => {
				this.numReadyWorkers += 1;
				this._tick();
			});
	}
}
