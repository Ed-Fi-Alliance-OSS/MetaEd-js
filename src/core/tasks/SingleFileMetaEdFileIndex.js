"use strict";
const MetaEdFile_1 = require('../../grammar/MetaEdFile');
const NotImplementedException_1 = require('typescript-dotnet-commonjs/System/Exceptions/NotImplementedException');
class SingleFileMetaEdFileIndex {
    add(metaEdFile) {
        this.metaEdFile = metaEdFile;
    }
    addContents(contents) {
        this.metaEdFile = new MetaEdFile_1.MetaEdFile("DirectoryName", "FileName", contents);
    }
    getAllContents() {
        return this.metaEdFile.Contents;
    }
    getFileAndLineNumber(concatenatedLineNumber) {
        return { fileName: this.metaEdFile.fileName, lineNumber: concatenatedLineNumber };
    }
    load(metaEdFiles) {
        throw new NotImplementedException_1.default();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SingleFileMetaEdFileIndex;
//# sourceMappingURL=SingleFileMetaEdFileIndex.js.map