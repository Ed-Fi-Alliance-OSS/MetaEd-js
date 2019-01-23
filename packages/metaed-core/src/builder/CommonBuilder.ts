import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { TopLevelEntityBuilder } from './TopLevelEntityBuilder';
import { newCommon, newInlineCommon } from '../model/Common';
import { isErrorText } from './BuilderUtility';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import { sourceMapFrom } from '../model/SourceMap';

/**
 * An ANTLR4 listener that creates Common entities.
 */
export class CommonBuilder extends TopLevelEntityBuilder {
  enterCommon(context: MetaEdGrammar.CommonContext) {
    this.enteringEntity(newCommon);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.sourceMap.type = sourceMapFrom(context);
    }
  }

  // @ts-ignore
  exitCommon(context: MetaEdGrammar.CommonContext) {
    this.exitingEntity();
  }

  enterCommonName(context: MetaEdGrammar.CommonNameContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterInlineCommon(context: MetaEdGrammar.InlineCommonContext) {
    this.enteringEntity(newInlineCommon);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.sourceMap.type = sourceMapFrom(context);
    }
  }

  // @ts-ignore
  exitInlineCommon(context: MetaEdGrammar.InlineCommonContext) {
    this.exitingEntity();
  }

  enterInlineCommonName(context: MetaEdGrammar.InlineCommonNameContext) {
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  }
}
