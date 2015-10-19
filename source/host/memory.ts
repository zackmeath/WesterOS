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
        public clearAllMemory(): void {
            for(var i = 0; i < this.memory.length; i++){
                this.memory[i] = '00';
            }
        }
        public clearRange(start: number, end: number): void {
            for(var i = 0; i < end; i++){
                this.memory[start + i] = '00';
            }
        }
        public getByte(loc: number): string {
            return this.memory[loc];
        }
        public setByte(loc: number, data: string): void {
            this.memory[loc] = data;
        }
        public getSize(): number {
            return this.memory.length;
        }
        public printMem(){
            console.log(this.memory);
        }
    }
}
