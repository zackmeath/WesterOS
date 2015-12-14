var TSOS;
(function (TSOS) {
    var FileSystem = (function () {
        function FileSystem(tracks, sectors, blocks, blockSize, headerSize) {
            this.tracks = tracks;
            this.sectors = sectors;
            this.blocks = blocks;
            this.blockSize = blockSize;
            this.headerSize = headerSize;
        }
        FileSystem.prototype.read = function (track, sector, block) {
            // console.log(localStorage.getItem(track + '-' + sector + '-' + block));
            // return this.byteArrayToString(this.unstringifyBytesForStorage(localStorage.getItem(track + '-' + sector + '-' + block)));
            return localStorage.getItem(track + '-' + sector + '-' + block);
        };
        FileSystem.prototype.write = function (track, sector, block, data) {
            // localStorage.setItem(track + '-' + sector + '-' + block, this.stringifyBytesForStorage(this.stringToByteArray(data)));
            localStorage.setItem(track + '-' + sector + '-' + block, data);
        };
        return FileSystem;
    })();
    TSOS.FileSystem = FileSystem;
})(TSOS || (TSOS = {}));
