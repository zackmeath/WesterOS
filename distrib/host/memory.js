var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(size) {
            this.memory = new Array(size);
        }
        Memory.prototype.init = function () {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = '00';
            }
        };
        Memory.prototype.clearAllMemory = function () {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = '00';
            }
        };
        Memory.prototype.clearRange = function (start, end) {
            for (var i = 0; i < end; i++) {
                this.memory[start + i] = '00';
            }
        };
        Memory.prototype.getByte = function (loc) {
            return this.memory[loc];
        };
        Memory.prototype.setByte = function (loc, data) {
            this.memory[loc] = data;
        };
        Memory.prototype.getSize = function () {
            return this.memory.length;
        };
        Memory.prototype.printMem = function () {
            console.log(this.memory);
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
