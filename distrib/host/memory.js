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
        Memory.prototype.loadProgram = function (program, offset) {
            for (var i = 0; i < program.length; i++) {
                var code = program[i];
                this.memory[offset + i] = (code !== undefined) ? code : '00';
            }
        };
        Memory.prototype.clearAllMemory = function () {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[i] = '00';
            }
        };
        Memory.prototype.clearProgramBlock = function (offset) {
            for (var i = 0; i < this.memory.length; i++) {
                this.memory[offset + i] = '00';
            }
        };
        return Memory;
    })();
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
