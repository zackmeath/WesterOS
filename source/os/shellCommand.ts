module WESTEROS {
    export class ShellCommand {
        constructor(public func: any,
                    public command = "",
                    public description = "") {
        }
    }
}
