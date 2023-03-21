import type {
  DecimalPlacesContext,
  MaxValueDecimalContext,
  MinValueDecimalContext,
  SharedDecimalContext,
  SharedDecimalNameContext,
  TotalDigitsContext,
} from '../grammar/gen/MetaEdGrammar';
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
  enterSharedDecimal = (context: SharedDecimalContext) => {
    this.enteringSharedSimple(newSharedDecimal);
    if (this.currentSharedSimple !== NoSharedSimple) {
      Object.assign((this.currentSharedSimple as SharedDecimal).sourceMap, {
        type: sourceMapFrom(context),
      });
    }
  };

  exitSharedDecimal = (_context: SharedDecimalContext) => {
    this.exitingSharedSimple();
  };

  enterSharedDecimalName = (context: SharedDecimalNameContext) => {
    if (context.exception || context.ID() == null || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    (this.currentSharedSimple as SharedDecimal).sourceMap.metaEdName = sourceMapFrom(context);
  };

  enterDecimalPlaces = (context: DecimalPlacesContext) => {
    if (this.currentSharedSimple === NoSharedSimple) return;
    if (context.exception || context.UNSIGNED_INT() == null || isErrorText(context.UNSIGNED_INT().getText())) return;
    (this.currentSharedSimple as SharedDecimal).decimalPlaces = context.UNSIGNED_INT().getText();
    (this.currentSharedSimple.sourceMap as SharedDecimalSourceMap).decimalPlaces = sourceMapFrom(context);
  };

  enterTotalDigits = (context: TotalDigitsContext) => {
    if (this.currentSharedSimple === NoSharedSimple) return;
    if (context.exception || context.UNSIGNED_INT() == null || isErrorText(context.UNSIGNED_INT().getText())) return;
    (this.currentSharedSimple as SharedDecimal).totalDigits = context.UNSIGNED_INT().getText();
    (this.currentSharedSimple.sourceMap as SharedDecimalSourceMap).totalDigits = sourceMapFrom(context);
  };

  enterMinValueDecimal = (context: MinValueDecimalContext) => {
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
  };

  enterMaxValueDecimal = (context: MaxValueDecimalContext) => {
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
  };
}
