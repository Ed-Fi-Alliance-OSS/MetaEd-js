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
  NoOpenApiProperty,
  OpenApiArray,
  OpenApiObject,
  OpenApiProperties,
  OpenApiProperty,
  OpenApiReference,
} from '../model/OpenApi';
import { PropertyModifier, prefixedName, propertyModifierConcat } from '../model/PropertyModifier';
import { singularize, topLevelApiNameOnEntity, uncapitalize } from '../Utility';

const enhancerName = 'OpenApiRequestBodyComponentEnhancer';

type SchoolYearOpenApis = { schoolYearOpenApi: OpenApiProperty; schoolYearEnumerationOpenApi: OpenApiObject };

// All descriptor documents have the same OpenApi request body
const descriptorOpenApi: OpenApiObject = {
  type: 'object',
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
  required: ['namespace', 'codeValue', 'shortDescription'],
};

/**
 * Wraps a set of OpenApi properties and required field names with a OpenApi object
 */
function openApiObjectFrom(openApiProperties: OpenApiProperties, required: string[]): OpenApiObject {
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
 * Wraps a OpenApi property in an OpenApi array
 */
function openApiArrayFrom(openApiArrayElement: OpenApiProperty): OpenApiArray {
  return {
    type: 'array',
    items: openApiArrayElement,
    minItems: 0,
    uniqueItems: false,
  };
}

/**
 * Determines whether the OpenApi property for this entity property is required
 */
function isOpenApiPropertyRequired(property: EntityProperty, propertyModifier: PropertyModifier): boolean {
  return (
    (property.isRequired || property.isRequiredCollection || property.isPartOfIdentity) &&
    !propertyModifier.optionalDueToParent
  );
}

/**
 * Returns an OpenApiReference to the OpenApi reference component for the referenced entity
 */
function openApiReferenceFor(property: ReferentialProperty): OpenApiReference {
  return {
    $ref: `#/components/schemas/${property.referencedNamespaceName}_${property.referencedEntity.metaEdName}`,
  };
}

/**
 * Returns an OpenApi fragment that specifies the API body element shape
 * corresponding to the given scalar common property.
 */
function openApiObjectForScalarCommonProperty(
  property: CommonProperty,
  propertyModifier: PropertyModifier,
  schoolYearOpenApis: SchoolYearOpenApis,
): OpenApiObject {
  const openApiProperties: OpenApiProperties = {};
  const required: string[] = [];

  const { collectedApiProperties } = property.referencedEntity.data.edfiApiSchema as EntityApiSchemaData;

  collectedApiProperties.forEach((collectedApiProperty) => {
    const concatenatedPropertyModifier: PropertyModifier = propertyModifierConcat(
      propertyModifier,
      collectedApiProperty.propertyModifier,
    );

    const referencePropertyApiMapping = (collectedApiProperty.property.data.edfiApiSchema as EntityPropertyApiSchemaData)
      .apiMapping;
    const openApiPropertyName: string = uncapitalize(
      prefixedName(referencePropertyApiMapping.topLevelName, concatenatedPropertyModifier),
    );

    const openApiProperty: OpenApiProperty = openApiPropertyFor(
      collectedApiProperty.property,
      concatenatedPropertyModifier,
      schoolYearOpenApis,
    );

    openApiProperties[openApiPropertyName] = openApiProperty;
    if (isOpenApiPropertyRequired(collectedApiProperty.property, concatenatedPropertyModifier)) {
      required.push(openApiPropertyName);
    }
  });
  return openApiObjectFrom(openApiProperties, required);
}

/**
 * Returns an OpenApi fragment that specifies the API body element shape
 * corresponding to the given property.
 */
function openApiPropertyForNonReference(
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
      if (stringProperty.isPartOfIdentity) result.pattern = '^(?!\\s)(.*\\S)$';
      if (stringProperty.isRequired) result.pattern = '^(?!\\s*$).+';
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

/**
 * Returns a JSON openApi fragment that specifies the API body element shape
 * corresponding to the given reference collection property.
 */
function openApiArrayForReferenceCollection(property: EntityProperty, propertyModifier: PropertyModifier): OpenApiArray {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  const referenceName = uncapitalize(prefixedName(apiMapping.referenceCollectionName, propertyModifier));

  const referenceArrayElement: OpenApiObject = openApiObjectFrom(
    { [referenceName]: openApiReferenceFor(property as ReferentialProperty) },
    [referenceName],
  );

  return {
    ...openApiArrayFrom(referenceArrayElement),
    minItems: isOpenApiPropertyRequired(property, propertyModifier) ? 1 : 0,
  };
}

/**
 * Returns a JSON openApi fragment that specifies the API body element shape
 * corresponding to the given descriptor collection property.
 */
function openApiArrayForDescriptorCollection(property: EntityProperty, propertyModifier: PropertyModifier): OpenApiArray {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  const descriptorName = uncapitalize(prefixedName(apiMapping.descriptorCollectionName, propertyModifier));

  const descriptorOpenApiProperty: { [key: string]: OpenApiProperty } = {
    [descriptorName]: { type: 'string', description: 'An Ed-Fi Descriptor' },
  };

  return {
    ...openApiArrayFrom(openApiObjectFrom(descriptorOpenApiProperty, [descriptorName])),
    minItems: isOpenApiPropertyRequired(property, propertyModifier) ? 1 : 0,
  };
}

/**
 * Returns an OpenApi fragment that specifies the API body element shape
 * corresponding to the given non-reference collection property.
 */
function openApiArrayForNonReferenceCollection(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  schoolYearOpenApis: SchoolYearOpenApis,
): OpenApiArray {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  const propertyName = uncapitalize(singularize(prefixedName(apiMapping.fullName, propertyModifier)));

  const openApiProperty: { [key: string]: OpenApiProperty } = {
    [propertyName]: openApiPropertyForNonReference(property, schoolYearOpenApis),
  };

  return {
    ...openApiArrayFrom(openApiObjectFrom(openApiProperty, [propertyName])),
    minItems: isOpenApiPropertyRequired(property, propertyModifier) ? 1 : 0,
  };
}

/**
 * Returns an OpenApi fragment that specifies the API body shape
 * corresponding to a given school year enumeration reference.
 */
function openApiPropertyForSchoolYearEnumeration(
  property: EntityProperty,
  schoolYearEnumerationOpenApi: OpenApiObject,
): OpenApiProperty {
  invariant(property.type === 'schoolYearEnumeration');

  return schoolYearEnumerationOpenApi;
}

/**
 * Returns an OpenApi fragment that specifies the OpenApi property of the API body element
 * corresponding to the given property
 */
function openApiPropertyFor(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  schoolYearOpenApis: SchoolYearOpenApis,
): OpenApiProperty {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (apiMapping.isReferenceCollection) {
    return openApiArrayForReferenceCollection(property, propertyModifier);
  }
  if (apiMapping.isScalarReference) {
    return openApiReferenceFor(property as ReferentialProperty);
  }
  if (apiMapping.isDescriptorCollection) {
    return openApiArrayForDescriptorCollection(property, propertyModifier);
  }
  if (apiMapping.isCommonCollection) {
    return openApiArrayFrom(
      openApiObjectForScalarCommonProperty(property as CommonProperty, propertyModifier, schoolYearOpenApis),
    );
  }
  if (apiMapping.isScalarCommon) {
    return openApiObjectForScalarCommonProperty(property as CommonProperty, propertyModifier, schoolYearOpenApis);
  }
  if (property.isRequiredCollection || property.isOptionalCollection) {
    return openApiArrayForNonReferenceCollection(property, propertyModifier, schoolYearOpenApis);
  }
  return openApiPropertyForNonReference(property, schoolYearOpenApis);
}

/**
 * Adds a property name to the OpenApi object's required field if required, creating the field if necessary.
 */
function addRequired(isRequired: boolean, openApiObject: OpenApiObject, openApiPropertyName: string): void {
  if (!isRequired) return;
  if (openApiObject.required == null) {
    openApiObject.required = [];
  }
  openApiObject.required.push(openApiPropertyName);
}

/**
 * Builds an OpenApi request body that corresponds to a given MetaEd entity.
 */
function buildOpenApiRequestBody(entityForOpenApi: TopLevelEntity, schoolYearOpenApis: SchoolYearOpenApis): OpenApiObject {
  const openApiProperties: OpenApiProperties = {};

  const openApiRoot: OpenApiObject = {
    type: 'object',
    description: entityForOpenApi.documentation,
    properties: openApiProperties,
  };

  const { collectedApiProperties } = entityForOpenApi.data.edfiApiSchema as EntityApiSchemaData;

  collectedApiProperties.forEach(({ property, propertyModifier }) => {
    const topLevelName = topLevelApiNameOnEntity(entityForOpenApi, property);
    const openApiObjectBaseName = uncapitalize(prefixedName(topLevelName, propertyModifier));

    const openApiProperty: OpenApiProperty =
      property.type === 'schoolYearEnumeration'
        ? openApiPropertyForSchoolYearEnumeration(property, schoolYearOpenApis.schoolYearEnumerationOpenApi)
        : openApiPropertyFor(property, propertyModifier, schoolYearOpenApis);

    openApiProperties[openApiObjectBaseName] = openApiProperty;
    addRequired(isOpenApiPropertyRequired(property, propertyModifier), openApiRoot, openApiObjectBaseName);
  });

  return openApiRoot;
}

/**
 * This enhancer uses the results of the ApiMappingEnhancer to create an OpenApiRequestBody
 * for each MetaEd entity.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const schoolYearOpenApi: OpenApiProperty = {
    type: 'integer',
    description: `A school year between ${metaEd.minSchoolYear} and ${metaEd.maxSchoolYear}`,
    minimum: metaEd.minSchoolYear,
    maximum: metaEd.maxSchoolYear,
  };

  const schoolYearEnumerationOpenApi: OpenApiObject = {
    type: 'object',
    description: 'A school year enumeration',
    properties: {
      schoolYear: schoolYearOpenApi,
    },
  };

  // Build OpenApiRequestBody for each domain entity and association
  getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'association',
    'domainEntitySubclass',
    'associationSubclass',
    'associationExtension',
    'domainEntityExtension',
  ).forEach((entity) => {
    const entityApiOpenApiData = entity.data.edfiApiSchema as EntityApiSchemaData;
    entityApiOpenApiData.openApiRequestBodyComponent = buildOpenApiRequestBody(entity as TopLevelEntity, {
      schoolYearOpenApi,
      schoolYearEnumerationOpenApi,
    });
  });

  // Attach descriptor OpenApiRequestBody to each descriptor
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((entity) => {
    const entityApiOpenApiData = entity.data.edfiApiSchema as EntityApiSchemaData;
    entityApiOpenApiData.openApiRequestBodyComponent = descriptorOpenApi;
  });

  // Attach school year enumeration OpenApiRequestBody
  getAllEntitiesOfType(metaEd, 'schoolYearEnumeration').forEach((entity) => {
    const entityApiOpenApiData = entity.data.edfiApiSchema as EntityApiSchemaData;
    entityApiOpenApiData.openApiRequestBodyComponent = schoolYearEnumerationOpenApi;
  });

  return {
    enhancerName,
    success: true,
  };
}
