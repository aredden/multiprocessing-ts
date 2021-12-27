import Pool from './pool';
import Heap from './heap';
import P from 'bluebird';
import type { JobOptions } from 'index';

export default class PriorityQueue {
	numReadyWorkers: number;
	pool: Pool;
	heap: Heap;

	constructor(numWorkers: number) {
		this.numReadyWorkers = numWorkers;
		this.pool = new Pool(numWorkers);
		this.heap = new Heap();
	}

	push<T = any, R = any>(
		arg: T,
		priority: number,
		fnOrModulePath: (arg: T) => R | string,
		options?: JobOptions
	) {
		return new P<R>((resolve, reject) => {
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

	_processTask(task: {
		args: [arg1: any, arg2: any, arg3: any];
		resolve?: (value: any) => unknown;
		reject?: (value: any) => unknown;
	}) {
		this.pool
			.apply(...task.args)
			.then(task.resolve, task.reject)
			.then(() => {
				this.numReadyWorkers += 1;
				this._tick();
			});
	}
}
