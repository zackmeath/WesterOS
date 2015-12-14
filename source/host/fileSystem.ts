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
            // console.log(localStorage.getItem(track + '-' + sector + '-' + block));
            // return this.byteArrayToString(this.unstringifyBytesForStorage(localStorage.getItem(track + '-' + sector + '-' + block)));
            return localStorage.getItem(track + '-' + sector + '-' + block)
        }

        public write(track, sector, block, data){
            // localStorage.setItem(track + '-' + sector + '-' + block, this.stringifyBytesForStorage(this.stringToByteArray(data)));
            localStorage.setItem(track + '-' + sector + '-' + block, data);
        }
// 
//         private stringToByteArray(str: string): number[] {
//             var bytes = [];
//             for (var i = 0; i < str.length; i++) {
//                 bytes.push(str.charCodeAt(i));
//             }
//             return bytes;
//         }
//         private byteArrayToString(bytes: number[]): string {
//             var str = '';
//             for (var i = 0; i < bytes.length; i++){
//                 str += String.fromCharCode(bytes[i]);
//             }
//             return str;
//         }
// 
//         private stringifyBytesForStorage(bytes: number[]): string {
//             var str = '';
//             for(var i = 0; i < bytes.length; i++){
//                 var bite = '' + bytes[i];
//                 while (bite.length < 3){
//                     bite = '0' + bite;
//                 }
//                 str += bite;
//             }
//             return str;
//         }
// 
//         private unstringifyBytesForStorage(str: string): number[] {
//             var bytes = [];
//             for(var i = 0; i < str.length; i += 3){
//                 var ch = str.substr(i, 3);
//                 bytes.push(parseInt(ch));
//             }
//             return bytes;
//         }

    }

}
