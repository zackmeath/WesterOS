
module TSOS {
    export class CpuScheduler {

        private quantum: number;
        public getQuantum(): number {  return this.quantum;  }
        public setQuantum(q: number){  this.quantum = q;  }
        
        private mode: TSOS.SchedulingMode;
        public setSchedulingMode(m: TSOS.SchedulingMode){  this.mode = m;  }
        public getSchedulingMode(){  return this.mode;  }

        private counter: number;
        public incrementCounter(): void {  this.counter++;  }
        public resetCounter(): void {  this.counter = 1;  }

        private executingPCB: TSOS.PCB;
        public setExecutingPCB(pbc: TSOS.PCB) {  this.executingPCB = pbc  }

        constructor(){
            this.quantum = 6;
            this.counter = 1;
            this.mode = TSOS.SchedulingMode.ROUND_ROBIN;
            this.executingPCB = null;
        }

        public contextSwitch(): void {
            if(_CPU.currentPCB === null && _ProcessManager.readyQueue.getSize() > 0){
                var nextProgram = _ProcessManager.readyQueue.dequeue();
                if(!nextProgram.isInMemory){
                    var params = {newPCB: nextProgram.processID, oldPCB: -1};
                    _KernelInterruptQueue.enqueue(new Interrupt(TSOS.IRQ.PAGE_FAULT, params));
                }
                nextProgram.processState = TSOS.ProcessState.Running;
                this.executingPCB = nextProgram;
                _CPU.loadProgram(this.executingPCB);
                _CPU.isExecuting = true;
            } else if(_ProcessManager.readyQueue.getSize() > 0){
                _CPU.updatePCB();
                var nextProgram = _ProcessManager.readyQueue.dequeue();
                if(!nextProgram.isInMemory){
                    var params = {newPCB: nextProgram.processID, oldPCB: _CPU.currentPCB.processID};
                    _KernelInterruptQueue.enqueue(new Interrupt(TSOS.IRQ.PAGE_FAULT, params));
                }
                nextProgram.processState = TSOS.ProcessState.Running;

                this.executingPCB.processState = TSOS.ProcessState.Waiting;
                _ProcessManager.readyQueue.enqueue(this.executingPCB);

                this.executingPCB = nextProgram;
                _CPU.loadProgram(this.executingPCB);
                _CPU.isExecuting = true;
            } else {
                console.log('Empty context switch');
            }
        }

        public schedule():void {
            switch (this.mode) {
                case SchedulingMode.ROUND_ROBIN:
                    this.scheduleRoundRobin();
                    break;
                case SchedulingMode.FCFS:
                    this.scheduleFirstComeFirstServe();
                    break;
                case SchedulingMode.PRIORITY:
                    this.schedulePriority();
                    break;
                default:
                    this.scheduleRoundRobin();
                    break;
            }
        }

        private scheduleRoundRobin(): void {
            if (this.executingPCB === null && _ProcessManager.readyQueue.getSize() > 0){
                _Kernel.krnInterruptHandler(TSOS.IRQ.CONTEXT_SWITCH);
                // this.executingPCB = _ProcessManager.readyQueue.dequeue();
                // this.executingPCB.processState = TSOS.ProcessState.Running;
                // _CPU.loadProgram(this.executingPCB);
                // _CPU.isExecuting = true;
            } else if (_ProcessManager.readyQueue.getSize() > 0){
                if(this.counter >= this.quantum){
                    this.counter = 1;
                    _Kernel.krnInterruptHandler(TSOS.IRQ.CONTEXT_SWITCH);
                }
            } else {
                // Do nothing, we are all set
            }
        }

        private scheduleFirstComeFirstServe(): void {
            // TODO Sort readyQueue by startup time?
            if (this.executingPCB === null && _ProcessManager.readyQueue.getSize() > 0){
                _Kernel.krnInterruptHandler(TSOS.IRQ.CONTEXT_SWITCH);
            }
        }

        private schedulePriority(): void {
            if(_ProcessManager.readyQueue.getSize() === 0){
                return;
            }
            if(_ProcessManager.readyQueue.getSize() === 1 && this.executingPCB === null){
                _Kernel.krnInterruptHandler(TSOS.IRQ.CONTEXT_SWITCH);
                return;
            }

            if(this.executingPCB === null){ // Only schedule if there is nothing running
                // Get the queue into array form
                var tempArray = [];
                var size = _ProcessManager.readyQueue.getSize();
                for(var i = 0; i < size; i++){
                    tempArray.push(_ProcessManager.readyQueue.dequeue());
                }

                // Sort programs so they are in correct order
                for(var j = 0; j < tempArray.length; j++){
                    var bestPriority = Infinity;
                    for(var i = 0; i < tempArray.length; i++){
                        var currentPCB = tempArray[i];
                        if(currentPCB === undefined || currentPCB === null){
                            continue;
                        }
                        if(currentPCB.priority < bestPriority){
                            bestPriority = currentPCB.priority;
                        }
                    }
                    for(var i = 0; i < tempArray.length; i++){
                        var currentPCB = tempArray[i];
                        if(currentPCB === undefined || currentPCB === null){
                            continue;
                        }
                        if(currentPCB.priority === bestPriority){
                            _ProcessManager.readyQueue.enqueue(currentPCB);
                            delete tempArray[i];
                            break;
                        }
                    }
                }
            }

            // If current program is done, do next one
            if (this.executingPCB === null && _ProcessManager.readyQueue.getSize() > 0){
                _Kernel.krnInterruptHandler(TSOS.IRQ.CONTEXT_SWITCH);
            }
        }

    } // End of cpuScheduler class
} // End of TSOS module

