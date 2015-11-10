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
    (function (Mode) {
        Mode[Mode["ROUND_ROBIN"] = 0] = "ROUND_ROBIN";
        Mode[Mode["FCFS"] = 1] = "FCFS";
        Mode[Mode["PRIORITY"] = 2] = "PRIORITY";
    })(TSOS.Mode || (TSOS.Mode = {}));
    var Mode = TSOS.Mode;
    ;
})(TSOS || (TSOS = {}));
