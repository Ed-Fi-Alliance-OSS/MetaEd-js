// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
