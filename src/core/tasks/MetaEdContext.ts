import {IMetaEdFileIndex} from '../../grammar/IMetaEdFileIndex';
import {ISymbolTable} from '../validators/SymbolTable';

declare type ArtifactGeneration = any;
declare type IParseTree = any;
declare type ValidationMessage = any;
declare type IVersion = any;
declare type Exception = any;
declare type GeneratedOutput = any;
declare type FilesToLoad = any;
declare type Version = any;

module MetaEd.Core.Tasks {
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
        private _exceptionCollection: Exception[] = new Exception[]();
        constructor(metaEdFileIndex: IMetaEdFileIndex, symbolTable: ISymbolTable) {
            this._warningMessageCollection = new ValidationMessage[]();
            this._errorMessageCollection = new ValidationMessage[]();
            this._metaEdFileIndex = metaEdFileIndex;
            this._symbolTable = symbolTable;
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
}