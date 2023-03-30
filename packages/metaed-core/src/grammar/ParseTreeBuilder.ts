import antlr4 from '@edfi/antlr4/index';
import { BaseLexer } from './gen/BaseLexer';
import { MetaEdGrammar } from './gen/MetaEdGrammar';
import { MetaEdErrorListener } from './MetaEdErrorListener';

export type ParseTreeBuilder = (metaEdErrorListener: MetaEdErrorListener, metaEdContents: string) => MetaEdGrammar;

function errorListeningParser(metaEdErrorListener: MetaEdErrorListener, metaEdContents: string): MetaEdGrammar {
  const lexer = new BaseLexer(new antlr4.InputStream(metaEdContents));
  const parser = new MetaEdGrammar(new antlr4.CommonTokenStream(lexer));
  lexer.removeErrorListeners();
  lexer.addErrorListener(metaEdErrorListener);
  parser.removeErrorListeners();
  parser.addErrorListener(metaEdErrorListener);
  return parser;
}

export function buildMetaEd(metaEdErrorListener: MetaEdErrorListener, metaEdContents: string): MetaEdGrammar {
  return errorListeningParser(metaEdErrorListener, metaEdContents).metaEd();
}

export function buildTopLevelEntity(metaEdErrorListener: MetaEdErrorListener, metaEdContents: string): MetaEdGrammar {
  return errorListeningParser(metaEdErrorListener, metaEdContents).topLevelEntity();
}
