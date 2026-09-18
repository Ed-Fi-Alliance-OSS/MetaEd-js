// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  EntityProperty,
  getAllProperties,
  MetaEdEnvironment,
  PluginEnvironment,
  SemVer,
  ValidationFailure,
  versionSatisfies,
} from '@edfi/metaed-core';

/**
 * The Ed-Fi API versions this validator applies to. Ed-Fi API 8.1 and later reserve every name in
 * reservedQueryParameterNames out of resource-filter matching, so a model targeting one of those versions
 * cannot use them as property names.
 *
 * This is a targetTechnologyVersion gate, not a data standard version gate: the reservation is a property of
 * the API implementation a model targets, not of the data standard the model describes.
 */
const targetTechnologyVersion: SemVer = '>=8.1.0';

/**
 * The query parameter names the Ed-Fi API reserves, lower-cased for case-insensitive comparison. The API
 * matches a supplied query parameter against a resource's query fields case-insensitively, so a property
 * named with any casing of one of these names collides with it.
 *
 * limit, offset and totalCount control traditional paging; pageToken and pageSize control cursor paging;
 * minChangeVersion and maxChangeVersion bound a change-version window; number is the partition count of the
 * /partitions operation.
 */
const reservedQueryParameterNames: string[] = [
  'limit',
  'offset',
  'totalcount',
  'pagetoken',
  'pagesize',
  'minchangeversion',
  'maxchangeversion',
  'number',
];

/**
 * The reserved names as the Ed-Fi API spells them, for the failure message.
 */
const reservedQueryParameterNamesForMessage: string =
  'limit, offset, totalCount, pageToken, pageSize, minChangeVersion, maxChangeVersion and number';

/**
 * The name the Ed-Fi API derives a resource's query field from, which is the property name prefixed with its
 * role name. Falls back to the metaEdName for a property whose full name was never assigned.
 */
function queryFieldSourceNameFor(property: EntityProperty): string {
  return property.fullPropertyName === '' ? property.metaEdName : property.fullPropertyName;
}

/**
 * Validates that no property is named a query parameter the targeted Ed-Fi API reserves. Such a property
 * would be accepted by the model build and then be unfilterable on the API endpoints that reserve the name,
 * with no warning to the extension author. Applies only when the edfiUnified plugin targets Ed-Fi API 8.1 or
 * later; earlier targets are not validated.
 */
export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const pluginEnvironment: PluginEnvironment | undefined = metaEd.plugin.get('edfiUnified');

  if (pluginEnvironment == null || !versionSatisfies(pluginEnvironment.targetTechnologyVersion, targetTechnologyVersion)) {
    return [];
  }

  const failures: ValidationFailure[] = [];

  getAllProperties(metaEd.propertyIndex).forEach((property: EntityProperty) => {
    const propertyName: string = queryFieldSourceNameFor(property);

    if (reservedQueryParameterNames.includes(propertyName.toLowerCase())) {
      failures.push({
        validatorName: 'NoPagingPropertyNames',
        category: 'error',
        message: `${propertyName} is a reserved query parameter name for Ed-Fi API 8.1+ and cannot be used as a property name. Reserved names are ${reservedQueryParameterNamesForMessage}`,
        sourceMap: property.sourceMap.metaEdName,
        fileMap: null,
      });
    }
  });

  return failures;
}
