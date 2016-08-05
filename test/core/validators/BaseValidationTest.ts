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

export abstract class BaseValidationTest {
    protected symbolTable: SymbolTable;
    protected warningMessageCollection: List<ValidationMessage>;
    protected errorMessageCollection: List<ValidationMessage>;
    protected parserContext: ParserRuleContext;
    protected metaEdContext: IMetaEdContext;

    protected abstract metaEdText(): string

    public setup(): void {
        let metaEdText = this.metaEdText();
        console.log(metaEdText);
        let metaEdFileIndex = new SingleFileMetaEdFileIndex();
        metaEdFileIndex.addContents(metaEdText);
        let antlrInputStream = new antlr4.InputStream(metaEdText);//InputStream(metaEdText);
        let lexer = new BaseLexer.BaseLexer(antlrInputStream);
        let tokens = new antlr4.CommonTokenStream(lexer);
        let parser = new MetaEdGrammar.MetaEdGrammar(tokens);
        this.parserContext = parser.metaEd();
        //if (this.parserContext.hasErrors())
        this.symbolTable = new SymbolTable();
        this.metaEdContext = new MetaEdContext(metaEdFileIndex, this.symbolTable);
        this.warningMessageCollection = this.metaEdContext.WarningMessageCollection;
        this.errorMessageCollection = this.metaEdContext.ErrorMessageCollection;
        let builder = new SymbolTableBuilder(new NullSymbolTableBuilderListener());
        builder.withContext(this.metaEdContext);
        antlr4.tree.ParseTreeWalker.DEFAULT.walk(builder, this.parserContext);
    }

    protected setupPostBuilder(): void {
    }
}