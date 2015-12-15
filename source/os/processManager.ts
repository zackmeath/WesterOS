module TSOS {
    export class ProcessManager {

        public residentList: TSOS.PCB[];
        public readyQueue: TSOS.Queue;

        constructor(){
            this.readyQueue = new Queue();
            this.residentList = [];
        }

        public load(program: Array<string>, priority: number): number {
            var pcb = new PCB(priority);
            this.residentList[pcb.processID] = pcb;
            _MemoryManager.allocateMemory(pcb, program);
            return pcb.processID;
        }

        public doesProcessExist(pid: number): boolean {
            return (this.residentList[pid] !== undefined && this.residentList[pid] !== null);
        }

        public getPCB(pid: number): TSOS.PCB {
            return this.residentList[pid];
        }

        public getAllRunningProcesses(): TSOS.PCB[]{
            var output: TSOS.PCB[] = [];
            for(var i = 0; i < this.residentList.length; i++){
                var pcb = this.residentList[i];
                if(pcb.processState === TSOS.ProcessState.Running || pcb.processState === TSOS.ProcessState.Waiting){
                    output.push(pcb);
                }
            }
            return output;
        }
        
        public killProcess(pid: number): void {
            // TODO Kill the process with the pid provided
            // Deallocate memory
            // Do not turn off _CPU.isExecuting because it might be executing other processes
            var pcb = this.residentList[pid];
            _MemoryManager.deallocateMemory(pcb);
            pcb.processState = TSOS.ProcessState.Terminated;
            if(this.readyQueue.getSize() === 0 && _CPU.currentPCB === null){
                _CPU.isExecuting = false;
            } else if (_CPU.currentPCB.processID === pid){
                _CPU.currentPCB = null;
                _CpuScheduler.setExecutingPCB(null);
            }
        }

        public runProcess(pid: number): void {
            // TODO Run the process on the CPU
            var pcb = this.residentList[pid];
            pcb.processState = TSOS.ProcessState.Waiting;
            this.readyQueue.enqueue(this.residentList[pid]);
            _CPU.isExecuting = true;
        }

        public runall(): void{
            for(var i = 0; i < this.residentList.length; i++){
                var pcb = this.residentList[i];
                if(pcb.processState === TSOS.ProcessState.New){
                    pcb.processState = TSOS.ProcessState.Waiting;
                    this.readyQueue.enqueue(pcb, pcb.priority);
                }
            }
            _CPU.isExecuting = true;
        }


        private processes;
    }
}
