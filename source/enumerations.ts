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

    export enum IRQ {
        TIMER,
        KEYBOARD,
        SYSCALL,
        CONTEXT_SWITCH,
        FILE_SYSTEM,
        PAGE_FAULT
    }
}

