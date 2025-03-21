// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { SharedSimpleBuilder } from './SharedSimpleBuilder';
import { newSharedInteger } from '../model/SharedInteger';
import { SharedInteger, SharedIntegerSourceMap } from '../model/SharedInteger';
import { sourceMapFrom } from '../model/SourceMap';
import { isErrorText } from './BuilderUtility';
import { NoSharedSimple } from '../model/SharedSimple';

/**
 * An ANTLR4 listener that creates SharedInteger entities.
 */
export class SharedIntegerBuilder extends SharedSimpleBuilder {
  enterSharedInteger(context: MetaEdGrammar.SharedIntegerContext) {
    this.enteringSharedSimple(newSharedInteger);
    if (this.currentSharedSimple !== NoSharedSimple) {
      Object.assign(this.currentSharedSimple.sourceMap as SharedIntegerSourceMap, {
        type: sourceMapFrom(context),
      });
    }
  }

  enterSharedShort(context: MetaEdGrammar.SharedShortContext) {
    this.enteringSharedSimple(newSharedInteger);
    if (this.currentSharedSimple !== NoSharedSimple) {
      (this.currentSharedSimple as SharedInteger).isShort = true;
      Object.assign(this.currentSharedSimple.sourceMap as SharedIntegerSourceMap, {
        type: sourceMapFrom(context),
        isShort: sourceMapFrom(context),
      });
    }
  }

  exitSharedInteger(_context: MetaEdGrammar.SharedIntegerContext) {
    this.exitingSharedSimple();
  }

  exitSharedShort(_context: MetaEdGrammar.SharedShortContext) {
    this.exitingSharedSimple();
  }

  enterSharedIntegerName(context: MetaEdGrammar.SharedIntegerNameContext) {
    if (this.currentSharedSimple === NoSharedSimple) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    (this.currentSharedSimple.sourceMap as SharedIntegerSourceMap).metaEdName = sourceMapFrom(context);
  }

  enterSharedShortName(context: MetaEdGrammar.SharedShortNameContext) {
    if (this.currentSharedSimple === NoSharedSimple) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    (this.currentSharedSimple.sourceMap as SharedIntegerSourceMap).metaEdName = sourceMapFrom(context);
  }

  enterMinValue(context: MetaEdGrammar.MinValueContext) {
    if (this.currentSharedSimple === NoSharedSimple) return;

    if (context.exception) return;
    if (context.signed_int() == null && context.BIG() == null) return;
    if (context.signed_int() == null && (context.BIG().exception || isErrorText(context.BIG().getText()))) return;
    if (context.BIG() == null && (context.signed_int().exception || isErrorText(context.signed_int().getText()))) return;

    if (context.signed_int() != null) (this.currentSharedSimple as SharedInteger).minValue = context.signed_int().getText();
    if (context.BIG() != null) (this.currentSharedSimple as SharedInteger).hasBigHint = true;

    (this.currentSharedSimple.sourceMap as SharedIntegerSourceMap).minValue = sourceMapFrom(context);
  }

  enterMaxValue(context: MetaEdGrammar.MaxValueContext) {
    if (this.currentSharedSimple === NoSharedSimple) return;

    if (context.exception) return;
    if (context.signed_int() == null && context.BIG() == null) return;
    if (context.signed_int() == null && (context.BIG().exception || isErrorText(context.BIG().getText()))) return;
    if (context.BIG() == null && (context.signed_int().exception || isErrorText(context.signed_int().getText()))) return;

    if (context.signed_int() != null) (this.currentSharedSimple as SharedInteger).maxValue = context.signed_int().getText();
    if (context.BIG() != null) (this.currentSharedSimple as SharedInteger).hasBigHint = true;

    (this.currentSharedSimple.sourceMap as SharedIntegerSourceMap).maxValue = sourceMapFrom(context);
  }
}
