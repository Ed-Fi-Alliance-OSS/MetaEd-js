import antlr4 from 'antlr4';
import R from 'ramda';
import SymbolTable from '../../../src/core/validators/SymbolTable';

import SymbolTableBuilder from '../../../src/core/validators/SymbolTableBuilder';
import { MetaEdGrammar } from '../../../src/grammar/gen/MetaEdGrammar';
import BaseLexer from '../../../src/grammar/gen/BaseLexer';
import { StateInstance } from '../../../src/core/State';
// eslint-disable-next-line no-duplicate-imports
import type { State } from '../../../src/core/State';
import type { ValidationMessage } from '../../../src/core/validators/ValidationTypes';
import { createFileIndex } from '../../../src/core/tasks/FileIndex';
import { createMetaEdFile } from '../../../src/core/tasks/MetaEdFile';

export default class ValidatorTestHelper {
  state: State;

  // eslint-disable-next-line no-unused-vars
  setup(metaEdText: string, validatorListener: any, symbolTable: SymbolTable = new SymbolTable()): void {
    console.log(metaEdText);
    const fileIndex = createFileIndex([createMetaEdFile('DirectoryName', 'FileName', metaEdText)]);

    const antlrInputStream = new antlr4.InputStream(metaEdText);
    const lexer = new BaseLexer.BaseLexer(antlrInputStream);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new MetaEdGrammar(tokens);
    const parserContext = parser.metaEd();

    this.state = new StateInstance({ fileIndex });

    const symbolTableBuilder = new SymbolTableBuilder();
    symbolTableBuilder.withState(this.state);
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(symbolTableBuilder, parserContext);
    this.state = symbolTableBuilder.postBuildState();

    validatorListener.withState(this.state);
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(validatorListener, parserContext);
    this.state = validatorListener.postValidationState();
  }

  warningMessages(): Array<ValidationMessage> {
    return this.state.get('warningMessages').toArray();
  }

  errorMessages(): Array<ValidationMessage> {
    return this.state.get('errorMessages').toArray();
  }
}

// mutating function that appends mock rule functions for the given path onto the given root, possibly ending with an exception
export function addRuleContextPath(ruleContextPath: string[], rootContext: any, endWithException: boolean = true): any {
  let currentContext = rootContext;

  ruleContextPath.forEach(pathElement => {
    const nextContext = {};
    currentContext[pathElement] = () => nextContext;
    currentContext = nextContext;
  });

  if (endWithException) currentContext.exception = true;
  return rootContext;
}
