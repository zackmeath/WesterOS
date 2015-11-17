var TSOS;
(function (TSOS) {
    var CpuScheduler = (function () {
        function CpuScheduler() {
            this.quantum = 6;
            this.counter = 1;
            this.mode = TSOS.SchedulingMode.ROUND_ROBIN;
            this.executingPCB = null;
        }
        CpuScheduler.prototype.getQuantum = function () { return this.quantum; };
        CpuScheduler.prototype.setQuantum = function (q) { this.quantum = q; };
        CpuScheduler.prototype.setSchedulingMode = function (m) { this.mode = m; };
        CpuScheduler.prototype.incrementCounter = function () { this.counter++; };
        CpuScheduler.prototype.resetCounter = function () { this.counter = 1; };
        CpuScheduler.prototype.setExecutingPCB = function (pbc) { this.executingPCB = pbc; };
        CpuScheduler.prototype.contextSwitch = function () {
            if (_CPU.currentPCB === null && _ProcessManager.readyQueue.getSize() > 0) {
                var nextProgram = _ProcessManager.readyQueue.dequeue();
                nextProgram.processState = TSOS.ProcessState.Running;
                this.executingPCB = nextProgram;
                _CPU.loadProgram(this.executingPCB);
            }
            else if (_ProcessManager.readyQueue.getSize() > 0) {
                _CPU.updatePCB();
                var nextProgram = _ProcessManager.readyQueue.dequeue();
                nextProgram.processState = TSOS.ProcessState.Running;
                this.executingPCB.processState = TSOS.ProcessState.Waiting;
                _ProcessManager.readyQueue.enqueue(this.executingPCB);
                this.executingPCB = nextProgram;
                _CPU.loadProgram(this.executingPCB);
            }
            else {
                console.log('Empty context switch');
            }
        };
        CpuScheduler.prototype.schedule = function () {
            switch (this.mode) {
                case TSOS.SchedulingMode.ROUND_ROBIN:
                    this.scheduleRoundRobin();
                    break;
                case TSOS.SchedulingMode.FCFS:
                    this.scheduleFirstComeFirstServe();
                    break;
                case TSOS.SchedulingMode.PRIORITY:
                    this.schedulePriority();
                    break;
            }
        };
        CpuScheduler.prototype.scheduleRoundRobin = function () {
            if (this.executingPCB === null && _ProcessManager.readyQueue.getSize() > 0) {
                this.executingPCB = _ProcessManager.readyQueue.dequeue();
                this.executingPCB.processState = TSOS.ProcessState.Running;
                _CPU.loadProgram(this.executingPCB);
                _CPU.isExecuting = true;
            }
            else if (_ProcessManager.readyQueue.getSize() > 0) {
                if (this.counter >= this.quantum) {
                    this.counter = 1;
                    _Kernel.krnInterruptHandler(CONTEXT_SWITCH_IRQ);
                    _CPU.isExecuting = true;
                }
            }
            else {
            }
        };
        CpuScheduler.prototype.scheduleFirstComeFirstServe = function () {
            // TODO for Project 4
        };
        CpuScheduler.prototype.schedulePriority = function () {
            // TODO for Project 4
        };
        return CpuScheduler;
    })();
    TSOS.CpuScheduler = CpuScheduler; // End of cpuScheduler class
})(TSOS || (TSOS = {})); // End of TSOS module
