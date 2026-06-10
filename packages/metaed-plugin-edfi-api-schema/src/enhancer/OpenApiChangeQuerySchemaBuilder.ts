// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { type DomainEntity, type TopLevelEntity } from '@edfi/metaed-core';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { JsonPath } from '../model/api-schema/JsonPath';
import type { PathType } from '../model/api-schema/PathType';
import type { QueryFieldMapping } from '../model/api-schema/QueryFieldMapping';
import type { QueryFieldPathInfo } from '../model/api-schema/QueryFieldPathInfo';
import type { SchemaObject, Schemas } from '../model/OpenApiTypes';
import { deAcronym, normalizeDescriptorName } from '../Utility';
import { schemaObjectFromEntityProperty } from './OpenApiEntityPropertySchemaMapper';

/**
 * Component schema names used by tracked-change OpenAPI response schemas.
 */
export type TrackedChangeSchemaNames = {
  keyValues: string;
  deleteItem: string;
  keyChangeItem: string;
};

/**
 * A public query field and OpenAPI schema pair derived from identity metadata.
 */
type IdentityFieldSchema = {
  fieldName: string;
  schema: SchemaObject;
};

/**
 * Query field path information matched to a public query field name.
 */
type QueryFieldPathInfoMatch = {
  fieldName: string;
  pathInfo: QueryFieldPathInfo;
};

/**
 * Creates the tracked-change component base name for an entity.
 */
function trackedChangeComponentBaseNameFor(entity: TopLevelEntity): string {
  return `${deAcronym(entity.namespace.namespaceName)}_${deAcronym(normalizeDescriptorName(entity))}`;
}

/**
 * Creates tracked-change component schema names for an entity.
 */
export function trackedChangeSchemaNamesFor(entity: TopLevelEntity): TrackedChangeSchemaNames {
  const componentBaseName: string = trackedChangeComponentBaseNameFor(entity);

  return {
    keyValues: `${componentBaseName}_TrackedChangeKey`,
    deleteItem: `${componentBaseName}_TrackedChangeDelete`,
    keyChangeItem: `${componentBaseName}_TrackedChangeKeyChange`,
  };
}

/**
 * Returns whether the entity is an abstract resource with schemas but no endpoint.
 */
function isAbstractResource(entity: TopLevelEntity): boolean {
  return (
    (entity.type === 'domainEntity' ||
      entity.type === 'association' ||
      entity.type === 'domainEntitySubclass' ||
      entity.type === 'associationSubclass') &&
    (entity as DomainEntity).isAbstract === true
  );
}

/**
 * Creates a fallback schema from API Schema path type metadata.
 */
function schemaObjectFromPathType(pathType: PathType): SchemaObject {
  switch (pathType) {
    case 'boolean':
      return { type: 'boolean' };
    case 'date':
      return { type: 'string', format: 'date' };
    case 'date-time':
      return { type: 'string', format: 'date-time' };
    case 'number':
      return { type: 'number', format: 'double' };
    case 'string':
      return { type: 'string' };
    case 'time':
      return { type: 'string' };
    default:
      return { type: 'string' };
  }
}

/**
 * Creates an OpenAPI schema object from query field path metadata.
 */
function schemaObjectFromQueryFieldPathInfo(pathInfo: QueryFieldPathInfo): SchemaObject {
  if (pathInfo.sourceProperty == null) return schemaObjectFromPathType(pathInfo.type);

  return schemaObjectFromEntityProperty(pathInfo.sourceProperty, { type: 'string' });
}

/**
 * Finds public query field path info by exact identity JSON path match.
 */
function queryFieldPathInfoMatching(
  identityJsonPath: JsonPath,
  queryFieldMapping: QueryFieldMapping,
): QueryFieldPathInfoMatch | undefined {
  const matchingQueryFieldEntry: [string, QueryFieldPathInfo[]] | undefined = Object.entries(queryFieldMapping).find(
    ([, pathInfos]: [string, QueryFieldPathInfo[]]) =>
      pathInfos.some((pathInfo: QueryFieldPathInfo) => pathInfo.path === identityJsonPath),
  );
  if (matchingQueryFieldEntry == null) return undefined;

  const [fieldName, pathInfos] = matchingQueryFieldEntry;
  const matchingPathInfo: QueryFieldPathInfo | undefined = pathInfos.find(
    (pathInfo: QueryFieldPathInfo) => pathInfo.path === identityJsonPath,
  );
  if (matchingPathInfo == null) return undefined;

  return { fieldName, pathInfo: matchingPathInfo };
}

/**
 * Creates public identity field schemas for a regular resource from identity and query-field metadata.
 */
function identityFieldSchemasFrom(entity: TopLevelEntity): IdentityFieldSchema[] {
  const entityApiSchemaData: EntityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  const identityJsonPaths: JsonPath[] = entityApiSchemaData.identityJsonPaths ?? [];
  const includedFieldNames: Set<string> = new Set();
  const result: IdentityFieldSchema[] = [];

  identityJsonPaths.forEach((identityJsonPath: JsonPath) => {
    const match: QueryFieldPathInfoMatch | undefined = queryFieldPathInfoMatching(
      identityJsonPath,
      entityApiSchemaData.queryFieldMapping,
    );
    if (match == null || includedFieldNames.has(match.fieldName)) return;

    includedFieldNames.add(match.fieldName);
    result.push({
      fieldName: match.fieldName,
      schema: schemaObjectFromQueryFieldPathInfo(match.pathInfo),
    });
  });

  return result;
}

/**
 * Creates the descriptor tracked-change key schema.
 */
function descriptorKeyValuesSchema(): SchemaObject {
  return {
    type: 'object',
    required: ['namespace', 'codeValue'],
    properties: {
      namespace: {
        type: 'string',
        maxLength: 255,
      },
      codeValue: {
        type: 'string',
        maxLength: 50,
      },
    },
  };
}

/**
 * Creates the tracked-change key object schema from identity field schemas.
 */
function keyValuesSchemaFrom(identityFieldSchemas: IdentityFieldSchema[]): SchemaObject {
  const properties: { [name: string]: SchemaObject } = {};
  const required: string[] = [];

  identityFieldSchemas.forEach((identityFieldSchema: IdentityFieldSchema) => {
    properties[identityFieldSchema.fieldName] = identityFieldSchema.schema;
    required.push(identityFieldSchema.fieldName);
  });

  return {
    type: 'object',
    required,
    properties,
  };
}

/**
 * Creates the shared tracked-change ChangeVersion schema.
 */
function changeVersionSchema(): SchemaObject {
  return {
    type: 'integer',
    format: 'int64',
  };
}

/**
 * Creates the tracked-change delete response item schema.
 */
function deleteItemSchema(keyValuesSchemaName: string): SchemaObject {
  return {
    type: 'object',
    required: ['id', 'changeVersion', 'keyValues'],
    properties: {
      id: {
        type: 'string',
      },
      changeVersion: changeVersionSchema(),
      keyValues: {
        $ref: `#/components/schemas/${keyValuesSchemaName}`,
      },
    },
  };
}

/**
 * Creates the tracked-change key-change response item schema.
 */
function keyChangeItemSchema(keyValuesSchemaName: string): SchemaObject {
  return {
    type: 'object',
    required: ['id', 'changeVersion', 'oldKeyValues', 'newKeyValues'],
    properties: {
      id: {
        type: 'string',
      },
      changeVersion: changeVersionSchema(),
      oldKeyValues: {
        $ref: `#/components/schemas/${keyValuesSchemaName}`,
      },
      newKeyValues: {
        $ref: `#/components/schemas/${keyValuesSchemaName}`,
      },
    },
  };
}

/**
 * Creates tracked-change OpenAPI component schemas for a resource or descriptor.
 */
export function createTrackedChangeSchemasFrom(entity: TopLevelEntity): Schemas {
  if (isAbstractResource(entity)) return {};

  const trackedChangeSchemaNames: TrackedChangeSchemaNames = trackedChangeSchemaNamesFor(entity);
  const keyValuesSchema: SchemaObject =
    entity.type === 'descriptor' ? descriptorKeyValuesSchema() : keyValuesSchemaFrom(identityFieldSchemasFrom(entity));

  if (keyValuesSchema.required == null || keyValuesSchema.required.length === 0) return {};

  return {
    [trackedChangeSchemaNames.keyValues]: keyValuesSchema,
    [trackedChangeSchemaNames.deleteItem]: deleteItemSchema(trackedChangeSchemaNames.keyValues),
    [trackedChangeSchemaNames.keyChangeItem]: keyChangeItemSchema(trackedChangeSchemaNames.keyValues),
  };
}
