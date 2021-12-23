"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pool_1 = __importDefault(require("./pool"));
var heap_1 = __importDefault(require("./heap"));
var bluebird_1 = __importDefault(require("bluebird"));

var PriorityQueue = function () {
    function PriorityQueue(numWorkers) {
        _classCallCheck(this, PriorityQueue);

        this.numReadyWorkers = numWorkers;
        // @ts-ignore
        this.pool = new pool_1.default(numWorkers);
        this.heap = new heap_1.default();
    }

    _createClass(PriorityQueue, [{
        key: "push",
        value: function push(arg, priority, fnOrModulePath, options) {
            var _this = this;

            return new bluebird_1.default(function (resolve, reject) {
                _this.heap.insert(priority, {
                    args: [arg, fnOrModulePath, options],
                    resolve: resolve,
                    reject: reject
                });
                _this._tick();
            });
        }
    }, {
        key: "_tick",
        value: function _tick() {
            while (this.numReadyWorkers && this.heap.len) {
                this.numReadyWorkers -= 1;
                this._processTask(this.heap.popMax().data);
            }
        }
    }, {
        key: "_processTask",
        value: function _processTask(task) {
            var _pool,
                _this2 = this;

            (_pool = this.pool).apply.apply(_pool, _toConsumableArray(task.args)).then(task.resolve, task.reject).then(function () {
                _this2.numReadyWorkers += 1;
                _this2._tick();
            });
        }
    }]);

    return PriorityQueue;
}();

exports.default = PriorityQueue;
//# sourceMappingURL=../src/src/priority-queue.js.map