export class InputDirectory {
    constructor() {
        this.path = null;
        this.namespace = null;
        this.isExtension = null;
        this.projectExtension = null;
    }
}

export class MetaEdContext {
    constructor(metaEdFileIndex, symbolTable) {
        this.warningMessageCollection = [];
        this.errorMessageCollection = [];
        this.metaEdFileIndex = metaEdFileIndex;
        this.symbolTable = symbolTable;
        this.exceptionCollection = [];
        this.generatedOutput = [];
        this.inputDirectories = [];
        this.fileNamesToLoad = [];
    }
}
