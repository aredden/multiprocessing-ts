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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpb3JpdHktcXVldWUuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJwcmlvcml0eS1xdWV1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQixrREFBMEI7QUFDMUIsd0RBQXlCO0FBRXpCLE1BQXFCLGFBQWE7SUFLakMsWUFBWSxVQUFrQjtRQUM3QixJQUFJLENBQUMsZUFBZSxHQUFHLFVBQVUsQ0FBQztRQUNsQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxjQUFJLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsSUFBSSxDQUFtQixHQUFNLEVBQUUsUUFBZ0IsRUFBRSxjQUFzQyxFQUFFLE9BQWE7UUFDckcsT0FBTyxJQUFJLGtCQUFDLENBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFO2dCQUMxQixJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQztnQkFDcEMsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLE1BQU0sRUFBRSxNQUFNO2FBQ2QsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSztRQUNKLE9BQU8sSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUM3QyxJQUFJLENBQUMsZUFBZSxJQUFJLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDM0M7SUFDRixDQUFDO0lBRUQsWUFBWSxDQUFDLElBSVo7UUFDQSxJQUFJLENBQUMsSUFBSTthQUNQLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQzthQUMvQixJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1YsSUFBSSxDQUFDLGVBQWUsSUFBSSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Q7QUExQ0QsZ0NBMENDIn0=
