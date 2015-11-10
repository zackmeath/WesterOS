var TSOS;
(function (TSOS) {
    var CpuScheduler = (function () {
        function CpuScheduler() {
            this.quantum = 6;
            this.mode = TSOS.Mode.ROUND_ROBIN;
        }
        CpuScheduler.prototype.getQuantum = function () { return this.quantum; };
        CpuScheduler.prototype.setQuantum = function (q) { this.quantum = q; };
        CpuScheduler.prototype.setMode = function (m) { this.mode = m; };
        return CpuScheduler;
    })();
    TSOS.CpuScheduler = CpuScheduler; // End of cpuScheduler class
})(TSOS || (TSOS = {})); // End of TSOS module
