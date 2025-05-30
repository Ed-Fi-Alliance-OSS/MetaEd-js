// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, TopLevelEntity, getAllEntitiesOfType, EntityProperty } from '@edfi/metaed-core';
import { ApiEntityMapping, NoApiEntityMapping } from '../model/ApiEntityMapping';
import {
  superclassFor,
  descriptorCollectedApiPropertiesFrom,
  flattenIdentityPropertiesFrom,
  collectAllIdentityPropertiesFor,
  referenceGroupsFrom,
} from './ApiEntityMappingEnhancerBase';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';

/**
 * Collects all of the API shape metadata for a MetaEd non-subclass entity.
 */
function buildApiEntityMapping(entity: TopLevelEntity): ApiEntityMapping {
  const allIdentityProperties: EntityProperty[] = collectAllIdentityPropertiesFor(entity);
  const properties = [...entity.properties].sort((a, b) => a.fullPropertyName.localeCompare(b.fullPropertyName));
  return {
    allIdentityProperties,
    flattenedIdentityProperties: flattenIdentityPropertiesFrom(allIdentityProperties, entity),
    referenceGroups: referenceGroupsFrom(properties),
    descriptorCollectedApiProperties: descriptorCollectedApiPropertiesFrom(entity),
    superclass: superclassFor(entity),
  };
}

/**
 * This enhancer uses the results of the ReferenceComponentEnhancer to build API
 * shape metadata for each MetaEd entity.
 *
 * Note, this enhancer is dependent on ApiPropertyMappingEnhancer
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntityExtension', 'associationExtension').forEach(
    (entity) => {
      (entity.data.edfiApiSchema as EntityApiSchemaData).apiMapping = buildApiEntityMapping(entity as TopLevelEntity);
    },
  );

  // Descriptors have no API shape metadata
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((entity) => {
    (entity.data.edfiApiSchema as EntityApiSchemaData).apiMapping = NoApiEntityMapping;
  });

  return {
    enhancerName: 'ApiEntityMappingEnhancer',
    success: true,
  };
}
