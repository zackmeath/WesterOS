///<reference path="../globals.ts" />
///<reference path="../os/canvastext.ts" />

/* ------------
   Control.ts

   Requires globals.ts.

   Routines for the hardware simulation, NOT for our client OS itself.
   These are static because we are never going to instantiate them, because they represent the hardware.
   In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
   is the "bare metal" (so to speak) for which we write code that hosts our client OS.
   But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
   in both the host and client environments.

   This (and other host/simulation scripts) is the only place that we should see "web" code, such as
   DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Control Services
//
module TSOS {

    export class Control {

        public static updateProcessDisplay(pcb: TSOS.PCB, instruction: string): void {
            var display = document.getElementById('processTable');
            // Update the table to show the current instruction and the pcb
            display.innerHTML = '<tr><th>Instr</th><th>PC</th><th>Acc</th><th>X</th><th>Y</th><th>Z</th></tr>' + '<tr>' +'<td>' + instruction + '</td>' + '<td>' + pcb.programCounter + '</td>' + '<td>' + pcb.acc.toString(16) + '</td>' + '<td>' + pcb.XRegister.toString(16) + '</td>' + '<td>' + pcb.YRegister.toString(16) + '</td>' + '<td>' + pcb.ZFlag + '</td>' + '</tr>';
        }

        public static initMemoryDisplay(): void {
            var display = document.getElementById('memoryTable');
            var htmlString = '';

            // For each row in the table, generate each column
            for(var i = 0; i < 768; i += 8){
                var iStr = i.toString();
                if(i < 10){
                    iStr = '0' + iStr;
                }
                if(i < 100){
                    iStr = '0' + iStr;
                }
                htmlString += '<tr>' + '<th>0x' + iStr + '</th>' + '<th>00</th>' + '<th>00</th>' + '<th>00</th>' + '<th>00</th>';
                htmlString += '<th>00</th>' + '<th>00</th>' + '<th>00</th>' + '<th>00</th>' + '</tr>' ;
            }
            display.innerHTML = htmlString;
        }

        public static updateMemoryDisplay(): void {
            var display = document.getElementById('memoryTable');
            var htmlString = '';
            var memArr = _Memory.toString().split(' ');
            var memPointer = 0;

            // For each row in the table, generate each column
            for(var i = 0; i < 768; i += 8){
                var iStr = i.toString();
                if(i < 10){
                    iStr = '0' + iStr;
                }
                if(i < 100){
                    iStr = '0' + iStr;
                }
                htmlString += '<tr>' + '<th>0x' + iStr + '</th>' + '<th>' + memArr[memPointer++] + '</th>' + '<th>' + memArr[memPointer++];
                htmlString += '</th>' + '<th>' + memArr[memPointer++] + '</th>' + '<th>' + memArr[memPointer++] + '</th>';
                htmlString += '<th>' + memArr[memPointer++] + '</th>' + '<th>' + memArr[memPointer++] + '</th>' + '<th>' + memArr[memPointer++];
                htmlString += '</th>' + '<th>' + memArr[memPointer++] + '</th>' + '</tr>' ;
            }
            display.innerHTML = htmlString;
        }

        public static updateResidentDisplay(): void {
            var display = document.getElementById('residentTable');
            var htmlString = '<tr><th>PID</th><th>State</th><th>Program Counter</th></tr>';
            for(var i = 0; i < _ProcessManager.residentList.length; i++){
                var pcb = _ProcessManager.residentList[i];
                var statusString = 'N/A';
                switch (pcb.processState){
                    case TSOS.ProcessState.New:
                        statusString = 'New';
                        break;
                    case TSOS.ProcessState.Ready:
                        statusString = 'Ready';
                        break;
                    case TSOS.ProcessState.Waiting:
                        statusString = 'Waiting';
                        break;
                    case TSOS.ProcessState.Halted:
                        statusString = 'Halted';
                        break;
                    case TSOS.ProcessState.Running:
                        statusString = 'Running';
                        break;
                    case TSOS.ProcessState.Terminated:
                        statusString = 'Terminated';
                        break;
                }
                htmlString += '<tr><td>' + pcb.processID + '</td><td>' + statusString + '</td><td>' + pcb.programCounter + '</td></tr>';
            }
            if(_ProcessManager.residentList.length === 0){
                htmlString += '<tr><td>N/A</td><td>N/A</td><td>N/A</td></tr>';
            }
            display.innerHTML = htmlString;
        }

        public static updateFSDisplay(): void {
            var display = document.getElementById('fsTable');
            var htmlString = '<tr><th>TSB</th><th>Bit</th><th>Loc</th><th>Data</th></tr>';
            if(!_hasBeenFormatted){
                htmlString += '<tr><td>N/A</td><td>N/A</td><td>N/A</td><td>N/A</td></tr>';
            } else {
                for(var i = 0; i < _FileSystem.tracks; i++){
                    for(var j = 0; j < _FileSystem.sectors; j++){
                        for(var k = 0; k < _FileSystem.blocks; k++){
                            var file = _FileSystem.read(i, j, k);
                            var tsbStr = '' + i + j + k;
                            htmlString += '<tr><td>' + tsbStr + '</td><td>' + file.substr(0,1) + '</td><td>' + file.substr(1,3) + '</td><td>' + file.substr(4, file.length) + '</td></tr>';
                        }
                    }
                }
            }
            display.innerHTML = htmlString;
        }

        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.  TODO: Should we move this stuff into a Display Device Driver?
            _Canvas = <HTMLCanvasElement>document.getElementById('display');
            _Canvas.width = 500 * window.devicePixelRatio;
            _Canvas.style.width = "500px";

            // Get a global reference to the drawing context.
            _DrawingContext = _Canvas.getContext("2d");
            _DrawingContext.scale(window.devicePixelRatio,window.devicePixelRatio);

            _UserProgramInput = document.getElementById("taProgramInput").value;

            // Enable the added-in canvas text functions (see canvastext.ts for provenance and details).
            CanvasTextFunctions.enable(_DrawingContext);   // Text functionality is now built in to the HTML5 canvas. But this is old-school, and fun, so we'll keep it.

            // Clear the log text box.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("taHostLog")).value="";

            // Set focus on the start button.
            // Use the TypeScript cast to HTMLInputElement
            (<HTMLInputElement> document.getElementById("btnStartOS")).focus();

            this.initMemoryDisplay();

            // Check for our testing and enrichment core, which
            // may be referenced here (from index.html) as function Glados().
            if (typeof Glados === "function") {
                // function Glados() is here, so instantiate Her into
                // the global (and properly capitalized) _GLaDOS variable.
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }

        public static hostLog(msg: string, source: string = "?"): void {
            // Note the OS CLOCK.
            var clock: number = _OSclock;

            // Parse the time into a readable format
            var now = new Date();
            var hours = (now.getHours() % 12).toString();
            if(hours === '0'){
                hours = '12';
            }
            hours = hours.toString();
            var minutes = now.getMinutes().toString();
            var seconds = now.getSeconds().toString();
            if(seconds.length === 1){
                seconds = '0' + seconds;
            }
            if(minutes.length === 1){
                minutes = '0' + minutes;
            }
            if(hours.length === 1){
                hours = '0' + hours;
            }

            // Build the log string.
            var str: string = " " + hours + ':' + minutes + ':' + seconds + " - " + "Pulse: " + clock + "  Source: " + source + "  Msg: " + msg + "\n";

            // Update the log console.
            var taLog = <HTMLInputElement> document.getElementById("taHostLog");
            taLog.value= str + taLog.value;
        }


        // Host Events
        public static hostBtnStartOS_click(btn): void {
            // Disable the (passed-in) start button...
            btn.disabled = true;

            // .. enable the Halt, Reset, and Single-step  buttons ...
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnSingleStep")).disabled = false;

            // .. set focus on the OS console display ...
            document.getElementById("display").focus();

            // ... Create and initialize the CPU, memory, and file system (because they're part of the hardware)  ...
            _CPU = new Cpu();  // Note: We could simulate multi-core systems by instantiating more than one instance of the CPU here.
            _CPU.init();       //       There's more to do, like dealing with scheduling and such, but this would be a start. Pretty cool.
            _Memory = new Memory(768);
            _FileSystem = new FileSystem(4, 8, 8, 64, 4);

            // ... then set the host clock pulse ...
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            // .. and call the OS Kernel Bootstrap routine.
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();  // _GLaDOS.afterStartup() will get called in there, if configured.
        }

        public static hostBtnHaltOS_click(btn): void {
            (<HTMLButtonElement>document.getElementById("btnSingleStep")).disabled = true;
            (<HTMLButtonElement>document.getElementById("btnStep")).disabled = true;
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Call the OS shutdown routine.
            _Kernel.krnShutdown();
            // Stop the interval that's simulating our clock pulse.
            clearInterval(_hardwareClockID);
        }

        public static hostBtnSingleStep_click(btn): void {
            // Toggle single step mode
            TSOS.Cpu.singleStep = !(TSOS.Cpu.singleStep);

            // Start executing if we are in the middle of a program
            if(!TSOS.Cpu.singleStep && !_CPU.isExecuting && _CPU.PC !== 0){
                _CPU.isExecuting = true;
            }

            // Enable the Step button
            (<HTMLButtonElement>document.getElementById("btnStep")).disabled = !TSOS.Cpu.singleStep;

            // Change the text on the button to display the current mode
            btn.value = (TSOS.Cpu.singleStep) ? 'Single-step Execution: On ' : 'Single-step Execution: Off';
        }

        public static hostBtnStep_click(btn): void {
            // Execute the next step in the program
            _CPU.isExecuting = true;
        }

        public static hostBtnReset_click(btn): void {
            // The easiest and most thorough way to do this is to reload (not refresh) the document.
            location.reload(true);
            // That boolean parameter is the 'forceget' flag. When it is true it causes the page to always
            // be reloaded from the server. If it is false or not specified the browser may reload the
            // page from its cache, which is not what we want.
        }
    }
}
