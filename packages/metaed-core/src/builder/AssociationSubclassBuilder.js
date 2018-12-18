// @flow
import type { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
import { TopLevelEntityBuilder } from './TopLevelEntityBuilder';
import { newAssociationSubclass } from '../model/AssociationSubclass';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import { isErrorText } from './BuilderUtility';
import { sourceMapFrom } from '../model/SourceMap';

/**
 * An ANTLR4 listener that creates AssociationSubclass entities.
 */
export class AssociationSubclassBuilder extends TopLevelEntityBuilder {
  enterAssociationSubclass(context: MetaEdGrammar.AssociationSubclassContext) {
    this.enteringEntity(newAssociationSubclass);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.sourceMap.type = sourceMapFrom(context);
    }
  }

  // eslint-disable-next-line no-unused-vars
  exitAssociationSubclass(context: MetaEdGrammar.AssociationSubclassContext) {
    this.exitingEntity();
  }

  enterAssociationName(context: MetaEdGrammar.AssociationNameContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterBaseName(context: MetaEdGrammar.BaseNameContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;

    this.currentTopLevelEntity.baseEntityName = context.ID().getText();
    this.currentTopLevelEntity.sourceMap.baseEntityName = sourceMapFrom(context);
  }
}
