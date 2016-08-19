import List from 'typescript-dotnet-commonjs/System/Collections/List'
import ValidationMessage from '../../../src/common/ValidationMessage'
import { SymbolTable } from '../../../src/core/validators/SymbolTable'
import { MetaEdContext } from '../../../src/core/tasks/MetaEdContext'
import SingleFileMetaEdFileIndex from '../../../src/core/tasks/SingleFileMetaEdFileIndex'
import { SymbolTableBuilder } from  '../../../src/core/validators/SymbolTableBuilder'
import NullSymbolTableBuilderListener from '../../common/NullSymbolTableBuilderListener'

let antlr4 = require('antlr4/index');
let MetaEdGrammar = require('../../../src/grammar/gen/MetaEdGrammar');
let BaseLexer = require('../../../src/grammar/gen/BaseLexer');

export class ValidationTestHelper {
    public symbolTable: SymbolTable;
    public warningMessageCollection: List<ValidationMessage>;
    public errorMessageCollection: List<ValidationMessage>;

    public setup(metaEdText: string): void {
        console.log(metaEdText);
        let metaEdFileIndex = new SingleFileMetaEdFileIndex();
        metaEdFileIndex.addContents(metaEdText);

        this.symbolTable = new SymbolTable();

        let antlrInputStream = new antlr4.InputStream(metaEdText);
        let lexer = new BaseLexer.BaseLexer(antlrInputStream);
        let tokens = new antlr4.CommonTokenStream(lexer);
        let parser = new MetaEdGrammar.MetaEdGrammar(tokens);
        let parserContext = parser.metaEd();
        let metaEdContext: MetaEdContext = new MetaEdContext(metaEdFileIndex, this.symbolTable);

        this.warningMessageCollection = metaEdContext.warningMessageCollection;
        this.errorMessageCollection = metaEdContext.errorMessageCollection;
        let builder = new SymbolTableBuilder(new NullSymbolTableBuilderListener());
        builder.withContext(metaEdContext);
        antlr4.tree.ParseTreeWalker.DEFAULT.walk(builder, parserContext);
    }
}