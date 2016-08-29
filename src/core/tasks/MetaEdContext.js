"use strict";
const Version_1 = require('./Version');
class InputDirectory {
}
exports.InputDirectory = InputDirectory;
class MetaEdContext {
    constructor(metaEdFileIndex, symbolTable) {
        this._generatedOutput = [];
        this._inputDirectories = [];
        this._fileNamesToLoad = [];
        this._version = new Version_1.Version();
        this._exceptionCollection = [];
        this._warningMessageCollection = [];
        this._errorMessageCollection = [];
        this._metaEdFileIndex = metaEdFileIndex;
        this._symbolTable = symbolTable;
    }
    get fileExtension() {
        return ".metaed";
    }
    set fileExtension(value) {
    }
    get inputDirectories() {
        return this._inputDirectories;
    }
    get metaEdFileIndex() {
        return this._metaEdFileIndex;
    }
    get warningMessageCollection() {
        return this._warningMessageCollection;
    }
    get errorMessageCollection() {
        return this._errorMessageCollection;
    }
    get exceptionCollection() {
        return this._exceptionCollection;
    }
    get symbolTable() {
        return this._symbolTable;
    }
    get output() {
        return this._generatedOutput;
    }
    get fileNamesToLoad() {
        return this._fileNamesToLoad;
    }
    get version() {
        return this._version;
    }
}
exports.MetaEdContext = MetaEdContext;
//# sourceMappingURL=MetaEdContext.js.map