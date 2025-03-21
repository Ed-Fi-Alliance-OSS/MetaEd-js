// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
