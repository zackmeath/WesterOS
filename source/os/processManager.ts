module TSOS {
    export class ProcessManager {

        public residentList: TSOS.PCB[];
        public readyQueue: TSOS.Queue;

        constructor(private maxProcesses: number){
            this.readyQueue = new Queue();
            this.residentList = [];
        }

        public load(program: Array<string>, priority: number): number {
            var pcb = new PCB(priority);
            if(this.residentList.length <= this.maxProcesses){
                this.residentList[pcb.processID] = pcb;
            }
            _MemoryManager.allocateMemory(pcb, program);
            return pcb.processID;
        }

        public doesProcessExist(pid: number): boolean {
            return (this.residentList[pid] !== undefined && this.residentList[pid] !== null);
        }

        public getPCB(pid: number): TSOS.PCB {
            return this.residentList[pid];
        }

        public getAllRunningProcesses(): [TSOS.PCB]{
            // TODO return a list of all the current running processes (return their entire pcb)
        }
        
        public killProcess(pid: number): void {
            // TODO Kill the process with the pid provided
            // Deallocate memory
            // Do not turn off _CPU.isExecuting because it might be executing other processes
        }

        public runProcess(pid: number): void {
            // TODO Run the process on the CPU
            this.readyQueue.enqueue(this.residentList[pid]);
        }

        private processes;
    }
}
