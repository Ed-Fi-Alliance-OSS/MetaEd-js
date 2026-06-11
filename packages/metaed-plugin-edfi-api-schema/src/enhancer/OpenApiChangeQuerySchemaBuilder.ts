// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { type DomainEntity, type TopLevelEntity } from '@edfi/metaed-core';
import { invariant } from 'ts-invariant';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { SchemaObject, Schemas } from '../model/OpenApiTypes';
import type { TrackedChangeKeyField } from '../model/TrackedChangeKeyField';
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
 * Creates a display name for tracked-change invariant messages.
 */
function entityDisplayNameFor(entity: TopLevelEntity): string {
  return `${entity.namespace.namespaceName}.${entity.metaEdName}`;
}

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
 * Asserts that a concrete resource has complete semantic metadata for tracked-change key schemas.
 */
function assertCanCreateIdentityFieldSchemasFrom(
  entity: TopLevelEntity,
  trackedChangeKeyFields: TrackedChangeKeyField[],
): void {
  invariant(
    trackedChangeKeyFields.length > 0,
    `Unable to create tracked-change key schema for ${entityDisplayNameFor(
      entity,
    )}. No tracked-change key fields were found.`,
  );
}

/**
 * Creates an OpenAPI schema object from a tracked-change key field.
 */
function identityFieldSchemaFrom(trackedChangeKeyField: TrackedChangeKeyField): IdentityFieldSchema {
  return {
    fieldName: trackedChangeKeyField.fieldName,
    schema: schemaObjectFromEntityProperty(trackedChangeKeyField.sourceProperty, { type: 'string' }),
  };
}

/**
 * Creates public identity field schemas for a regular resource from tracked-change key field metadata.
 */
function identityFieldSchemasFrom(entity: TopLevelEntity): IdentityFieldSchema[] {
  const entityApiSchemaData: EntityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  const trackedChangeKeyFields: TrackedChangeKeyField[] = entityApiSchemaData.trackedChangeKeyFields ?? [];

  assertCanCreateIdentityFieldSchemasFrom(entity, trackedChangeKeyFields);

  return trackedChangeKeyFields.map((trackedChangeKeyField: TrackedChangeKeyField) =>
    identityFieldSchemaFrom(trackedChangeKeyField),
  );
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

  const sortedRequired: string[] = [...required].sort();

  return {
    type: 'object',
    required: sortedRequired,
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

  return {
    [trackedChangeSchemaNames.keyValues]: keyValuesSchema,
    [trackedChangeSchemaNames.deleteItem]: deleteItemSchema(trackedChangeSchemaNames.keyValues),
    [trackedChangeSchemaNames.keyChangeItem]: keyChangeItemSchema(trackedChangeSchemaNames.keyValues),
  };
}
