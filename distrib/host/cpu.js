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
        }
        Cpu.prototype.init = function () {
        };
        Cpu.prototype.loadProgram = function (pcb) {
            this.currentPCB = pcb;
            this.Acc = pcb.acc;
            this.PC = pcb.programCounter;
            this.Xreg = pcb.XRegister;
            this.Yreg = pcb.YRegister;
            this.Zflag = pcb.ZFlag;
        };
        Cpu.prototype.updatePCB = function () {
            this.currentPCB.update(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            if (this.currentPCB !== null && this.isExecuting) {
                switch (_MemoryManager.read(this.currentPCB, this.PC)) {
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
                            this.PC += parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
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
                            _StdOut.putText(this.Yreg);
                        }
                        else {
                            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
                            this.PC++;
                            _StdOut.putText(parseInt(_MemoryManager.read(this.currentPCB, this.Yreg), 16));
                        }
                        this.PC++;
                        break;
                    case 'EA':
                        this.PC++;
                        break;
                    case '00':
                        this.PC++;
                        break;
                    default:
                        alert('Illegal instruction: ' + _MemoryManager.read(this.currentPCB, this.PC));
                        this.PC++;
                        break;
                }
            }
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
