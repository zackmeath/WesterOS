var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager() {
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
            // TODO Set base and limit register for pcb
            for (var i = 0; i < 256; i++) {
                var code = program[i];
                _Memory.setByte(pcb.baseRegister + i, (code !== undefined) ? code : '00');
            }
        };
        return MemoryManager;
    })();
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
