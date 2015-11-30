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
            return (this.q.length === 0);
        };
        Queue.prototype.enqueue = function (element) {
            this.q[this.getSize()] = element;
        };
        Queue.prototype.dequeue = function () {
            var returnValue = null;
            if (this.q.length > 0) {
                returnValue = this.q.shift();
            }
            return returnValue;
        };
        Queue.prototype.toString = function () {
            var returnValue = "[";
            for (var i in this.q) {
                returnValue += "" + this.q[i];
                if (i < this.q.length - 1) {
                    returnValue += ', ';
                }
            }
            return returnValue + ']';
        };
        return Queue;
    })();
    TSOS.Queue = Queue;
})(TSOS || (TSOS = {}));
