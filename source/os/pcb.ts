module TSOS {
    export class PCB {
        public priority:       number;           // Importance
        public processID:      number;           // Int
        public acc:            number;           // Number from 0-255
        public XRegister:      number;           // Number from 0-255
        public YRegister:      number;           // Number from 0-255
        public ZFlag:          number;           // 0 or 1
        public programCounter: number;           // Location of current program execution
        public processState:   TSOS.ProcessState; // Enum of 'NEW', 'READY', 'WAITING', 'HALTED', 'RUNNING', 'TERMINATED'
        public baseRegister:   number;           // Where memory access starts
        public limitRegister:  number;           // Where memory access ends
        
        static currentProcessId: number = 1;
        constructor(priority: number){
         this.priority = priority;
         this.processID = PCB.currentProcessId++;
         this.acc = 0;
         this.XRegister = 0;
         this.YRegister = 0;
         this.ZFlag = 0;
         this.programCounter = 0;
         this.processState = TSOS.ProcessState.New;
         this.baseRegister = -1;
         this.limitRegister = -1;


        } // End of constructor
        public update(
                pc: number, 
                Acc: number,
                XReg: number,
                YReg: number,
                Zflag: number
        ): void {
            this.programCounter = pc;
            this.acc = Acc;
            this.XRegister = XReg;
            this.YRegister = YReg;
            this.ZFlag = Zflag;
        }

    } // End of Process class
} // End of TSOS module

