import antlr4 from 'antlr4';
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

export type RuleContextChain = {
  ruleContext: any,
  leafContext: any,
}

// mutating function that appends mock rule functions for the given path onto the given root, possibly ending with an exception
export function addRuleContextPath(ruleContextPath: string[], rootContext: any, endWithException: boolean = true): RuleContextChain {
  let currentContext = rootContext;

  ruleContextPath.forEach(pathElement => {
    const nextContext = {};
    currentContext[pathElement] = () => nextContext;
    currentContext = nextContext;
  });

  if (endWithException) currentContext.exception = true;
  return { ruleContext: rootContext, leafContext: currentContext };
}

// mutating function that appends an array to the rule context function chain
export function addArrayContext(arrayContextName: string, rootContext: any): RuleContextChain {
  const leafContext = {};
  // eslint-disable-next-line no-param-reassign
  rootContext[arrayContextName] = () => [leafContext];
  return { ruleContext: rootContext, leafContext };
}

// mutating function that appends a PropertyContext, which is special because all possible
// property methods exist, though only one ever returns not-null, which here is the propertyName specified
export function addPropertyContext(propertyName: string, rootContext: any): RuleContextChain {
  const propertyContextNames = [
    'associationProperty',
    'booleanProperty',
    'choiceProperty',
    'commonProperty',
    'currencyProperty',
    'dateProperty',
    'decimalProperty',
    'descriptorProperty',
    'domainEntityProperty',
    'durationProperty',
    'enumerationProperty',
    'inlineCommonProperty',
    'integerProperty',
    'percentProperty',
    'referenceProperty',
    'sharedDecimalProperty',
    'sharedIntegerProperty',
    'sharedShortProperty',
    'sharedStringProperty',
    'shortProperty',
    'stringProperty',
    'timeProperty',
    'yearProperty',
  ];

  propertyContextNames.forEach(propertyContextName => {
    // eslint-disable-next-line no-param-reassign
    rootContext[propertyContextName] = () => null;
  });

  const leafContext = {};
  // eslint-disable-next-line no-param-reassign
  rootContext[propertyName] = () => leafContext;
  return { ruleContext: rootContext, leafContext };
}

// mutating function that appends an array with a single PropertyContext of the specified name
export function addPropertyArrayContext(propertyName: string, rootContext: any): RuleContextChain {
  const { leafContext: propertyArrayContext } = addArrayContext('property', rootContext);
  const { leafContext: propertyContext } = addPropertyContext(propertyName, propertyArrayContext);
  return { ruleContext: rootContext, leafContext: propertyContext };
}
