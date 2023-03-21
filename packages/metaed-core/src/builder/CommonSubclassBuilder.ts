import type { BaseNameContext, CommonNameContext, CommonSubclassContext } from '../grammar/gen/MetaEdGrammar';
import { TopLevelEntityBuilder } from './TopLevelEntityBuilder';
import { newCommonSubclass } from '../model/CommonSubclass';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import { isErrorText } from './BuilderUtility';
import { sourceMapFrom } from '../model/SourceMap';

/**
 * An ANTLR4 listener that creates CommonSubclass entities.
 */
export class CommonSubclassBuilder extends TopLevelEntityBuilder {
  enterCommonSubclass = (context: CommonSubclassContext) => {
    this.enteringEntity(newCommonSubclass);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.sourceMap.type = sourceMapFrom(context);
    }
  };

  exitCommonSubclass = (_context: CommonSubclassContext) => {
    this.exitingEntity();
  };

  enterCommonName = (context: CommonNameContext) => {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.ID() == null || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  };

  enterBaseName = (context: BaseNameContext) => {
    this.enteringBaseName(context);
  };
}
