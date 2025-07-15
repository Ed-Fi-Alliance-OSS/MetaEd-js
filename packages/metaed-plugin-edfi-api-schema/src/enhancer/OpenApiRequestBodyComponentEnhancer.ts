// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  ReferentialProperty,
  EntityProperty,
  TopLevelEntity,
  CommonProperty,
} from '@edfi/metaed-core';
import { invariant } from 'ts-invariant';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
import { OpenApiArray, OpenApiObject, OpenApiProperties, OpenApiProperty, OpenApiReference } from '../model/OpenApi';
import {
  ED_FI_DEPRECATED_EXTENSION_KEY,
  ED_FI_DEPRECATED_REASONS_EXTENSION_KEY,
  ED_FI_IDENTITY_EXTENSION_KEY,
  ED_FI_NULLABLE_EXTENSION_KEY,
} from '../model/OpenApiTypes';
import { PropertyModifier, prefixedName, propertyModifierConcat } from '../model/PropertyModifier';
import { topLevelApiNameOnEntity, uncapitalize } from '../Utility';
import {
  openApiObjectFrom,
  isOpenApiPropertyRequired,
  SchoolYearOpenApis,
  openApiPropertyForNonReference,
  newSchoolYearOpenApis,
  openApiCollectionReferenceNameFor,
  openApiArrayFrom,
  openApiReferenceFor,
} from './OpenApiComponentEnhancerBase';

const enhancerName = 'OpenApiRequestBodyComponentEnhancer';

// All descriptor documents have the same OpenApi request body
const descriptorOpenApi: OpenApiObject = {
  type: 'object',
  description: 'An Ed-Fi Descriptor',
  properties: {
    id: {
      type: 'string',
      description: '',
    },
    namespace: {
      type: 'string',
      description: 'The descriptor namespace as a URI',
      maxLength: 255,
      minLength: 1,
      pattern: '^(?!\\s).*(?<!\\s)$',
      [ED_FI_IDENTITY_EXTENSION_KEY]: true,
    },
    codeValue: {
      type: 'string',
      description: 'The descriptor code value',
      maxLength: 50,
      minLength: 1,
      pattern: '^(?!\\s).*(?<!\\s)$',
      [ED_FI_IDENTITY_EXTENSION_KEY]: true,
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
      [ED_FI_NULLABLE_EXTENSION_KEY]: true,
    },
    effectiveBeginDate: {
      type: 'string',
      format: 'date',
      description: 'The descriptor effective begin date',
      [ED_FI_NULLABLE_EXTENSION_KEY]: true,
    },
    effectiveEndDate: {
      type: 'string',
      format: 'date',
      description: 'The descriptor effective end date',
      [ED_FI_NULLABLE_EXTENSION_KEY]: true,
    },
  },
  required: ['namespace', 'codeValue', 'shortDescription'],
};

/**
 * Returns an OpenApi fragment that specifies the API body shape
 * corresponding to a given school year enumeration reference.
 */
function openApiPropertyForSchoolYearEnumeration(
  property: EntityProperty,
  schoolYearOpenApis: SchoolYearOpenApis,
): OpenApiProperty {
  invariant(property.type === 'schoolYearEnumeration');

  return { $ref: schoolYearOpenApis.schoolYearEnumerationRef };
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
 * Returns an OpenApi fragment that specifies the API body element shape
 * corresponding to the given scalar common property.
 */
export function openApiObjectForScalarCommonProperty(
  property: CommonProperty,
  propertyModifier: PropertyModifier,
  schoolYearOpenApis: SchoolYearOpenApis,
  propertiesChain: EntityProperty[],
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
    // eslint-disable-next-line no-use-before-define
    const openApiProperty: OpenApiProperty = openApiPropertyFor(
      collectedApiProperty.property,
      concatenatedPropertyModifier,
      schoolYearOpenApis,
      propertiesChain,
    );

    openApiProperties[openApiPropertyName] = openApiProperty;
    if (isOpenApiPropertyRequired(collectedApiProperty.property, concatenatedPropertyModifier)) {
      required.push(openApiPropertyName);
    }
  });
  return openApiObjectFrom(openApiProperties, required);
}

/**
 * Returns an OpenApiReference to the OpenApi non-reference component for the referenced entity
 */
function openApiNonResourceReferenceFor(fullName: string): OpenApiReference {
  return {
    $ref: `#/components/schemas/${fullName}`,
  };
}

/**
 * Returns an OpenApi fragment that specifies the API reference element shape
 * corresponding to the given scalar common property.
 */
export function openApiReferenceForScalarCommonProperty(
  property: CommonProperty,
  propertyModifier: PropertyModifier,
  propertiesChain: EntityProperty[],
): OpenApiReference {
  return openApiNonResourceReferenceFor(openApiCollectionReferenceNameFor(property, propertyModifier, propertiesChain));
}

/**
 * Returns an OpenApi array specification based on the provided collection property.
 */
function openApiArrayForNonResourceReferenceCollection(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  propertiesChain: EntityProperty[],
): OpenApiArray {
  return {
    ...openApiArrayFrom(
      openApiNonResourceReferenceFor(openApiCollectionReferenceNameFor(property, propertyModifier, propertiesChain)),
    ),
    minItems: isOpenApiPropertyRequired(property, propertyModifier) ? 1 : 0,
  };
}

/**
 * Returns an OpenApi array specification based on the provided common collection property.
 */
function openApiArrayForCommonCollection(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  propertiesChain: EntityProperty[],
): OpenApiArray {
  const referenceName: string = openApiCollectionReferenceNameFor(property, propertyModifier, propertiesChain);
  return {
    ...openApiArrayFrom(openApiNonResourceReferenceFor(referenceName)),
    minItems: isOpenApiPropertyRequired(property, propertyModifier) ? 1 : 0,
  };
}

/**
 * Returns an OpenApi fragment that specifies the OpenApi property of the API body element
 * corresponding to the given property
 */
export function openApiPropertyFor(
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  schoolYearOpenApis: SchoolYearOpenApis,
  propertiesChain: EntityProperty[],
): OpenApiProperty {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (apiMapping.isReferenceCollection) {
    return openApiArrayForNonResourceReferenceCollection(property, propertyModifier, propertiesChain);
  }
  if (apiMapping.isScalarReference) {
    return openApiReferenceFor(property as ReferentialProperty);
  }
  if (apiMapping.isDescriptorCollection) {
    return openApiArrayForNonResourceReferenceCollection(property, propertyModifier, propertiesChain);
  }
  if (apiMapping.isCommonCollection) {
    return openApiArrayForCommonCollection(property, propertyModifier, propertiesChain);
  }
  if (apiMapping.isScalarCommon) {
    return openApiReferenceForScalarCommonProperty(property as CommonProperty, propertyModifier, propertiesChain);
  }
  if (property.isRequiredCollection || property.isOptionalCollection) {
    return openApiArrayForNonResourceReferenceCollection(property, propertyModifier, propertiesChain);
  }
  return openApiPropertyForNonReference(property, schoolYearOpenApis);
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

  collectedApiProperties.forEach(({ property, propertyModifier, propertyChain }) => {
    const topLevelName = topLevelApiNameOnEntity(entityForOpenApi, property);
    const openApiObjectBaseName = uncapitalize(prefixedName(topLevelName, propertyModifier));

    const openApiProperty: OpenApiProperty =
      property.type === 'schoolYearEnumeration'
        ? openApiPropertyForSchoolYearEnumeration(property, schoolYearOpenApis)
        : openApiPropertyFor(property, propertyModifier, schoolYearOpenApis, propertyChain);

    // Add x-Ed-Fi-isIdentity extension for identity properties that are NOT references
    if (property.isPartOfIdentity) {
      openApiProperty[ED_FI_IDENTITY_EXTENSION_KEY] = true;
    }
    // Add x-Ed-Fi-nullable extension for nullable identity properties
    if (property.isOptional) {
      openApiProperty[ED_FI_NULLABLE_EXTENSION_KEY] = true;
    }
    // Add x-Ed-Fi-deprecated extension for deprecated identity properties
    if (property.isDeprecated) {
      openApiProperty[ED_FI_DEPRECATED_EXTENSION_KEY] = true;
      openApiProperty[ED_FI_DEPRECATED_REASONS_EXTENSION_KEY] = property.deprecationReason;
    }

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
  const schoolYearOpenApis: SchoolYearOpenApis = newSchoolYearOpenApis(metaEd.minSchoolYear, metaEd.maxSchoolYear);

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
    entityApiOpenApiData.openApiRequestBodyComponent = buildOpenApiRequestBody(entity as TopLevelEntity, schoolYearOpenApis);
    entityApiOpenApiData.openApiRequestBodyComponentPropertyName = `${entity.namespace.namespaceName}_${entity.metaEdName}`;
  });

  // Attach descriptor OpenApiRequestBody to each descriptor
  getAllEntitiesOfType(metaEd, 'descriptor').forEach((entity) => {
    const entityApiOpenApiData = entity.data.edfiApiSchema as EntityApiSchemaData;
    entityApiOpenApiData.openApiRequestBodyComponent = descriptorOpenApi;
    entityApiOpenApiData.openApiRequestBodyComponentPropertyName = `${entity.namespace.namespaceName}_${entity.metaEdName}`;
  });

  // Attach school year enumeration OpenApiRequestBody
  getAllEntitiesOfType(metaEd, 'schoolYearEnumeration').forEach((entity) => {
    const entityApiOpenApiData = entity.data.edfiApiSchema as EntityApiSchemaData;
    entityApiOpenApiData.openApiRequestBodyComponent = schoolYearOpenApis.schoolYearEnumerationOpenApi;
    entityApiOpenApiData.openApiRequestBodyComponentPropertyName = `${entity.namespace.namespaceName}_${entity.metaEdName}`;
  });

  return {
    enhancerName,
    success: true,
  };
}
