import antlr4 from 'antlr4/index';
import { List } from 'immutable';
import SymbolTable from '../../../src/core/validators/SymbolTable';
import SingleFileMetaEdFileIndex from '../../../src/core/tasks/SingleFileMetaEdFileIndex';
import SymbolTableBuilder from '../../../src/core/validators/SymbolTableBuilder';

import MetaEdGrammar from '../../../src/grammar/gen/MetaEdGrammar';
import BaseLexer from '../../../src/grammar/gen/BaseLexer';
import type { ValidationMessage } from '../../../src/core/validators/ValidationMessage';
import type { State } from '../../../src/core/State';

export default class SymbolTableTestHelper {
  state: State;

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
    this.state = {
      warningMessageCollection: new List(),
      errorMessageCollection: new List(),
      symbolTable: this.symbolTable,
      metaEdFileIndex,
    };

    listener.withState(this.state);
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, this.parserContext);
    this.state = listener.postBuildState();
  }

  warningMessageCollection(): Array<ValidationMessage> {
    return this.state.warningMessageCollection.toArray();
  }

  errorMessageCollection(): Array<ValidationMessage> {
    return this.state.errorMessageCollection.toArray();
  }
}
