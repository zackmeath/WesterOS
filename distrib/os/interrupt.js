/* ------------
   Interrupt.ts
   ------------ */
var ZMOS;
(function (ZMOS) {
    var Interrupt = (function () {
        function Interrupt(irq, params) {
            this.irq = irq;
            this.params = params;
        }
        return Interrupt;
    })();
    ZMOS.Interrupt = Interrupt;
})(ZMOS || (ZMOS = {}));
