var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(proc) {
            if (!this.validateProc(proc)) {
                this.processID = proc.processID;
                this.acc = proc.acc;
                this.XRegister = proc.XRegister;
                this.YRegister = proc.YRegister;
                this.ZFlag = proc.ZFlag;
                this.programCounter = proc.programCounter;
                this.processState = TSOS.ProcessState.New;
                this.priority = proc.priority;
                this.memory = proc.memory.toUpperCase();
            }
            else {
            }
        } // End of constructor
        PCB.prototype.validateProc = function (proc) {
            var pID = proc.hasOwnProperty('processID');
            var acc = proc.hasOwnProperty('acc');
            var x = proc.hasOwnProperty('XRegister');
            var y = proc.hasOwnProperty('YRegister');
            var z = proc.hasOwnProperty('ZFlag');
            var pc = proc.hasOwnProperty('programCounter');
            var ps = proc.hasOwnProperty('processState');
            var priority = proc.hasOwnProperty('priority');
            var validRegister = proc.XRegister < 256 && proc.YRegister < 256 && proc.acc < 256;
            return (pID && acc && x && y && z && pc && ps && priority && validRegister);
        }; // End of validateProc
        return PCB;
    })();
    TSOS.PCB = PCB; // End of Process class
})(TSOS || (TSOS = {})); // End of TSOS module
