import type {
  MaxLengthContext,
  MinLengthContext,
  SharedStringContext,
  SharedStringNameContext,
} from '../grammar/gen/MetaEdGrammar';
import { SharedSimpleBuilder } from './SharedSimpleBuilder';
import { newSharedString } from '../model/SharedString';
import { SharedString, SharedStringSourceMap } from '../model/SharedString';
import { sourceMapFrom } from '../model/SourceMap';
import { isErrorText } from './BuilderUtility';
import { NoSharedSimple } from '../model/SharedSimple';

/**
 * An ANTLR4 listener that creates SharedString entities.
 */
export class SharedStringBuilder extends SharedSimpleBuilder {
  enterSharedString = (context: SharedStringContext) => {
    this.enteringSharedSimple(newSharedString);
    if (this.currentSharedSimple !== NoSharedSimple) {
      Object.assign(this.currentSharedSimple.sourceMap as SharedStringSourceMap, {
        type: sourceMapFrom(context),
      });
    }
  };

  exitSharedString = (_context: SharedStringContext) => {
    this.exitingSharedSimple();
  };

  enterSharedStringName = (context: SharedStringNameContext) => {
    if (this.currentSharedSimple === NoSharedSimple) return;
    if (context.exception || context.ID() == null || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    (this.currentSharedSimple.sourceMap as SharedStringSourceMap).metaEdName = sourceMapFrom(context);
  };

  enterMaxLength = (context: MaxLengthContext) => {
    if (this.currentSharedSimple === NoSharedSimple) return;
    if (context.exception || context.UNSIGNED_INT() == null || isErrorText(context.UNSIGNED_INT().getText())) return;
    (this.currentSharedSimple as SharedString).maxLength = context.UNSIGNED_INT().getText();
    (this.currentSharedSimple.sourceMap as SharedStringSourceMap).maxLength = sourceMapFrom(context);
  };

  enterMinLength = (context: MinLengthContext) => {
    if (this.currentSharedSimple === NoSharedSimple) return;
    if (context.exception || context.UNSIGNED_INT() == null || isErrorText(context.UNSIGNED_INT().getText())) return;
    (this.currentSharedSimple as SharedString).minLength = context.UNSIGNED_INT().getText();
    (this.currentSharedSimple.sourceMap as SharedStringSourceMap).minLength = sourceMapFrom(context);
  };
}
