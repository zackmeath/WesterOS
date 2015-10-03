module TSOS {
    export class Process {
        constructor(proc: {
                processID: number,      // Int
                acc: number,            // byte?
                x: number,              // byte?
                y: number,              // byte?
                z: number,              // 0 or 1
                programCounter: number, // Location to resume
                processState: string,   // Enum of 'NEW', 'READY', 'WAITING', 'HALTED', 'RUNNING', 'TERMINATED'
                priority: number,       // Importance
                })
        {
            if(!this.validateProc){
                this.processID = proc.processID;
                this.acc = proc.acc;
                this.XRegister = proc.XRegister;
                this.YRegister = proc.YRegister;
                this.ZFlag = proc.ZFlag;
                this.programCounter = proc.programCounter;
                this.processState = proc.processState;
                this.priority = proc.priority;
            } else {
                // TODO Add error handling
            }
        } // End of constructor

        public processID: number,
        public acc: number, // byte?
        public XRegister: number, // byte?
        public YRegister: number, // byte?
        public ZFlag: number, 
        public programCounter: number,
        public processState: string,
        public priority: number,

        private validateProc(proc){
            var pID = proc.hasOwnProperty('processID');
            var acc = proc.hasOwnProperty('acc');
            var x = proc.hasOwnProperty('XRegister');
            var y = proc.hasOwnProperty('YRegister');
            var z = proc.hasOwnProperty('ZFlag');
            var pc = proc.hasOwnProperty('programCounter');
            var ps = proc.hasOwnProperty('');
            var priority = proc.hasOwnProperty('');
        }
    } // End of Process class
} // End of TSOS module

