/* eslint-disable no-use-before-define */

import {
  getAllEntitiesOfType,
  MetaEdEnvironment,
  EnhancerResult,
  ReferentialProperty,
  EntityProperty,
  TopLevelEntity,
} from '@edfi/metaed-core';
import type { EntityApiSchemaData } from '../model/EntityApiSchemaData';
import type { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
import { newEqualityConstraint } from '../model/EqualityConstraint';

const enhancerName = 'EqualityConstraintEnhancer';

function sourceObjectForReferentialProperty(
  jsonPath: string,
  propertyChainElement: ReferentialProperty,
  isTopLevelElement: boolean,
): string {
  const referencedEntityApiMapping = (propertyChainElement.referencedEntity.data.edfiApiSchema as EntityApiSchemaData)
    .apiMapping;

  let subJsonPath = '';
  const subJsonPathArray: string[] = [];

  referencedEntityApiMapping.flattenedIdentityProperties.forEach((identityProperty) => {
    subJsonPath = propertyFor(jsonPath, identityProperty, false);
    if (subJsonPath !== '') {
      const { apiMapping } = propertyChainElement.data.edfiApiSchema as EntityPropertyApiSchemaData;
      if (isTopLevelElement) subJsonPathArray.push(`.${apiMapping.decollisionedTopLevelName}${subJsonPath}`);
      else subJsonPathArray.push(`${subJsonPath}`);
    }
  });

  return subJsonPathArray.join('');
}

function propertyForNonReference(
  jsonPath: string,
  propertyChainElement: EntityProperty,
  isTopLevelElement: boolean,
): string {
  const { apiMapping } = propertyChainElement.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (jsonPath.indexOf(`.${apiMapping.fullName}`) === -1) {
    if (!isTopLevelElement) return `.${apiMapping.fullName}`;
    return `.${apiMapping.decollisionedTopLevelName}.${apiMapping.fullName}`;
  }

  return '';
}

function arrayForReferenceCollection(property: EntityProperty): string {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  return `.${apiMapping.decollisionedTopLevelName}[*].${apiMapping.referenceCollectionName}`;
}

function propertyFor(jsonPath: string, propertyChainElement: EntityProperty, isTopLevelElement: boolean): string {
  const { apiMapping } = propertyChainElement.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (apiMapping.isReferenceCollection) {
    return arrayForReferenceCollection(propertyChainElement);
  }
  if (apiMapping.isScalarReference) {
    return sourceObjectForReferentialProperty(jsonPath, propertyChainElement as ReferentialProperty, isTopLevelElement);
  }
  if (apiMapping.isCommonCollection) {
    return '';
  }
  if (apiMapping.isScalarCommon) {
    return '';
  }
  if (propertyChainElement.isRequiredCollection || propertyChainElement.isOptionalCollection) {
    return '';
  }
  return propertyForNonReference(jsonPath, propertyChainElement, isTopLevelElement);
}

function equalityConstraintBuilder(propertyChain): string {
  let subJsonPath = '$';
  let elementIndex = 0;
  propertyChain.forEach((propertyChainElement) => {
    subJsonPath += propertyFor(subJsonPath, propertyChainElement, elementIndex === 0);
    elementIndex += 1;
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
    .forEach(({ property }) => {
      const { apiMapping } = entityPathFor.data.edfiApiSchema as EntityApiSchemaData;
      apiMapping.equalityConstraints = [];
      (property as ReferentialProperty).mergeDirectives.forEach((mergeDirective) => {
        const equalityConstraint = newEqualityConstraint();
        equalityConstraint.sourceJsonPath = equalityConstraintBuilder(mergeDirective.sourcePropertyChain);
        equalityConstraint.targetJsonPath = equalityConstraintBuilder(mergeDirective.targetPropertyChain);
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
