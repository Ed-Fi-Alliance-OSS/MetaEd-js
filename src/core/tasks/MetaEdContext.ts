import {IMetaEdFileIndex} from '../../grammar/IMetaEdFileIndex';
import {ISymbolTable} from '../validators/SymbolTable';
import {IVersion, Version} from './Version'
import ValidationMessage from '../../common/ValidationMessage'
import {ArtifactGeneration} from '../../common/ArtifactGeneration'
import {FilesToLoad} from './FilesToLoad'
import {GeneratedOutput} from '../Generators/GeneratedOutput'

declare type IParseTree = any;
declare type Exception = any;

export interface IMetaEdContext {
    fileExtension: string;
    inputDirectories: InputDirectory[];
    projectFile: string;
    outputDirectory: string;
    artifactGeneration: ArtifactGeneration;
    parseTree: IParseTree;
    metaEdFileIndex: IMetaEdFileIndex;
    warningMessageCollection: ValidationMessage[];
    errorMessageCollection: ValidationMessage[];
    exceptionCollection: Exception[];
    symbolTable: ISymbolTable;
    output: GeneratedOutput[];
    fileNamesToLoad: FilesToLoad[];
    onlySyntaxCheckFirstFileNameSet: boolean;
    version: IVersion;
    copyrightYear: string;
    generationDateTime: Date;
    disableDiminishers: boolean;
}

export class InputDirectory {
    public path: string;
    public namespace: string;
    public projectExtension: string;
    public isExtension: boolean;
}

export class MetaEdContext implements IMetaEdContext {
    private _metaEdFileIndex: IMetaEdFileIndex;
    private _warningMessageCollection: ValidationMessage[];
    private _errorMessageCollection: ValidationMessage[];
    private _symbolTable: ISymbolTable;
    private _generatedOutput: GeneratedOutput[] = [];
    private _inputDirectories: InputDirectory[] = [];
    private _fileNamesToLoad: FilesToLoad[] = [];
    private _version: Version = new Version();
    private _exceptionCollection: Exception[] = [];
    constructor(metaEdFileIndex: IMetaEdFileIndex, symbolTable: ISymbolTable) {
        this._warningMessageCollection = [];
        this._errorMessageCollection = [];
        this._metaEdFileIndex = metaEdFileIndex;
         this.symbolTable = symbolTable;
    }
    public get fileExtension(): string {
        return ".metaed";
    }
    public set fileExtension(value: string) {

    }
    public get inputDirectories(): InputDirectory[] {
        return this._inputDirectories;
    }
    public projectFile: string;
    public outputDirectory: string;
    public artifactGeneration: ArtifactGeneration;
    public parseTree: IParseTree;
    public get metaEdFileIndex(): IMetaEdFileIndex {
        return this._metaEdFileIndex;
    }
    public get warningMessageCollection(): ValidationMessage[] {
        return this._warningMessageCollection;
    }
    public get errorMessageCollection(): ValidationMessage[] {
        return this._errorMessageCollection;
    }
    public get exceptionCollection(): Exception[] {
        return this._exceptionCollection;
    }
    public get symbolTable(): ISymbolTable {
        return this._symbolTable;
    }
    public get output(): GeneratedOutput[] {
        return this._generatedOutput;
    }
    public get fileNamesToLoad(): FilesToLoad[] {
        return this._fileNamesToLoad;
    }
    public onlySyntaxCheckFirstFileNameSet: boolean;
    public get version(): IVersion {
        return this._version;
    }
    public copyrightYear: string;
    public generationDateTime: Date;
    public disableDiminishers: boolean;
}
