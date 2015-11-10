module TSOS {
    export class MemoryManager {

        private memorySize;
        private allocated;
        private programSize;

        constructor(maxProcesses: number){
            this.memorySize = _Memory.getSize();
            this.programSize = this.memorySize/maxProcesses;
            this.allocated = new Array(maxProcesses);
            for(var i = 0; i < this.allocated.length; i++){
                this.allocated[i] = -1;
            }
        }

        public clearMemory(): void {
            _Memory.clearAllMemory();
        }

        public read(pcb: TSOS.PCB, loc: number): string {
            if(loc >= 0 && loc < this.programSize){
                return _Memory.getByte(pcb.baseRegister + loc);
            } else {
                // TODO Throw memory access error
                _ProcessManager.killProcess(pcb.processID);
                alert('Memory access error');
            }
        }

        public write(pcb: TSOS.PCB, loc: number, data: string): void {
            if(loc >= 0 && loc < 256){
                if(parseInt(data, 16) > 255){
                    // TODO Can't store more than FF
                } else {
                    _Memory.setByte(pcb.baseRegister + loc, data);
                }
            } else {
                // TODO Throw memory access error
                _ProcessManager.killProcess(pcb.processID);
                alert('Memory access error');
            }
        }

        public allocateMemory(pcb: TSOS.PCB, program: Array<string>): void {
            for(var i = 0; i < this.allocated.length; i++){
                if(this.allocated[i] === -1){
                    this.allocated[i] = pcb.processID;
                    pcb.baseRegister = i * 256;
                    pcb.limitRegister = pcb.baseRegister + 255;
                    break;
                }
            }
            if(pcb.baseRegister === -1){
                // TODO Error handling no more space to allocate
                alert("BASE REGISTER NOT SET");
            }
            for(var i = 0; i < 256; i++){
                var code = program[i];
                _Memory.setByte(pcb.baseRegister + i, (code !== undefined) ? code : '00');
            }
        }

        public deallocateMemory(pcb: TSOS.PCB): void {
            for(var i = 0; i < this.allocated.length; i++){
                if(this.allocated[i] === pcb.processID){
                    this.allocated[i] = -1;
                    _Memory.clearRange(pcb.baseRegister, pcb.limitRegister);
                    break;
                }
            }
        }
    }
}
