import type {
  MaxValueContext,
  MinValueContext,
  SharedIntegerContext,
  SharedIntegerNameContext,
  SharedShortContext,
  SharedShortNameContext,
} from '../grammar/gen/MetaEdGrammar';
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
  enterSharedInteger = (context: SharedIntegerContext) => {
    this.enteringSharedSimple(newSharedInteger);
    if (this.currentSharedSimple !== NoSharedSimple) {
      Object.assign(this.currentSharedSimple.sourceMap as SharedIntegerSourceMap, {
        type: sourceMapFrom(context),
      });
    }
  };

  enterSharedShort = (context: SharedShortContext) => {
    this.enteringSharedSimple(newSharedInteger);
    if (this.currentSharedSimple !== NoSharedSimple) {
      (this.currentSharedSimple as SharedInteger).isShort = true;
      Object.assign(this.currentSharedSimple.sourceMap as SharedIntegerSourceMap, {
        type: sourceMapFrom(context),
        isShort: sourceMapFrom(context),
      });
    }
  };

  exitSharedInteger = (_context: SharedIntegerContext) => {
    this.exitingSharedSimple();
  };

  exitSharedShort = (_context: SharedShortContext) => {
    this.exitingSharedSimple();
  };

  enterSharedIntegerName = (context: SharedIntegerNameContext) => {
    if (this.currentSharedSimple === NoSharedSimple) return;
    if (context.exception || context.ID() == null || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    (this.currentSharedSimple.sourceMap as SharedIntegerSourceMap).metaEdName = sourceMapFrom(context);
  };

  enterSharedShortName = (context: SharedShortNameContext) => {
    if (this.currentSharedSimple === NoSharedSimple) return;
    if (context.exception || context.ID() == null || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    (this.currentSharedSimple.sourceMap as SharedIntegerSourceMap).metaEdName = sourceMapFrom(context);
  };

  enterMinValue = (context: MinValueContext) => {
    if (this.currentSharedSimple === NoSharedSimple) return;
    if (
      context.exception ||
      context.signed_int() == null ||
      context.signed_int().exception ||
      isErrorText(context.signed_int().getText())
    )
      return;
    (this.currentSharedSimple as SharedInteger).minValue = context.signed_int().getText();
    (this.currentSharedSimple.sourceMap as SharedIntegerSourceMap).minValue = sourceMapFrom(context);
  };

  enterMaxValue = (context: MaxValueContext) => {
    if (this.currentSharedSimple === NoSharedSimple) return;
    if (
      context.exception ||
      context.signed_int() == null ||
      context.signed_int().exception ||
      isErrorText(context.signed_int().getText())
    )
      return;
    (this.currentSharedSimple as SharedInteger).maxValue = context.signed_int().getText();
    (this.currentSharedSimple.sourceMap as SharedIntegerSourceMap).maxValue = sourceMapFrom(context);
  };
}
