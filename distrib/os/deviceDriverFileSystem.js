///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* ----------------------------------
   DeviceDriverFileSystem.ts

   Requires deviceDriver.ts
   ---------------------------------- */
var TSOS;
(function (TSOS) {
    var DeviceDriverFileSystem = (function (_super) {
        __extends(DeviceDriverFileSystem, _super);
        function DeviceDriverFileSystem() {
            _super.call(this, this.fsDriverEntry, this.FSisr);
        }
        DeviceDriverFileSystem.prototype.fsDriverEntry = function () {
            // Initialization routine for this, the kernel-mode File System Device Driver.
            this.status = "loaded";
        };
        DeviceDriverFileSystem.prototype.FSisr = function (params) {
            switch (params.operationType) {
                case 'format':
                    _FileSystemManager.formatFileSystem();
                    break;
                case 'ls':
                    var files = _FileSystemManager.ls();
                    for (var i = 0; i < files.length; i++) {
                        _StdOut.putText(files[i]);
                        _StdOut.advanceLine();
                    }
                    _OsShell.putPrompt();
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
        };
        return DeviceDriverFileSystem;
    })(TSOS.DeviceDriver);
    TSOS.DeviceDriverFileSystem = DeviceDriverFileSystem;
})(TSOS || (TSOS = {}));
