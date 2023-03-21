import type {
  AssociationContext,
  AssociationNameContext,
  CascadeUpdateContext,
  DefiningDomainEntityContext,
} from '../grammar/gen/MetaEdGrammar';
import { TopLevelEntityBuilder } from './TopLevelEntityBuilder';
import { newDomainEntityProperty } from '../model/property/DomainEntityProperty';
import { newAssociation } from '../model/Association';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import { isErrorText } from './BuilderUtility';
import { sourceMapFrom } from '../model/SourceMap';
import { EntityProperty } from '../model/property/EntityProperty';

/**
 * An ANTLR4 listener that creates Association entities.
 */
export class AssociationBuilder extends TopLevelEntityBuilder {
  enterAssociation = (context: AssociationContext) => {
    this.enteringEntity(newAssociation);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.sourceMap.type = sourceMapFrom(context);
    }
  };

  exitAssociation = (_context: AssociationContext) => {
    this.exitingEntity();
  };

  enterAssociationName = (context: AssociationNameContext) => {
    if (
      this.currentTopLevelEntity === NoTopLevelEntity ||
      context.exception ||
      context.ID() == null ||
      isErrorText(context.ID().getText())
    )
      return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  };

  enterCascadeUpdate = (context: CascadeUpdateContext) => {
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.allowPrimaryKeyUpdates = true;
      this.currentTopLevelEntity.sourceMap.allowPrimaryKeyUpdates = sourceMapFrom(context);
    }
  };

  enterDefiningDomainEntity = (context: DefiningDomainEntityContext) => {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = { ...newDomainEntityProperty(), definesAssociation: true } as EntityProperty;
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
    this.enteringIdentity(context);
  };

  exitDefiningDomainEntity = (_context: DefiningDomainEntityContext) => {
    this.exitingProperty();
  };
}
