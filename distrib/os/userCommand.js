var WESTEROS;
(function (WESTEROS) {
    var UserCommand = (function () {
        function UserCommand(command, args) {
            if (command === void 0) { command = ""; }
            if (args === void 0) { args = []; }
            this.command = command;
            this.args = args;
        }
        return UserCommand;
    })();
    WESTEROS.UserCommand = UserCommand;
})(WESTEROS || (WESTEROS = {}));
