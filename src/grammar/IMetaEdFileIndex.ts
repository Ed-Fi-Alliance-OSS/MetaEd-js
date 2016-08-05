import {MetaEdFile} from './MetaEdFile'

export interface IMetaEdFileIndex {
    getAllContents(): string;
    getFileAndLineNumber(concatenatedLineNumber: number): FileAndLineNumber;
    load(metaEdFiles: MetaEdFile[]): void;
}

export class MetaEdFileIndex implements IMetaEdFileIndex {
    //Based on the logic in the load method. This should be sorted by default.
    private _filesByLineNumber: MetaEdFile[]; //SortedDictionary<int, MetaEdFile> new SortedDictionary<int, MetaEdFile>();
    private _totalLineCount: number;

    public getAllContents(): string {
        let concatenation = "";

        for (let value of this._filesByLineNumber)
            concatenation += value.Contents;

        return concatenation;
    }

    public getFileAndLineNumber(concatenatedLineNumber: number): FileAndLineNumber {
        let selectedValue: MetaEdFile;
        let selectedKey: number;

        for (let i = 1; i < this._totalLineCount; i++) {
            let value = this._filesByLineNumber[i];
            if (!value) continue;
            if (i <= concatenatedLineNumber) {
                selectedValue = value;
                selectedKey = i;
            } else break;

        }

        if (this._totalLineCount <= concatenatedLineNumber || selectedValue == undefined)
            return <FileAndLineNumber>{ fileName: "unknown", lineNumber: -1 };

        let lineNumber = concatenatedLineNumber - selectedKey + 1;

        return <FileAndLineNumber>{ fileName: selectedValue.FullName, lineNumber: lineNumber }; 
    }

    public load(metaEdFiles: MetaEdFile[]): void {
        this._filesByLineNumber = [];
        let lineNumber = 1;
        for (let key in metaEdFiles) {
            this._filesByLineNumber[lineNumber] = metaEdFiles[key];
            lineNumber += metaEdFiles[key].LineCount;
        }

        this._totalLineCount = lineNumber;
    }
}

export class FileAndLineNumber {
    public fileName: string
    public lineNumber: number
}