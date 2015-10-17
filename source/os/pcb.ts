module TSOS {
    export class PCB {
        constructor(proc: {
                processID: number,               // Int
                acc: number,                     // Number from 0-255
                XRegister: number,               // Number from 0-255
                YRegister: number,               // Number from 0-255
                ZFlag: number,                   // 0 or 1
                programCounter: number,          // Location of current program execution
                processState: TSOS.ProcessState, // Enum of 'NEW', 'READY', 'WAITING', 'HALTED', 'RUNNING', 'TERMINATED'
                priority: number,                // Importance
                })
        {
            if(!this.validateProc(proc)){
                this.processID      = proc.processID;
                this.acc            = proc.acc;
                this.XRegister      = proc.XRegister;
                this.YRegister      = proc.YRegister;
                this.ZFlag          = proc.ZFlag;
                this.programCounter = proc.programCounter;
                this.processState   = ProcessState.New;
                this.priority       = proc.priority;
            } else {
                // TODO Add error handling in case proc is invalid
            }
        } // End of constructor

        // Instance fields
        public processID:      number;
        public acc:            number;
        public XRegister:      number;
        public YRegister:      number;
        public ZFlag:          number; 
        public programCounter: number;
        public processState:   ProcessState;
        public priority:       number;

        private validateProc(proc){
            var pID           = proc.hasOwnProperty('processID');
            var acc           = proc.hasOwnProperty('acc');
            var x             = proc.hasOwnProperty('XRegister');
            var y             = proc.hasOwnProperty('YRegister');
            var z             = proc.hasOwnProperty('ZFlag');
            var pc            = proc.hasOwnProperty('programCounter');
            var ps            = proc.hasOwnProperty('processState');
            var priority      = proc.hasOwnProperty('priority');
            var validRegister = proc.XRegister < 256 && proc.YRegister < 256 && proc.acc < 256;

            return (pID && acc && x && y && z && pc && ps && priority && validRegister);
        } // End of validateProc
    } // End of Process class
} // End of TSOS module

