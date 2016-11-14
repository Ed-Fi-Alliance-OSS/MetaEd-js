// @flow
import antlr4 from 'antlr4';
import { List } from 'immutable';
import SymbolTable from '../../../src/core/validators/SymbolTable';
import type { State } from '../../../src/core/State';
import SingleFileMetaEdFileIndex from '../../../src/core/tasks/SingleFileMetaEdFileIndex';
import SymbolTableBuilder from '../../../src/core/validators/SymbolTableBuilder';
import { MetaEdGrammar } from '../../../src/grammar/gen/MetaEdGrammar';
import BaseLexer from '../../../src/grammar/gen/BaseLexer';
import type { ValidationMessage } from '../../../src/core/validators/ValidationMessage';

export default class ValidatorTestHelper {
  state: State;

  setup(metaEdText: string, validatorListener: any, symbolTable: SymbolTable = new SymbolTable()): void {
    console.log(metaEdText);
    const metaEdFileIndex = new SingleFileMetaEdFileIndex();
    metaEdFileIndex.addContents(metaEdText);

    const antlrInputStream = new antlr4.InputStream(metaEdText);
    const lexer = new BaseLexer.BaseLexer(antlrInputStream);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new MetaEdGrammar(tokens);
    const parserContext = parser.metaEd();

    this.state = {
      warningMessageCollection: new List(),
      errorMessageCollection: new List(),
      symbolTable,
      metaEdFileIndex,
    };

    const symbolTableBuilder = new SymbolTableBuilder();
    symbolTableBuilder.withState(this.state);
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(symbolTableBuilder, parserContext);
    this.state = symbolTableBuilder.postBuildState();

    validatorListener.withState(this.state);
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(validatorListener, parserContext);
    this.state = validatorListener.postValidationState();
  }

  warningMessageCollection(): Array<ValidationMessage> {
    return this.state.warningMessageCollection.toArray();
  }

  errorMessageCollection(): Array<ValidationMessage> {
    return this.state.errorMessageCollection.toArray();
  }
}
