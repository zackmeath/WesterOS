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

        constructor(
                public PC:          number   = 0,
                public Acc:         number   = 0,
                public Xreg:        number   = 0,
                public Yreg:        number   = 0,
                public Zflag:       number   = 0,
                public isExecuting: boolean  = false,
                public currentPCB:  TSOS.PCB = null
                ) {
        }

        public init(): void {
        }

        private loadFromPCB(): void {
            this.PC = this.currentPCB.programCounter;
            this.Acc = this.currentPCB.acc;
            this.Xreg = this.currentPCB.XRegister;
            this.Yreg = this.currentPCB.YRegister;
            this.Zflag = this.currentPCB.ZFlag;
        }

        public runProcess(pid: number):void {
            this.currentPCB = _ProcessManager.getPCB(pid);
            if(this.currentPCB.processState === ProcessState.Terminated){
                _StdOut.putText('This process has already been terminated');
            } else {
                this.currentPCB.processState = ProcessState.Running;
                this.loadFromPCB();
                this.isExecuting = true;
            }
        }

        public loadProgram(pcb: TSOS.PCB): void {
            this.currentPCB = pcb;
            this.Acc = pcb.acc;
            this.PC = pcb.programCounter;
            this.Xreg = pcb.XRegister;
            this.Yreg = pcb.YRegister;
            this.Zflag = pcb.ZFlag;
        }

        public updatePCB(): void {
            if(this.currentPCB !== null){
                TSOS.Control.updateProcessDisplay(this.currentPCB);
                this.currentPCB.update(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);
            }
        }

        public cycle(): void {
            this.PC = this.PC % (this.currentPCB.limitRegister - this.currentPCB.baseRegister);
            TSOS.Control.updateMemoryDisplay();
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            if(this.currentPCB !== null && this.isExecuting){
                // console.log(_MemoryManager.read(this.currentPCB, this.PC) + ', ' + _MemoryManager.read(this.currentPCB, this.PC+1) );
                switch(_MemoryManager.read(this.currentPCB, this.PC)){
                    case 'A9': // Load acc with constant 
                        this.PC++;
                        this.Acc = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        break;
                    case 'AD': // Load acc from memory 
                        this.PC++;
                        var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        this.Acc = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
                        this.PC++;
                        break;
                    case '8D': // Store acc in memory 
                        this.PC++;
                        var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        _MemoryManager.write(this.currentPCB, addr, this.Acc.toString(16));
                        this.PC++;
                        break;
                    case '6D': // Add with carry (adds contents from addr to acc and stores in acc)
                        this.PC++;
                        var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        this.Acc += parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
                        this.PC++;
                        break;
                    case 'A2': // Load X Register with constant 
                        this.PC++;
                        this.Xreg = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        break;
                    case 'AE': // Load X Register from memory 
                        this.PC++;
                        var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        this.Xreg = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
                        this.PC++;
                        break;
                    case 'A0': // Load Y Register with constant 
                        this.PC++;
                        this.Yreg = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        break;
                    case 'AC': // Load Y Register from memory 
                        this.PC++;
                        var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        this.Yreg = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
                        this.PC++;
                        break;
                    case 'EC': // Compare byte at addr to X register, set z flag if equal 
                        this.PC++;
                        var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        this.Zflag = (this.Xreg === parseInt(_MemoryManager.read(this.currentPCB, addr), 16)) ? 1 : 0;
                        this.PC++;
                        break;
                    case 'D0': // Branch N bytes if z flag = 0 (byte = N) 
                        this.PC++;
                        if(this.Zflag === 0){
                            var hex = _MemoryManager.read(this.currentPCB, this.PC);
                            var jump = parseInt(hex, 16);
                            this.PC += jump;
                        } else {
                            this.PC++;
                        }
                        break;
                    case 'EE': // EE increment a byte at addr 
                        this.PC++;
                        var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        var value = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
                        value++;
                        _MemoryManager.write(this.currentPCB, addr, value.toString(16));
                        this.PC++;
                        break;
                    case 'FF': // System call:
                        // if 1 in X register, print byte in Y register
                        // else if 2 in X register, print 00 terminated string at addr stored in Y register
                        if (this.Xreg === 1){
                            _StdOut.putText(this.Yreg + '');
                            _StdOut.advanceLine();
                            _OsShell.putPrompt();
                        } else {
                            this.PC++;
                            var addr = this.Yreg;
                            var code = _MemoryManager.read(this.currentPCB, addr);
                            while(code !== '00'){
                                var letter = String.fromCharCode(parseInt(code,16));
                                _StdOut.putText(letter);
                                addr++;
                                var code = _MemoryManager.read(this.currentPCB, addr);
                            }
                            _StdOut.advanceLine();
                            _OsShell.putPrompt();
                        }
                        this.PC++;
                        break;
                    case 'EA': // No OP
                        this.PC++;
                        break;
                    case '00': // BREAK PROGRAM (sys call)
                        this.isExecuting = false;
                        _MemoryManager.deallocateMemory(this.currentPCB);
                        this.currentPCB.processState = ProcessState.Terminated;
                        this.updatePCB();
                        this.currentPCB = null;
                        this.Acc = 0;
                        this.Xreg = 0;
                        this.Yreg = 0;
                        this.Zflag = 0;
                        this.PC = 0;
                        break;
                    default:
                        alert('Illegal instruction: ' + _MemoryManager.read(this.currentPCB, this.PC) + ', PC = ' + this.PC);
                        this.PC++;
                        break;
                }
            }
            if(this.currentPCB !== null){
                this.updatePCB();
            }
        } // End of cycle
    }
}
