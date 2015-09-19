///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */
var ZMOS;
(function (ZMOS) {
    // Extends DeviceDriver
    var DeviceDriverKeyboard = (function (_super) {
        __extends(DeviceDriverKeyboard, _super);
        function DeviceDriverKeyboard() {
            // Override the base method pointers.
            _super.call(this, this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
        }
        DeviceDriverKeyboard.prototype.krnKbdDriverEntry = function () {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        };
        DeviceDriverKeyboard.prototype.krnKbdDispatchKeyPress = function (params) {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||
                ((keyCode >= 97) && (keyCode <= 123))) {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) {
                    chr = String.fromCharCode(keyCode);
                }
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            }
            else if (((keyCode >= 48) && (keyCode <= 57)) ||
                (keyCode == 32) ||
                (keyCode == 13)) {
                if (isShifted) {
                    switch (keyCode) {
                        case 48:
                            chr = String.fromCharCode(41);
                            break;
                        case 49:
                            chr = String.fromCharCode(33);
                            break;
                        case 50:
                            chr = String.fromCharCode(64);
                            break;
                        case 51:
                            chr = String.fromCharCode(35);
                            break;
                        case 52:
                            chr = String.fromCharCode(36);
                            break;
                        case 53:
                            chr = String.fromCharCode(37);
                            break;
                        case 54:
                            chr = String.fromCharCode(94);
                            break;
                        case 55:
                            chr = String.fromCharCode(38);
                            break;
                        case 56:
                            chr = String.fromCharCode(42);
                            break;
                        case 57:
                            chr = String.fromCharCode(40);
                            break;
                    }
                }
                _KernelInputQueue.enqueue(chr);
            }
            else {
                console.log(keyCode);
                var regularMappings = {
                    189: 45,
                    187: 61,
                    219: 91,
                    221: 93,
                    186: 59,
                    222: 39,
                    188: 44,
                    190: 46,
                    191: 47,
                    192: 96
                };
                var shiftedMappings = {
                    189: 95,
                    187: 43,
                    219: 123,
                    221: 125,
                    186: 58,
                    222: 34,
                    188: 60,
                    190: 62,
                    191: 63,
                    192: 126
                };
                if (regularMappings[keyCode] !== undefined) {
                    chr = String.fromCharCode(isShifted ? shiftedMappings[keyCode] : regularMappings[keyCode]);
                }
                else {
                    chr = String.fromCharCode(keyCode);
                }
                _KernelInputQueue.enqueue(chr);
            }
        };
        return DeviceDriverKeyboard;
    })(ZMOS.DeviceDriver);
    ZMOS.DeviceDriverKeyboard = DeviceDriverKeyboard;
})(ZMOS || (ZMOS = {}));
