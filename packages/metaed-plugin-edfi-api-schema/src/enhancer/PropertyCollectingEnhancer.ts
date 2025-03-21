// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { getAllEntitiesOfType, MetaEdEnvironment, EnhancerResult, TopLevelEntity } from '@edfi/metaed-core';
import { CollectedProperty } from '../model/CollectedProperty';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { defaultPropertyModifier } from '../model/PropertyModifier';
import { collectAllProperties, collectApiProperties } from './BasePropertyCollectingEnhancer';

/**
 * Accumulates properties that belong under an entity in the API body.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'domainEntitySubclass',
    'domainEntityExtension',
    'association',
    'associationSubclass',
    'associationExtension',
    'common',
    'commonSubclass',
    'commonExtension',
    'choice',
  ).forEach((entity) => {
    const collectedApiProperties: CollectedProperty[] = [];
    const allProperties: CollectedProperty[] = [];

    (entity as TopLevelEntity).properties.forEach((property) => {
      collectApiProperties(collectedApiProperties, property, defaultPropertyModifier, []);
      collectAllProperties(allProperties, property);
    });

    (entity.data.edfiApiSchema as EntityApiSchemaData).collectedApiProperties = collectedApiProperties;
    (entity.data.edfiApiSchema as EntityApiSchemaData).allProperties = allProperties;
  });

  return {
    enhancerName: 'PropertyCollectingEnhancer',
    success: true,
  };
}
