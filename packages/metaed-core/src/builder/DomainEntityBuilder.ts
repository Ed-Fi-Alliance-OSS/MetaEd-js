// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdGrammar } from '../grammar/gen/MetaEdGrammar';
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
  enterAbstractEntity(context: MetaEdGrammar.AbstractEntityContext) {
    this.enteringEntity(newAbstractEntity);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      asDomainEntity(this.currentTopLevelEntity).isAbstract = true;
      Object.assign(this.currentTopLevelEntity.sourceMap as DomainEntitySourceMap, {
        type: sourceMapFrom(context),
        isAbstract: sourceMapFrom(context),
      });
    }
  }

  enterDomainEntity(context: MetaEdGrammar.DomainEntityContext) {
    this.enteringEntity(newDomainEntity);
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      Object.assign(this.currentTopLevelEntity.sourceMap, {
        type: sourceMapFrom(context),
      });
    }
  }

  exitAbstractEntity(_context: MetaEdGrammar.AbstractEntityContext) {
    this.exitingEntity();
  }

  exitDomainEntity(_context: MetaEdGrammar.DomainEntityContext) {
    this.exitingEntity();
  }

  enterAbstractEntityName(context: MetaEdGrammar.AbstractEntityNameContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterEntityName(context: MetaEdGrammar.EntityNameContext) {
    if (this.currentTopLevelEntity === NoTopLevelEntity) return;
    if (context.exception || context.ID() == null || context.ID().exception || isErrorText(context.ID().getText())) return;
    this.enteringName(context.ID().getText());
    this.currentTopLevelEntity.sourceMap.metaEdName = sourceMapFrom(context);
  }

  enterCascadeUpdate(context: MetaEdGrammar.CascadeUpdateContext) {
    if (this.currentTopLevelEntity !== NoTopLevelEntity) {
      this.currentTopLevelEntity.allowPrimaryKeyUpdates = true;
      this.currentTopLevelEntity.sourceMap.allowPrimaryKeyUpdates = sourceMapFrom(context);
    }
  }
}
