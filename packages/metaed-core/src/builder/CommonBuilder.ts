import type {
  CommonContext,
  CommonNameContext,
  InlineCommonContext,
  InlineCommonNameContext,
} from '../grammar/gen/MetaEdGrammar';
import { TopLevelEntityBuilder } from './TopLevelEntityBuilder';
import { newCommon, newInlineCommon } from '../model/Common';
import { isErrorText } from './BuilderUtility';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import { sourceMapFrom } from '../model/SourceMap';

/**
 * An ANTLR4 listener that creates Common entities.
 */
export class CommonBuilder extends TopLevelEntityBuilder {
  enterCommon = (context: CommonContext) => {
    this.enteringEntity(newCommon);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.sourceMap.type = sourceMapFrom(context);
    }
  };

  exitCommon = (_context: CommonContext) => {
    this.exitingEntity();
  };

  enterCommonName = (context: CommonNameContext) => {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.ID() == null || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  };

  enterInlineCommon = (context: InlineCommonContext) => {
    this.enteringEntity(newInlineCommon);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.sourceMap.type = sourceMapFrom(context);
    }
  };

  exitInlineCommon = (_context: InlineCommonContext) => {
    this.exitingEntity();
  };

  enterInlineCommonName = (context: InlineCommonNameContext) => {
    if (context.exception || context.ID() == null || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  };
}
