// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  EnhancerResult,
  getAllEntitiesOfType,
  TopLevelEntity,
  NoCommonExtension,
} from '@edfi/metaed-core';
import { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
import { CommonExtensionOverride } from '../model/api-schema/CommonExtensionOverride';
import { JsonPath } from '../model/api-schema/JsonPath';
import { ProjectEndpointName } from '../model/api-schema/ProjectEndpointName';
import { SchemaArray, SchemaObject, SchemaProperty } from '../model/JsonSchema';
import { createUriSegment, isCommonExtensionOverride, topLevelApiNameOnEntity, uncapitalize } from '../Utility';
import { prefixedName } from '../model/PropertyModifier';

const enhancerName = 'CommonExtensionOverrideCollectorEnhancer';

/**
 * Derives the JSONPath insertion location in the core entity's jsonSchemaForInsert
 * where the _ext.{project} block attaches for a common extension override property.
 *
 * For a collection common (e.g. addresses), the path is $.properties.addresses.items
 * because the common items are inside an array.
 * For a scalar common (e.g. address), the path is $.properties.address.
 */
function deriveInsertionLocation(schemaPropertyName: string, isCollection: boolean): JsonPath {
  if (isCollection) {
    return `$.properties.${schemaPropertyName}.items` as JsonPath;
  }
  return `$.properties.${schemaPropertyName}` as JsonPath;
}

/**
 * Extracts the _ext block from a schema property, returning undefined if not found.
 */
function extractExtBlock(schema: SchemaProperty): SchemaObject | undefined {
  if (schema.type !== 'object') return undefined;
  // eslint-disable-next-line no-underscore-dangle
  return schema.properties?._ext as SchemaObject | undefined;
}

/**
 * Extracts the schema fragment (the _ext.{project} object with extension-only properties)
 * from the common extension override property's schema in the extension entity's jsonSchemaForInsert.
 *
 * The extension entity's jsonSchemaForInsert has the override property at root level with
 * an _ext.{project} structure containing the extension properties.
 */
function extractSchemaFragment(
  extensionEntityApiSchemaData: EntityApiSchemaData,
  schemaPropertyName: string,
  isCollection: boolean,
): SchemaObject {
  const { jsonSchemaForInsert } = extensionEntityApiSchemaData;
  const rootProperty = jsonSchemaForInsert.properties[schemaPropertyName];

  if (rootProperty == null) {
    return { type: 'object', properties: {}, additionalProperties: false };
  }

  // For collections, the schema is an array wrapping an object; the _ext is inside items
  const schemaToSearch = isCollection ? (rootProperty as SchemaArray).items : rootProperty;
  const extBlock = extractExtBlock(schemaToSearch);

  return extBlock ?? { type: 'object', properties: {}, additionalProperties: false };
}

/**
 * This enhancer collects common extension override information from extension entities
 * (domainEntityExtension, associationExtension) and stores explicit attachment-point
 * metadata in entityApiSchemaData.commonExtensionOverrides.
 *
 * It runs after JsonSchemaForInsertEnhancer, which already builds the schema fragments
 * for common extension overrides.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntityExtension', 'associationExtension').forEach((entity) => {
    const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    const overrides: CommonExtensionOverride[] = [];

    entityApiSchemaData.collectedApiProperties.forEach(({ property, propertyModifier }) => {
      if (!isCommonExtensionOverride(property)) return;

      const { referencedCommonExtension } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
      if (referencedCommonExtension === NoCommonExtension) return;

      const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
      const isCollection = apiMapping.isCommonCollection;

      const topLevelName = topLevelApiNameOnEntity(entity as TopLevelEntity, property);
      const schemaPropertyName = uncapitalize(prefixedName(topLevelName, propertyModifier));

      const projectName = createUriSegment(referencedCommonExtension.namespace.projectName);
      const insertionLocation = deriveInsertionLocation(schemaPropertyName, isCollection);
      const schemaFragment = extractSchemaFragment(entityApiSchemaData, schemaPropertyName, isCollection);

      overrides.push({
        insertionLocations: [insertionLocation],
        projectEndpointName: projectName as ProjectEndpointName,
        schemaFragment,
      });
    });

    entityApiSchemaData.commonExtensionOverrides = overrides;
  });

  return {
    enhancerName,
    success: true,
  };
}
