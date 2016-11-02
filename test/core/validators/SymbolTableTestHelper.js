import antlr4 from 'antlr4/index';
import SymbolTable from '../../../src/core/validators/SymbolTable';
import { MetaEdContext } from '../../../src/core/tasks/MetaEdContext';
import SingleFileMetaEdFileIndex from '../../../src/core/tasks/SingleFileMetaEdFileIndex';
import SymbolTableBuilder from '../../../src/core/validators/SymbolTableBuilder';

import MetaEdGrammar from '../../../src/grammar/gen/MetaEdGrammar';
import BaseLexer from '../../../src/grammar/gen/BaseLexer';

export default class SymbolTableTestHelper {
  setup(metaEdText) {
    console.log(metaEdText);
    const metaEdFileIndex = new SingleFileMetaEdFileIndex();
    metaEdFileIndex.addContents(metaEdText);

    this.symbolTable = new SymbolTable();
    const listener = new SymbolTableBuilder();

    const antlrInputStream = new antlr4.InputStream(metaEdText);
    const lexer = new BaseLexer.BaseLexer(antlrInputStream);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new MetaEdGrammar.MetaEdGrammar(tokens);
    this.parserContext = parser.metaEd();
    this.metaEdContext = new MetaEdContext(metaEdFileIndex, this.symbolTable);

    this.warningMessageCollection = this.metaEdContext.warningMessageCollection;
    this.errorMessageCollection = this.metaEdContext.errorMessageCollection;
    listener.withContext(this.metaEdContext);
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, this.parserContext);
  }
}
