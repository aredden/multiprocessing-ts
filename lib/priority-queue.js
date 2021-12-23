"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pool_1 = __importDefault(require("./pool"));
const heap_1 = __importDefault(require("./heap"));
const bluebird_1 = __importDefault(require("bluebird"));
class PriorityQueue {
    constructor(numWorkers) {
        this.numReadyWorkers = numWorkers;
        // @ts-ignore
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
//# sourceMappingURL=../src/src/priority-queue.js.map