import {IMetaEdFileIndex, FileAndLineNumber} from '../../grammar/IMetaEdFileIndex'
import {MetaEdFile} from '../../grammar/MetaEdFile'
import NotImplementedException from 'typescript-dotnet-commonjs/System/Exceptions/NotImplementedException'


export default class SingleFileMetaEdFileIndex implements IMetaEdFileIndex {
    private metaEdFile: MetaEdFile;

    public add(metaEdFile: MetaEdFile): void {
        this.metaEdFile = metaEdFile;
    }

    public addContents(contents: string): void {
        this.metaEdFile = new MetaEdFile("DirectoryName", "FileName", contents);
    }

    public getAllContents(): string {
        return this.metaEdFile.Contents;
    }

    public getFileAndLineNumber(concatenatedLineNumber: number): FileAndLineNumber {
        return { fileName: this.metaEdFile.fileName, lineNumber: concatenatedLineNumber };
    }

    public load(metaEdFiles: MetaEdFile[]): void {
        throw new NotImplementedException();
    }
}