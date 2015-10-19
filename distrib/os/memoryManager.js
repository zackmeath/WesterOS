var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(maxProcesses) {
            this.memorySize = _Memory.getSize();
            this.numOfBlocks = this.memorySize / maxProcesses;
            this.allocated = new Array(maxProcesses);
            for (var i = 0; i < this.allocated.length; i++) {
                this.allocated[i] = -1;
            }
        }
        MemoryManager.prototype.init = function () {
        };
        MemoryManager.prototype.read = function (pcb, loc) {
            if (loc >= 0 && loc < 256) {
                return _Memory.getByte(pcb.baseRegister + loc);
            }
            else {
            }
        };
        MemoryManager.prototype.write = function (pcb, loc, data) {
            if (loc >= 0 && loc < 256) {
                return _Memory.setByte(pcb.baseRegister + loc, data);
            }
            else {
            }
        };
        MemoryManager.prototype.allocateMemory = function (pcb, program) {
            for (var i = 0; i < this.allocated.length; i++) {
                if (this.allocated[i] === -1) {
                    this.allocated[i] = pcb.processID;
                    pcb.baseRegister = i * 256;
                    pcb.limitRegister = pcb.baseRegister + 255;
                    break;
                }
            }
            if (pcb.baseRegister === -1) {
                // TODO Error handling no more space to allocate
                alert("BASE REGISTER NOT SET");
            }
            for (var i = 0; i < 256; i++) {
                var code = program[i];
                _Memory.setByte(pcb.baseRegister + i, (code !== undefined) ? code : '00');
            }
        };
        MemoryManager.prototype.deallocateMemory = function (pcb) {
            for (var i = 0; i < this.allocated.length; i++) {
                if (this.allocated[i] === pcb.processID) {
                    this.allocated[i] = -1;
                    _Memory.clearRange(pcb.baseRegister, pcb.limitRegister);
                    break;
                }
            }
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));