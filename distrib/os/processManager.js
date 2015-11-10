var TSOS;
(function (TSOS) {
    var ProcessManager = (function () {
        function ProcessManager(maxProcesses) {
            this.maxProcesses = maxProcesses;
            this.readyQueue = new TSOS.Queue();
            this.residentList = [];
        }
        ProcessManager.prototype.load = function (program, priority) {
            var pcb = new TSOS.PCB(priority);
            if (this.residentList.length <= this.maxProcesses) {
                this.residentList[pcb.processID] = pcb;
            }
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
            // TODO return a list of all the current running processes (return their entire pcb)
        };
        ProcessManager.prototype.killProcess = function (pid) {
            // TODO Kill the process with the pid provided
            // Deallocate memory
            // Do not turn off _CPU.isExecuting because it might be executing other processes
        };
        ProcessManager.prototype.runProcess = function (pid) {
            // TODO Run the process on the CPU
            this.readyQueue.enqueue(this.residentList[pid]);
        };
        return ProcessManager;
    })();
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
