var TSOS;
(function (TSOS) {
    var UserCommand = (function () {
        function UserCommand(command, args) {
            if (command === void 0) { command = ""; }
            if (args === void 0) { args = []; }
            this.command = command;
            this.args = args;
        }
        return UserCommand;
    })();
    TSOS.UserCommand = UserCommand;
})(TSOS || (TSOS = {}));
