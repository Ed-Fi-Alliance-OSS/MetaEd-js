// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { SharedSimpleBuilder } from './SharedSimpleBuilder';
import { newSharedDecimal } from '../model/SharedDecimal';
import { SharedDecimal, SharedDecimalSourceMap } from '../model/SharedDecimal';
import { sourceMapFrom } from '../model/SourceMap';
import { isErrorText } from './BuilderUtility';
import { NoSharedSimple } from '../model/SharedSimple';

/**
 * An ANTLR4 listener that creates SharedDecimal entities.
 */
export class SharedDecimalBuilder extends SharedSimpleBuilder {
  enterSharedDecimal(context: MetaEdGrammar.SharedDecimalContext) {
    this.enteringSharedSimple(newSharedDecimal);
    if (this.currentSharedSimple !== NoSharedSimple) {
      Object.assign((this.currentSharedSimple as SharedDecimal).sourceMap, {
        type: sourceMapFrom(context),
      });
    }
  }

  exitSharedDecimal(_context: MetaEdGrammar.SharedDecimalContext) {
    this.exitingSharedSimple();
  }

  enterSharedDecimalName(context: MetaEdGrammar.SharedDecimalNameContext) {
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    (this.currentSharedSimple as SharedDecimal).sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterDecimalPlaces(context: MetaEdGrammar.DecimalPlacesContext) {
    if (this.currentSharedSimple === NoSharedSimple) return;
    if (
      context.exception ||
      context.UNSIGNED_INT() == null ||
      context.UNSIGNED_INT().exception ||
      isErrorText(context.UNSIGNED_INT().getText())
    )
      return;
    (this.currentSharedSimple as SharedDecimal).decimalPlaces = context.UNSIGNED_INT().getText();
    (this.currentSharedSimple.sourceMap as SharedDecimalSourceMap).decimalPlaces = sourceMapFrom(context);
  }

  enterTotalDigits(context: MetaEdGrammar.TotalDigitsContext) {
    if (this.currentSharedSimple === NoSharedSimple) return;
    if (
      context.exception ||
      context.UNSIGNED_INT() == null ||
      context.UNSIGNED_INT().exception ||
      isErrorText(context.UNSIGNED_INT().getText())
    )
      return;
    (this.currentSharedSimple as SharedDecimal).totalDigits = context.UNSIGNED_INT().getText();
    (this.currentSharedSimple.sourceMap as SharedDecimalSourceMap).totalDigits = sourceMapFrom(context);
  }

  enterMinValueDecimal(context: MetaEdGrammar.MinValueDecimalContext) {
    if (this.currentSharedSimple === NoSharedSimple) return;
    if (
      context.exception ||
      context.decimalValue() == null ||
      context.decimalValue().exception ||
      isErrorText(context.decimalValue().getText())
    )
      return;
    (this.currentSharedSimple as SharedDecimal).minValue = context.decimalValue().getText();
    (this.currentSharedSimple.sourceMap as SharedDecimalSourceMap).minValue = sourceMapFrom(context);
  }

  enterMaxValueDecimal(context: MetaEdGrammar.MaxValueDecimalContext) {
    if (this.currentSharedSimple === NoSharedSimple) return;
    if (
      context.exception ||
      context.decimalValue() == null ||
      context.decimalValue().exception ||
      isErrorText(context.decimalValue().getText())
    )
      return;
    (this.currentSharedSimple as SharedDecimal).maxValue = context.decimalValue().getText();
    (this.currentSharedSimple.sourceMap as SharedDecimalSourceMap).maxValue = sourceMapFrom(context);
  }
}
