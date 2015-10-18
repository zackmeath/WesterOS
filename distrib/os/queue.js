/* ------------
   Queue.ts

   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the Javascript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.

   ------------ */
var TSOS;
(function (TSOS) {
    var Queue = (function () {
        function Queue(q) {
            if (q === void 0) { q = new Array(); }
            this.q = q;
        }
        Queue.prototype.getSize = function () {
            return this.q.length;
        };
        Queue.prototype.isEmpty = function () {
            return (this.q.length == 0);
        };
        Queue.prototype.enqueue = function (element, priority) {
            var insertObject = { value: element, priority: priority };
            var inserted = false;
            for (var i = 0; i < this.getSize(); i++) {
                if (this.q[i].priority > priority) {
                    this.q.splice(i, 0, insertObject);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                this.q[this.getSize()] = insertObject;
            }
        };
        Queue.prototype.dequeue = function () {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift().value;
            }
            return retVal;
        };
        Queue.prototype.toString = function () {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i].value + "] ";
            }
            return retVal;
        };
        return Queue;
    })();
    TSOS.Queue = Queue;
})(TSOS || (TSOS = {}));
