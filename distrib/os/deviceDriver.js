/* ------------------------------
     DeviceDriver.ts

     The "base class" for all Device Drivers.
     ------------------------------ */
var TSOS;
(function (TSOS) {
    var DeviceDriver = (function () {
        function DeviceDriver(driverEntry, isr) {
            if (driverEntry === void 0) { driverEntry = null; }
            if (isr === void 0) { isr = null; }
            this.driverEntry = driverEntry;
            this.isr = isr;
            this.version = '0.07';
            this.status = 'unloaded';
            this.preemptable = false;
        }
        return DeviceDriver;
    })();
    TSOS.DeviceDriver = DeviceDriver;
})(TSOS || (TSOS = {}));
