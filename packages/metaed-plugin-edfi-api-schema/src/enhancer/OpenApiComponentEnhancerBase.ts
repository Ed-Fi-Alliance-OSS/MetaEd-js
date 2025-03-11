import { EntityProperty, StringProperty, IntegerProperty, ShortProperty } from '@edfi/metaed-core';
import { invariant } from 'ts-invariant';
import { NoOpenApiProperty, OpenApiObject, OpenApiProperties, OpenApiProperty } from '../model/OpenApi';
import { PropertyModifier, prefixedName } from '../model/PropertyModifier';
import { singularize } from '../Utility';

export type SchoolYearOpenApis = { schoolYearOpenApi: OpenApiProperty; schoolYearEnumerationOpenApi: OpenApiObject };

/**
 * Create new SchoolYearOpenApis
 */
export function newSchoolYearOpenApis(minSchoolYear: number, maxSchoolYear: number): SchoolYearOpenApis {
  const schoolYearOpenApi: OpenApiProperty = {
    type: 'integer',
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
  };

  return {
    schoolYearOpenApi,
    schoolYearEnumerationOpenApi,
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
  return `${namespace}_${parentEntitiesNameChain}_${propertyName}`;
}

/**
 * Returns an OpenApi fragment that specifies the API body element shape
 * corresponding to the given property.
 */
export function openApiPropertyForNonReference(
  property: EntityProperty,
  { schoolYearOpenApi, schoolYearEnumerationOpenApi }: SchoolYearOpenApis,
): OpenApiProperty {
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
      return { type: 'number', description };

    case 'date':
      return { type: 'string', format: 'date', description };

    case 'datetime':
      return { type: 'string', format: 'date-time', description };

    case 'descriptor':
    case 'enumeration':
      return { type: 'string', description };

    case 'integer':
    case 'sharedInteger': {
      const result: OpenApiProperty = { type: 'integer', description };
      const integerProperty: IntegerProperty = property as IntegerProperty;
      if (integerProperty.minValue) result.minimum = Number(integerProperty.minValue);
      if (integerProperty.maxValue) result.maximum = Number(integerProperty.maxValue);
      return result;
    }

    case 'short':
    case 'sharedShort': {
      const result: OpenApiProperty = { type: 'integer', description };
      const shortProperty: ShortProperty = property as ShortProperty;
      if (shortProperty.minValue) result.minimum = Number(shortProperty.minValue);
      if (shortProperty.maxValue) result.maximum = Number(shortProperty.maxValue);
      return result;
    }

    case 'string':
    case 'sharedString': {
      const result: OpenApiProperty = { type: 'string', description };
      const stringProperty: StringProperty = property as StringProperty;
      if (stringProperty.minLength) result.minLength = Number(stringProperty.minLength);
      if (stringProperty.maxLength) result.maxLength = Number(stringProperty.maxLength);
      return result;
    }

    case 'time':
      return { type: 'string', format: 'time', description };

    case 'schoolYearEnumeration':
      if (property.parentEntity.type === 'common') {
        // For a common, the school year ends up being nested under a reference object
        return schoolYearEnumerationOpenApi;
      }

      return schoolYearOpenApi;

    case 'year':
      return { type: 'integer', description };

    case 'choice':
    case 'inlineCommon':
    default:
      return NoOpenApiProperty;
  }
}
