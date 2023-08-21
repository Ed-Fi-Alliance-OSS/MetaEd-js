import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
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
  enterAssociation(context: MetaEdGrammar.AssociationContext) {
    this.enteringEntity(newAssociation);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.sourceMap.type = sourceMapFrom(context);
    }
  }

  exitAssociation(_context: MetaEdGrammar.AssociationContext) {
    this.exitingEntity();
  }

  enterAssociationName(context: MetaEdGrammar.AssociationNameContext) {
    if (
      this.currentTopLevelEntity === NoTopLevelEntity ||
      context.exception ||
      context.ID() == null ||
      context.ID().exception ||
      isErrorText(context.ID().getText())
    )
      return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterCascadeUpdate(context: MetaEdGrammar.CascadeUpdateContext) {
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.allowPrimaryKeyUpdates = true;
      this.currentTopLevelEntity.sourceMap.allowPrimaryKeyUpdates = sourceMapFrom(context);
    }
  }

  enterDefiningDomainEntity(context: MetaEdGrammar.DefiningDomainEntityContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception) return;
    this.currentProperty = { ...newDomainEntityProperty(), definesAssociation: true } as EntityProperty;
    this.currentProperty.sourceMap.type = sourceMapFrom(context);
    this.enteringIdentity(context);
  }

  exitDefiningDomainEntity(_context: MetaEdGrammar.DefiningDomainEntityContext) {
    this.exitingProperty();
  }
}
