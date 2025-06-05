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
 * Collects all identity properties with their correct fullnames, using the pre-computed allJsonPathsMapping
 * that already contains the correct property paths including inline common prefixes
 */
function collectIdentityFullnamesFor(entity: TopLevelEntity): MetaEdPropertyFullName[] {
  const { documentPathsMapping } = entity.data.edfiApiSchema as EntityApiSchemaData;

  return (
    Object.entries(documentPathsMapping)
      // will find identity properties on main entity and also on inline commons off the main entity
      .filter(
        ([_, documentPaths]) =>
          documentPaths.isPartOfIdentity &&
          (documentPaths.sourceProperty?.parentEntity === entity ||
            (documentPaths.sourceProperty?.parentEntity.type === 'common' &&
              (documentPaths.sourceProperty?.parentEntity as Common).inlineInOds)),
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
 * Accumulates the identity fullnames for a non-subclass entity that maps to an API resource.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association').forEach((entity) => {
    const identityFullnames = collectIdentityFullnamesFor(entity as TopLevelEntity);
    (entity.data.edfiApiSchema as EntityApiSchemaData).identityFullnames = identityFullnames;
  });

  return {
    enhancerName: 'IdentityFullnameEnhancer',
    success: true,
  };
}
