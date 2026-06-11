// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  type EntityProperty,
  type EnhancerResult,
  type MetaEdEnvironment,
  type TopLevelEntity,
  getAllEntitiesOfType,
  newEntityProperty,
} from '@edfi/metaed-core';
import { invariant } from 'ts-invariant';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
import type { FlattenedIdentityProperty } from '../model/FlattenedIdentityProperty';
import type { SchemaObject } from '../model/OpenApiTypes';
import { defaultPropertyModifier, prefixedName } from '../model/PropertyModifier';
import type { TrackedChangeKeyField, TrackedChangeKeyFieldName } from '../model/TrackedChangeKeyField';
import { findIdenticalRoleNamePatternPrefix, prependPrefixWithCollapse, uncapitalize } from '../Utility';
import { parentPropertyModifier } from './JsonElementNamingHelper';
import { schemaObjectFromEntityProperty } from './OpenApiEntityPropertySchemaMapper';

const enhancerName = 'OpenApiTrackedChangeKeyFieldEnhancer';

/**
 * Creates a display name for tracked-change invariant messages.
 */
function entityDisplayNameFor(entity: TopLevelEntity): string {
  return `${entity.namespace.namespaceName}.${entity.metaEdName}`;
}

/**
 * Returns the public tracked-change key field name for a flattened identity property.
 */
function trackedChangeKeyFieldNameFrom(flattenedIdentityProperty: FlattenedIdentityProperty): TrackedChangeKeyFieldName {
  const identityPropertyApiMapping = (
    flattenedIdentityProperty.identityProperty.data.edfiApiSchema as EntityPropertyApiSchemaData
  ).apiMapping;

  const specialPrefix: string = findIdenticalRoleNamePatternPrefix(flattenedIdentityProperty);
  const adjustedName: string =
    specialPrefix === ''
      ? identityPropertyApiMapping.fullName
      : prependPrefixWithCollapse(identityPropertyApiMapping.fullName, specialPrefix);
  const parentAdjustedPropertyModifier = parentPropertyModifier(flattenedIdentityProperty, defaultPropertyModifier);

  return uncapitalize(prefixedName(adjustedName, parentAdjustedPropertyModifier)) as TrackedChangeKeyFieldName;
}

/**
 * Returns whether the tracked-change key field source properties produce the same OpenAPI schema.
 */
function trackedChangeKeyFieldSchemasMatch(
  trackedChangeKeyField: TrackedChangeKeyField,
  sourceProperty: EntityProperty,
): boolean {
  const existingSchema: SchemaObject = schemaObjectFromEntityProperty(trackedChangeKeyField.sourceProperty, {
    type: 'string',
  });
  const newSchema: SchemaObject = schemaObjectFromEntityProperty(sourceProperty, { type: 'string' });

  return (
    existingSchema.type === newSchema.type &&
    existingSchema.format === newSchema.format &&
    existingSchema.maxLength === newSchema.maxLength &&
    existingSchema.minLength === newSchema.minLength
  );
}

/**
 * Adds a tracked-change key field to the collection, failing on ambiguous public field names.
 */
function addTrackedChangeKeyField(
  trackedChangeKeyFieldsByName: { [fieldName: string]: TrackedChangeKeyField },
  entity: TopLevelEntity,
  fieldName: TrackedChangeKeyFieldName,
  sourceProperty: EntityProperty,
): void {
  const existingTrackedChangeKeyField: TrackedChangeKeyField | undefined = trackedChangeKeyFieldsByName[fieldName];

  if (existingTrackedChangeKeyField != null) {
    invariant(
      trackedChangeKeyFieldSchemasMatch(existingTrackedChangeKeyField, sourceProperty),
      `Tracked-change key field name collision for ${entityDisplayNameFor(
        entity,
      )}: ${fieldName} is produced by multiple non-merged-away identity properties with different schemas.`,
    );
    return;
  }

  trackedChangeKeyFieldsByName[fieldName] = {
    fieldName,
    sourceProperty,
  };
}

/**
 * Returns the public tracked-change key fields for a regular resource entity.
 */
function trackedChangeKeyFieldsFrom(entity: TopLevelEntity): TrackedChangeKeyField[] {
  const entityApiSchemaData: EntityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  const trackedChangeKeyFieldsByName: { [fieldName: string]: TrackedChangeKeyField } = {};

  entityApiSchemaData.apiMapping.flattenedIdentityProperties
    .filter((flattenedIdentityProperty: FlattenedIdentityProperty) => flattenedIdentityProperty.mergedAwayBy == null)
    .forEach((flattenedIdentityProperty: FlattenedIdentityProperty) => {
      const fieldName: TrackedChangeKeyFieldName = trackedChangeKeyFieldNameFrom(flattenedIdentityProperty);
      addTrackedChangeKeyField(trackedChangeKeyFieldsByName, entity, fieldName, flattenedIdentityProperty.identityProperty);
    });

  return Object.values(trackedChangeKeyFieldsByName);
}

/**
 * Returns the public tracked-change key fields for the hard-coded SchoolYear resource.
 */
function schoolYearTrackedChangeKeyFields(): TrackedChangeKeyField[] {
  const schoolYearSourceProperty: EntityProperty = {
    ...newEntityProperty(),
    type: 'schoolYearEnumeration',
  };

  return [
    {
      fieldName: 'schoolYear' as TrackedChangeKeyFieldName,
      sourceProperty: schoolYearSourceProperty,
    },
  ];
}

/**
 * Adds public tracked-change key fields to resource entity data.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      (entity.data.edfiApiSchema as EntityApiSchemaData).trackedChangeKeyFields = trackedChangeKeyFieldsFrom(
        entity as TopLevelEntity,
      );
    },
  );

  getAllEntitiesOfType(metaEd, 'schoolYearEnumeration').forEach((entity) => {
    (entity.data.edfiApiSchema as EntityApiSchemaData).trackedChangeKeyFields = schoolYearTrackedChangeKeyFields();
  });

  return {
    enhancerName,
    success: true,
  };
}
