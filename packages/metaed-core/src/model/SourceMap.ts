import deepFreeze from 'deep-freeze';
import { ParserRuleContext } from '@edfi/antlr4/ParserRuleContext';

/**
 *
 */
export interface SourceMap {
  line: number;
  column: number;
  tokenText: string;
}

/**
 *
 */
export function newSourceMap(): SourceMap {
  return {
    line: 0,
    column: 0,
    tokenText: 'unknown',
  };
}

/**
 *
 */
export const NoSourceMap: SourceMap = deepFreeze({
  ...newSourceMap(),
  tokenText: 'NoSourceMap',
});

/**
 *
 */
export function sourceMapFrom(context: ParserRuleContext): SourceMap {
  if (context == null || context.start == null) return NoSourceMap;
  return {
    line: context.start.line == null ? 0 : context.start.line,
    column: context.start.column == null ? 0 : context.start.column,
    tokenText: context.start.text == null ? '' : context.start.text,
  };
}
