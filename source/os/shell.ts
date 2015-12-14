///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />


/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

   Note: While fun and learning are the primary goals of all enrichment center activities,
   serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS {
    export class Shell {
        // Properties
        public promptStr = "$ ";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() {
        }

        public init() {
            var sc;
            //
            // Load the command list.

            // ice
            sc = new ShellCommand(this.shellIce,
            "ice",
            "- Changes the current theme to ice");
            this.commandList[this.commandList.length] = sc;

            // fire
            sc = new ShellCommand(this.shellFire,
            "fire",
            "- Changes the current theme to fire");
            this.commandList[this.commandList.length] = sc;

            // create
            sc = new ShellCommand(this.shellCreate,
            "create",
            "<filename> - Creates a file with the name <filename>");
            this.commandList[this.commandList.length] = sc;

            // read
            sc = new ShellCommand(this.shellRead,
            "read",
            "<filename> - Reads the file with the name <filename> and prints the output");
            this.commandList[this.commandList.length] = sc;

            // write
            sc = new ShellCommand(this.shellWrite,
            "write",
            "<filename> \"data\" - Writes the contents of \"data\" to the file <filename>");
            this.commandList[this.commandList.length] = sc;

            // delete
            sc = new ShellCommand(this.shellDelete,
            "delete",
            "<filename> - Deletes the file with the name <filename>");
            this.commandList[this.commandList.length] = sc;

            // format
            sc = new ShellCommand(this.shellFormat,
            "format",
            "- Initializes and formats the hard disk");
            this.commandList[this.commandList.length] = sc;

            // ls
            sc = new ShellCommand(this.shellLs,
            "ls",
            "- Displays a list of all files from the directory");
            this.commandList[this.commandList.length] = sc;

            // setschedule
            sc = new ShellCommand(this.shellSetSchedule,
            "setschedule",
            "\"rr\" | \"fcfs\" | \"priority\" - Changes the process scheduling algorithm to the input");
            this.commandList[this.commandList.length] = sc;

            // getschedule
            sc = new ShellCommand(this.shellGetSchedule,
            "getschedule",
            "- Prints the current scheduling algorithm: \"Round Robin\" | \"First-Come First-Serve\" | \"Priority\"");
            this.commandList[this.commandList.length] = sc;

            // clearmem
            sc = new ShellCommand(this.shellClearMem,
            "clearmem",
            "- Clears all of the memory");
            this.commandList[this.commandList.length] = sc;

            // runall
            sc = new ShellCommand(this.shellRunall,
            "runall",
            "- Runs all of the processes in memory");
            this.commandList[this.commandList.length] = sc;

            // quantum
            sc = new ShellCommand(this.shellQuantum,
            "quantum",
            "<num> - Sets the quantum for round robin scheduling to <num>");
            this.commandList[this.commandList.length] = sc;

            // ps
            sc = new ShellCommand(this.shellPs,
            "ps",
            "- Lists all of the processes currently running");
            this.commandList[this.commandList.length] = sc;

            // kill
            sc = new ShellCommand(this.shellKill,
            "kill",
            "<pid> - Kills the process running with pid <pid>");
            this.commandList[this.commandList.length] = sc;

            // killall
            sc = new ShellCommand(this.shellKillall,
            "killall",
            "- Kills all of the processes");
            this.commandList[this.commandList.length] = sc;

            // ver
            sc = new ShellCommand(this.shellVer,
            "ver",
            "- Displays the current version.");
            this.commandList[this.commandList.length] = sc;

            // bsod
            sc = new ShellCommand(this.shellBsod,
            "bsod",
            "- Displays the blue screen of death.");
            this.commandList[this.commandList.length] = sc;

            // load
            sc = new ShellCommand(this.shellLoad,
            "load",
            "<priority> - Loads program from input text area, <priority> is optional");
            this.commandList[this.commandList.length] = sc;

            // Run
            sc = new ShellCommand(this.shellRun,
            "run",
            "<pid> - Runs process with <pid>");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new ShellCommand(this.shellDate,
            "date",
            "- Displays the current date and time");
            this.commandList[this.commandList.length] = sc;

            // status
            sc = new ShellCommand(this.shellStatus,
            "status",
            "<string> - Updates the system status to <string>");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new ShellCommand(this.shellWhereami,
            "whereami",
            "- Displays the current user's location");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
            "help",
            "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
            "shutdown",
            "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
            "cls",
            "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
            "man",
            "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
            "trace",
            "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
            "rot13",
            "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
            "prompt",
            "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() {
            if (_shouldPrompt){
                _StdOut.putText(this.promptStr);
            }
        }

        public handleInput(buffer) {
            // Output a trace
            _Kernel.krnTrace("Shell Command~" + buffer);

            // Track the command history
            _CommandHistory.addCommand(buffer);

            // Parse the input...
            var userCommand = this.parseInput(buffer);

            // Assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;

            // Determine the command and execute it.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) {     // Check for curses.
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {        // Check for apologies.
                    this.execute(this.shellApology);
                } else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
                }
            }

            // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
            public execute(fn, args?) {
                // We just got a command, so advance the line...
                _StdOut.advanceLine();
                // ... call the command function passing in the args with some über-cool functional programming ...
                fn(args);
                // Check to see if we need to advance the line again
                if (_StdOut.currentXPosition > 0) {
                    _StdOut.advanceLine();
                }
                // ... and finally write the prompt again.
                this.putPrompt();
            }

            public parseInput(buffer): UserCommand {
                var retVal = new UserCommand();

                // 1. Remove leading and trailing spaces.
                buffer = Utils.trim(buffer);

                // 2. Lower-case it.
                buffer = buffer.toLowerCase();

                // 3. Separate on spaces so we can determine the command and command-line args, if any.
                var tempList = buffer.split(" ");

                // 4. Take the first (zeroth) element and use that as the command.
                var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
                // 4.1 Remove any left-over spaces.
                cmd = Utils.trim(cmd);
                // 4.2 Record it in the return value.
                retVal.command = cmd;

                // 5. Now create the args array from what's left.
                for (var i in tempList) {
                    var arg = Utils.trim(tempList[i]);
                    if (arg != "") {
                        retVal.args[retVal.args.length] = tempList[i];
                    }
                }
                return retVal;
            }

            // Shell Command Functions.  Kinda not part of Shell() class exactly, but
            // called from here, so kept here to avoid violating the law of least astonishment.
            public shellInvalidCommand() {
                _StdOut.putText("Invalid Command. ");
                if (_SarcasticMode) {
                    _StdOut.putText("Unbelievable.");
                } else {
                    _StdOut.putText("Type 'help' for a list of available commands");
                }
            }

            public shellCurse() {
                _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
                _StdOut.advanceLine();
                _StdOut.putText("Bitch.");
                _SarcasticMode = true;
            }

            public shellFire() {
                // Switch out the style sheets
                document.getElementById('stylesheet').href='distrib/styles/fire.css';
            }

            public shellIce() {
                // Switch out the style sheets
                document.getElementById('stylesheet').href='distrib/styles/ice.css';
            }

            public shellApology() {
                if (_SarcasticMode) {
                    _StdOut.putText("I think we can put our differences behind us.");
                    _StdOut.advanceLine();
                    _StdOut.putText("For science . . . You monster.");
                    _SarcasticMode = false;
                } else {
                    _StdOut.putText("For what?");
                }
            }

            public shellCreate(args) {
                if(!_hasBeenFormatted){
                    _StdOut.putText("File System has not been formatted yet, use the \"format\" command first");
                    return;
                }
                var fileName = args[0];
                if(fileName === undefined || fileName === null){
                    _StdOut.putText("No arguments given for \"create\" command");
                } else {
                    var params = {operationType: 'create', fileName: fileName};
                    _KernelInterruptQueue.enqueue(new Interrupt(TSOS.IRQ.FILE_SYSTEM, params));
                }
                TSOS.Control.updateFSDisplay();
            }

            public shellRead(args) {
                if(!_hasBeenFormatted){
                    _StdOut.putText("File System has not been formatted yet, use the \"format\" command first");
                    return;
                }
                var fileName = args[0];
                if(fileName === undefined || fileName === null){
                    _StdOut.putText("No arguments given for \"read\" command");
                } else {
                    var params = {operationType: 'read', fileName: fileName};
                    _KernelInterruptQueue.enqueue(new Interrupt(TSOS.IRQ.FILE_SYSTEM, params));
                }
            }

            public shellWrite(args) {
                if(!_hasBeenFormatted){
                    _StdOut.putText("File System has not been formatted yet, use the \"format\" command first");
                    return;
                }
                if(args.length < 2){
                    _StdOut.putText("Not enough arguments given for \"write\" command");
                    return;
                }
                var fileName = args[0];
                var data = '';
                for (var i = 1; i < args.length; i++) {
                    data += args[i] + ' ';
                }
                data = data.trim();
                if(data.substr(1,1) !== '\"' || data.substr(-1) !== '\"'){
                    _StdOut.putText("The data to write must be surrounded by quotes");
                    return;
                }
                data = data.substring(2, data.length-1);
                var params = {operationType: 'write', fileName: fileName, data: data};
                _KernelInterruptQueue.enqueue(new Interrupt(TSOS.IRQ.FILE_SYSTEM, params));
                TSOS.Control.updateFSDisplay();
            }

            public shellDelete(args) {
                if(!_hasBeenFormatted){
                    _StdOut.putText("File System has not been formatted yet, use the \"format\" command first");
                    return;
                }
                var fileName = args[0];
                if(fileName === undefined || fileName === null){
                    _StdOut.putText("No arguments given for \"delete\" command");
                } else {
                    var params = {operationType: 'delete', fileName: fileName};
                    _KernelInterruptQueue.enqueue(new Interrupt(TSOS.IRQ.FILE_SYSTEM, params));
                }
                TSOS.Control.updateFSDisplay();
            }

            public shellFormat(args) {
                _hasBeenFormatted = true;
                var params = {operationType: 'format'};
                _KernelInterruptQueue.enqueue(new Interrupt(TSOS.IRQ.FILE_SYSTEM, params));
                TSOS.Control.updateFSDisplay();
            }

            public shellLs(args) {
                if(!_hasBeenFormatted){
                    _StdOut.putText("File System has not been formatted yet, use the \"format\" command first");
                    return;
                }
                var params = {operationType: 'ls'};
                _KernelInterruptQueue.enqueue(new Interrupt(TSOS.IRQ.FILE_SYSTEM, params));
            }

            public shellSetSchedule(args) {
                var algo = args[0];
                if(algo === undefined || algo === null){
                    _StdOut.putText("No arguments given for \"delete\" command");
                } else {
                    switch (algo) {
                        case 'rr':
                            _CpuScheduler.setSchedulingMode(TSOS.SchedulingMode.ROUND_ROBIN);
                            break;
                        case 'fcfs':
                            _CpuScheduler.setSchedulingMode(TSOS.SchedulingMode.FCFS);
                            break;
                        case 'priority':
                            _CpuScheduler.setSchedulingMode(TSOS.SchedulingMode.PRIORITY);
                            break;
                        default:
                            _StdOut.putText('Argument given did not match a scheduling algorithm (\"rr\", \"fcfs\", \"priority\")');
                            break;
                    }
                }
            }

            public shellGetSchedule(args){
                switch(_CpuScheduler.getSchedulingMode()){
                    case TSOS.SchedulingMode.ROUND_ROBIN:
                        _StdOut.putText("Round Robin");
                        break;
                    case TSOS.SchedulingMode.FCFS:
                        _StdOut.putText("First-Come First-Serve");
                        break;
                    case TSOS.SchedulingMode.PRIORITY:
                        _StdOut.putText("Priority");
                        break;
                }
            }

            public shellVer(args) {
                _StdOut.putText(APP_NAME + " version " + APP_VERSION);
            }

            public shellClearMem(args) {
                _MemoryManager.clearMemory();
                TSOS.Control.updateMemoryDisplay();
            }

            public shellRunall(args) {
                _ProcessManager.runall();
            }

            public shellQuantum(args) {
                if(args.length === 0){
                    _StdOut.putText("Must provide a quantum");
                } else {
                    var quantum = parseInt(args[0]);
                    if(isNaN(quantum)){
                        _StdOut.putText("Quantum must be an integer");
                    } else {
                        _CpuScheduler.setQuantum(quantum);
                    }
                }
            }

            public shellPs(args) {
                var processes = _ProcessManager.getAllRunningProcesses();
                if(processes.length === 0){
                    _StdOut.putText("There are no running processes");
                } else {
                    _StdOut.putText("Running processes: ");
                    for(var process in processes){
                        _StdOut.putText(processes[process].processID + " ");
                    }
                }
            }

            public shellKill(args) {
                if(args.length === 0){
                    _StdOut.putText("Must provide a pid to kill");
                } else {
                    var pid = parseInt(args[0]);
                    if(isNaN(pid)){
                        _StdOut.putText("pid must be an integer");
                    } else {
                        if(!_ProcessManager.doesProcessExist(pid)){
                            _StdOut.putText("pid: " + pid + " does not exist");
                        } else {
                            _ProcessManager.killProcess(pid);
                        }
                    }
                }
            }

            public shellKillall(args) {
                var processes = _ProcessManager.getAllRunningProcesses();
                for(var process in processes){
                    _ProcessManager.killProcess(processes[process].processID);
                }
            }

            public shellBsod(args){
                _shouldPrompt = false;
                _Kernel.krnTrapError('BSOD test');
            }

            public shellLoad(args){
                // Make sure the hex code is valid
                var legalChars = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f',' ']; 
                _UserProgramInput = document.getElementById("taProgramInput").value.trim();
                var isLegal = (_UserProgramInput.length > 0);
                for (var i = 0; i < _UserProgramInput.length; i++) {
                    var character = _UserProgramInput[i];
                    if( legalChars.indexOf(character.toLowerCase()) === -1 ){
                        isLegal = false;
                        break;
                    }
                }
                if (!isLegal){
                    _StdOut.putText("Invalid user progrom");
                } else {
                    // Legal program
                    var priority = parseInt(args[0]);
                    if(isNaN(priority)){
                        if(args[0] !== undefined){
                            _StdOut.putText('Could not parse <priority> to a number, defaulting to 10');
                        }
                        priority = 10; // default priority
                    } else {
                        if (priority < 1){
                            _StdOut.putText('Priority needs to be higher than 0, defaulting to 10');
                            priority = 10; // default priority
                        }
                    }
                    var programString = '';
                    var programArray = _UserProgramInput.split(' ');
                    for(var i = 0; i < programArray.length; i++){
                        programString += programArray[i];
                    }
                    var chars = programString.split('');
                    var doubles = [];
                    for(var i = 0; i < chars.length; i += 2){
                        doubles.push(chars[i] + chars[i+1]);
                    }
                    var num = _ProcessManager.load(doubles, priority);
                    _StdOut.putText('Process ID: ' + num);
                }
                // Update the display to reflect the program
                TSOS.Control.updateMemoryDisplay();
                TSOS.Control.updateResidentDisplay();
            }

            public shellRun(args){
                // Make sure we have a pid
                if(args.length === 0){
                    _StdOut.putText("Must provide a valid pid");
                } else {
                    var pid = parseInt(args[0]);
                    // Make sure the pid is a number
                    if(isNaN(pid)){
                        _StdOut.putText("Must provide a valid number");
                        // Make sure the pid is actually a program
                    } else if(!_ProcessManager.doesProcessExist(pid)){
                        _StdOut.putText("pid does not match a program currently in memory");
                    } else {
                        // Valid pid
                        if(TSOS.Cpu.singleStep){
                            // Enable the step button
                            (<HTMLButtonElement>document.getElementById("btnStep")).disabled = false;
                        }
                        // Run the process
                        _ProcessManager.runProcess(pid);
                    }
                }
            }

            public shellDate(args) {
                var currentDate = new Date();
                var date = currentDate.getMonth()+1 + '/' + currentDate.getDate() + '/' + currentDate.getFullYear();
                var hours = currentDate.getHours();
                var ampm = 'am';
                if (hours > 12){
                    hours -= 12;
                    var ampm = 'pm';
                }
                var time = hours + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds() + ampm;
                var dateTime = time + ' ' + date;
                _StdOut.putText(dateTime);
            }

            public shellStatus(args){
                if (args.length < 0){
                    _StdOut.putText("Please supply an argument <string> to be set as the new status");
                } else {
                    var stat = '';
                    for(var i = 0; i < args.length; i++){
                        stat += args[i];
                        stat += (i === args.length-1) ? '' : ' ';
                    }
                    _SystemStatus = stat;
                    document.getElementById('statusTA').value = 'Status: ' + stat;
                }
            }

            public shellWhereami(args){
                var locations = [
                'Casterly Rock',
                'Kings Landing',
                'Winterfell',
                'The Lands of Always Winter',
                'Castle Black',
                'The Eyrie',
                'Braavos',
                'Dragonstone',
                'Meereen',
                'The Dreadfort',
                'Riverrun',
                'Storm\'s End',
                'Highgarden',
                'The Twins',
                'Sunspear',
                'Pyke',
                'Harrenhal',
                'Pentos',
                'Volantis',
                'Astapor',
                'Quarth',
                'Vaes Dothrak',
                'The Citadel',
                ];
                var people = [
                'Jon Snow',
                'Eddard Stark',
                'Tyrion Lannister',
                'Cersei Lannister',
                'Daenarys Targaryen',
                'Sansa Stark',
                'Arya Stark',
                'Robb Stark',
                'Bran Stark',
                'Gregor \'The Mountain\' Clegane',
                'Stannis Baratheon',
                'Ramsey Bolton',
                'Theon \'Reek\' Greyjoy',
                'Melisandre',
                'Jaime Lannister',
                'Petyr Baelish',
                'Jorah Mormont',
                'Oberyn Martell',
                'Sandor \'GET HYPE\' Clegane',
                'Tywin Lannister',
                'Brienne of Tarth',
                'Jaquen H\'ghar',
                'Varys',
                'Benjen Stark, Gendry, and Rickon',
                'Barriston Selmy',
                'Margaery Tyrell',
                'Drogon',
                'HODOR',
                'Allister Thorne',
                'Walder Frey',
                'Khal Drogo',
                'The Night\'s King',
                'Bronn',
                'Davos Seaworth',
                'Doran Martell',
                ];

                // Randomize these arrays
                Utils.shuffle(locations);
                Utils.shuffle(people);

                // Pop off for random combinations
                _StdOut.putText(locations.pop() + ' with ' + people.pop());
            }

            public shellHelp(args) {
                _StdOut.putText("Commands:");
                for (var i in _OsShell.commandList) {
                    _StdOut.advanceLine();
                    _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
                }
            }

            public shellShutdown(args) {
                _StdOut.putText("Shutting down...");
                // Call Kernel shutdown routine.
                _Kernel.krnShutdown();
                _shouldPrompt = false;
            }

            public shellCls(args) {
                _StdOut.clearScreen();
                _StdOut.resetXY();
            }

            public shellMan(args) {
                if (args.length > 0) {
                    var topic = args[0];
                    switch (topic) {
                        case "ice":
                            _StdOut.putText("Ally with the Starks of Winterfell, The North remembers...");
                            break;
                        case "fire":
                            _StdOut.putText("Ally with Daenerys Stormborn of house Targaryen, Zaldrizes buzdari iksos daor");
                            break;
                        case "help":
                            if (_SarcasticMode) {
                                _StdOut.putText("Really?");
                                break;
                            }
                            _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                            break;
                        case "ver":
                            _StdOut.putText("Displays the current version of WesterOS");
                            break;
                        case "clearmem":
                            _StdOut.putText("Clears the memory in all memory partitions");
                            break;
                        case "runall":
                            _StdOut.putText("Runs all of the waiting processes in the ready queue");
                            break;
                        case "quantum":
                            _StdOut.putText("<num> - sets the quantum used in round robin scheduling to <num>");
                            break;
                        case "ps":
                            _StdOut.putText("Lists all of the processes currently executing");
                            break;
                        case "kill":
                            _StdOut.putText("<pid> - Kills the process with pid <pid>");
                            break;
                        case "killall":
                            _StdOut.putText("Kills all of the currently running processes");
                            break;
                        case "bsod":
                            _StdOut.putText("Displays the blue screen of death");
                            break;
                        case "load":
                            _StdOut.putText("Loads the current user program");
                            break;
                        case "run":
                            _StdOut.putText("run <pid> wuns the program with process id: <pid>");
                            break;
                        case "shutdown":
                            _StdOut.putText("Shuts down the virtual OS, but keeps underlying host running");
                            break;
                        case "cls":
                            _StdOut.putText("Clears the terminal");
                            break;
                        case "man":
                            if (_SarcasticMode) {
                                _StdOut.putText("Really?");
                                break;
                            }
                            _StdOut.putText("<topic> - Displays detailed information about <topic>");
                            break;
                        case "trace":
                            _StdOut.putText("<on | off> - Toggles OS tracing");
                            _StdOut.advanceLine();
                            _StdOut.putText("\ton - Enables host log trace output data");
                            _StdOut.advanceLine();
                            _StdOut.putText("\toff - Disables host log trace output data");
                            break;
                        case "status":
                            _StdOut.putText("<string> - sets the current system status to <string>");
                            break;
                        case "whereami":
                            _StdOut.putText("Prints the current user location");
                            break;
                        case "date":
                            _StdOut.putText("Prints the current time and date");
                            break;
                        case "rot13":
                            _StdOut.putText("<string> - Does rot13 obfuscation on <string>");
                            _StdOut.advanceLine();
                            _StdOut.putText("Encodes or decodes string with a Caesar cipher rotation of 13 characters");
                            break;
                        case "prompt":
                            _StdOut.putText("<prompt> - Changes the prompt to be <prompt>");
                            break;
                        default:
                            _StdOut.putText("No manual entry for " + args[0] + ".");
                    }
                } else {
                    _StdOut.putText("Usage: man <topic>  Please supply a topic.");
                }
            }

            public shellTrace(args) {
                if (args.length > 0) {
                    var setting = args[0];
                    switch (setting) {
                        case "on":
                            if (_Trace && _SarcasticMode) {
                                _StdOut.putText("Trace is already on, doofus.");
                            } else {
                                _Trace = true;
                                _StdOut.putText("Trace ON");
                            }
                            break;
                        case "off":
                            _Trace = false;
                            _StdOut.putText("Trace OFF");
                            break;
                        default:
                            _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                    }
                } else {
                    _StdOut.putText("Usage: trace <on | off>");
                }
            }

            public shellRot13(args) {
                if (args.length > 0) {
                    // Requires Utils.ts for rot13() function.
                    _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
                } else {
                    _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
                }
            }

            public shellPrompt(args) {
                if (args.length > 0) {
                    _OsShell.promptStr = args[0];
                } else {
                    _StdOut.putText("Usage: prompt <string>  Please supply a string.");
                }
            }
        }
    }
