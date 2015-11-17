
module TSOS {
    export class CpuScheduler {

        private quantum: number;
        public getQuantum(): number {  return this.quantum;  }
        public setQuantum(q: number){  this.quantum = q;  }
        
        private mode: TSOS.SchedulingMode;
        public setSchedulingMode(m: TSOS.SchedulingMode){  this.mode = m;  }

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
                nextProgram.processState = TSOS.ProcessState.Running;
                this.executingPCB = nextProgram;
                _CPU.loadProgram(this.executingPCB);
            } else if(_ProcessManager.readyQueue.getSize() > 0){
                _CPU.updatePCB();
                var nextProgram = _ProcessManager.readyQueue.dequeue();
                nextProgram.processState = TSOS.ProcessState.Running;

                this.executingPCB.processState = TSOS.ProcessState.Waiting;
                _ProcessManager.readyQueue.enqueue(this.executingPCB);

                this.executingPCB = nextProgram;
                _CPU.loadProgram(this.executingPCB);
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
            }
        }

        private scheduleRoundRobin(): void {
            if (this.executingPCB === null && _ProcessManager.readyQueue.getSize() > 0){
                this.executingPCB = _ProcessManager.readyQueue.dequeue();
                this.executingPCB.processState = TSOS.ProcessState.Running;
                _CPU.loadProgram(this.executingPCB);
                _CPU.isExecuting = true;
            } else if (_ProcessManager.readyQueue.getSize() > 0){
                if(this.counter >= this.quantum){
                    this.counter = 1;
                    _Kernel.krnInterruptHandler(CONTEXT_SWITCH_IRQ);
                    _CPU.isExecuting = true;
                }
            } else {
            }
        }

        private scheduleFirstComeFirstServe(): void {
            // TODO for Project 4
        }
        private schedulePriority(): void {
            // TODO for Project 4
        }

    } // End of cpuScheduler class
} // End of TSOS module

