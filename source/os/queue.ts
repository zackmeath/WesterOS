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
            return (this.q.length == 0);
        }

        public enqueue(element, priority) {
            var insertObject = { value: element, priority: priority };
            var inserted = false;
            for(var i = 0; i < this.getSize(); i++){
                if(this.q[i].priority > priority){
                    this.q.splice(i, 0, insertObject);
                    inserted = true;
                    break;
                }
            }
            if(!inserted){
                this.q[this.getSize()] = insertObject;
            }
        }

    public dequeue() {
        var retVal = null;
        if (this.q.length > 0) {
            retVal = this.q.shift().value;
        }
        return retVal;
    }

    public toString() {
        var retVal = "";
        for (var i in this.q) {
            retVal += "[" + this.q[i].value + "] ";
        }
        return retVal;
    }
  }
}
