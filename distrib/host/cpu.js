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
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting, currentPCB, instruction) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            if (currentPCB === void 0) { currentPCB = null; }
            if (instruction === void 0) { instruction = 'N/A'; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
            this.currentPCB = currentPCB;
            this.instruction = instruction;
            TSOS.Cpu.singleStep = false;
        }
        Cpu.prototype.init = function () {
        };
        // Load the CPU registers from the PCB
        Cpu.prototype.loadFromPCB = function () {
            this.PC = this.currentPCB.programCounter;
            this.Acc = this.currentPCB.acc;
            this.Xreg = this.currentPCB.XRegister;
            this.Yreg = this.currentPCB.YRegister;
            this.Zflag = this.currentPCB.ZFlag;
        };
        // Load the program by setting the current pcb and updateing the cpu registers
        Cpu.prototype.loadProgram = function (pcb) {
            this.currentPCB = pcb;
            this.currentPCB.processState = TSOS.ProcessState.Running;
            this.loadFromPCB();
        };
        // Change the pcb to reflect what the CPU registers currently are
        Cpu.prototype.updatePCB = function () {
            if (this.currentPCB !== null) {
                this.currentPCB.update(this.PC, this.Acc, this.Xreg, this.Yreg, this.Zflag);
                TSOS.Control.updateProcessDisplay(this.currentPCB, this.instruction);
            }
        };
        Cpu.prototype.cycle = function () {
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Only execute if we have something to run and cpu is allowed to execute
            if (this.currentPCB !== null && this.isExecuting) {
                // Trace the cycle
                _Kernel.krnTrace('CPU cycle');
                // Get the next instruction
                this.instruction = _MemoryManager.read(this.currentPCB, this.PC);
                // Executing an instruction
                _CpuScheduler.incrementCounter();
                // Decide what to do with the instruction
                switch (this.instruction) {
                    case 'A9':
                        this.loadAccFromConstant();
                        break;
                    case 'AD':
                        this.loadAccFromMemory();
                        break;
                    case '8D':
                        this.storeAccInMemory();
                        break;
                    case '6D':
                        this.addWithCarry();
                        break;
                    case 'A2':
                        this.loadXWithConstant();
                        break;
                    case 'AE':
                        this.loadXFromMemory();
                        break;
                    case 'A0':
                        this.loadYWithConstant();
                        break;
                    case 'AC':
                        this.loadYFromMemory();
                        break;
                    case 'EC':
                        this.comparison();
                        break;
                    case 'D0':
                        this.branch();
                        break;
                    case 'EE':
                        this.increment();
                        break;
                    case 'FF':
                        this.sysCall();
                        break;
                    case 'EA':
                        this.PC++;
                        break;
                    case '00':
                        var out = '';
                        for (var i = 0; i < 256; i++) {
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
            if (this.currentPCB !== null) {
                this.updatePCB();
            }
            // If we are in single step mode, we need to pause after executing to allow steping
            if (this.currentPCB !== null && this.isExecuting && TSOS.Cpu.singleStep) {
                this.isExecuting = false;
            }
            // Update the memory display to reflect command
            TSOS.Control.updateMemoryDisplay();
            // Update resident table
            TSOS.Control.updateResidentDisplay();
            // Update File System display
            TSOS.Control.updateFSDisplay();
        }; // End of cycle
        Cpu.prototype.loadAccFromConstant = function () {
            this.PC++;
            this.Acc = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
        };
        Cpu.prototype.loadAccFromMemory = function () {
            this.PC++;
            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Acc = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
            this.PC++;
        };
        Cpu.prototype.storeAccInMemory = function () {
            this.PC++;
            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
            _MemoryManager.write(this.currentPCB, addr, this.Acc.toString(16));
            this.PC++;
        };
        Cpu.prototype.addWithCarry = function () {
            this.PC++;
            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Acc += parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
            this.PC++;
        };
        Cpu.prototype.loadXWithConstant = function () {
            this.PC++;
            this.Xreg = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
        };
        Cpu.prototype.loadXFromMemory = function () {
            this.PC++;
            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Xreg = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
            this.PC++;
        };
        Cpu.prototype.loadYWithConstant = function () {
            this.PC++;
            this.Yreg = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
        };
        Cpu.prototype.loadYFromMemory = function () {
            this.PC++;
            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Yreg = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
            this.PC++;
        };
        Cpu.prototype.comparison = function () {
            this.PC++;
            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
            this.Zflag = (this.Xreg === parseInt(_MemoryManager.read(this.currentPCB, addr), 16)) ? 1 : 0;
            this.PC++;
        };
        Cpu.prototype.branch = function () {
            this.PC++;
            if (this.Zflag === 0) {
                var hex = _MemoryManager.read(this.currentPCB, this.PC);
                this.PC++; // Account for the byte to tell us how far to jump
                var jump = parseInt(hex, 16);
                this.PC += jump;
            }
            else {
                this.PC++;
            }
        };
        Cpu.prototype.increment = function () {
            this.PC++;
            var addr = parseInt(_MemoryManager.read(this.currentPCB, this.PC), 16);
            this.PC++;
            var value = parseInt(_MemoryManager.read(this.currentPCB, addr), 16);
            value++;
            _MemoryManager.write(this.currentPCB, addr, value.toString(16));
            this.PC++;
        };
        Cpu.prototype.sysCall = function () {
            // if 1 in X register, print byte in Y register
            // else if 2 in X register, print 00 terminated string at addr stored in Y register
            if (this.Xreg === 1) {
                var params = { output: this.Yreg.toString() };
            }
            else {
                var output = '';
                var addr = this.Yreg;
                var code = _MemoryManager.read(this.currentPCB, addr);
                while (code !== '00') {
                    var letter = String.fromCharCode(parseInt(code, 16));
                    output += letter;
                    addr++;
                    var code = _MemoryManager.read(this.currentPCB, addr);
                }
                var params = { output: output };
            }
            _KernelInterruptQueue.enqueue(new TSOS.Interrupt(TSOS.IRQ.SYSCALL, params));
            this.PC++;
        };
        Cpu.prototype.breakOP = function () {
            this.updatePCB();
            this.currentPCB.processState = TSOS.ProcessState.Terminated;
            _MemoryManager.deallocateMemory(this.currentPCB);
            this.currentPCB = null;
            _CpuScheduler.setExecutingPCB(null);
            _CpuScheduler.resetCounter();
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.PC = 0;
            document.getElementById("btnStep").disabled = true;
            if (_ProcessManager.readyQueue.getSize() === 0) {
                this.isExecuting = false;
            }
        };
        return Cpu;
    })();
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
