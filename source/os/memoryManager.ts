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
                _ProcessManager.killProcess(pcb.processID);
                alert('Memory read error: Accessing loc(' + loc + ')');
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
                _ProcessManager.killProcess(pcb.processID);
                alert('Memory write error: Accessing loc(' + loc + ')');
            }
        }

        public allocateMemory(pcb: TSOS.PCB, program: Array<string>): void {
            for(var i = 0; i < this.allocated.length; i++){
                if(this.allocated[i] === -1){
                    this.allocated[i] = pcb.processID;
                    pcb.baseRegister = i * 256;
                    pcb.limitRegister = pcb.baseRegister + 255;
                    pcb.isInMemory = true;
                    pcb.diskLocation = '';
                    break;
                }
            }
            if(!pcb.isInMemory){
                // No more space to allocate in memory, write to disk
                pcb.isInMemory = false;
                pcb.diskLocation = _FileSystemManager.findEmptyTSB();
                var str = '';
                for (var i = 0; i < program.length; i++){
                    str += program[i];
                }
                while(str.length < this.programSize*2){
                    str += '0';
                }
                _FileSystemManager.writeFileContents(pcb.diskLocation, str);
                TSOS.Control.updateFSDisplay();
            } else {
                for(var i = 0; i < 256; i++){
                    var code = program[i];
                    _Memory.setByte(pcb.baseRegister + i, (code !== undefined) ? code : '00');
                }
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

        public pageFaultISR(newPCBid: number, oldPCBid): void {
            var pcbToLoad = _ProcessManager.residentList[newPCBid];

            if(oldPCBid !== -1) {
                var pcbToStore = _ProcessManager.residentList[oldPCBid];

                // Store old pcb
                var programString = '';
                for(var i = 0; i < this.allocated.length; i++){
                    if(this.allocated[i] === pcbToStore.processID){
                        for(var j = 0; j < this.programSize; j++){
                            programString += this.read(pcbToStore, j);
                        }
                        this.allocated[i] = -1;
                        break;
                    }
                }
                pcbToStore.isInMemory = false;
                pcbToStore.diskLocation = _FileSystemManager.findEmptyTSB();
                _FileSystemManager.writeFileContents(pcbToStore.diskLocation, programString);
            }
            
            // load new pcb
            var newProgram = _FileSystemManager.retrieveFileContents(pcbToLoad.diskLocation);
            var programArray = [];
            for (var i = 0; i < newProgram.length; i += 2){
                programArray.push('' + newProgram[i] + newProgram[i + 1]);
            }
            _FileSystemManager.contentsDelete(pcbToLoad.diskLocation);
            pcbToLoad.diskLocation = '';
            pcbToLoad.isInMemory = true;
            this.allocateMemory(pcbToLoad, programArray);

            // Update the display
            TSOS.Control.updateFSDisplay();
        }

    }
}
