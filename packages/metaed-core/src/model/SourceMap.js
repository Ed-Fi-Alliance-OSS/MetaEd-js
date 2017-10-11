// @flow
import type { ParserRuleContext } from 'antlr4/ParserRuleContext';

export type SourceMap = {
  line: number,
  column: number,
  tokenText: string,
}

export function newSourceMap(): SourceMap {
  return {
    line: 0,
    column: 0,
    tokenText: 'unknown',
  };
}

export const NoSourceMap: SourceMap = Object.assign(newSourceMap(), {
  tokenText: 'NoSourceMap',
});

export function sourceMapFrom(context: ParserRuleContext): SourceMap {
  if (context.exception || context.start == null) return NoSourceMap;
  return {
    line: context.start.line,
    column: context.start.column,
    tokenText: context.start.text == null ? '' : context.start.text,
  };
}
