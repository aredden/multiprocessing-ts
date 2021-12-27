'use strict';
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
const pool_1 = __importDefault(require('./pool'));
const heap_1 = __importDefault(require('./heap'));
const bluebird_1 = __importDefault(require('bluebird'));
class PriorityQueue {
	constructor(numWorkers) {
		this.numReadyWorkers = numWorkers;
		this.pool = new pool_1.default(numWorkers);
		this.heap = new heap_1.default();
	}
	push(arg, priority, fnOrModulePath, options) {
		return new bluebird_1.default((resolve, reject) => {
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
	_processTask(task) {
		this.pool
			.apply(...task.args)
			.then(task.resolve, task.reject)
			.then(() => {
				this.numReadyWorkers += 1;
				this._tick();
			});
	}
}
exports.default = PriorityQueue;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpb3JpdHktcXVldWUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJwcmlvcml0eS1xdWV1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixrREFBMEI7QUFDMUIsd0RBQXlCO0FBR3pCLE1BQXFCLGFBQWE7SUFLakMsWUFBWSxVQUFrQjtRQUM3QixJQUFJLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQztRQUNsQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxjQUFJLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsSUFBSSxDQUNILEdBQU0sRUFDTixRQUFnQixFQUNoQixjQUFzQyxFQUN0QyxPQUFvQjtRQUVwQixPQUFPLElBQUksa0JBQUMsQ0FBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNuQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUU7Z0JBQzFCLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDO2dCQUNwQyxPQUFPLEVBQUUsT0FBTztnQkFDaEIsTUFBTSxFQUFFLE1BQU07YUFDZCxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxLQUFLO1FBQ0osT0FBTyxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQzdDLElBQUksQ0FBQyxlQUFlLElBQUksQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMzQztJQUNGLENBQUM7SUFFRCxZQUFZLENBQUMsSUFJWjtRQUNBLElBQUksQ0FBQyxJQUFJO2FBQ1AsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzthQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQy9CLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDVixJQUFJLENBQUMsZUFBZSxJQUFJLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRDtBQS9DRCxnQ0ErQ0MifQ==
