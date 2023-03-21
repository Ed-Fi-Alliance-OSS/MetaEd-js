import type {
  AbstractEntityContext,
  AbstractEntityNameContext,
  CascadeUpdateContext,
  DomainEntityContext,
  EntityNameContext,
} from '../grammar/gen/MetaEdGrammar';
import { TopLevelEntityBuilder } from './TopLevelEntityBuilder';
import { newDomainEntity, newAbstractEntity, asDomainEntity } from '../model/DomainEntity';
import { DomainEntitySourceMap } from '../model/DomainEntity';
import { sourceMapFrom } from '../model/SourceMap';
import { NoTopLevelEntity } from '../model/TopLevelEntity';
import { isErrorText } from './BuilderUtility';

/**
 * An ANTLR4 listener that creates DomainEntity entities.
 */
export class DomainEntityBuilder extends TopLevelEntityBuilder {
  enterAbstractEntity = (context: AbstractEntityContext) => {
    this.enteringEntity(newAbstractEntity);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      asDomainEntity(this.currentTopLevelEntity).isAbstract = true;
      Object.assign(this.currentTopLevelEntity.sourceMap as DomainEntitySourceMap, {
        type: sourceMapFrom(context),
        isAbstract: sourceMapFrom(context),
      });
    }
  };

  enterDomainEntity = (context: DomainEntityContext) => {
    this.enteringEntity(newDomainEntity);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      Object.assign(this.currentTopLevelEntity.sourceMap, {
        type: sourceMapFrom(context),
      });
    }
  };

  exitAbstractEntity = (_context: AbstractEntityContext) => {
    this.exitingEntity();
  };

  exitDomainEntity = (_context: DomainEntityContext) => {
    this.exitingEntity();
  };

  enterAbstractEntityName = (context: AbstractEntityNameContext) => {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.ID() == null || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  };

  enterEntityName = (context: EntityNameContext) => {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.ID() == null || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  };

  enterCascadeUpdate = (context: CascadeUpdateContext) => {
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.allowPrimaryKeyUpdates = true;
      this.currentTopLevelEntity.sourceMap.allowPrimaryKeyUpdates = sourceMapFrom(context);
    }
  };
}
