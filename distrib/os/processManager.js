var TSOS;
(function (TSOS) {
    var ProcessManager = (function () {
        function ProcessManager(maxProcesses) {
            this.maxProcesses = maxProcesses;
        }
        ProcessManager.prototype.init = function () {
            this.processes = [null];
        };
        ProcessManager.prototype.load = function (program, priority) {
            var pcb = new TSOS.PCB(priority);
            if (this.processes.length <= this.maxProcesses) {
                this.processes[pcb.processID] = pcb;
            }
            _MemoryManager.allocateMemory(pcb, program);
            return pcb.processID;
        };
        ProcessManager.prototype.doesProcessExist = function (pid) {
            return (this.processes[pid] !== undefined || this.processes[pid] !== null);
        };
        ProcessManager.prototype.getPCB = function (pid) {
            return this.processes[pid];
        };
        return ProcessManager;
    })();
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
