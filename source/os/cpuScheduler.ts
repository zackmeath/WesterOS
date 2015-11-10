
module TSOS {
    export class CpuScheduler {

        private quantum: number;
        public getQuantum(): number {  return this.quantum;  }
        public setQuantum(q: number){  this.quantum = q;  }
        
        private mode: TSOS.Mode;
        public setMode(m: TSOS.Mode){  this.mode = m;  }

        constructor(){
            this.quantum = 6;
            this.mode = TSOS.Mode.ROUND_ROBIN;
        }

    } // End of cpuScheduler class
} // End of TSOS module

