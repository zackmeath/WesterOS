module TSOS {
    export enum ProcessState { 
        New, 
        Ready, 
        Waiting, 
        Halted, 
        Running, 
        Terminated
    };
    
    export enum Mode {
        ROUND_ROBIN,
        FCFS,
        PRIORITY
    };
}

