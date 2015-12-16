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
        CpuScheduler.prototype.getSchedulingMode = function () { return this.mode; };
        CpuScheduler.prototype.incrementCounter = function () { this.counter++; };
        CpuScheduler.prototype.resetCounter = function () { this.counter = 1; };
        CpuScheduler.prototype.setExecutingPCB = function (pbc) { this.executingPCB = pbc; };
        CpuScheduler.prototype.contextSwitch = function () {
            if (_CPU.currentPCB === null && _ProcessManager.readyQueue.getSize() > 0) {
                var nextProgram = _ProcessManager.readyQueue.dequeue();
                if (!nextProgram.isInMemory) {
                    var params = { newPCB: nextProgram.processID, oldPCB: -1 };
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TSOS.IRQ.PAGE_FAULT, params));
                }
                nextProgram.processState = TSOS.ProcessState.Running;
                this.executingPCB = nextProgram;
                _CPU.loadProgram(this.executingPCB);
                _CPU.isExecuting = true;
            }
            else if (_ProcessManager.readyQueue.getSize() > 0) {
                _CPU.updatePCB();
                var nextProgram = _ProcessManager.readyQueue.dequeue();
                if (!nextProgram.isInMemory) {
                    var params = { newPCB: nextProgram.processID, oldPCB: _CPU.currentPCB.processID };
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TSOS.IRQ.PAGE_FAULT, params));
                }
                nextProgram.processState = TSOS.ProcessState.Running;
                this.executingPCB.processState = TSOS.ProcessState.Waiting;
                _ProcessManager.readyQueue.enqueue(this.executingPCB);
                this.executingPCB = nextProgram;
                _CPU.loadProgram(this.executingPCB);
                _CPU.isExecuting = true;
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
                default:
                    this.scheduleRoundRobin();
                    break;
            }
        };
        CpuScheduler.prototype.scheduleRoundRobin = function () {
            if (this.executingPCB === null && _ProcessManager.readyQueue.getSize() > 0) {
                _Kernel.krnInterruptHandler(TSOS.IRQ.CONTEXT_SWITCH);
            }
            else if (_ProcessManager.readyQueue.getSize() > 0) {
                if (this.counter >= this.quantum) {
                    this.counter = 1;
                    _Kernel.krnInterruptHandler(TSOS.IRQ.CONTEXT_SWITCH);
                }
            }
            else {
            }
        };
        CpuScheduler.prototype.scheduleFirstComeFirstServe = function () {
            // TODO Sort readyQueue by startup time?
            if (this.executingPCB === null && _ProcessManager.readyQueue.getSize() > 0) {
                _Kernel.krnInterruptHandler(TSOS.IRQ.CONTEXT_SWITCH);
            }
        };
        CpuScheduler.prototype.schedulePriority = function () {
            if (_ProcessManager.readyQueue.getSize() === 0) {
                return;
            }
            if (_ProcessManager.readyQueue.getSize() === 1 && this.executingPCB === null) {
                _Kernel.krnInterruptHandler(TSOS.IRQ.CONTEXT_SWITCH);
                return;
            }
            if (this.executingPCB === null) {
                // Get the queue into array form
                var tempArray = [];
                var size = _ProcessManager.readyQueue.getSize();
                for (var i = 0; i < size; i++) {
                    tempArray.push(_ProcessManager.readyQueue.dequeue());
                }
                // Sort programs so they are in correct order
                for (var j = 0; j < tempArray.length; j++) {
                    var bestPriority = Infinity;
                    for (var i = 0; i < tempArray.length; i++) {
                        var currentPCB = tempArray[i];
                        if (currentPCB === undefined || currentPCB === null) {
                            continue;
                        }
                        if (currentPCB.priority < bestPriority) {
                            bestPriority = currentPCB.priority;
                        }
                    }
                    for (var i = 0; i < tempArray.length; i++) {
                        var currentPCB = tempArray[i];
                        if (currentPCB === undefined || currentPCB === null) {
                            continue;
                        }
                        if (currentPCB.priority === bestPriority) {
                            _ProcessManager.readyQueue.enqueue(currentPCB);
                            delete tempArray[i];
                            break;
                        }
                    }
                }
            }
            // If current program is done, do next one
            if (this.executingPCB === null && _ProcessManager.readyQueue.getSize() > 0) {
                _Kernel.krnInterruptHandler(TSOS.IRQ.CONTEXT_SWITCH);
            }
        };
        return CpuScheduler;
    })();
    TSOS.CpuScheduler = CpuScheduler; // End of cpuScheduler class
})(TSOS || (TSOS = {})); // End of TSOS module
