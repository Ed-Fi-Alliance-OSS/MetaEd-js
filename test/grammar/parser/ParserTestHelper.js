import antlr4 from 'antlr4';
import { Trees } from 'antlr4/tree/Trees';
import BaseLexer from './../../../src/grammar/gen/BaseLexer';
import MetaEdGrammar from './../../../src/grammar/gen/MetaEdGrammar';

export default class ParserTestHelper {
  static parse(inputText: string) {
    const inputStream = new antlr4.InputStream(inputText);
    const lexer = new BaseLexer.BaseLexer(inputStream);
    const tokens = new antlr4.CommonTokenStream(lexer, undefined);
    const parser = new MetaEdGrammar.MetaEdGrammar(tokens);
    return parser;
  }

  static hasErrors(ruleContext) {
    if (ruleContext.exception != null) return true;
    if (ruleContext.children == null) return false;

    // eslint-disable-next-line no-restricted-syntax
    for (const childContext of ruleContext.children) {
      if (this._isErrorNode(childContext)) return true;
      if (this.hasErrors(childContext)) return true;
    }
    return false;
  }

  static _isErrorNode(ruleContext) {
    return ruleContext.isErrorNode !== undefined && ruleContext.isErrorNode();
  }

  static toStringTree(ruleContext, parser): string {
    return Trees.toStringTree(ruleContext, parser.ruleNames, parser.getTokenTypeMap);
  }
}
