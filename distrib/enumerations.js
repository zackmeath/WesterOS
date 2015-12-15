var TSOS;
(function (TSOS) {
    (function (ProcessState) {
        ProcessState[ProcessState["New"] = 0] = "New";
        ProcessState[ProcessState["Ready"] = 1] = "Ready";
        ProcessState[ProcessState["Waiting"] = 2] = "Waiting";
        ProcessState[ProcessState["Halted"] = 3] = "Halted";
        ProcessState[ProcessState["Running"] = 4] = "Running";
        ProcessState[ProcessState["Terminated"] = 5] = "Terminated";
    })(TSOS.ProcessState || (TSOS.ProcessState = {}));
    var ProcessState = TSOS.ProcessState;
    ;
    (function (SchedulingMode) {
        SchedulingMode[SchedulingMode["ROUND_ROBIN"] = 0] = "ROUND_ROBIN";
        SchedulingMode[SchedulingMode["FCFS"] = 1] = "FCFS";
        SchedulingMode[SchedulingMode["PRIORITY"] = 2] = "PRIORITY";
    })(TSOS.SchedulingMode || (TSOS.SchedulingMode = {}));
    var SchedulingMode = TSOS.SchedulingMode;
    ;
    (function (IRQ) {
        IRQ[IRQ["TIMER"] = 0] = "TIMER";
        IRQ[IRQ["KEYBOARD"] = 1] = "KEYBOARD";
        IRQ[IRQ["SYSCALL"] = 2] = "SYSCALL";
        IRQ[IRQ["CONTEXT_SWITCH"] = 3] = "CONTEXT_SWITCH";
        IRQ[IRQ["FILE_SYSTEM"] = 4] = "FILE_SYSTEM";
        IRQ[IRQ["PAGE_FAULT"] = 5] = "PAGE_FAULT";
    })(TSOS.IRQ || (TSOS.IRQ = {}));
    var IRQ = TSOS.IRQ;
})(TSOS || (TSOS = {}));
