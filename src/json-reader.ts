export default class JsonFile {
    // Here we import the File System module of node
    private fs = require('fs');
    private filename: String;

    constructor(filename: String) {
        this.filename = filename;
    }

    createFile(data: any) {
        this.fs.writeFile(this.filename + '.json', JSON.stringify(data),function(err) {
            if (err) {
                return console.error(err);
            }
            console.log("File created!");
        });
    }

    readFile() {
        this.fs.readFileSync(this.filename + '.json', function (err, data) {
            if (err) {
                return console.error(err);
            }
            return JSON.parse(data);
        });
    }
}