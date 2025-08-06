// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EntityProperty, StringProperty, IntegerProperty, ShortProperty, ReferentialProperty } from '@edfi/metaed-core';
import { invariant } from 'ts-invariant';
import {
  NoOpenApiProperty,
  OpenApiArray,
  OpenApiObject,
  OpenApiProperties,
  OpenApiProperty,
  OpenApiReference,
} from '../model/OpenApi';
import { PropertyModifier, prefixedName } from '../model/PropertyModifier';
import { deAcronym, singularize, uncapitalize } from '../Utility';
import { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';

export type SchoolYearOpenApis = {
  schoolYearOpenApi: OpenApiProperty;
  schoolYearEnumerationOpenApi: OpenApiObject;
  schoolYearEnumerationRef: string;
};

/**
 * Create new SchoolYearOpenApis
 */
export function newSchoolYearOpenApis(minSchoolYear: number, maxSchoolYear: number): SchoolYearOpenApis {
  const schoolYearOpenApi: OpenApiProperty = {
    type: 'integer',
    format: 'int32',
    description: `A school year between ${minSchoolYear} and ${maxSchoolYear}`,
    minimum: minSchoolYear,
    maximum: maxSchoolYear,
  };

  const schoolYearEnumerationOpenApi: OpenApiObject = {
    type: 'object',
    description: 'A school year enumeration',
    properties: {
      schoolYear: schoolYearOpenApi,
    },
    required: ['schoolYear'],
  };

  const schoolYearEnumerationRef = '#/components/schemas/EdFi_SchoolYearTypeReference';

  return {
    schoolYearOpenApi,
    schoolYearEnumerationOpenApi,
    schoolYearEnumerationRef,
  };
}

/**
 * Wraps a set of OpenApi properties and required field names with a OpenApi object
 */
export function openApiObjectFrom(openApiProperties: OpenApiProperties, required: string[]): OpenApiObject {
  const result: OpenApiProperty = {
    type: 'object',
    properties: openApiProperties,
  };

  if (required.length > 0) {
    result.required = required;
  }
  return result;
}

/**
 * Determines whether the OpenApi property for this entity property is required
 */
export function isOpenApiPropertyRequired(property: EntityProperty, propertyModifier: PropertyModifier): boolean {
  return (
    (property.isRequired || property.isRequiredCollection || property.isPartOfIdentity) &&
    !propertyModifier.optionalDueToParent
  );
}

/**
 * Returns an OpenApiReference to the OpenApi reference component for the referenced entity
 */
export function openApiReferenceFor(property: ReferentialProperty): OpenApiReference {
  return {
    $ref: `#/components/schemas/${deAcronym(property.referencedNamespaceName)}_${deAcronym(
      property.referencedEntity.metaEdName,
    )}_Reference`,
  };
}

/**
 * Wraps a OpenApi property in an OpenApi array
 */
export function openApiArrayFrom(openApiArrayElement: OpenApiProperty): OpenApiArray {
  return {
    type: 'array',
    items: openApiArrayElement,
    minItems: 0,
    uniqueItems: false,
  };
}

/**
 * Returns an OpenApi collection reference component name
 */
export function openApiCollectionReferenceNameFor(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  propertiesChain: EntityProperty[],
): string {
  const propertyName: string = singularize(prefixedName(property.fullPropertyName, propertyModifier));
  const parentEntitiesNameChain: string =
    propertiesChain.length > 0
      ? propertiesChain.map((chainedProperty) => chainedProperty.parentEntityName).join('_')
      : property.parentEntityName;
  const namespace: string =
    propertiesChain.length > 0
      ? propertiesChain[0].parentEntity.namespace.namespaceName
      : property.parentEntity.namespace.namespaceName;
  return `${deAcronym(namespace)}_${deAcronym(parentEntitiesNameChain)}_${deAcronym(propertyName)}`;
}

/**
 * Returns an OpenApi fragment that specifies the API body element shape
 * corresponding to the given property.
 */
export function openApiPropertyForNonReference(
  property: EntityProperty,
  { schoolYearOpenApi, schoolYearEnumerationRef }: SchoolYearOpenApis,
): OpenApiProperty {
  invariant(property.type !== 'association' && property.type !== 'common' && property.type !== 'domainEntity');

  const description: string = property.documentation;

  switch (property.type) {
    case 'boolean': {
      const result: OpenApiProperty = { type: 'boolean', description };
      if (property.isOptional) result['x-nullable'] = true;
      return result;
    }

    case 'currency':
    case 'decimal':
    case 'duration':
    case 'percent':
    case 'sharedDecimal': {
      const result: OpenApiProperty = { type: 'number', format: 'double', description };
      if (property.isOptional) result['x-nullable'] = true;
      return result;
    }

    case 'date': {
      const result: OpenApiProperty = { type: 'string', format: 'date', description };
      if (property.isOptional) result['x-nullable'] = true;
      return result;
    }

    case 'datetime': {
      const result: OpenApiProperty = { type: 'string', format: 'date-time', description };
      if (property.isOptional) result['x-nullable'] = true;
      return result;
    }

    case 'descriptor':
    case 'enumeration': {
      const result: OpenApiProperty = { type: 'string', description, maxLength: 306 };
      if (property.isOptional) result['x-nullable'] = true;
      return result;
    }

    case 'integer':
    case 'sharedInteger': {
      const integerProperty: IntegerProperty = property as IntegerProperty;
      const result: OpenApiProperty = {
        type: 'integer',
        description,
        format: integerProperty.hasBigHint ? 'int64' : 'int32',
      };
      if (integerProperty.minValue) result.minimum = Number(integerProperty.minValue);
      if (integerProperty.maxValue) result.maximum = Number(integerProperty.maxValue);
      if (integerProperty.isOptional) result['x-nullable'] = true;
      return result;
    }

    case 'short':
    case 'sharedShort': {
      const result: OpenApiProperty = { type: 'integer', description, format: 'int32' };
      const shortProperty: ShortProperty = property as ShortProperty;
      if (shortProperty.minValue) result.minimum = Number(shortProperty.minValue);
      if (shortProperty.maxValue) result.maximum = Number(shortProperty.maxValue);
      if (shortProperty.isOptional) result['x-nullable'] = true;
      return result;
    }

    case 'string':
    case 'sharedString': {
      const result: OpenApiProperty = { type: 'string', description };
      const stringProperty: StringProperty = property as StringProperty;
      if (stringProperty.minLength) result.minLength = Number(stringProperty.minLength);
      if (stringProperty.maxLength) result.maxLength = Number(stringProperty.maxLength);
      if (stringProperty.isOptional) result['x-nullable'] = true;
      return result;
    }

    case 'time': {
      const result: OpenApiProperty = { type: 'string', format: 'time', description };
      if (property.isOptional) result['x-nullable'] = true;
      return result;
    }

    case 'schoolYearEnumeration': {
      if (property.parentEntity.type === 'common') {
        // For a common, the school year ends up being nested under a reference object
        const result: OpenApiProperty = { $ref: schoolYearEnumerationRef };
        return result;
      }

      const result: OpenApiProperty = { ...schoolYearOpenApi };
      if (property.isOptional) result['x-nullable'] = true;
      return result;
    }

    case 'year': {
      const result: OpenApiProperty = { type: 'integer', description, format: 'int32' };
      if (property.isOptional) result['x-nullable'] = true;
      return result;
    }

    case 'choice':
    case 'inlineCommon':
    default:
      return NoOpenApiProperty;
  }
}

/**
 * Returns an OpenApi fragment that specifies the API body element shape
 * corresponding to the reference collection item for the given property.
 */
export function openApiArrayItemForReferenceCollection(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
): OpenApiObject {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  const referenceName = uncapitalize(prefixedName(apiMapping.referenceCollectionName, propertyModifier));

  return openApiObjectFrom({ [referenceName]: openApiReferenceFor(property as ReferentialProperty) }, [referenceName]);
}
