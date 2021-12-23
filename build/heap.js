"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

Object.defineProperty(exports, "__esModule", { value: true });
var newHeapNode = function newHeapNode(elem, data) {
    var child = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var next = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    return {
        elem: elem,
        data: data,
        child: child,
        next: next
    };
};

var Heap = function () {
    function Heap() {
        _classCallCheck(this, Heap);

        this.root = null;
        this.len = 0;
    }

    _createClass(Heap, [{
        key: "popMax",
        value: function popMax() {
            if (!this.len) {
                return null;
            }
            var max = this.root;
            this.len -= 1;
            this.root = this.mergePairs(this.root.child);
            return max;
        }
    }, {
        key: "insert",
        value: function insert(elem, data) {
            this.root = this.merge(this.root, newHeapNode(elem, data));
            return ++this.len;
        }
    }, {
        key: "link",
        value: function link(parent, child) {
            var firstChild = parent.child;
            parent.child = child;
            child.next = firstChild;
        }
    }, {
        key: "merge",
        value: function merge(heap1, heap2) {
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
    }, {
        key: "mergePairs",
        value: function mergePairs(heapLL) {
            var paired = [];
            while (heapLL && heapLL.next) {
                var heap1 = heapLL;
                var heap2 = heap1.next;
                heapLL = heap2.next;
                paired.push(this.merge(heap1, heap2));
            }
            if (heapLL) {
                paired.push(heapLL);
            }
            var newRoot = paired.pop();
            while (paired.length) {
                var heap = paired.pop();
                if (!heap || !newRoot) {
                    throw new Error("heap or newRoot shouldn't be empty, but it is... newRoot: " + JSON.stringify(newRoot) + ", heap: " + JSON.stringify(heap));
                    break;
                }
                newRoot = this.merge(heap, newRoot);
            }
            return newRoot;
        }
    }]);

    return Heap;
}();

exports.default = Heap;
//# sourceMappingURL=../src/src/heap.js.map