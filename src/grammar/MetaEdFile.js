"use strict";
class MetaEdFile {
    constructor(directoryName, fileName, contents) {
        this.directoryName = directoryName;
        this.fileName = fileName;
        this._contents = contents;
    }
    get Contents() { return this._contents; }
    set Contents(value) {
        this._contents = value;
        if (this._contents == null)
            this._contents = "";
        if (!this._contents.endsWith("\n"))
            this._contents += "\n";
        this._lineCount = this._contents.split("\n").length - 1;
    }
    get FullName() {
        if (this.directoryName == null || this.directoryName == "")
            return this.fileName;
        return `${this.directoryName}/${this.fileName}`;
    }
    get LineCount() { return this._lineCount; }
}
exports.MetaEdFile = MetaEdFile;
//# sourceMappingURL=MetaEdFile.js.map