import antlr4 from 'antlr4';
import SymbolTable from '../../../src/core/validators/SymbolTable';

import SingleFileMetaEdFileIndex from '../../../src/core/tasks/SingleFileMetaEdFileIndex';
import SymbolTableBuilder from '../../../src/core/validators/SymbolTableBuilder';
import { MetaEdGrammar } from '../../../src/grammar/gen/MetaEdGrammar';
import BaseLexer from '../../../src/grammar/gen/BaseLexer';
import { StateRecordInstance } from '../../../src/core/State';
// eslint-disable-next-line no-duplicate-imports
import type { State } from '../../../src/core/State';
import type { ValidationMessage } from '../../../src/core/validators/ValidationMessage';

export default class ValidatorTestHelper {
  state: State;

  // eslint-disable-next-line no-unused-vars
  setup(metaEdText: string, validatorListener: any, symbolTable: SymbolTable = new SymbolTable()): void {
    console.log(metaEdText);
    const metaEdFileIndex = new SingleFileMetaEdFileIndex();
    metaEdFileIndex.addContents(metaEdText);

    const antlrInputStream = new antlr4.InputStream(metaEdText);
    const lexer = new BaseLexer.BaseLexer(antlrInputStream);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new MetaEdGrammar(tokens);
    const parserContext = parser.metaEd();

    this.state = new StateRecordInstance({ metaEdFileIndex });

    const symbolTableBuilder = new SymbolTableBuilder();
    symbolTableBuilder.withState(this.state);
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(symbolTableBuilder, parserContext);
    this.state = symbolTableBuilder.postBuildState();

    validatorListener.withState(this.state);
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(validatorListener, parserContext);
    this.state = validatorListener.postValidationState();
  }

  warningMessageCollection(): Array<ValidationMessage> {
    return this.state.get('warningMessageCollection').toArray();
  }

  errorMessageCollection(): Array<ValidationMessage> {
    return this.state.get('errorMessageCollection').toArray();
  }
}
