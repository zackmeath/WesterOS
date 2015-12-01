///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverFileSystem.ts

   Requires deviceDriver.ts
   ---------------------------------- */

module TSOS {

    export class DeviceDriverFileSystem extends DeviceDriver {

        constructor (){
            super(this.driverEntry, this.isr);
        }

        public driverEntry() {
            // Initialization routine for this, the kernel-mode File System Device Driver.
            this.status = "loaded";
        }
        public isr() {
            switch (params.operationType) {
                case 'format':
                    _FileSystemManager.formatFileSystem();
                    break;
                case 'ls':
                    _FileSystemManager.ls();
                    break;
                case 'create':
                    var output = _FileSystemManager.createFile(params.fileName);
                    _StdOut.putText(output);
                    _StdOut.advanceLine();
                    _OsShell.putPrompt();
                    break;
                case 'read':
                    var output = _FileSystemManager.readFile(params.fileName);
                    _StdOut.putText(output);
                    _StdOut.advanceLine();
                    _OsShell.putPrompt();
                    break;
                case 'write':
                    var output = _FileSystemManager.writeFile(params.fileName, params.data);
                    _StdOut.putText(output);
                    _StdOut.advanceLine();
                    _OsShell.putPrompt();
                    break;
                case 'delete':
                    var output = _FileSystemManager.deleteFile(params.fileName);
                    _StdOut.putText(output);
                    _StdOut.advanceLine();
                    _OsShell.putPrompt();
                    break;
            }
        }
    }
}
