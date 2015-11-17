module TSOS {
    export enum ProcessState { 
        New, 
        Ready, 
        Waiting, 
        Halted, 
        Running, 
        Terminated
    };
    
    export enum SchedulingMode {
        ROUND_ROBIN,
        FCFS,
        PRIORITY
    };
}

