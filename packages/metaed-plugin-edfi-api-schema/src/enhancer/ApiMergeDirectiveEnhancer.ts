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
  TopLevelEntity,
  MergeDirective,
} from '@edfi/metaed-core';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
import { PropertyModifier } from '../model/PropertyModifier';
import { newEqualityConstraint } from '../model/EqualityConstraint';

const enhancerName = 'ApiMergeDirectiveEnhancer';

function targetProperty(mergeDirective: MergeDirective): EntityProperty {
  return mergeDirective.targetPropertyChain[mergeDirective.targetPropertyChain.length - 1];
}

function sourceProperty(mergeDirective: MergeDirective): EntityProperty {
  return mergeDirective.sourcePropertyChain[mergeDirective.sourcePropertyChain.length - 1];
}

function sourceObjectForReferentialProperty(
  jsonPath: string,
  property: ReferentialProperty,
  propertyModifier: PropertyModifier,
): string {
  const referencedEntityApiMapping = (property.referencedEntity.data.edfiApiSchema as EntityApiSchemaData).apiMapping;

  let subJsonPath = '';

  referencedEntityApiMapping.flattenedIdentityProperties.forEach((identityProperty) => {
    const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

    subJsonPath += sourcePropertyFor(jsonPath, identityProperty, propertyModifier, apiMapping.isReferenceCollection);
    if (subJsonPath !== '') {
      if (apiMapping.isScalarReference) subJsonPath = `.${apiMapping.decollisionedTopLevelName}${subJsonPath}`;
      else subJsonPath = `${subJsonPath}`;
    }
  });

  return subJsonPath;
}

function targetObjectForReferentialProperty(
  jsonPath: string,
  property: ReferentialProperty,
  propertyModifier: PropertyModifier,
): string {
  const referencedEntityApiMapping = (property.referencedEntity.data.edfiApiSchema as EntityApiSchemaData).apiMapping;

  let subJsonPath = '';

  referencedEntityApiMapping.flattenedIdentityProperties.forEach((identityProperty) => {
    const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

    subJsonPath += targetPropertyFor(jsonPath, identityProperty, propertyModifier, apiMapping.isReferenceCollection);
    if (subJsonPath !== '') {
      if (apiMapping.isScalarReference) subJsonPath = `.${apiMapping.decollisionedTopLevelName}${subJsonPath}`;
      else subJsonPath = `${subJsonPath}`;
    }
  });

  return subJsonPath;
}

function sourcePropertyForNonReference(
  jsonPath: string,
  property: EntityProperty,
  fromReferenceCollection: boolean,
): string {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (jsonPath.indexOf(`.${apiMapping.fullName}`) === -1) {
    if (fromReferenceCollection) {
      return `.${apiMapping.fullName}=%value%`;
    }
    return `.${apiMapping.fullName}`;
  }

  return '';
}

function targetPropertyForNonReference(
  jsonPath: string,
  property: EntityProperty,
  fromReferenceCollection: boolean,
): string {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (jsonPath.indexOf(`.${apiMapping.fullName}`) === -1) {
    if (fromReferenceCollection) {
      return `.${apiMapping.fullName}=%value%`;
    }

    if (property.parentEntity.type === 'association' || property.parentEntity.type === 'domainEntity') {
      if (apiMapping.decollisionedTopLevelName === apiMapping.fullName) return `.${apiMapping.fullName}`;
      return `.${apiMapping.decollisionedTopLevelName}.${apiMapping.fullName}`;
    }

    return `.${apiMapping.fullName}`;
  }

  return '';
}

function sourceArrayForReferenceCollection(property: EntityProperty, propertyModifier: PropertyModifier): string {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  let subJsonPath = `.${apiMapping.decollisionedTopLevelName}[?(@.${apiMapping.referenceCollectionName}`;

  const referenceSchemaObject: string = sourceObjectForReferentialProperty(subJsonPath, property as ReferentialProperty, {
    ...propertyModifier,
    parentPrefixes: [],
  });

  subJsonPath += `${referenceSchemaObject})]`;

  return subJsonPath;
}

function targetArrayForReferenceCollection(property: ReferentialProperty, propertyModifier: PropertyModifier): string {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  let subJsonPath = `.${apiMapping.decollisionedTopLevelName}[?(@.${apiMapping.referenceCollectionName}`;

  const referenceSchemaObject: string = targetObjectForReferentialProperty(subJsonPath, property as ReferentialProperty, {
    ...propertyModifier,
    parentPrefixes: [],
  });

  subJsonPath += `${referenceSchemaObject})]`;

  return subJsonPath;
}

function sourcePropertyFor(
  jsonPath: string,
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  fromReferenceCollection: boolean,
): string {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (apiMapping.isReferenceCollection) {
    return sourceArrayForReferenceCollection(property, propertyModifier);
  }
  if (apiMapping.isScalarReference) {
    if (property.type === 'association' || property.type === 'domainEntity') {
      return sourceObjectForReferentialProperty(jsonPath, property as ReferentialProperty, propertyModifier);
    }
    return `.${apiMapping.decollisionedTopLevelName}`;
  }
  if (apiMapping.isCommonCollection) {
    return '';
  }
  if (apiMapping.isScalarCommon) {
    return '';
  }
  if (property.isRequiredCollection || property.isOptionalCollection) {
    return '';
  }
  return sourcePropertyForNonReference(jsonPath, property, fromReferenceCollection);
}

function targetPropertyFor(
  jsonPath: string,
  property: EntityProperty,
  propertyModifier: PropertyModifier,
  fromReferenceCollection: boolean,
): string {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (apiMapping.isReferenceCollection) {
    return targetArrayForReferenceCollection(property as ReferentialProperty, propertyModifier);
  }
  if (apiMapping.isScalarReference) {
    if (property.type === 'association' || property.type === 'domainEntity') {
      return targetObjectForReferentialProperty(jsonPath, property as ReferentialProperty, propertyModifier);
    }
  }
  if (apiMapping.isCommonCollection) {
    return '';
  }
  if (apiMapping.isScalarCommon) {
    return '';
  }
  if (property.isRequiredCollection || property.isOptionalCollection) {
    return '';
  }
  return targetPropertyForNonReference(jsonPath, property, fromReferenceCollection);
}

function sourceEqualityConstraintBuilder(propertyModifier: PropertyModifier, mergeDirective: MergeDirective): string {
  let subJsonPath = '$';
  mergeDirective.sourcePropertyChain.forEach((propertyChainElement) => {
    subJsonPath += sourcePropertyFor(subJsonPath, propertyChainElement, propertyModifier, false);
  });

  return subJsonPath;
}

function targetEqualityConstraintBuilder(propertyModifier: PropertyModifier, mergeDirective: MergeDirective): string {
  let subJsonPath = '$';
  mergeDirective.targetPropertyChain.forEach((propertyChainElement) => {
    subJsonPath += targetPropertyFor(subJsonPath, propertyChainElement, propertyModifier, false);
  });

  return subJsonPath;
}

function equalityConstraintElements(entityPathFor: TopLevelEntity) {
  const { collectedProperties } = entityPathFor.data.edfiApiSchema as EntityApiSchemaData;

  collectedProperties
    .filter(
      (property) =>
        (property.property as ReferentialProperty).mergeDirectives != null &&
        (property.property as ReferentialProperty).mergeDirectives.length > 0,
    )
    .forEach(({ property, propertyModifier }) => {
      const { apiMapping } = entityPathFor.data.edfiApiSchema as EntityApiSchemaData;
      apiMapping.equalityConstraints = [];
      (property as ReferentialProperty).mergeDirectives.forEach((mergeDirective) => {
        const equalityConstraint = newEqualityConstraint();
        equalityConstraint.equalityConstraintElementSource = {
          ...sourceProperty(mergeDirective),
          jsonPath: sourceEqualityConstraintBuilder(propertyModifier, mergeDirective),
        };
        equalityConstraint.equalityConstraintElementTarget = {
          ...targetProperty(mergeDirective),
          jsonPath: targetEqualityConstraintBuilder(propertyModifier, mergeDirective),
        };
        apiMapping.equalityConstraints?.push(equalityConstraint);
      });
    });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(metaEd, 'domainEntity', 'association', 'domainEntitySubclass', 'associationSubclass').forEach(
    (entity) => {
      equalityConstraintElements(entity as TopLevelEntity);
    },
  );

  return {
    enhancerName,
    success: true,
  };
}
