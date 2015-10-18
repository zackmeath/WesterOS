module TSOS {
    export class PCB {
        static currentProcessId: number = 1;
        constructor(
                public processID:      number = PCB.currentProcessId++, // Int
                public acc:            number = 0,                      // Number from 0-255
                public XRegister:      number = 0,                      // Number from 0-255
                public YRegister:      number = 0,                      // Number from 0-255
                public ZFlag:          number = 0,                      // 0 or 1
                public programCounter: number = 0,                      // Location of current program execution
                public processState:   ProcessState.New,                // Enum of 'NEW', 'READY', 'WAITING', 'HALTED', 'RUNNING', 'TERMINATED'
                public priority:       number = 0,                      // Importance
                public baseRegister:   number = -1,                     // Where memory access starts
                public limitRegister:  number = -1                      // Where memory access ends
                )
        {
        } // End of constructor
        public update(
                programCounter: number, 
                acc: number,
                XRegister: number,
                YRegister: number,
                ZFlag: number
        ) : void {
            this.programCounter = programCounter;
            this.acc = acc;
            this.XRegister = XRegister;
            this.YRegister = YRegister;
            this.ZFlag = ZFlag;
        }

    } // End of Process class
} // End of TSOS module

