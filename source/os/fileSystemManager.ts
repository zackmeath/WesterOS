module TSOS {

    export class FileSystemManager{

        private tracks:     number;
        private sectors:    number;
        private blocks:     number;
        private blockSize:  number;
        private headerSize: number;

        constructor(){
            this.tracks = _FileSystem.tracks;
            this.sectors = _FileSystem.sectors;
            this.blocks = _FileSystem.blocks;
            this.blockSize = _FileSystem.blockSize;
            this.headerSize = _FileSystem.headerSize;
        }

        public handleOperation(params){
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
        }

        private formatFileSystem(){
            var blankBlock = FILE_SYSTEM_FLAG_NOT_USED;
            for(var i = 0; i < this.blockSize-1; i++){
                blankBlock += FILE_SYSTEM_EMPTY;
            }
            for(var i = 0; i < this.tracks; i++){
                for(var j = 0; j < this.sectors; j++){
                    for(var k = 0; k < this.blocks; k++){
                        _FileSystem.write(i, j, k, blankBlock);
                    }
                }
            }
        }

        private createFile(fileName): string {
            var foundSpot = false;
            if(this.doesFileExist(fileName)){
                return 'File \"' + fileName + '\" already exists';
            }
            for(var j = 0; j < this.sectors; j++){
                for(var k = 0; k < this.blocks; k++){
                    var file = this.deconstructFile(0, j, k);
                    if(file[0] === 0){
                        foundSpot = true;
                        var fileString = FILE_SYSTEM_FLAG_USED;
                        var done = false;
                        for(var x = 1; x < this.tracks; x++){
                            for(var y = 0; y < this.tracks; y++){
                                for(var z = 0; z < this.tracks; z++){
                                    if(done){
                                        continue;
                                    }
                                    var secondFile = this.deconstructFile(x, y, z);
                                    if(secondFile[0] === FILE_SYSTEM_FLAG_NOT_USED){
                                        done = true;
                                        fileString += '' + x + y + z;
                                    }
                                }
                            }
                        }
                        fileString += fileName;
                        while(fileString.length < this.blockSize){
                            fileString += FILE_SYSTEM_EMPTY;
                        }
                        _FileSystem.write(0, j, k, fileString);
                    }
                }
            }
            if(foundSpot){
                return 'Success';
            } else {
                return 'Exceeded maximum number of files allowed';
            }
        }

        private readFile(fileName): string {
            if(!this.doesFileExist(fileName)){
                return 'File \"' + fileName + '\" does not exist';
            }
            for(var j = 0; j < this.sectors; j++){
                for(var k = 0; k < this.blocks; k++){
                    var file = this.deconstructFile(0, j, k);
                    if(file[0] === FILE_SYSTEM_FLAG_NOT_USED){ // File is not in use
                        continue;
                    }
                    if(file[2] === fileName){
                        return this.retrieveFileContents(file[1]);
                    }
                }
            }

        }

        private writeFile(fileName, data): string {
            if(!this.doesFileExist(fileName)){
                return 'File \"' + fileName + '\" does not exist';
            }
            // TODO Return 'Success' if successful
        }

        private deleteFile(fileName): string {
            if(!this.doesFileExist(fileName)){
                return 'File \"' + fileName + '\" does not exist';
            }
            // TODO Return 'Success' if successful
        }

        private ls(){
            // TODO
        }

        private retrieveFileContents(tsbString){
            var track = parseInt(tsbString.substring(0,1));
            var sector = parseInt(tsbString.substring(1,2));
            var block = parseInt(tsbString.substring(2,3));

            var file = this.deconstructFile(_FileSystem.read(track, sector, block));

            if(isNaN(parseInt(file[1]))){ // If we do not need to continue reading to a new block
                return file[2];
            } else {
                return file[2] + this.retrieveFileContents(file[1]);
            }
        }

        private doesFileExist(fileName): boolean {
            for(var j = 0; j < this.sectors; j++){
                for(var k = 0; k < this.blocks; k++){

                    var file = this.deconstructFile(0, j, k);

                    // If the tsb is not in use we dont care about it
                    if(file[0] === FILE_SYSTEM_FLAG_NOT_USED){
                        continue;
                    }

                    // Test if the contents at tsb match the filename
                    if(file[2] === fileName){
                        return true;
                    }

                }
            }
            return false;
        }

        private deconstructFile(t, s, b){
            var contents = _FileSystem.read(t, s, b);
            var flag = contents.substring(0, 1);
            var address = contents.substring(1, 4);
            var data = contents.substring(4, contents.indexOf(FILE_SYSTEM_EMPTY));
            return [flag, address, data];
        }
    }

}
