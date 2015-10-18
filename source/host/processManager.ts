module TSOS {
    export class ProcessManager {
        constructor(private maxProcesses: number = 1){
        }
        public init(): void{
            this.programs = [];
        }
        public load(program: Array<string>, priority: number): number {
            var processData = {
                processState: ProcessState.New,
                priority: priority,
            };
            var pcb = new PCB(processData);
            if(this.programs.length <= this.maxProcesses){
                this.programs[this.programs.length] = pcb;
            }
        }
        public execute(): void {
        }
        private programs;
    }
}
