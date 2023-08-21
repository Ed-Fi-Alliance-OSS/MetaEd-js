import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { TopLevelEntityBuilder } from './TopLevelEntityBuilder';
import { newCommonSubclass } from '../model/CommonSubclass';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import { isErrorText } from './BuilderUtility';
import { sourceMapFrom } from '../model/SourceMap';

/**
 * An ANTLR4 listener that creates CommonSubclass entities.
 */
export class CommonSubclassBuilder extends TopLevelEntityBuilder {
  enterCommonSubclass(context: MetaEdGrammar.CommonSubclassContext) {
    this.enteringEntity(newCommonSubclass);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.sourceMap.type = sourceMapFrom(context);
    }
  }

  exitCommonSubclass(_context: MetaEdGrammar.CommonSubclassContext) {
    this.exitingEntity();
  }

  enterCommonName(context: MetaEdGrammar.CommonNameContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterBaseName(context: MetaEdGrammar.BaseNameContext) {
    this.enteringBaseName(context);
  }
}
