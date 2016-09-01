import ValidationMessage from '../../../src/common/ValidationMessage'
import SymbolTable from '../../../src/core/validators/SymbolTable'
import { MetaEdContext } from '../../../src/core/tasks/MetaEdContext'
import SingleFileMetaEdFileIndex from '../../../src/core/tasks/SingleFileMetaEdFileIndex'
import { SymbolTableBuilder } from  '../../../src/core/validators/SymbolTableBuilder'
import NullSymbolTableBuilderListener from '../../common/NullSymbolTableBuilderListener'

let antlr4 = require('antlr4/index');
let MetaEdGrammar = require('../../../src/grammar/gen/MetaEdGrammar');
let BaseLexer = require('../../../src/grammar/gen/BaseLexer');

export default class SymbolTableTestHelper {
    public warningMessageCollection: ValidationMessage[];
    public errorMessageCollection: ValidationMessage[];
    public metaEdContext: MetaEdContext;
    public parserContext: any;
    public symbolTable: SymbolTable;

    public setup(metaEdText: string): void {
        console.log(metaEdText);
        let metaEdFileIndex = new SingleFileMetaEdFileIndex();
        metaEdFileIndex.addContents(metaEdText);

        this.symbolTable = new SymbolTable();
        let listener = new SymbolTableBuilder(new NullSymbolTableBuilderListener());

        let antlrInputStream = new antlr4.InputStream(metaEdText);
        let lexer = new BaseLexer.BaseLexer(antlrInputStream);
        let tokens = new antlr4.CommonTokenStream(lexer);
        let parser = new MetaEdGrammar.MetaEdGrammar(tokens);
        this.parserContext = parser.metaEd();
        this.metaEdContext = new MetaEdContext(metaEdFileIndex, this.symbolTable);

        this.warningMessageCollection = this.metaEdContext.warningMessageCollection;
        this.errorMessageCollection = this.metaEdContext.errorMessageCollection;
        listener.withContext(this.metaEdContext);
        antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, this.parserContext);
    }
}
