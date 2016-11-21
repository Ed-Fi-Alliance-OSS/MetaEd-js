// @flow
import antlr4 from 'antlr4/index';
import { BaseLexer } from './gen/BaseLexer';
import { MetaEdGrammar } from './gen/MetaEdGrammar';
import MetaEdErrorListener from './MetaEdErrorListener';

function errorListeningParser(metaEdErrorListener: MetaEdErrorListener, metaEdContents: string): MetaEdGrammar {
  const lexer = new BaseLexer(new antlr4.InputStream(metaEdContents));
  const parser = new MetaEdGrammar(new antlr4.CommonTokenStream(lexer, undefined));
  lexer.addErrorListener(metaEdErrorListener);
  parser.removeErrorListeners();
  parser.addErrorListener(metaEdErrorListener);
  return parser;
}

function errorIgnoringParser(metaEdErrorListener: MetaEdErrorListener, metaEdContents: string): MetaEdGrammar {
  const lexer = new BaseLexer(new antlr4.InputStream(metaEdContents));
  const parser = new MetaEdGrammar(new antlr4.CommonTokenStream(lexer, undefined));
  parser.Interpreter.PredictionMode = antlr4.atn.PredictionMode.SLL;
  parser.Interpreter.tail_call_preserves_sll = false;
  parser.ErrorHandler = new antlr4.error.ErrorStrategy();
  return parser;
}

export function buildMetaEd(metaEdErrorListener: MetaEdErrorListener, metaEdContents: string): MetaEdGrammar {
  try {
    return errorIgnoringParser(metaEdErrorListener, metaEdContents).metaEd();
  } catch (parseCanceledException) {
    return errorListeningParser(metaEdErrorListener, metaEdContents).metaEd();
  }
}

export function buildTopLevelEntity(metaEdErrorListener: MetaEdErrorListener, metaEdContents: string): MetaEdGrammar {
  try {
    return errorIgnoringParser(metaEdErrorListener, metaEdContents).topLevelEntity();
  } catch (parseCanceledException) {
    return errorListeningParser(metaEdErrorListener, metaEdContents).topLevelEntity();
  }
}
