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
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
import type { FlattenedIdentityProperty } from '../model/FlattenedIdentityProperty';
import { defaultPropertyModifier, prefixedName } from '../model/PropertyModifier';
import type { TrackedChangeKeyField, TrackedChangeKeyFieldName } from '../model/TrackedChangeKeyField';
import { findIdenticalRoleNamePatternPrefix, prependPrefixWithCollapse, uncapitalize } from '../Utility';
import { parentPropertyModifier } from './JsonElementNamingHelper';

const enhancerName = 'OpenApiTrackedChangeKeyFieldEnhancer';

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
 * Returns the public tracked-change key fields for a regular resource entity.
 */
function trackedChangeKeyFieldsFrom(entity: TopLevelEntity): TrackedChangeKeyField[] {
  const entityApiSchemaData: EntityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  const trackedChangeKeyFieldsByName: { [fieldName: string]: TrackedChangeKeyField } = {};

  entityApiSchemaData.apiMapping.flattenedIdentityProperties
    .filter((flattenedIdentityProperty: FlattenedIdentityProperty) => flattenedIdentityProperty.mergedAwayBy == null)
    .forEach((flattenedIdentityProperty: FlattenedIdentityProperty) => {
      const fieldName: TrackedChangeKeyFieldName = trackedChangeKeyFieldNameFrom(flattenedIdentityProperty);
      trackedChangeKeyFieldsByName[fieldName] = {
        fieldName,
        sourceProperty: flattenedIdentityProperty.identityProperty,
      };
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
