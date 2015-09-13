var ZMOS;
(function (ZMOS) {
    var ShellCommand = (function () {
        function ShellCommand(func, command, description) {
            if (command === void 0) { command = ""; }
            if (description === void 0) { description = ""; }
            this.func = func;
            this.command = command;
            this.description = description;
        }
        return ShellCommand;
    })();
    ZMOS.ShellCommand = ShellCommand;
})(ZMOS || (ZMOS = {}));
