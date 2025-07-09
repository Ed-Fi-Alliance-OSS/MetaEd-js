// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/* eslint-disable no-use-before-define */

import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  ReferentialProperty,
  EntityProperty,
  CommonProperty,
  TopLevelEntity,
  StringProperty,
  IntegerProperty,
  ShortProperty,
} from '@edfi/metaed-core';
import { invariant } from 'ts-invariant';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
import {
  newSchemaRoot,
  NoSchemaProperty,
  SchemaArray,
  SchemaObject,
  SchemaProperties,
  SchemaProperty,
  SchemaRoot,
} from '../model/JsonSchema';
import { PropertyModifier, prefixedName, propertyModifierConcat } from '../model/PropertyModifier';
import {
  findIdenticalRoleNamePatternPrefix,
  singularize,
  topLevelApiNameOnEntity,
  prependPrefixWithCollapse,
  uncapitalize,
} from '../Utility';
import { FlattenedIdentityProperty } from '../model/FlattenedIdentityProperty';
import { parentPropertyModifier } from './JsonElementNamingHelper';

const enhancerName = 'JsonSchemaForInsertEnhancer';

type SchoolYearSchemas = { schoolYearSchema: SchemaProperty; schoolYearEnumerationSchema: SchemaRoot };

// All descriptor documents have the same schema
const descriptorSchema: SchemaRoot = {
  ...newSchemaRoot(),
  type: 'object',
  title: 'EdFi.Descriptor',
  description: 'An Ed-Fi Descriptor',
  properties: {
    namespace: {
      type: 'string',
      description: 'The descriptor namespace as a URI',
      maxLength: 255,
      minLength: 1,
      pattern: '^(?!\\s).*(?<!\\s)$',
    },
    codeValue: {
      type: 'string',
      description: 'The descriptor code value',
      maxLength: 50,
      minLength: 1,
      pattern: '^(?!\\s).*(?<!\\s)$',
    },
    shortDescription: {
      type: 'string',
      description: 'The descriptor short description',
      maxLength: 75,
      minLength: 1,
      pattern: '^(?!\\s).*(?<!\\s)$',
    },
    description: {
      type: 'string',
      description: 'The descriptor description',
      maxLength: 1024,
    },
    effectiveBeginDate: {
      type: 'string',
      format: 'date',
      description: 'The descriptor effective begin date',
    },
    effectiveEndDate: {
      type: 'string',
      format: 'date',
      description: 'The descriptor effective end date',
    },
  },
  additionalProperties: false,
  required: ['namespace', 'codeValue', 'shortDescription'],
};

/**
 * Wraps a set of schema properties and required field names with a schema object
 */
function schemaObjectFrom(schemaProperties: SchemaProperties, required: string[]): SchemaObject {
  const result: SchemaProperty = {
    type: 'object',
    properties: schemaProperties,
    additionalProperties: false,
  };

  if (required.length > 0) {
    result.required = required;
  }
  return result;
}

/**
 * Wraps a schema property in a schema array
 */
function schemaArrayFrom(schemaArrayElement: SchemaProperty): SchemaArray {
  return {
    type: 'array',
    items: schemaArrayElement,
    minItems: 0,
    uniqueItems: false,
  };
}

/**
 * Determines whether the schema property for this entity property is required
 */
function isSchemaPropertyRequired(property: EntityProperty, propertyModifier: PropertyModifier): boolean {
  return (
    (property.isRequired || property.isRequiredCollection || property.isPartOfIdentity) &&
    !propertyModifier.optionalDueToParent
  );
}

/**
 * Returns a JSON schema fragment that specifies the API body element shape
 * corresponding to the given referential property.
 */
function schemaObjectForReferentialProperty(
  property: ReferentialProperty,
  propertyModifier: PropertyModifier,
  schoolYearSchemas: SchoolYearSchemas,
): SchemaObject {
  const schemaProperties: SchemaProperties = {};
  const required: Set<string> = new Set();

  const referencedEntityApiMapping = (property.referencedEntity.data.edfiApiSchema as EntityApiSchemaData).apiMapping;

  // Ignore merges on references
  const flattenedIdentityPropertiesOmittingMerges = referencedEntityApiMapping.flattenedIdentityProperties.filter(
    (flattenedIdentityProperty: FlattenedIdentityProperty) => flattenedIdentityProperty.mergedAwayBy == null,
  );

  flattenedIdentityPropertiesOmittingMerges.forEach((flattenedIdentityProperty: FlattenedIdentityProperty) => {
    const identityPropertyApiMapping = (
      flattenedIdentityProperty.identityProperty.data.edfiApiSchema as EntityPropertyApiSchemaData
    ).apiMapping;

    const specialPrefix: string = findIdenticalRoleNamePatternPrefix(flattenedIdentityProperty);

    const adjustedName =
      specialPrefix === ''
        ? identityPropertyApiMapping.fullName
        : prependPrefixWithCollapse(identityPropertyApiMapping.fullName, specialPrefix);

    const parentAdjustedPropertyModifier = parentPropertyModifier(flattenedIdentityProperty, propertyModifier);

    const schemaPropertyName: string = uncapitalize(prefixedName(adjustedName, parentAdjustedPropertyModifier));

    // Because these are flattened, we know they are non-reference properties
    const schemaProperty: SchemaProperty = schemaPropertyForNonReference(
      flattenedIdentityProperty.identityProperty,
      schoolYearSchemas,
    );

    // Note that this key/value usage of Object implicitly merges by overwrite if there is more than one scalar property
    // with the same name sourced from different identity reference properties. There is no need to check
    // properties for merge directive annotations because MetaEd has already validated merges and any scalar identity
    // property name duplication _must_ be a merge.
    schemaProperties[schemaPropertyName] = schemaProperty;

    if (isSchemaPropertyRequired(flattenedIdentityProperty.identityProperty, parentAdjustedPropertyModifier)) {
      // As above, this usage of Set this implicitly merges by overwrite
      required.add(schemaPropertyName);
    }
  });

  return schemaObjectFrom(schemaProperties, Array.from(required.values()));
}

/**
 * Returns a JSON schema fragment that specifies the API body element shape
 * corresponding to the given scalar common property.
 */
function schemaObjectForScalarCommonProperty(
  property: CommonProperty,
  propertyModifier: PropertyModifier,
  schoolYearSchemas: SchoolYearSchemas,
): SchemaObject {
  const schemaProperties: SchemaProperties = {};
  const required: string[] = [];

  const { collectedApiProperties } = property.referencedEntity.data.edfiApiSchema as EntityApiSchemaData;

  collectedApiProperties.forEach((collectedApiProperty) => {
    const concatenatedPropertyModifier: PropertyModifier = propertyModifierConcat(
      propertyModifier,
      collectedApiProperty.propertyModifier,
    );

    const referencePropertyApiMapping = (collectedApiProperty.property.data.edfiApiSchema as EntityPropertyApiSchemaData)
      .apiMapping;
    const schemaPropertyName: string = uncapitalize(
      prefixedName(referencePropertyApiMapping.topLevelName, concatenatedPropertyModifier),
    );

    const schemaProperty: SchemaProperty = schemaPropertyFor(
      collectedApiProperty.property,
      concatenatedPropertyModifier,
      schoolYearSchemas,
    );

    schemaProperties[schemaPropertyName] = schemaProperty;
    if (isSchemaPropertyRequired(collectedApiProperty.property, concatenatedPropertyModifier)) {
      required.push(schemaPropertyName);
    }
  });
  return schemaObjectFrom(schemaProperties, required);
}

/**
 * Returns a JSON schema fragment that specifies the API body element shape
 * corresponding to the given property.
 */
function schemaPropertyForNonReference(
  property: EntityProperty,
  { schoolYearSchema, schoolYearEnumerationSchema }: SchoolYearSchemas,
): SchemaProperty {
  invariant(property.type !== 'association' && property.type !== 'common' && property.type !== 'domainEntity');

  const description: string = property.documentation;

  switch (property.type) {
    case 'boolean':
      return { type: 'boolean', description };

    case 'currency':
    case 'decimal':
    case 'duration':
    case 'percent':
    case 'sharedDecimal':
      return { type: 'number', format: 'double', description };

    case 'date':
      return { type: 'string', format: 'date', description };

    case 'datetime':
      return { type: 'string', format: 'date-time', description };

    case 'descriptor':
    case 'enumeration':
      return { type: 'string', description };

    case 'integer':
    case 'sharedInteger': {
      const result: SchemaProperty = { type: 'integer', description };
      const integerProperty: IntegerProperty = property as IntegerProperty;
      if (integerProperty.minValue) result.minimum = Number(integerProperty.minValue);
      if (integerProperty.maxValue) result.maximum = Number(integerProperty.maxValue);
      return result;
    }

    case 'short':
    case 'sharedShort': {
      const result: SchemaProperty = { type: 'integer', description };
      const shortProperty: ShortProperty = property as ShortProperty;
      if (shortProperty.minValue) result.minimum = Number(shortProperty.minValue);
      if (shortProperty.maxValue) result.maximum = Number(shortProperty.maxValue);
      return result;
    }

    case 'string':
    case 'sharedString': {
      const result: SchemaProperty = { type: 'string', description };
      const stringProperty: StringProperty = property as StringProperty;
      if (stringProperty.minLength) result.minLength = Number(stringProperty.minLength);
      if (stringProperty.maxLength) result.maxLength = Number(stringProperty.maxLength);
      if (stringProperty.isPartOfIdentity) result.pattern = '^(?!\\s)(.*\\S)$';
      if (stringProperty.isRequired) result.pattern = '^(?!\\s*$).+';
      return result;
    }

    case 'time':
      return { type: 'string', format: 'time', description };

    case 'schoolYearEnumeration':
      if (property.parentEntity.type === 'common') {
        // For a common, the school year ends up being nested under a reference object
        return schoolYearEnumerationSchema;
      }

      return schoolYearSchema;

    case 'year':
      return { type: 'integer', description };

    case 'choice':
    case 'inlineCommon':
    default:
      return NoSchemaProperty;
  }
}

/**
 * Returns a JSON schema fragment that specifies the API body element shape
 * corresponding to the given reference collection property.
 */
function schemaArrayForReferenceCollection(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  schoolYearSchemas: SchoolYearSchemas,
): SchemaArray {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  const referenceName = uncapitalize(prefixedName(apiMapping.referenceCollectionName, propertyModifier));

  const referenceSchemaObject: SchemaObject = schemaObjectForReferentialProperty(
    property as ReferentialProperty,
    {
      ...propertyModifier,
      parentPrefixes: [], // reset prefixes inside the reference
    },
    schoolYearSchemas,
  );

  const referenceArrayElement: SchemaObject = schemaObjectFrom({ [referenceName]: referenceSchemaObject }, [referenceName]);

  return {
    ...schemaArrayFrom(referenceArrayElement),
    minItems: isSchemaPropertyRequired(property, propertyModifier) ? 1 : 0,
  };
}

/**
 * Returns a JSON schema fragment that specifies the API body element shape
 * corresponding to the given descriptor collection property.
 */
function schemaArrayForDescriptorCollection(property: EntityProperty, propertyModifier: PropertyModifier): SchemaArray {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  const descriptorName = uncapitalize(prefixedName(apiMapping.descriptorCollectionName, propertyModifier));

  const descriptorSchemaProperty: { [key: string]: SchemaProperty } = {
    [descriptorName]: { type: 'string', description: 'An Ed-Fi Descriptor' },
  };

  return {
    ...schemaArrayFrom(schemaObjectFrom(descriptorSchemaProperty, [descriptorName])),
    minItems: isSchemaPropertyRequired(property, propertyModifier) ? 1 : 0,
  };
}

/**
 * Returns a JSON schema fragment that specifies the API body element shape
 * corresponding to the given non-reference collection property.
 */
function schemaArrayForNonReferenceCollection(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  schoolYearSchemas: SchoolYearSchemas,
): SchemaArray {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  const propertyName = uncapitalize(singularize(prefixedName(apiMapping.fullNamePreservingPrefix, propertyModifier)));

  const schemaProperty: { [key: string]: SchemaProperty } = {
    [propertyName]: schemaPropertyForNonReference(property, schoolYearSchemas),
  };

  return {
    ...schemaArrayFrom(schemaObjectFrom(schemaProperty, [propertyName])),
    minItems: isSchemaPropertyRequired(property, propertyModifier) ? 1 : 0,
  };
}

/**
 * Returns a JSON schema fragment that specifies the API body shape
 * corresponding to a given school year enumeration reference.
 */
function schemaPropertyForSchoolYearEnumeration(
  property: EntityProperty,
  schoolYearEnumerationSchema: SchemaRoot,
): SchemaProperty {
  invariant(property.type === 'schoolYearEnumeration');

  return schoolYearEnumerationSchema;
}

/**
 * Returns a schema fragment that specifies the schema property of the API body element
 * corresponding to the given property
 */
function schemaPropertyFor(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  schoolYearSchemas: SchoolYearSchemas,
): SchemaProperty {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (apiMapping.isReferenceCollection) {
    return schemaArrayForReferenceCollection(property, propertyModifier, schoolYearSchemas);
  }
  if (apiMapping.isScalarReference) {
    return schemaObjectForReferentialProperty(property as ReferentialProperty, propertyModifier, schoolYearSchemas);
  }
  if (apiMapping.isDescriptorCollection) {
    return schemaArrayForDescriptorCollection(property, propertyModifier);
  }
  if (apiMapping.isCommonCollection) {
    return schemaArrayFrom(
      schemaObjectForScalarCommonProperty(property as CommonProperty, propertyModifier, schoolYearSchemas),
    );
  }
  if (apiMapping.isScalarCommon) {
    return schemaObjectForScalarCommonProperty(property as CommonProperty, propertyModifier, schoolYearSchemas);
  }
  if (property.isRequiredCollection || property.isOptionalCollection) {
    return schemaArrayForNonReferenceCollection(property, propertyModifier, schoolYearSchemas);
  }
  return schemaPropertyForNonReference(property, schoolYearSchemas);
}

/**
 * Adds a property name to the schema object's required field if required, creating the field if necessary.
 */
function addRequired(isRequired: boolean, schemaObject: SchemaObject, schemaPropertyName: string): void {
  if (!isRequired) return;
  if (schemaObject.required == null) {
    schemaObject.required = [];
  }
  schemaObject.required.push(schemaPropertyName);
}

/**
 * Builds an API JSON document schema that corresponds to a given MetaEd entity.
 */
function buildJsonSchema(entityForSchema: TopLevelEntity, schoolYearSchemas: SchoolYearSchemas): SchemaRoot {
  let schemaProperties: SchemaProperties = {};
  const extensionSchemaProperties: SchemaProperties = {};

  const schemaRoot: SchemaRoot = {
    ...newSchemaRoot(),
    type: 'object',
    title: `${entityForSchema.namespace.projectName}.${entityForSchema.metaEdName}`,
    description: entityForSchema.documentation,
    properties: schemaProperties,
    additionalProperties: false,
  };

  // DE/Association extension entity properties go under _ext
  if (entityForSchema.type === 'domainEntityExtension' || entityForSchema.type === 'associationExtension') {
    // New schemaProperties to go under _ext
    schemaProperties = {};
    const extensionSchemaName = entityForSchema.namespace.projectName.toLocaleLowerCase() as string;

    // New schemaProperties to go under extensionSchema (ex: tpdm)
    extensionSchemaProperties[`${extensionSchemaName}`] = {
      description: `${extensionSchemaName} extension properties collection`,
      type: 'object',
      properties: schemaProperties,
      additionalProperties: true,
    };

    // eslint-disable-next-line dot-notation
    schemaRoot.properties[`_ext`] = {
      description: 'optional extension collection',
      type: 'object',
      properties: extensionSchemaProperties,
      additionalProperties: true,
    };
  }

  const { collectedApiProperties } = entityForSchema.data.edfiApiSchema as EntityApiSchemaData;

  collectedApiProperties.forEach(({ property, propertyModifier }) => {
    const topLevelName = topLevelApiNameOnEntity(entityForSchema, property);
    const schemaObjectBaseName = uncapitalize(prefixedName(topLevelName, propertyModifier));

    const schemaProperty: SchemaProperty =
      property.type === 'schoolYearEnumeration'
        ? schemaPropertyForSchoolYearEnumeration(property, schoolYearSchemas.schoolYearEnumerationSchema)
        : schemaPropertyFor(property, propertyModifier, schoolYearSchemas);

    schemaProperties[schemaObjectBaseName] = schemaProperty;
    addRequired(isSchemaPropertyRequired(property, propertyModifier), schemaRoot, schemaObjectBaseName);
  });

  return schemaRoot;
}

/**
 * This enhancer uses the results of the ApiMappingEnhancer to create a JSON schema for insert
 * for each MetaEd entity. This schema is used to validate the API JSON document body
 * shape for each resource that corresponds to the MetaEd entity.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const schoolYearSchema: SchemaProperty = {
    type: 'integer',
    description: `A school year between ${metaEd.minSchoolYear} and ${metaEd.maxSchoolYear}`,
    minimum: metaEd.minSchoolYear,
    maximum: metaEd.maxSchoolYear,
  };

  const schoolYearEnumerationSchema: SchemaRoot = {
    ...newSchemaRoot(),
    type: 'object',
    title: 'EdFi.SchoolYearType',
    description: 'A school year enumeration',
    properties: {
      schoolYear: schoolYearSchema,
    },
    additionalProperties: false,
  };

  // Build schemas for each domain entity and association
  getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'association',
    'domainEntitySubclass',
    'associationSubclass',
    'associationExtension',
    'domainEntityExtension',
  ).forEach((entity) => {
    const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    entityApiSchemaData.jsonSchemaForInsert = buildJsonSchema(entity as TopLevelEntity, {
      schoolYearSchema,
      schoolYearEnumerationSchema,
    });
  });

  // Attach descriptor schema to each descriptor
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((entity) => {
    const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    entityApiSchemaData.jsonSchemaForInsert = descriptorSchema;
  });

  // Attach school year enumeration schema
  getAllEntitiesOfType(metaEd, 'schoolYearEnumeration').forEach((entity) => {
    const entityApiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
    entityApiSchemaData.jsonSchemaForInsert = schoolYearEnumerationSchema;
  });

  return {
    enhancerName,
    success: true,
  };
}
