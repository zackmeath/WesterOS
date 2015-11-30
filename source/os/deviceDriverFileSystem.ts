///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverFileSystem.ts

   Requires deviceDriver.ts
   ---------------------------------- */

module TSOS {

    export class DeviceDriverFileSystem extends DeviceDriver {

        constructor (){
            super(this.krnFSDriverEntry, this.krnFS);
        }

        public krnFSDriverEntry() {
            // Initialization routine for this, the kernel-mode File System Device Driver.
            this.status = "loaded";
        }
        public krnFS() {
        }
    }
}
