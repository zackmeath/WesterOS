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
var WESTEROS;
(function (WESTEROS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = "$ ";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ice
            sc = new WESTEROS.ShellCommand(this.shellIce, "ice", "- Changes the current theme to ice");
            this.commandList[this.commandList.length] = sc;
            // fire
            sc = new WESTEROS.ShellCommand(this.shellFire, "fire", "- Changes the current theme to fire");
            this.commandList[this.commandList.length] = sc;
            // ver
            sc = new WESTEROS.ShellCommand(this.shellVer, "ver", "- Displays the current version.");
            this.commandList[this.commandList.length] = sc;
            // bsod
            sc = new WESTEROS.ShellCommand(this.shellBsod, "bsod", "- Displays the blue screen of death.");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new WESTEROS.ShellCommand(this.shellLoad, "load", "- Loads program from input text area");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new WESTEROS.ShellCommand(this.shellDate, "date", "- Displays the current date and time");
            this.commandList[this.commandList.length] = sc;
            // status
            sc = new WESTEROS.ShellCommand(this.shellStatus, "status", "<string> - Updates the system status to <string>");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new WESTEROS.ShellCommand(this.shellWhereami, "whereami", "- Displays the current user's location");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new WESTEROS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new WESTEROS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new WESTEROS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new WESTEROS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new WESTEROS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new WESTEROS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new WESTEROS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            if (_shouldPrompt) {
                _StdOut.putText(this.promptStr);
            }
        };
        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            // Track the command history
            _CommandHistory.addCommand(buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + WESTEROS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                }
                else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
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
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new WESTEROS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = WESTEROS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = WESTEROS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = WESTEROS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable.");
            }
            else {
                _StdOut.putText("Type 'help' for a list of available commands");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellFire = function () {
            document.getElementById('stylesheet').href = 'distrib/styles/fire.css';
        };
        Shell.prototype.shellIce = function () {
            document.getElementById('stylesheet').href = 'distrib/styles/ice.css';
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellBsod = function (args) {
            _shouldPrompt = false;
            _Kernel.krnTrapError('BSOD test');
        };
        Shell.prototype.shellLoad = function (args) {
            var legalChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', ' '];
            var isLegal = true;
            _UserProgramInput = document.getElementById("taProgramInput").value.trim();
            for (var i = 0; i < _UserProgramInput.length; i++) {
                var character = _UserProgramInput[i];
                if (legalChars.indexOf(character.toLowerCase()) === -1) {
                    isLegal = false;
                    break;
                }
            }
            if (!isLegal) {
                _StdOut.putText("Invalid user progrom");
            }
            else {
            }
        };
        Shell.prototype.shellDate = function (args) {
            var currentDate = new Date();
            var date = currentDate.getMonth() + 1 + '/' + currentDate.getDate() + '/' + currentDate.getFullYear();
            var hours = currentDate.getHours();
            var ampm = 'am';
            if (hours > 12) {
                hours -= 12;
                var ampm = 'pm';
            }
            var time = hours + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds() + ampm;
            var dateTime = time + ' ' + date;
            _StdOut.putText(dateTime);
        };
        Shell.prototype.shellStatus = function (args) {
            if (args.length < 0) {
                _StdOut.putText("Please supply an argument <string> to be set as the new status");
            }
            else {
                _SystemStatus = args[0];
                document.getElementById('statusTA').value = 'Status: ' + args[0];
            }
        };
        Shell.prototype.shellWhereami = function (args) {
            if (_SarcasticMode) {
                _StdOut.putText('Right here');
            }
            else {
                _StdOut.putText('Aperture Science Enrichment Center');
            }
        };
        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            _shouldPrompt = false;
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
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
                    case "bsod":
                        _StdOut.putText("Displays the blue screen of death");
                        break;
                    case "load":
                        _StdOut.putText("Loads the current user program");
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
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
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
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + WESTEROS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        return Shell;
    })();
    WESTEROS.Shell = Shell;
})(WESTEROS || (WESTEROS = {}));
