// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  TopLevelEntity,
  MetaEdPropertyFullName,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';

/**
 * Accumulates the identity fullnames for a subclass entity that maps to an API resource.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntitySubclass', 'associationSubclass').forEach((entity) => {
    const subclass: TopLevelEntity = entity as TopLevelEntity;

    const identityFullnames: MetaEdPropertyFullName[] = [];

    let renamedPropertyMetaEdName: string | null = null;

    // Subclass identity properties first
    subclass.properties.forEach((property) => {
      // Looking for an identity rename to exclude the superclass property - MetaEd only allows
      // one rename property per subclass, so assuming only one is fine.
      if (property.isIdentityRename) renamedPropertyMetaEdName = property.baseKeyName;

      if (property.isPartOfIdentity) {
        identityFullnames.push(property.fullPropertyName as MetaEdPropertyFullName);
      }
    });

    // Add the superclass identity properties, omitting the renamed one
    if (subclass.baseEntity != null) {
      subclass.baseEntity.properties
        .filter((p) => p.metaEdName !== renamedPropertyMetaEdName)
        .forEach((property) => {
          if (property.isPartOfIdentity) {
            identityFullnames.push(property.fullPropertyName as MetaEdPropertyFullName);
          }
        });
    }

    (entity.data.edfiApiSchema as EntityApiSchemaData).identityFullnames = identityFullnames.sort();
  });

  return {
    enhancerName: 'SubclassIdentityFullnameEnhancer',
    success: true,
  };
}
