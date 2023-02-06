// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, getAllEntitiesOfType, ModelBase } from '@edfi/metaed-core';
import { ApiEntityMapping, NoApiEntityMapping } from './ApiEntityMapping';
import type { CollectedProperty } from './CollectedProperty';
import { SchemaRoot, NoSchemaRoot } from './JsonSchema';

export type EntityApiSchemaData = {
  /**
   * API shape metadata for this entity.
   */
  apiMapping: ApiEntityMapping;
  /**
   * The API document JSON schema that corresponds to this MetaEd entity.
   */
  jsonSchema: SchemaRoot;
  /**
   * Properties that belong under this entity in the API body
   */
  collectedProperties: CollectedProperty[];
};

/**
 * Initialize entity with ApiSchema data placeholder.
 */
export function addEntityApiSchemaDataTo(entity: ModelBase) {
  if (entity.data.edfiApiSchema == null) entity.data.edfiApiSchema = {};

  Object.assign(entity.data.edfiApiSchema, {
    apiMapping: NoApiEntityMapping,
    jsonSchema: NoSchemaRoot,
    collectedProperties: [],
  });
}

/**
 * Initialize all properties with ApiSchema data placeholder.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'association',
    'domainEntitySubclass',
    'associationSubclass',
    'descriptor',
    'common',
    'schoolYearEnumeration',
  ).forEach((entity) => {
    if (entity.data.edfiApiSchema == null) entity.data.edfiApiSchema = {};
    addEntityApiSchemaDataTo(entity);
  });

  return {
    enhancerName: 'EntityApiSchemaDataSetupEnhancer',
    success: true,
  };
}
