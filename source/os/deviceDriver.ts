/* ------------------------------
     DeviceDriver.ts

     The "base class" for all Device Drivers.
     ------------------------------ */

module TSOS {
    export class DeviceDriver {
        public version = '0.07';
        public status = 'unloaded';
        public preemptable = false;

        constructor(public driverEntry = null,
                    public isr = null) {
        }
    }
}
