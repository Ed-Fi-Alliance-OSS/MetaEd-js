// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getAllEntitiesOfType, newReferentialProperty, NoTopLevelEntity } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, PropertyType, ReferentialProperty, TopLevelEntity } from '@edfi/metaed-core';
import { addEntityPropertyEdfiOdsTo } from '../model/property/EntityProperty';

const enhancerName = 'TopLevelEntityBaseReferenceEnhancer';

export function propertyTypeFor(entity: TopLevelEntity): PropertyType {
  switch (entity.type) {
    case 'association':
    case 'associationExtension':
    case 'associationSubclass':
      return 'association';
    case 'domainEntity':
    case 'domainEntityExtension':
    case 'domainEntitySubclass':
      return 'domainEntity';
    default:
      return 'unknown';
  }
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(
    metaEd,
    'associationExtension',
    'associationSubclass',
    'domainEntityExtension',
    'domainEntitySubclass',
  )
    .map((x) => x as TopLevelEntity)
    .forEach((entity: TopLevelEntity) => {
      if (entity.data.edfiOdsRelational.odsProperties.some((x) => x.isIdentityRename)) return;

      const referenceToBase: ReferentialProperty = {
        ...newReferentialProperty(),
        metaEdName: entity.baseEntity ? entity.baseEntity.metaEdName : '',
        documentation: entity.baseEntity ? entity.baseEntity.documentation : '',
        type: entity.baseEntity ? propertyTypeFor(entity.baseEntity) : 'unknown',
        isPartOfIdentity: true,
        parentEntity: entity,
        referencedEntity: entity.baseEntity ? entity.baseEntity : NoTopLevelEntity,
        namespace: entity.namespace,
        data: {
          edfiOdsRelational: {
            odsDeleteCascadePrimaryKey: true,
            odsCausesCyclicUpdateCascade: false,
            odsIsReferenceToSuperclass: entity.type === 'associationSubclass' || entity.type === 'domainEntitySubclass',
            odsIsReferenceToExtensionParent:
              entity.type === 'associationExtension' || entity.type === 'domainEntityExtension',
          },
        },
      };
      addEntityPropertyEdfiOdsTo(referenceToBase);
      entity.data.edfiOdsRelational.odsProperties.push(referenceToBase);
      entity.data.edfiOdsRelational.odsIdentityProperties.push(referenceToBase);
    });

  return {
    enhancerName,
    success: true,
  };
}
