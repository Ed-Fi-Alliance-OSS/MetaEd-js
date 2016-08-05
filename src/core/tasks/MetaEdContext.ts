import {IMetaEdFileIndex} from '../../grammar/IMetaEdFileIndex';
import ValidationMessage from '../../common/ValidationMessage';
import {ISymbolTable} from '../validators/SymbolTable';

import List from 'typescript-dotnet-commonjs/System/Collections/List'

export interface IMetaEdContext {
    //      FileExtension: string
    //    InputDirectories: IList<InputDirectory>
    //    string ProjectFile { get; set; }
    //    string OutputDirectory { get; set; }
    //    ArtifactGeneration ArtifactGeneration { get; set; }
    //    IParseTree ParseTree { get; set; }
    MetaEdFileIndex: IMetaEdFileIndex
    ErrorMessageCollection: List<ValidationMessage>
    WarningMessageCollection: List<ValidationMessage>
    //    IList<Exception> ExceptionCollection { get; }
    SymbolTable: ISymbolTable
    //    List<GeneratedOutput> Output { get; }
    //    IList<FilesToLoad> FileNamesToLoad { get; }
    //    bool OnlySyntaxCheckFirstFileNameSet { get; set; }
    //    IVersion Version { get; }
    //    string CopyrightYear { get; set; }
    //    DateTimeOffset GenerationDateTime { get; set; }
    //    bool DisableDiminishers { get; set; }
    //}

    //public class InputDirectory
    //{
    //    public string Path { get; set; }
    //    public string Namespace { get; set; }
    //    public string ProjectExtension { get; set; }
    //    public bool IsExtension { get; set; }
    //}

    //public class MetaEdContext : IMetaEdContext
    //{
    //    private readonly IMetaEdFileIndex _metaEdFileIndex;
    //    private readonly List<ValidationMessage> _warningMessageCollection;
    //    private readonly List<ValidationMessage> _errorMessageCollection;
    //    private readonly ISymbolTable _symbolTable;
    //    private readonly List<GeneratedOutput> _generatedOutput = new List<GeneratedOutput>();
    //    private readonly List<InputDirectory> _inputDirectories = new List<InputDirectory>();
    //    private readonly List<FilesToLoad> _fileNamesToLoad = new List<FilesToLoad>();
    //    private readonly Version _version = new Version();
    //    private readonly List<Exception> _exceptionCollection = new List<Exception>();

    //    public MetaEdContext(IMetaEdFileIndex metaEdFileIndex, ISymbolTable symbolTable)
    //    {
    //        _warningMessageCollection = new List<ValidationMessage>();
    //        _errorMessageCollection = new List<ValidationMessage>();
    //        _metaEdFileIndex = metaEdFileIndex;
    //        _symbolTable = symbolTable;
    //    }

    //    public string FileExtension { get { return ".metaed"; } set {} }
    //    public IList<InputDirectory> InputDirectories { get { return _inputDirectories; } }
    //    public string ProjectFile { get; set; }
    //    public string OutputDirectory { get; set; }
    //    public ArtifactGeneration ArtifactGeneration { get; set; }
    //    public IParseTree ParseTree { get; set; }
    //    public IMetaEdFileIndex MetaEdFileIndex { get { return _metaEdFileIndex; } }
    //    public List<ValidationMessage> WarningMessageCollection { get { return _warningMessageCollection; } }
    //    public List<ValidationMessage> ErrorMessageCollection { get { return _errorMessageCollection; } }
    //    public IList<Exception> ExceptionCollection { get { return _exceptionCollection; } }
    //    public ISymbolTable SymbolTable { get { return _symbolTable; } }
    //    public List<GeneratedOutput> Output { get { return _generatedOutput; } }
    //    public IList<FilesToLoad> FileNamesToLoad { get { return _fileNamesToLoad; } }
    //    public bool OnlySyntaxCheckFirstFileNameSet { get; set; }
    //    public IVersion Version { get { return _version; } }
    //    public string CopyrightYear { get; set; }
    //    public DateTimeOffset GenerationDateTime { get; set; }
    //    public bool DisableDiminishers { get; set; }
}

export class MetaEdContext implements IMetaEdContext{
    private _metaEdFileIndex: IMetaEdFileIndex
    private _errorMessageCollection: List<ValidationMessage>
    private _warningMessageCollection: List<ValidationMessage>
    private _symbolTable: ISymbolTable

    public get MetaEdFileIndex(): IMetaEdFileIndex{return this._metaEdFileIndex}
    public get ErrorMessageCollection(): List<ValidationMessage>{return this._errorMessageCollection}
    public get WarningMessageCollection(): List<ValidationMessage>{return this._warningMessageCollection}
    public get SymbolTable(): ISymbolTable{return this._symbolTable}

    constructor(metaEdFileIndex: IMetaEdFileIndex, symbolTable: ISymbolTable){
        this._metaEdFileIndex = metaEdFileIndex
        this._symbolTable = symbolTable
        this._errorMessageCollection = new List<ValidationMessage>()
        this._warningMessageCollection = new List<ValidationMessage>()
    }
}
