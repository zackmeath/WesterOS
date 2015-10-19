module TSOS {
    export class MemoryManager {
        constructor(){
        }

        public init(): void {
        }

        public read(pcb: TSOS.PCB, loc: number): string {
            if(loc >= 0 && loc < 256){
                return _Memory.getByte(pcb.baseRegister + loc);
            } else {
                // TODO Throw memory access error
            }
        }

        public write(pcb: TSOS.PCB, loc: number, data: string): void {
            if(loc >= 0 && loc < 256){
                return _Memory.setByte(pcb.baseRegister + loc, data);
            } else {
                // TODO Throw memory access error
            }
        }

        public allocateMemory(pcb: TSOS.PCB, program: Array<string>): void {
            // TODO Set base and limit register for pcb
            for(var i = 0; i < 256; i++){
                var code = program[i];
                _Memory.setByte(pcb.baseRegister + i, (code !== undefined) ? code : '00');
            }
        }

    }
}
