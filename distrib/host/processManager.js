var TSOS;
(function (TSOS) {
    var ProcessManager = (function () {
        function ProcessManager(maxProcesses) {
            if (maxProcesses === void 0) { maxProcesses = 1; }
            this.maxProcesses = maxProcesses;
        }
        ProcessManager.prototype.init = function () {
            this.programs = [];
        };
        ProcessManager.prototype.load = function (program, priority) {
            var processData = {
                processState: TSOS.ProcessState.New,
                priority: priority
            };
            var pcb = new TSOS.PCB(processData);
            if (this.programs.length <= this.maxProcesses) {
                this.programs[this.programs.length] = pcb;
            }
        };
        ProcessManager.prototype.execute = function () {
        };
        return ProcessManager;
    })();
    TSOS.ProcessManager = ProcessManager;
})(TSOS || (TSOS = {}));
