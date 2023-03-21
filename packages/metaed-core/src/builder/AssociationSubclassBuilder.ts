import type { AssociationNameContext, AssociationSubclassContext, BaseNameContext } from '../grammar/gen/MetaEdGrammar';
import { TopLevelEntityBuilder } from './TopLevelEntityBuilder';
import { newAssociationSubclass } from '../model/AssociationSubclass';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import { isErrorText } from './BuilderUtility';
import { sourceMapFrom } from '../model/SourceMap';

/**
 * An ANTLR4 listener that creates AssociationSubclass entities.
 */
export class AssociationSubclassBuilder extends TopLevelEntityBuilder {
  enterAssociationSubclass = (context: AssociationSubclassContext) => {
    this.enteringEntity(newAssociationSubclass);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.sourceMap.type = sourceMapFrom(context);
    }
  };

  exitAssociationSubclass = (_context: AssociationSubclassContext) => {
    this.exitingEntity();
  };

  enterAssociationName = (context: AssociationNameContext) => {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.ID() == null || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  };

  enterBaseName = (context: BaseNameContext) => {
    this.enteringBaseName(context);
  };
}
