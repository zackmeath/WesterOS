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
        FileSystemManager.prototype.formatFileSystem = function () {
            var blankBlock = FILE_SYSTEM_FLAG_NOT_USED;
            for (var i = 0; i < this.blockSize - 1; i++) {
                blankBlock += FILE_SYSTEM_EMPTY_BYTE;
            }
            for (var i = 0; i < this.tracks; i++) {
                for (var j = 0; j < this.sectors; j++) {
                    for (var k = 0; k < this.blocks; k++) {
                        _FileSystem.write(i, j, k, blankBlock);
                    }
                }
            }
            var bootBlock = FILE_SYSTEM_FLAG_USED;
            bootBlock += FILE_SYSTEM_EMPTY_BYTE + FILE_SYSTEM_EMPTY_BYTE + FILE_SYSTEM_EMPTY_BYTE;
            bootBlock += 'Boot';
            for (var i = 0; i < this.blockSize - 1; i++) {
                bootBlock += FILE_SYSTEM_EMPTY_BYTE;
            }
            _FileSystem.write(0, 0, 0, bootBlock);
        };
        FileSystemManager.prototype.readFile = function (fileName) {
            if (!this.doesFileExist(fileName)) {
                return 'File \"' + fileName + '\" does not exist';
            }
            var file = this.getFileByName(fileName);
            return this.retrieveFileContents(file[1]);
        };
        FileSystemManager.prototype.createFile = function (fileName) {
            // Error handling
            if (this.doesFileExist(fileName)) {
                return 'File \"' + fileName + '\" already exists';
            }
            var fileLocation = this.findEmptyFileTSB();
            if (fileLocation.length !== 3) {
                return fileLocation;
            }
            var contentLocation = this.findEmptyTSB();
            if (contentLocation.length !== 3) {
                return contentLocation;
            }
            // Write to the new locations
            var fileString = FILE_SYSTEM_FLAG_USED + contentLocation + fileName;
            var contentString = FILE_SYSTEM_FLAG_USED;
            while (fileString.length < this.blockSize) {
                fileString += FILE_SYSTEM_EMPTY_BYTE;
            }
            while (contentString.length < this.blockSize) {
                contentString += FILE_SYSTEM_EMPTY_BYTE;
            }
            this.writeFileToFS(fileLocation, fileString);
            this.writeFileToFS(contentLocation, contentString);
            return 'Success';
        };
        FileSystemManager.prototype.writeFile = function (fileName, data) {
            if (!this.doesFileExist(fileName)) {
                return 'File \"' + fileName + '\" does not exist';
            }
            var file = this.getFileByName(fileName);
            this.writeFileContents(file[1], data);
            return 'Success';
        };
        FileSystemManager.prototype.deleteFile = function (fileName) {
            if (!this.doesFileExist(fileName)) {
                return 'File \"' + fileName + '\" does not exist';
            }
            var file = this.getFileByName(fileName);
            var fileLocation = this.getFileLocationByName(fileName);
            this.contentsDelete(file[1]);
            var newString = FILE_SYSTEM_FLAG_NOT_USED + file[1] + file[2];
            while (newString.length < this.blockSize) {
                newString += FILE_SYSTEM_EMPTY_BYTE;
            }
            this.writeFileToFS(fileLocation, newString);
            return 'Success';
        };
        FileSystemManager.prototype.ls = function () {
            var output = [];
            for (var j = 0; j < this.tracks; j++) {
                for (var k = 0; k < this.tracks; k++) {
                    var file = this.getFileByLocation(0, j, k);
                    if (file[0] === FILE_SYSTEM_FLAG_USED) {
                        output.push(file[2]);
                    }
                }
            }
            return output;
        };
        FileSystemManager.prototype.findEmptyFileTSB = function () {
            for (var j = 0; j < this.sectors; j++) {
                for (var k = 0; k < this.blocks; k++) {
                    var file = this.getFileByLocation(0, j, k);
                    if (file[0] === FILE_SYSTEM_FLAG_NOT_USED) {
                        return '' + 0 + j + k;
                    }
                }
            }
            return 'Exceeded maximum number of files';
        };
        FileSystemManager.prototype.findEmptyTSB = function () {
            for (var i = 1; i < this.tracks; i++) {
                for (var j = 0; j < this.sectors; j++) {
                    for (var k = 0; k < this.blocks; k++) {
                        var file = this.getFileByLocation(i, j, k);
                        if (file[0] === FILE_SYSTEM_FLAG_NOT_USED) {
                            return '' + i + j + k;
                        }
                    }
                }
            }
            return 'No free storage space was found';
        };
        FileSystemManager.prototype.contentsDelete = function (tsbString) {
            var file = this.getFileByLocationString(tsbString);
            if (parseInt(file[1])) {
                this.contentsDelete(file[1]);
            }
            var newString = FILE_SYSTEM_FLAG_NOT_USED + file[1] + file[2];
            while (newString.length < this.blockSize) {
                newString += FILE_SYSTEM_EMPTY_BYTE;
            }
            this.writeFileToFS(tsbString, newString);
        };
        // data will not always be the correct size
        FileSystemManager.prototype.writeFileContents = function (tsbString, data) {
            var DATA_SIZE = this.blockSize - this.headerSize;
            if (data.length <= DATA_SIZE) {
                data = FILE_SYSTEM_FLAG_USED + FILE_SYSTEM_EMPTY_BYTE + FILE_SYSTEM_EMPTY_BYTE + FILE_SYSTEM_EMPTY_BYTE + data;
                while (data.length < this.blockSize) {
                    data += FILE_SYSTEM_EMPTY_BYTE;
                }
                this.writeFileToFS(tsbString, data);
            }
            else {
                var blockTaken = FILE_SYSTEM_FLAG_USED;
                while (blockTaken.length < this.blockSize) {
                    blockTaken += FILE_SYSTEM_EMPTY_BYTE;
                }
                this.writeFileToFS(tsbString, blockTaken);
                var newLocation = this.findEmptyTSB();
                var first = data.substring(0, DATA_SIZE);
                var second = data.substring(DATA_SIZE);
                first = FILE_SYSTEM_FLAG_USED + newLocation + first;
                this.writeFileToFS(tsbString, first);
                this.writeFileContents(newLocation, second);
            }
        };
        // data will always be the correct size
        FileSystemManager.prototype.writeFileToFS = function (tsbString, data) {
            var track = parseInt(tsbString.substring(0, 1));
            var sector = parseInt(tsbString.substring(1, 2));
            var block = parseInt(tsbString.substring(2, 3));
            _FileSystem.write(track, sector, block, data);
        };
        FileSystemManager.prototype.retrieveFileContents = function (tsbString) {
            var file = this.getFileByLocationString(tsbString);
            if (file[1] === '---') {
                return file[2];
            }
            else {
                return file[2] + this.retrieveFileContents(file[1]);
            }
        };
        FileSystemManager.prototype.doesFileExist = function (fileName) {
            for (var j = 0; j < this.sectors; j++) {
                for (var k = 0; k < this.blocks; k++) {
                    var file = this.getFileByLocation(0, j, k);
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
        FileSystemManager.prototype.getFileByName = function (fileName) {
            for (var j = 0; j < this.sectors; j++) {
                for (var k = 0; k < this.blocks; k++) {
                    var file = this.getFileByLocation(0, j, k);
                    if (file[0] === FILE_SYSTEM_FLAG_NOT_USED) {
                        continue;
                    }
                    if (file[2] === fileName) {
                        return file;
                    }
                }
            }
        };
        FileSystemManager.prototype.getFileLocationByName = function (fileName) {
            for (var j = 0; j < this.sectors; j++) {
                for (var k = 0; k < this.blocks; k++) {
                    var file = this.getFileByLocation(0, j, k);
                    if (file[0] === FILE_SYSTEM_FLAG_NOT_USED) {
                        continue;
                    }
                    if (file[2] === fileName) {
                        return '' + 0 + j + k;
                    }
                }
            }
        };
        FileSystemManager.prototype.getFileByLocationString = function (tsbString) {
            var t = tsbString.substring(0, 1);
            var s = tsbString.substring(1, 2);
            var b = tsbString.substring(2, 3);
            return this.deconstructFile(t, s, b);
        };
        FileSystemManager.prototype.getFileByLocation = function (t, s, b) {
            return this.deconstructFile(t, s, b);
        };
        FileSystemManager.prototype.deconstructFile = function (t, s, b) {
            var contents = _FileSystem.read(t, s, b);
            var flag = contents.substring(0, 1);
            var address = contents.substring(1, 4);
            contents = contents.substring(4);
            // var data = contents.substring(0, contents.indexOf(FILE_SYSTEM_EMPTY_BYTE));
            var data = contents.substring(0);
            var out = '';
            for (var i = 0; i < data.length; i++) {
                if (data[i] === FILE_SYSTEM_EMPTY_BYTE) {
                    break;
                }
                out += data[i];
            }
            return [flag, address, out];
        };
        return FileSystemManager;
    })();
    TSOS.FileSystemManager = FileSystemManager;
})(TSOS || (TSOS = {}));
