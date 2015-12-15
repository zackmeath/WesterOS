var TSOS;
(function (TSOS) {
    var ProcessManager = (function () {
        function ProcessManager() {
            this.readyQueue = new TSOS.Queue();
            this.residentList = [];
        }
        ProcessManager.prototype.load = function (program, priority) {
            var pcb = new TSOS.PCB(priority);
            this.residentList[pcb.processID] = pcb;
            _MemoryManager.allocateMemory(pcb, program);
            return pcb.processID;
        };
        ProcessManager.prototype.doesProcessExist = function (pid) {
            return (this.residentList[pid] !== undefined && this.residentList[pid] !== null);
        };
        ProcessManager.prototype.getPCB = function (pid) {
            return this.residentList[pid];
        };
        ProcessManager.prototype.getAllRunningProcesses = function () {
            var output = [];
            for (var i = 0; i < this.residentList.length; i++) {
                var pcb = this.residentList[i];
                if (pcb.processState === TSOS.ProcessState.Running || pcb.processState === TSOS.ProcessState.Waiting) {
                    output.push(pcb);
                }
            }
            return output;
        };
        ProcessManager.prototype.killProcess = function (pid) {
            // TODO Kill the process with the pid provided
            // Deallocate memory
            // Do not turn off _CPU.isExecuting because it might be executing other processes
            var pcb = this.residentList[pid];
            _MemoryManager.deallocateMemory(pcb);
            pcb.processState = TSOS.ProcessState.Terminated;
            if (this.readyQueue.getSize() === 0 && _CPU.currentPCB === null) {
                _CPU.isExecuting = false;
            }
            else if (_CPU.currentPCB.processID === pid) {
                _CPU.currentPCB = null;
                _CpuScheduler.setExecutingPCB(null);
            }
        };
        ProcessManager.prototype.runProcess = function (pid) {
            // TODO Run the process on the CPU
            var pcb = this.residentList[pid];
            pcb.processState = TSOS.ProcessState.Waiting;
            this.readyQueue.enqueue(this.residentList[pid]);
            _CPU.isExecuting = true;
        };
        ProcessManager.prototype.runall = function () {
            for (var i = 0; i < this.residentList.length; i++) {
                var pcb = this.residentList[i];
                if (pcb.processState === TSOS.ProcessState.New) {
                    pcb.processState = TSOS.ProcessState.Waiting;
                    this.readyQueue.enqueue(pcb, pcb.priority);
                }
            }
            _CPU.isExecuting = true;
        };
        return ProcessManager;
    })();
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
