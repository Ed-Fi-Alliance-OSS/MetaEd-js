import antlr4 from 'antlr4/index';
import SymbolTable from '../../../src/core/validators/SymbolTable';
import { createFileIndex } from '../../../src/core/tasks/FileIndex';
import { createMetaEdFile } from '../../../src/core/tasks/MetaEdFile';
import SymbolTableBuilder from '../../../src/core/validators/SymbolTableBuilder';

import MetaEdGrammar from '../../../src/grammar/gen/MetaEdGrammar';
import BaseLexer from '../../../src/grammar/gen/BaseLexer';
import type { ValidationMessage } from '../../../src/core/validators/ValidationTypes';
import { StateInstance } from '../../../src/core/State';
// eslint-disable-next-line no-duplicate-imports
import type { State } from '../../../src/core/State';

export default class SymbolTableTestHelper {
  state: State;
  symbolTable: ?SymbolTable;

  setup(metaEdText) {
    const fileIndex = createFileIndex([createMetaEdFile('DirectoryName', 'FileName', metaEdText)]);

    const listener = new SymbolTableBuilder();

    const antlrInputStream = new antlr4.InputStream(metaEdText);
    const lexer = new BaseLexer.BaseLexer(antlrInputStream);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new MetaEdGrammar.MetaEdGrammar(tokens);
    this.parserContext = parser.metaEd();
    this.state = new StateInstance({ fileIndex });

    listener.withState(this.state);
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, this.parserContext);
    this.state = listener.postBuildState();

    this.symbolTable = this.state.get('symbolTable');
  }

  warningMessages(): Array<ValidationMessage> {
    return this.state.get('warningMessages').toArray();
  }

  errorMessages(): Array<ValidationMessage> {
    return this.state.get('errorMessages').toArray();
  }
}
