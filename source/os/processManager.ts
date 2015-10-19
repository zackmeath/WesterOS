module TSOS {
    export class ProcessManager {
        constructor(private maxProcesses: number){
        }
        public init(): void{
            this.processes = [];
        }
        public load(program: Array<string>, priority: number): number {
            var pcb = new PCB(priority);
            if(this.processes.length <= this.maxProcesses){
                this.processes[pcb.processId] = pcb;
            }
        }
        private processes;
    }
}
