"use strict";
class MetaEdFileIndex {
    getAllContents() {
        let concatenation = "";
        for (let value of this._filesByLineNumber)
            concatenation += value.Contents;
        return concatenation;
    }
    getFileAndLineNumber(concatenatedLineNumber) {
        let selectedValue;
        let selectedKey;
        for (let i = 1; i < this._totalLineCount; i++) {
            let value = this._filesByLineNumber[i];
            if (!value)
                continue;
            if (i <= concatenatedLineNumber) {
                selectedValue = value;
                selectedKey = i;
            }
            else
                break;
        }
        if (this._totalLineCount <= concatenatedLineNumber || selectedValue == undefined)
            return { fileName: "unknown", lineNumber: -1 };
        let lineNumber = concatenatedLineNumber - selectedKey + 1;
        return { fileName: selectedValue.FullName, lineNumber: lineNumber };
    }
    load(metaEdFiles) {
        this._filesByLineNumber = [];
        let lineNumber = 1;
        for (let key in metaEdFiles) {
            this._filesByLineNumber[lineNumber] = metaEdFiles[key];
            lineNumber += metaEdFiles[key].LineCount;
        }
        this._totalLineCount = lineNumber;
    }
}
exports.MetaEdFileIndex = MetaEdFileIndex;
class FileAndLineNumber {
}
exports.FileAndLineNumber = FileAndLineNumber;
//# sourceMappingURL=IMetaEdFileIndex.js.map