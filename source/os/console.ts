///<reference path="../globals.ts" />

/* ------------
   Console.ts

   Requires globals.ts

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
   ------------ */

module TSOS {

    export class CommandHistory {

        constructor(){
            this.pointer = -1;
            this.historyArray = [];
        }

        private historyArray;
        private pointer;

        public getCurrentPointerCommand(){
            return this.pointer === -1 ? '' : this.historyArray[this.pointer];
        }

        public addCommand(command){
            this.historyArray.unshift(command);
            this.pointer = -1;
        }

        public upArrow(){
            if (this.pointer < this.historyArray.length - 1){
                this.pointer++;
            }
        }

        public downArrow(){
            if (this.pointer >= 0){
                this.pointer--;
            }
        }

    } // End of CommandHistory class

    export class Console {

        constructor(public currentFont = _DefaultFontFamily,
        public currentFontSize = _DefaultFontSize,
        public currentXPosition = 0,
        public currentYPosition = _DefaultFontSize,
        public buffer = "") {
        }

        public YRatio = window.devicePixelRatio;

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        private clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        private resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        private changeCommand(newCommand){
            this.buffer = newCommand;
            var charHeight = _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
            _DrawingContext.clearRect(0, this.currentYPosition - charHeight, _Canvas.width, charHeight + _FontHeightMargin);
            this.currentXPosition = 0;
            _OsShell.putPrompt();
            _StdOut.putText(newCommand);
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { //     Enter key
                    // The enter key marks the end of a console command, so ...
                    // Store command in history
                    // ... tell the shell ...
                    _OsShell.handleInput(this.buffer);
                    // ... and reset our buffer.
                    this.buffer = "";
                } else if (chr === String.fromCharCode(8)){ // Backspace
                    // TODO Backspace on line wrapping
                    if (this.buffer.length > 0){
                        var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer[this.buffer.length-1]);
                        var charHeight = _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
                        _DrawingContext.clearRect(this.currentXPosition - offset, this.currentYPosition - charHeight, offset, charHeight + _FontHeightMargin);
                        this.currentXPosition -= offset;
                        this.buffer = this.buffer.substring(0, this.buffer.length-1);
                    }
                } else if (chr === String.fromCharCode(9)){ // Tab
                    for (var i = 0; i < _OsShell.commandList.length; i++){
                        var command = _OsShell.commandList[i];
                        if (command.command.indexOf(this.buffer) === 0 && command.command.length !== this.buffer.length){
                            this.buffer = command.command;
                            this.changeCommand(command.command);
                        }
                    }
                } else if (chr === 'upArrow'){
                    _CommandHistory.upArrow();
                    this.changeCommand(_CommandHistory.getCurrentPointerCommand());
                } else if (chr === String.fromCharCode(40)){
                    _CommandHistory.downArrow();
                    this.changeCommand(_CommandHistory.getCurrentPointerCommand());
                } else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
            }
        }

        public putText(text): void {
            // My first inclination here was to write two functions: putChar() and putString().
            // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
            // between the two.  So rather than be like PHP and write two (or more) functions that
            // do the same thing, thereby encouraging confusion and decreasing readability, I
            // decided to write one function and use the term "text" to connote string or char.
            //
            // UPDATE: Even though we are now working in TypeScript, char and string remain undistinguished.
            //         Consider fixing that.
            if (text !== "") {
                var arr = text.split(' ');
                if ( arr.length > 1 && text !== ' '){
                    for( var i = 0; i < arr.length; i++ ){
                        this.putText(arr[i]);
                        if (i !== arr.length-1){
                            this.putText(' ');
                        }
                    }
                } else {
                    var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                    // Utilize line wrapping
                    if (this.currentXPosition + offset > _Canvas.width/window.devicePixelRatio){
                        // if (this.currentXPosition + offset > _Canvas.width){
                        this.advanceLine();
                    }
                    // Draw the text at the current X and Y coordinates.
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                    // Move the current X position.
                    this.currentXPosition = this.currentXPosition + offset;
                    }
                }
            }

            public advanceLine(): void {
                this.currentXPosition = 0;
                /*
                 * Font size measures from the baseline to the highest point in the font.
                 * Font descent measures from the baseline to the lowest point in the font.
                 * Font height margin is extra spacing between the lines.
                 */
                this.currentYPosition += _DefaultFontSize + 
                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                    _FontHeightMargin;

                if (this.currentYPosition > _Canvas.height/window.devicePixelRatio){
                    var imgData = _Canvas.getContext('2d').getImageData(0,0,_Canvas.width, _Canvas.height);
                    _Canvas.height = (this.currentYPosition + 5) * window.devicePixelRatio;
                    _Canvas.getContext('2d').putImageData(imgData,0,0);
                    _DrawingContext.scale(window.devicePixelRatio,window.devicePixelRatio);

                    // Keep window at bottom of the canvas
                    var canvasDiv = document.getElementById("divConsole");
                    canvasDiv.scrollTop = canvasDiv.scrollHeight;
                }
            }
        }
    }
