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
  // CommonProperty,
  TopLevelEntity,
  MergeDirective,
  // StringProperty,
  // IntegerProperty,
  // ShortProperty,
} from '@edfi/metaed-core';
// import { invariant } from 'ts-invariant';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
// import { NoSchemaProperty, SchemaArray, SchemaObject, SchemaProperties, SchemaProperty } from '../model/JsonSchema';
// import { PropertyModifier, prefixedName } from '../model/PropertyModifier';
import { /* singularize, */ pluralize, uncapitalize } from '../Utility';
import { newMerge } from '../model/Merge';
// import { MergeElement } from '../model/MergeElement';

const enhancerName = 'ApiMergeDirectiveEnhancer';

/**
 * Returns a new PropertyModifier that is the concatenation of two. Used for Commons and sub-Commons,
 * where there is a chain of parent modifiers that cannot be completely pre-computed
 * (without a different design, like pre-computing all possible paths).
 */
/* function propertyModifierConcat(p1: PropertyModifier, p2: PropertyModifier): PropertyModifier {
  return {
    optionalDueToParent: p1.optionalDueToParent || p2.optionalDueToParent,
    parentPrefixes: [...p1.parentPrefixes, ...p2.parentPrefixes],
  };
} */

/**
 * Wraps a set of schema properties and required field names with a schema object
 */
/* function schemaObjectFrom(schemaProperties: SchemaProperties, required: string[]): SchemaObject {
  const result: SchemaProperty = {
    type: 'object',
    properties: schemaProperties,
    additionalProperties: false,
  };

  if (required.length > 0) {
    result.required = required;
  }
  return result;
} */

/**
 * Wraps a schema property in a schema array
 */
/* function schemaArrayFrom(schemaArrayElement: SchemaProperty): SchemaArray {
  return {
    type: 'array',
    items: schemaArrayElement,
    minItems: 0,
    uniqueItems: false,
  };
} */

/**
 * Returns a JSON schema fragment that specifies the API body element shape
 * corresponding to the given referential property.
 */
/* function schemaObjectForReferentialProperty(
  property: ReferentialProperty,
  propertyModifier: PropertyModifier,
): SchemaObject {
  const schemaProperties: SchemaProperties = {};
  const required: Set<string> = new Set();

  const referencedEntityApiMapping = (property.referencedEntity.data.edfiApiSchema as EntityApiSchemaData).apiMapping;

  referencedEntityApiMapping.flattenedIdentityProperties.forEach((identityProperty) => {
    const identityPropertyApiMapping = (identityProperty.data.edfiApiSchema as EntityPropertyApiSchemaData).apiMapping;
    const schemaPropertyName: string = prefixedName(identityPropertyApiMapping.fullName, propertyModifier);

    const schemaProperty: SchemaProperty = schemaPropertyFor(identityProperty, propertyModifier);

    // Note that this key/value usage of Object implictly merges by overwrite if there is more than one scalar property
    // with the same name sourced from different identity reference properties. There is no need to check
    // properties for merge directive annotations because MetaEd has already validated merges and any scalar identity
    // property name duplication _must_ be a merge.
    schemaProperties[schemaPropertyName] = schemaProperty;
  });

  return schemaObjectFrom(schemaProperties, Array.from(required.values()));
} */

/**
 * Returns a JSON schema fragment that specifies the API body element shape
 * corresponding to the given scalar common property.
 */
/* function schemaObjectForScalarCommonProperty(property: CommonProperty, propertyModifier: PropertyModifier): SchemaObject {
  const schemaProperties: SchemaProperties = {};
  const required: string[] = [];

  const { collectedProperties } = property.referencedEntity.data.edfiApiSchema as EntityApiSchemaData;

  collectedProperties.forEach((collectedProperty) => {
    const concatenatedPropertyModifier: PropertyModifier = propertyModifierConcat(
      propertyModifier,
      collectedProperty.propertyModifier,
    );

    const referencePropertyApiMapping = (collectedProperty.property.data.edfiApiSchema as EntityPropertyApiSchemaData)
      .apiMapping;
    const schemaPropertyName: string = prefixedName(referencePropertyApiMapping.topLevelName, concatenatedPropertyModifier);

    const schemaProperty: SchemaProperty = schemaPropertyFor(collectedProperty.property, concatenatedPropertyModifier);

    schemaProperties[schemaPropertyName] = schemaProperty;
  });
  return schemaObjectFrom(schemaProperties, required);
} */

/**
 * Returns a JSON schema fragment that specifies the API body element shape
 * corresponding to the given property.
 */
/* function schemaPropertyForNonReference(property: EntityProperty): SchemaProperty {
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
      return result;
    }

    case 'time':
      return { type: 'string', format: 'time', description };

    case 'year':
      return { type: 'integer', description };

    case 'choice':
    case 'inlineCommon':
    default:
      return NoSchemaProperty;
  }
} */

/**
 * Returns a schema fragment that specifies the schema property of the API body element
 * corresponding to the given property
 */
/* function schemaPropertyFor(property: EntityProperty, propertyModifier: PropertyModifier): SchemaProperty {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (apiMapping.isReferenceCollection) {
    return schemaArrayForReferenceCollection(property, propertyModifier);
  }
  if (apiMapping.isScalarReference) {
    return schemaObjectForReferentialProperty(property as ReferentialProperty, propertyModifier);
  }
  if (apiMapping.isCommonCollection) {
    return schemaArrayFrom(schemaObjectForScalarCommonProperty(property as CommonProperty, propertyModifier));
  }
  if (apiMapping.isScalarCommon) {
    return schemaObjectForScalarCommonProperty(property as CommonProperty, propertyModifier);
  }
  if (property.isRequiredCollection || property.isOptionalCollection) {
    return schemaArrayForNonReferenceCollection(property, propertyModifier);
  }
  return schemaPropertyForNonReference(property);
} */

/**
 * Returns a JSON schema fragment that specifies the API body element shape
 * corresponding to the given reference collection property.
 */
/* function schemaArrayForReferenceCollection(property: EntityProperty, propertyModifier: PropertyModifier): SchemaArray {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  const referenceName = prefixedName(apiMapping.referenceCollectionName, propertyModifier);

  const referenceSchemaObject: SchemaObject = schemaObjectForReferentialProperty(property as ReferentialProperty, {
    ...propertyModifier,
    parentPrefixes: [], // reset prefixes inside the reference
  });

  const referenceArrayElement: SchemaObject = schemaObjectFrom({ [referenceName]: referenceSchemaObject }, [referenceName]);

  return {
    ...schemaArrayFrom(referenceArrayElement),
  };
} */

/**
 * Returns a JSON schema fragment that specifies the API body element shape
 * corresponding to the given non-reference collection property.
 */
/* function schemaArrayForNonReferenceCollection(property: EntityProperty, propertyModifier: PropertyModifier): SchemaArray {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
  const propertyName = singularize(prefixedName(apiMapping.fullName, propertyModifier));

  const schemaProperty: { [key: string]: SchemaProperty } = {
    [propertyName]: schemaPropertyForNonReference(property),
  };

  return {
    ...schemaArrayFrom(schemaObjectFrom(schemaProperty, [propertyName])),
  };
} */

function targetProperty(mergeDirective: MergeDirective): EntityProperty {
  return mergeDirective.sourcePropertyChain[mergeDirective.targetPropertyChain.length - 1];
}

function sourceProperty(mergeDirective: MergeDirective): EntityProperty {
  return mergeDirective.sourcePropertyChain[mergeDirective.sourcePropertyChain.length - 1];
}

function mergeTargetBuilder(property: ReferentialProperty, mergeDirective: MergeDirective): string {
  let jsonPathExpression = '';

  jsonPathExpression = '$';
  jsonPathExpression += `.${uncapitalize(property.parentEntityName)}`;

  mergeDirective.targetPropertyChain.forEach((propertyChainElement) => {
    const { apiMapping } = propertyChainElement.data.edfiApiSchema as EntityPropertyApiSchemaData;
    jsonPathExpression += `.${apiMapping.isScalarReference ? apiMapping.decollisionedTopLevelName : apiMapping.fullName}`;
  });

  return jsonPathExpression;
}

function mergeSourceBuilder(property: ReferentialProperty, mergeDirective: MergeDirective): string {
  let jsonPathExpression = '';
  jsonPathExpression = '$';
  jsonPathExpression += `.${uncapitalize(pluralize(property.fullPropertyName))}`;

  if (property.isCollection) jsonPathExpression += '[?(@';

  mergeDirective.sourcePropertyChain.forEach((propertyChainElement) => {
    const { apiMapping } = propertyChainElement.data.edfiApiSchema as EntityPropertyApiSchemaData;
    if (apiMapping.isReferenceCollection) jsonPathExpression += `.${apiMapping.referenceCollectionName}`;
    else if (apiMapping.isScalarReference) jsonPathExpression += `.${apiMapping.decollisionedTopLevelName}`;
    else jsonPathExpression += `.${apiMapping.fullName}`;
  });

  if (property.isCollection) jsonPathExpression += '=%value%)]';

  return jsonPathExpression;
}

function mergeElements(entityPathFor: TopLevelEntity) {
  const { collectedProperties } = entityPathFor.data.edfiApiSchema as EntityApiSchemaData;

  collectedProperties
    .filter(
      (property) =>
        (property.property as ReferentialProperty).mergeDirectives != null &&
        (property.property as ReferentialProperty).mergeDirectives.length > 0,
    )
    .forEach(({ property }) => {
      const referentialProperty: ReferentialProperty = property as ReferentialProperty;
      const { apiMapping } = entityPathFor.data.edfiApiSchema as EntityApiSchemaData;
      apiMapping.merges = [];
      (property as ReferentialProperty).mergeDirectives.forEach((mergeDirective) => {
        const merge = newMerge();
        merge.mergeSource = {
          ...sourceProperty(mergeDirective),
          JsonPath: mergeSourceBuilder(referentialProperty, mergeDirective),
        };
        merge.mergeTarget = {
          ...targetProperty(mergeDirective),
          JsonPath: mergeTargetBuilder(referentialProperty, mergeDirective),
        };
        apiMapping.merges?.push(merge);
      });
    });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      mergeElements(entity as TopLevelEntity);
    },
  );

  return {
    enhancerName,
    success: true,
  };
}
