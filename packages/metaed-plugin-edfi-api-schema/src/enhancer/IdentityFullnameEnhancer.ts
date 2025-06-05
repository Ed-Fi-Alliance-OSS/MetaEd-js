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
  InlineCommonProperty,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';

/**
 * Collects all identity properties with their correct fullnames, including inline common prefixes
 */
function collectIdentityFullnamesFor(entity: TopLevelEntity): MetaEdPropertyFullName[] {
  const identityFullnames: MetaEdPropertyFullName[] = [];

  // Add direct identity properties
  entity.identityProperties.forEach((property) => {
    identityFullnames.push(
      `${property.fullPropertyName}${property.type === 'descriptor' ? 'Descriptor' : ''}` as MetaEdPropertyFullName,
    );
  });

  // Add identity properties from inline commons with proper prefixing
  function addInlineCommonIdentities(inlineEntity: TopLevelEntity, prefix: string) {
    inlineEntity.identityProperties.forEach((property) => {
      const prefixedName = `${prefix}.${property.fullPropertyName}${property.type === 'descriptor' ? 'Descriptor' : ''}`;
      identityFullnames.push(prefixedName as MetaEdPropertyFullName);
    });

    inlineEntity.properties
      .filter((property) => property.type === 'inlineCommon')
      .forEach((inlineCommonProperty) => {
        const nestedPrefix = `${prefix}.${inlineCommonProperty.metaEdName}`;
        addInlineCommonIdentities((inlineCommonProperty as InlineCommonProperty).referencedEntity, nestedPrefix);
      });
  }

  entity.properties
    .filter((property) => property.type === 'inlineCommon')
    .forEach((inlineCommonProperty) => {
      addInlineCommonIdentities(
        (inlineCommonProperty as InlineCommonProperty).referencedEntity,
        inlineCommonProperty.metaEdName,
      );
    });

  return identityFullnames;
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
