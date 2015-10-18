var TSOS;
(function (TSOS) {
    var PCB = (function () {
        function PCB(processID, // Int
            acc, // Number from 0-255
            XRegister, // Number from 0-255
            YRegister, // Number from 0-255
            ZFlag, // 0 or 1
            programCounter, // Location of current program execution
            processState, // Enum of 'NEW', 'READY', 'WAITING', 'HALTED', 'RUNNING', 'TERMINATED'
            priority, // Importance
            baseRegister, // Where memory access starts
            limitRegister // Where memory access ends
            ) {
            if (processID === void 0) { processID = PCB.currentProcessId++; }
            if (acc === void 0) { acc = 0; }
            if (XRegister === void 0) { XRegister = 0; }
            if (YRegister === void 0) { YRegister = 0; }
            if (ZFlag === void 0) { ZFlag = 0; }
            if (programCounter === void 0) { programCounter = 0; }
            if (priority === void 0) { priority = 0; }
            if (baseRegister === void 0) { baseRegister = -1; }
            if (limitRegister === void 0) { limitRegister = -1; }
            this.processID = processID;
            this.acc = acc;
            this.XRegister = XRegister;
            this.YRegister = YRegister;
            this.ZFlag = ZFlag;
            this.programCounter = programCounter;
            this.processState = processState;
            this.priority = priority;
            this.baseRegister = baseRegister;
            this.limitRegister = limitRegister;
        } // End of constructor
        PCB.prototype.update = function (programCounter, acc, XRegister, YRegister, ZFlag) {
            this.programCounter = programCounter;
            this.acc = acc;
            this.XRegister = XRegister;
            this.YRegister = YRegister;
            this.ZFlag = ZFlag;
        };
        PCB.currentProcessId = 1;
        return PCB;
    })();
    TSOS.PCB = PCB; // End of Process class
})(TSOS || (TSOS = {})); // End of TSOS module
