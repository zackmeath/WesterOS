module TSOS {
    export class ProcessManager {
        constructor(private maxProcesses: number){
        }
        public init(): void {
            this.processes = [];
        }
        public load(program: Array<string>, priority: number): number {
            var pcb = new PCB(priority);
            if(this.processes.length <= this.maxProcesses){
                this.processes[pcb.processID] = pcb;
            }
            _MemoryManager.allocateMemory(pcb, program);
            return pcb.processID;
        }
        public doesProcessExist(pid: number): boolean {
            return (this.processes[pid] !== undefined || this.processes[pid] !== null);
        }
        public getPCB(pid: number): TSOS.PCB {
            return this.processes[pid];
        }
        private processes;
    }
}
