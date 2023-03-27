import { CharStream, CommonTokenStream, ParserRuleContext } from 'antlr4';
import BaseLexer from './gen/BaseLexer';
import MetaEdGrammar from './gen/MetaEdGrammar';
import { MetaEdErrorListener } from './MetaEdErrorListener';

export type ParseTreeBuilder = (metaEdErrorListener: MetaEdErrorListener, metaEdContents: string) => ParserRuleContext;

function errorListeningParser(metaEdErrorListener: MetaEdErrorListener, metaEdContents: string): MetaEdGrammar {
  const lexer = new BaseLexer(new CharStream(metaEdContents));
  const parser = new MetaEdGrammar(new CommonTokenStream(lexer));
  lexer.removeErrorListeners();
  lexer.addErrorListener(metaEdErrorListener);
  parser.removeErrorListeners();
  parser.addErrorListener(metaEdErrorListener);
  return parser;
}

export function buildMetaEd(metaEdErrorListener: MetaEdErrorListener, metaEdContents: string): ParserRuleContext {
  return errorListeningParser(metaEdErrorListener, metaEdContents).metaEd();
}

export function buildTopLevelEntity(metaEdErrorListener: MetaEdErrorListener, metaEdContents: string): ParserRuleContext {
  return errorListeningParser(metaEdErrorListener, metaEdContents).topLevelEntity();
}
