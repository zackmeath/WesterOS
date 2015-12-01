module TSOS {

    export class FileSystem {

        constructor(
                public tracks:     number,
                public sectors:    number,
                public blocks:     number,
                public blockSize:  number,
                public headerSize: number
        ){}

        public read(track, sector, block): string {
            return localStorage.getItem(track + '-' + sector + '-' + block);
        }

        public write(track, sector, block, data){
            localStorage.setItem(track + '-' + sector + '-' + block, data);
        }

    }

}
