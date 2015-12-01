var TSOS;
(function (TSOS) {
    var FileSystemManager = (function () {
        function FileSystemManager() {
            this.tracks = _FileSystem.tracks;
            this.sectors = _FileSystem.sectors;
            this.blocks = _FileSystem.blocks;
            this.blockSize = _FileSystem.blockSize;
            this.headerSize = _FileSystem.headerSize;
        }
        FileSystemManager.prototype.format = function () {
            var blankBlock = FILE_SYSTEM_FLAG_NOT_USED;
            for (var i = 0; i < this.blockSize - 1; i++) {
                blankBlock += FILE_SYSTEM_EMPTY;
            }
            for (var i = 0; i < this.tracks; i++) {
                for (var j = 0; j < this.sectors; j++) {
                    for (var k = 0; k < this.blocks; k++) {
                        _FileSystem.write(i, j, k, blankBlock);
                    }
                }
            }
        };
        FileSystemManager.prototype.createFile = function (fileName) {
            if (this.doesFileExist(fileName)) {
                return 'File \"' + fileName + '\" already exists';
            }
            // TODO Return 'Success' if successful
        };
        FileSystemManager.prototype.readFile = function (fileName) {
            if (!this.doesFileExist(fileName)) {
                return 'File \"' + fileName + '\" does not exist';
            }
            // TODO
        };
        FileSystemManager.prototype.writeFile = function (fileName, data) {
            if (!this.doesFileExist(fileName)) {
                return 'File \"' + fileName + '\" does not exist';
            }
            // TODO Return 'Success' if successful
        };
        FileSystemManager.prototype.deleteFile = function (fileName) {
            if (!this.doesFileExist(fileName)) {
                return 'File \"' + fileName + '\" does not exist';
            }
            // TODO Return 'Success' if successful
        };
        FileSystemManager.prototype.doesFileExist = function (fileName) {
            for (var j = 0; j < this.sectors; j++) {
                for (var k = 0; k < this.blocks; k++) {
                    var contents = _FileSystem.read(0, j, k).split(FILE_SYSTEM_EMPTY)[0];
                    var header = file.substring(0, 4);
                    if (header.substring(0) === '0') {
                        continue;
                    }
                    var name = contents.substring(4);
                    if (name === fileName) {
                        return true;
                    }
                }
            }
            return false;
        };
        FileSystemManager.prototype.deconstructFile = function (t, s, b) {
            var contents = _FileSystem.read(t, s, b);
            var flag = contents.substring(0, 1);
            var address = contents.substring(1, 4);
            var data = contents.substring(4);
            return [flag, address, data];
        };
        return FileSystemManager;
    })();
    TSOS.FileSystemManager = FileSystemManager;
})(TSOS || (TSOS = {}));
