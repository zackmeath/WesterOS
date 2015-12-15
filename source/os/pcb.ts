module TSOS {
    export class PCB {

        static currentProcessId: number = 0;

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
        public isInMemory:     boolean;          // True if the process is stored in memory, false if on disk
        public diskLocation:   string;           // TSB string that contains the process's location on disk if isInMemory is false

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
         this.isInMemory = false;
         this.diskLocation = '';


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

