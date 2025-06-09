// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  TopLevelEntity,
  Common,
  MetaEdPropertyFullName,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { normalizeDescriptorPropertyPath } from '../Utility';

/**
 * Checks if a property's parent entity is part of the base entity hierarchy
 */
function isFromBaseEntityHierarchy(propertyParent: any, subclass: TopLevelEntity): boolean {
  if (!propertyParent || !subclass.baseEntity) {
    return false;
  }

  let currentBase: TopLevelEntity | null = subclass.baseEntity;
  while (currentBase) {
    if (propertyParent === currentBase) {
      return true;
    }
    currentBase = currentBase.baseEntity;
  }
  return false;
}

/**
 * Collects all identity properties with their correct fullnames for subclass entities, using the pre-computed
 * documentPathsMapping that properly handles inline common prefixes and descriptor normalization
 */
function collectIdentityFullnamesForSubclass(entity: TopLevelEntity): MetaEdPropertyFullName[] {
  const { documentPathsMapping } = entity.data.edfiApiSchema as EntityApiSchemaData;

  return (
    Object.entries(documentPathsMapping)
      // will find identity properties on subclass entity and also on inline commons off the entity or its base classes
      .filter(
        ([_, documentPaths]) =>
          documentPaths.isPartOfIdentity &&
          (documentPaths.sourceProperty?.parentEntity === entity ||
            (documentPaths.sourceProperty?.parentEntity.type === 'common' &&
              (documentPaths.sourceProperty?.parentEntity as Common).inlineInOds) ||
            // Also include properties from the base entity hierarchy
            isFromBaseEntityHierarchy(documentPaths.sourceProperty?.parentEntity, entity)),
      )
      .map(
        ([path, documentPaths]) =>
          normalizeDescriptorPropertyPath(
            path,
            documentPaths.isReference && documentPaths.isDescriptor,
          ) as MetaEdPropertyFullName,
      )
  );
}

/**
 * Accumulates the identity fullnames for a subclass entity that maps to an API resource.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntitySubclass', 'associationSubclass').forEach((entity) => {
    const identityFullnames = collectIdentityFullnamesForSubclass(entity as TopLevelEntity);
    (entity.data.edfiApiSchema as EntityApiSchemaData).identityFullnames = identityFullnames.sort();
  });

  return {
    enhancerName: 'SubclassIdentityFullnameEnhancer',
    success: true,
  };
}
