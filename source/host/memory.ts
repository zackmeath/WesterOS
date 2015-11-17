module TSOS {
    export class Memory {
        private memory;
        constructor(size: number){
            this.memory = new Array(size);
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
            for(var i = 0; i < (end - start); i++){
                this.memory[start + i] = '00';
            }
        }

        public getByte(loc: number): string {
            return this.memory[loc];
        }

        public setByte(loc: number, data: string): void {
            if(data.length === 1){
                data = '0' + data;
            }
            this.memory[loc] = data;
        }

        public getSize(): number {
            return this.memory.length;
        }

        public toString(){
            var output = '';
            for(var i = 0; i < this.memory.length; i++){
                output += this.memory[i] + ' ';
            }
            return output;
        }

    }
}
