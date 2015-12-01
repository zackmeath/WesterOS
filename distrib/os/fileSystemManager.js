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
        FileSystemManager.prototype.handleOperation = function (params) {
            switch (params.type) {
                case 'format':
                    this.formatFileSystem();
                    break;
                case 'ls':
                    this.ls();
                    break;
                case 'create':
                    var outupt = this.createFile(params.fileName);
                    _StdOut.putText(output);
                    break;
                case 'read':
                    var output = this.readFile(params.fileName);
                    _StdOut.putText(output);
                    break;
                case 'write':
                    var output = this.writeFile(params.fileName, params.data);
                    _StdOut.putText(output);
                    break;
                case 'delete':
                    var output = this.deleteFile(params.fileName);
                    _StdOut.putText(output);
                    break;
            }
        };
        FileSystemManager.prototype.formatFileSystem = function () {
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
            var foundSpot = false;
            if (this.doesFileExist(fileName)) {
                return 'File \"' + fileName + '\" already exists';
            }
            for (var j = 0; j < this.sectors; j++) {
                for (var k = 0; k < this.blocks; k++) {
                    var file = this.deconstructFile(0, j, k);
                    if (file[0] === 0) {
                        foundSpot = true;
                        var fileString = FILE_SYSTEM_FLAG_USED;
                        var done = false;
                        for (var x = 1; x < this.tracks; x++) {
                            for (var y = 0; y < this.tracks; y++) {
                                for (var z = 0; z < this.tracks; z++) {
                                    if (done) {
                                        continue;
                                    }
                                    var secondFile = this.deconstructFile(x, y, z);
                                    if (secondFile[0] === FILE_SYSTEM_FLAG_NOT_USED) {
                                        done = true;
                                        fileString += '' + x + y + z;
                                    }
                                }
                            }
                        }
                        fileString += fileName;
                        while (fileString.length < this.blockSize) {
                            fileString += FILE_SYSTEM_EMPTY;
                        }
                        _FileSystem.write(0, j, k, fileString);
                    }
                }
            }
            if (foundSpot) {
                return 'Success';
            }
            else {
                return 'Exceeded maximum number of files allowed';
            }
        };
        FileSystemManager.prototype.readFile = function (fileName) {
            if (!this.doesFileExist(fileName)) {
                return 'File \"' + fileName + '\" does not exist';
            }
            for (var j = 0; j < this.sectors; j++) {
                for (var k = 0; k < this.blocks; k++) {
                    var file = this.deconstructFile(0, j, k);
                    if (file[0] === FILE_SYSTEM_FLAG_NOT_USED) {
                        continue;
                    }
                    if (file[2] === fileName) {
                        return this.retrieveFileContents(file[1]);
                    }
                }
            }
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
        FileSystemManager.prototype.ls = function () {
            // TODO
        };
        FileSystemManager.prototype.retrieveFileContents = function (tsbString) {
            var track = parseInt(tsbString.substring(0, 1));
            var sector = parseInt(tsbString.substring(1, 2));
            var block = parseInt(tsbString.substring(2, 3));
            var file = this.deconstructFile(_FileSystem.read(track, sector, block));
            if (isNaN(parseInt(file[1]))) {
                return file[2];
            }
            else {
                return file[2] + this.retrieveFileContents(file[1]);
            }
        };
        FileSystemManager.prototype.doesFileExist = function (fileName) {
            for (var j = 0; j < this.sectors; j++) {
                for (var k = 0; k < this.blocks; k++) {
                    var file = this.deconstructFile(0, j, k);
                    // If the tsb is not in use we dont care about it
                    if (file[0] === FILE_SYSTEM_FLAG_NOT_USED) {
                        continue;
                    }
                    // Test if the contents at tsb match the filename
                    if (file[2] === fileName) {
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
            var data = contents.substring(4, contents.indexOf(FILE_SYSTEM_EMPTY));
            return [flag, address, data];
        };
        return FileSystemManager;
    })();
    TSOS.FileSystemManager = FileSystemManager;
})(TSOS || (TSOS = {}));
