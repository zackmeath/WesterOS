/* ------------
   Globals.ts

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */
//
// Global CONSTANTS (TypeScript 1.5 introduced const. Very cool.)
//

const APP_NAME: string    = "WesterOS";
const APP_VERSION: string = "5.10"; 

const CPU_CLOCK_INTERVAL: number = 100;   // This is in ms (milliseconds) so 1000 = 1 second.

const FILE_SYSTEM_EMPTY_BYTE: string    = '-';
const FILE_SYSTEM_FLAG_NOT_USED: string = '0';
const FILE_SYSTEM_FLAG_USED: string     = '1';

var _CPU: TSOS.Cpu;  // Utilize TypeScript's type annotation system to ensure that _CPU is an instance of the Cpu class.
var _Memory: TSOS.Memory;
var _FileSystem: TSOS.FileSystem;

var _CpuScheduler:      TSOS.CpuScheduler;
var _ProcessManager:    TSOS.ProcessManager;
var _MemoryManager:     TSOS.MemoryManager;
var _FileSystemManager: TSOS.FileSystemManager;

var KEYBOARD_IRQ = TSOS.IRQ.KEYBOARD;

var _OSclock: number = 0;  // Page 23.

var _Mode: number = 0;     // (currently unused)  0 = Kernel Mode, 1 = User Mode.  See page 21.

var _SystemStatus: string = "Normal";

var _Canvas: HTMLCanvasElement;         // Initialized in Control.hostInit().
var _DrawingContext: any; // = _Canvas.getContext("2d");  // Assigned here for type safety, but re-initialized in Control.hostInit() for OCD and logic.
var _DefaultFontFamily: string = "sans";        // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize: number = 13;
var _FontHeightMargin: number = 4;              // Additional space added to font size when advancing a line.

var _Trace: boolean = true;  // Default the OS trace to be on.
var _shouldPrompt = true;
var _ProcessIdValue = 1;

// The OS Kernel and its queues.
var _Kernel: TSOS.Kernel;
var _KernelInterruptQueue;          // Initializing this to null (which I would normally do) would then require us to specify the 'any' type, as below.
var _KernelInputQueue: any = null;  // Is this better? I don't like uninitialized variables. But I also don't like using the type specifier 'any'
var _KernelBuffers: any[] = null;   // when clearly 'any' is not what we want. There is likely a better way, but what is it?

// Standard input and output
var _StdIn;    // Same "to null or not to null" issue as above.
var _StdOut;

// UI
var _Console: TSOS.Console;
var _OsShell: TSOS.Shell;
var _CommandHistory: TSOS.CommandHistory;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode: boolean = false;
var _hasBeenFormatted: boolean = false;

// Global Device Driver Objects - page 12
var _krnKeyboardDriver; //  = null;
var _krnFSDriver; //  = null;

var _hardwareClockID: number = null;

var _UserProgramInput: string;

// For testing (and enrichment)...
var Glados: any = null;  // This is the function Glados() in glados.js on Labouseur.com.
var _GLaDOS: any = null; // If the above is linked in, this is the instantiated instance of Glados.

var onlyOnce = true;

var onDocumentLoad = function() {
if(onlyOnce){
    document.getElementById('display').height = 500 * window.devicePixelRatio;
    onlyOnce = false;
}


function startTime() {
    var date = new Date();
    var month = date.getMonth();
    var day = date.getDate();
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var ampm = 'am';
    minutes = checkTime(minutes);
    seconds = checkTime(seconds);
    if (hours > 12){
        hours -= 12;
        ampm = 'pm';
    }
    document.getElementById('timeTA').innerHTML = hours + ":" + minutes + ":" + seconds + ' ' + ampm + '  ' + month + '/' + day + '/' + year;
    var t = setTimeout(function(){startTime()},500);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    };  // add zero in front of numbers < 10
    return i;
}
startTime();
TSOS.Control.hostInit();
};
