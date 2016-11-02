// @flow
import antlr4 from 'antlr4/index';
import BaseLexer from './gen/BaseLexer';
import MetaEdGrammar from './gen/MetaEdGrammar';

import MetaEdErrorListener from './MetaEdErrorListener';

export default class ParseTreeBuilder {
  _metaEdErrorListener: MetaEdErrorListener;

  constructor(metaEdErrorListener: MetaEdErrorListener) {
    this._metaEdErrorListener = metaEdErrorListener;
  }

  buildParseTree(metaEdContents: string) {
    try {
      return this._errorIgnoringParser(metaEdContents).metaEd();
    } catch (parseCanceledException) {
      return this._errorListeningParser(metaEdContents).metaEd();
    }
  }

  buildTopLevelEntity(metaEdContents: string) {
    try {
      return this._errorIgnoringParser(metaEdContents).topLevelEntity();
    } catch (parseCanceledException) {
      return this._errorListeningParser(metaEdContents).topLevelEntity();
    }
  }

  _errorListeningParser(metaEdContents: string) {
    const lexer = new BaseLexer.BaseLexer(new antlr4.InputStream(metaEdContents));
    const parser = new MetaEdGrammar.MetaEdGrammar(new antlr4.CommonTokenStream(lexer, undefined));
    lexer.addErrorListener(this._metaEdErrorListener);
    parser.removeErrorListeners();
    parser.addErrorListener(this._metaEdErrorListener);
    return parser;
  }

  _errorIgnoringParser(metaEdContents: string) {
    const lexer = new BaseLexer.BaseLexer(new antlr4.InputStream(metaEdContents));
    const parser = new MetaEdGrammar.MetaEdGrammar(new antlr4.CommonTokenStream(lexer, undefined));
    parser.Interpreter.PredictionMode = antlr4.atn.PredictionMode.SLL;
    parser.Interpreter.tail_call_preserves_sll = false;
    parser.ErrorHandler = new antlr4.error.ErrorStrategy();
    return parser;
  }
}
