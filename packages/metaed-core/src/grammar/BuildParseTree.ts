// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import { ValidationFailure } from '../validator/ValidationFailure';
import { MetaEdErrorListener } from './MetaEdErrorListener';
import { State } from '../State';
import { getAllContents, getFilenameAndLineNumber } from '../file/FileIndex';
import { ParseTreeBuilder } from './ParseTreeBuilder';
import { Logger } from '../Logger';

export const buildParseTree = R.curry((parseTreeBuilder: ParseTreeBuilder, state: State): void => {
  const validationFailures: ValidationFailure[] = [];

  const errorListener = new MetaEdErrorListener(validationFailures, 'BuildParseTree - MetaEdErrorListener');
  const parseTree = parseTreeBuilder(errorListener, getAllContents(state.fileIndex));

  if (parseTree == null) {
    Logger.error('BuildParseTree: parse tree builder returned null for state metaEdFileIndex contents');
  }

  validationFailures.forEach((failure) => {
    if (failure.sourceMap && state.fileIndex) {
      failure.fileMap = getFilenameAndLineNumber(state.fileIndex, failure.sourceMap.line);
    }
  });

  //    state.validationFailure.push(...validationFailures);

  // eslint-disable-next-line no-param-reassign
  state.parseTree = parseTree;
});
