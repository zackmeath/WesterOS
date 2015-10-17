module TSOS {
    export class Memory {
        private memory;
        constructor(size: number){
            this.memory = new Array(size);
        }
        public init(): void {
            for(var i = 0; i < this.memory.length; i++){
                this.memory[i] = '00';
            }
        }
        public loadProgram(program: Array<String>, offset: number): void {
            for(var i = 0; i < program.length; i++){
                var code = program[i];
                this.memory[offset + i] = (code !== undefined) ? code : '00';
            }
        }
        public clearAllMemory(): void {
            for(var i = 0; i < this.memory.length; i++){
                this.memory[i] = '00';
            }
        }
        public clearProgramBlock(offset: number): void {
            for(var i = 0; i < this.memory.length; i++){
                this.memory[offset + i] = '00';
            }
        }
    }
}
