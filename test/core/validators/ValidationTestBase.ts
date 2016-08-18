import List from 'typescript-dotnet-commonjs/System/Collections/List'
import ValidationMessage from '../../../src/common/ValidationMessage'
import { SymbolTable } from '../../../src/core/validators/SymbolTable'
import { IMetaEdContext, MetaEdContext } from '../../../src/core/tasks/MetaEdContext'
import SingleFileMetaEdFileIndex from '../../../src/core/tasks/SingleFileMetaEdFileIndex'
import { SymbolTableBuilder } from  '../../../src/core/validators/SymbolTableBuilder'
import NullSymbolTableBuilderListener from '../../common/NullSymbolTableBuilderListener'

let antlr4 = require('antlr4/index')
let MetaEdGrammar = require('../../../src/grammar/gen/MetaEdGrammar');
let BaseLexer = require('../../../src/grammar/gen/BaseLexer')

declare type ParserRuleContext = any;

export abstract class ValidationTestBase {
    protected _symbolTable: SymbolTable;
    protected _warningMessageCollection: List<ValidationMessage>;
    protected _errorMessageCollection: List<ValidationMessage>;
    protected _parserContext: ParserRuleContext;
    protected _metaEdContext: IMetaEdContext;

    protected abstract metaEdText(): string

    public setup(): void {
        let metaEdText = this.metaEdText();
        console.log(metaEdText);
        let metaEdFileIndex = new SingleFileMetaEdFileIndex();
        metaEdFileIndex.addContents(metaEdText);
        let antlrInputStream = new antlr4.InputStream(metaEdText);
        let lexer = new BaseLexer.BaseLexer(antlrInputStream);
        let tokens = new antlr4.CommonTokenStream(lexer);
        let parser = new MetaEdGrammar.MetaEdGrammar(tokens);
        this._parserContext = parser.metaEd();

        this._symbolTable = new SymbolTable();
        this._metaEdContext = new MetaEdContext(metaEdFileIndex, this._symbolTable);
        this._warningMessageCollection = this._metaEdContext.WarningMessageCollection;
        this._errorMessageCollection = this._metaEdContext.ErrorMessageCollection;
        let builder = new SymbolTableBuilder(new NullSymbolTableBuilderListener());
        builder.withContext(this._metaEdContext);
        antlr4.tree.ParseTreeWalker.DEFAULT.walk(builder, this._parserContext);

        this.setupPostBuilder();
    }

    protected setupPostBuilder(): void {}
}