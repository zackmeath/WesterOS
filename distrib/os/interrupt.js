/* ------------
   Interrupt.ts
   ------------ */
var WESTEROS;
(function (WESTEROS) {
    var Interrupt = (function () {
        function Interrupt(irq, params) {
            this.irq = irq;
            this.params = params;
        }
        return Interrupt;
    })();
    WESTEROS.Interrupt = Interrupt;
})(WESTEROS || (WESTEROS = {}));
