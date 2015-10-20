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
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting, currentPCB) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (currentPCB === void 0) { currentPCB = null; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.currentPCB = currentPCB;
            TSOS.Cpu.singleStep = false;
        }
        Cpu.prototype.init = function () {
        };
        Cpu.prototype.loadFromPCB = function () {
            this.PC = this.currentPCB.programCounter;
            this.Acc = this.currentPCB.acc;
            this.Xreg = this.currentPCB.XRegister;
            this.Yreg = this.currentPCB.YRegister;
            this.Zflag = this.currentPCB.ZFlag;
        };
        Cpu.prototype.runProcess = function (pid) {
            this.currentPCB = _ProcessManager.getPCB(pid);
            if (this.currentPCB.processState === TSOS.ProcessState.Terminated) {
                _StdOut.putText('This process has already been terminated');
            }
            else {
                this.currentPCB.processState = TSOS.ProcessState.Running;
                this.loadFromPCB();
                this.isExecuting = true;
            }
        };
        Cpu.prototype.loadProgram = function (pcb) {
            this.currentPCB = pcb;
            this.Acc = pcb.acc;
            this.PC = pcb.programCounter;
            this.Xreg = pcb.XRegister;
            this.Yreg = pcb.YRegister;
            this.Zflag = pcb.ZFlag;
        };
        Cpu.prototype.updatePCB = function (instruction) {
            if (this.currentPCB !== null) {
                this.currentPCB.update(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);
                TSOS.Control.updateProcessDisplay(this.currentPCB, instruction);
            }
        };
        Cpu.prototype.cycle = function () {
            TSOS.Control.updateMemoryDisplay();
            _Kernel.krnTrace('CPU cycle');
            var instruction = 'N/A';
            // TODO: Accumulate CPU usage and profiling statistics here.
            if (this.currentPCB !== null && this.isExecuting) {
                this.PC = this.PC % (this.currentPCB.limitRegister - this.currentPCB.baseRegister + 1);
                instruction = _MemoryManager.read(this.currentPCB, this.PC);
                switch (instruction) {
                    case 'A9':
                        this.PC++;
                        this.Acc = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        break;
                    case 'AD':
                        this.PC++;
                        var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        this.Acc = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
                        this.PC++;
                        break;
                    case '8D':
                        this.PC++;
                        var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        _MemoryManager.write(this.currentPCB, addr, this.Acc.toString(16));
                        this.PC++;
                        break;
                    case '6D':
                        this.PC++;
                        var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        this.Acc += parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
                        this.PC++;
                        break;
                    case 'A2':
                        this.PC++;
                        this.Xreg = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        break;
                    case 'AE':
                        this.PC++;
                        var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        this.Xreg = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
                        this.PC++;
                        break;
                    case 'A0':
                        this.PC++;
                        this.Yreg = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        break;
                    case 'AC':
                        this.PC++;
                        var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        this.Yreg = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
                        this.PC++;
                        break;
                    case 'EC':
                        this.PC++;
                        var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        this.Zflag = (this.Xreg === parseInt(_MemoryManager.read(this.currentPCB, addr), 16)) ? 1 : 0;
                        this.PC++;
                        break;
                    case 'D0':
                        this.PC++;
                        if (this.Zflag === 0) {
                            var hex = _MemoryManager.read(this.currentPCB, this.PC);
                            console.log(hex);
                            this.PC++; // Account for the byte to tell us how far to jump
                            var jump = parseInt(hex, 16);
                            this.PC += jump;
                        }
                        else {
                            this.PC++;
                        }
                        break;
                    case 'EE':
                        this.PC++;
                        var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                        this.PC++;
                        var value = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
                        value++;
                        _MemoryManager.write(this.currentPCB, addr, value.toString(16));
                        this.PC++;
                        break;
                    case 'FF':
                        // if 1 in X register, print byte in Y register
                        // else if 2 in X register, print 00 terminated string at addr stored in Y register
                        if (this.Xreg === 1) {
                            _StdOut.putText(this.Yreg + '');
                            _StdOut.advanceLine();
                            _OsShell.putPrompt();
                        }
                        else {
                            var addr = this.Yreg;
                            var code = _MemoryManager.read(this.currentPCB, addr);
                            while (code !== '00') {
                                var letter = String.fromCharCode(parseInt(code, 16));
                                _StdOut.putText(letter);
                                addr++;
                                var code = _MemoryManager.read(this.currentPCB, addr);
                            }
                            _StdOut.advanceLine();
                            _OsShell.putPrompt();
                        }
                        this.PC++;
                        break;
                    case 'EA':
                        this.PC++;
                        break;
                    case '00':
                        this.isExecuting = false;
                        _MemoryManager.deallocateMemory(this.currentPCB);
                        this.currentPCB.processState = TSOS.ProcessState.Terminated;
                        this.updatePCB(instruction);
                        this.currentPCB = null;
                        this.Acc = 0;
                        this.Xreg = 0;
                        this.Yreg = 0;
                        this.Zflag = 0;
                        this.PC = 0;
                        document.getElementById("btnStep").disabled = true;
                        break;
                    default:
                        alert('Illegal instruction: ' + _MemoryManager.read(this.currentPCB, this.PC) + ', PC = ' + this.PC);
                        this.isExecuting = false;
                        break;
                }
            }
            if (this.currentPCB !== null) {
                this.updatePCB(instruction);
            }
            if (this.currentPCB !== null && this.isExecuting && TSOS.Cpu.singleStep) {
                this.isExecuting = false;
            }
        }; // End of cycle
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
