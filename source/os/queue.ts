/* ------------
   Queue.ts

   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the Javascript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.

   ------------ */

module TSOS {
    export class Queue {
        constructor(public q = new Array()) {
        }

        public getSize() {
            return this.q.length;
        }

        public isEmpty(){
            return (this.q.length === 0);
        }

        public enqueue(element) {
            this.q[this.getSize()] = element;
        }

    public dequeue() {
        var returnValue = null;
        if (this.q.length > 0) {
            returnValue = this.q.shift();
        }
        return returnValue;
    }

    public toString() {
        var returnValue = "[";
        for (var i in this.q) {
            returnValue += "" + this.q[i];
            if(i < this.q.length-1) {
                returnValue += ', ';
            }
        }
        return returnValue + ']';
    }
  }
}
