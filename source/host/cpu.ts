///<reference path="../globals.ts" />

/* ------------
   CPU.ts

   Requires global.ts.

   Routines for the host CPU simulation, NOT for the OS itself.
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   TypeScript/JavaScript in both the host and client environments.

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

module TSOS {

    export class Cpu {

        public static singleStep: boolean;

        constructor(
                public PC:          number   = 0,
                public Acc:         number   = 0,
                public Xreg:        number   = 0,
                public Yreg:        number   = 0,
                public Zflag:       number   = 0,
                public isExecuting: boolean  = false,
                public currentPCB:  TSOS.PCB = null,
                public instruction: string   = 'N/A'
                ) {
            TSOS.Cpu.singleStep = false;
        }

        public init(): void {
        }

        // Load the CPU registers from the PCB
        private loadFromPCB(): void {
            this.PC    = this.currentPCB.programCounter;
            this.Acc   = this.currentPCB.acc;
            this.Xreg  = this.currentPCB.XRegister;
            this.Yreg  = this.currentPCB.YRegister;
            this.Zflag = this.currentPCB.ZFlag;
        }

        // Load the program by setting the current pcb and updateing the cpu registers
        public loadProgram(pcb: TSOS.PCB): void {
            this.currentPCB = pcb;
            this.currentPCB.processState = TSOS.ProcessState.Running;
            this.loadFromPCB();
        }

        // Change the pcb to reflect what the CPU registers currently are
        public updatePCB(): void {
            if(this.currentPCB !== null){
                this.currentPCB.update(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);
                TSOS.Control.updateProcessDisplay(this.currentPCB, this.instruction);
            }
        }

        public cycle(): void {
            // TODO: Accumulate CPU usage and profiling statistics here.

            // Only execute if we have something to run and cpu is allowed to execute
            if(this.currentPCB !== null && this.isExecuting){
                // Trace the cycle
                _Kernel.krnTrace('CPU cycle');

                // Get the next instruction
                this.instruction = _MemoryManager.read(this.currentPCB, this.PC);

                // Executing an instruction
                _CpuScheduler.incrementCounter();

                // Decide what to do with the instruction
                switch(this.instruction){
                    case 'A9': // Load acc with constant 
                        this.loadAccFromConstant();
                        break;
                    case 'AD': // Load acc from memory 
                        this.loadAccFromMemory();
                        break;
                    case '8D': // Store acc in memory 
                        this.storeAccInMemory();
                        break;
                    case '6D': // Add with carry (adds contents from addr to acc and stores in acc)
                        this.addWithCarry();
                        break;
                    case 'A2': // Load X Register with constant 
                        this.loadXWithConstant();
                        break;
                    case 'AE': // Load X Register from memory 
                        this.loadXFromMemory();
                        break;
                    case 'A0': // Load Y Register with constant 
                        this.loadYWithConstant();
                        break;
                    case 'AC': // Load Y Register from memory 
                        this.loadYFromMemory();
                        break;
                    case 'EC': // Compare byte at addr to X register, set z flag if equal 
                        this.comparison();
                        break;
                    case 'D0': // Branch N bytes if z flag = 0 (byte = N) 
                        this.branch();
                        break;
                    case 'EE': // EE increment a byte at addr 
                        this.increment();
                        break;
                    case 'FF': // System call:
                        this.sysCall();
                        break;
                    case 'EA': // No OP
                        this.PC++;
                        break;
                    case '00': // BREAK PROGRAM (sys call)
                        var out = '';
                        for(var i = 0; i < 256; i++){
                            out += _MemoryManager.read(this.currentPCB, i);
                        }
                        this.breakOP();
                        break;
                    default:
                        alert('Illegal instruction: ' + _MemoryManager.read(this.currentPCB, this.PC) + ', PC = ' + this.PC);
                        this.currentPCB.processState = TSOS.ProcessState.Halted;
                        this.currentPCB = null;
                        _CpuScheduler.setExecutingPCB(null);
                        this.isExecuting = false;
                        break;
                }
            }

            // If the program counter goes past memory, loop back on itself
            this.PC = this.PC % 256;

            // Keep the pcb up to date with the cpu
            if(this.currentPCB !== null){
                this.updatePCB();
            }

            // If we are in single step mode, we need to pause after executing to allow steping
            if(this.currentPCB !== null && this.isExecuting && TSOS.Cpu.singleStep){
                this.isExecuting = false;
            }

            // Update the memory display to reflect command
            TSOS.Control.updateMemoryDisplay();

            // Update resident table
            TSOS.Control.updateResidentDisplay();

            // Update File System display
            TSOS.Control.updateFSDisplay();

        } // End of cycle


        private loadAccFromConstant(){
            this.PC++;
            this.Acc = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
        }
        private loadAccFromMemory(){
            this.PC++;
            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Acc = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
            this.PC++;
        }
        private storeAccInMemory(){
            this.PC++;
            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
            _MemoryManager.write(this.currentPCB, addr, this.Acc.toString(16));
            this.PC++;
        }
        private addWithCarry(){
            this.PC++;
            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Acc += parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
            this.PC++;
        }
        private loadXWithConstant() {
            this.PC++;
            this.Xreg = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
        }
        private loadXFromMemory() {
            this.PC++;
            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Xreg = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
            this.PC++;
        }
        private loadYWithConstant(){
            this.PC++;
            this.Yreg = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
        }
        private loadYFromMemory(){
            this.PC++;
            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Yreg = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
            this.PC++;
        }
        private comparison(){
            this.PC++;
            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Zflag = (this.Xreg === parseInt(_MemoryManager.read(this.currentPCB, addr), 16)) ? 1 : 0;
            this.PC++;
        }
        private branch() {
            this.PC++;
            if(this.Zflag === 0){
                var hex = _MemoryManager.read(this.currentPCB, this.PC);
                this.PC++; // Account for the byte to tell us how far to jump
                var jump = parseInt(hex, 16);
                this.PC += jump;
            } else {
                this.PC++;
            }
        }
        private increment() {
            this.PC++;
            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
            var value = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
            value++;
            _MemoryManager.write(this.currentPCB, addr, value.toString(16));
            this.PC++;
        }
        private sysCall(){
            // if 1 in X register, print byte in Y register
            // else if 2 in X register, print 00 terminated string at addr stored in Y register
            if (this.Xreg === 1){
                var params = { output: this.Yreg.toString() };
            } else {
                var output = '';
                var addr = this.Yreg;
                var code = _MemoryManager.read(this.currentPCB, addr);
                while(code !== '00'){
                    var letter = String.fromCharCode(parseInt(code,16));
                    output += letter;
                    addr++;
                    var code = _MemoryManager.read(this.currentPCB, addr);
                }
                var params = { output: output };
            }
            _KernelInterruptQueue.enqueue(new Interrupt(TSOS.IRQ.SYSCALL, params));
            this.PC++;
        }
        private breakOP() {
            this.updatePCB();
            this.currentPCB.processState = ProcessState.Terminated;
            _MemoryManager.deallocateMemory(this.currentPCB);
            this.currentPCB = null;
            _CpuScheduler.setExecutingPCB(null);
            _CpuScheduler.resetCounter();
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.PC = 0;
            (<HTMLButtonElement>document.getElementById("btnStep")).disabled = true;
            if(_ProcessManager.readyQueue.getSize() === 0){
                this.isExecuting = false;
            }
        }
    }
}
