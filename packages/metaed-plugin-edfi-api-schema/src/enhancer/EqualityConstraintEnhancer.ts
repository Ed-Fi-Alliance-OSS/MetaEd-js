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
import { newEqualityConstraint } from '../model/EqualityConstraint';

const enhancerName = 'EqualityConstraintEnhancer';

function sourceObjectForReferentialProperty(jsonPath: string, property: ReferentialProperty): string {
  const referencedEntityApiMapping = (property.referencedEntity.data.edfiApiSchema as EntityApiSchemaData).apiMapping;

  let subJsonPath = '';
  const subJsonPathArray: string[] = [];

  referencedEntityApiMapping.flattenedIdentityProperties.forEach((identityProperty) => {
    const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;
    const apiMappingIdentityProperty = (identityProperty.data.edfiApiSchema as EntityPropertyApiSchemaData).apiMapping;

    subJsonPath = sourcePropertyFor(jsonPath, identityProperty);
    if (subJsonPath !== '') {
      if (apiMappingIdentityProperty.isScalarReference) subJsonPathArray.push(subJsonPath);
      else if (apiMapping.isReferenceCollection) subJsonPathArray.push(`${subJsonPath}`);
      else subJsonPathArray.push(`${subJsonPath}`);
    }
  });

  return subJsonPathArray.join('');
}

function targetObjectForReferentialProperty(jsonPath: string, property: ReferentialProperty): string {
  const referencedEntityApiMapping = (property.referencedEntity.data.edfiApiSchema as EntityApiSchemaData).apiMapping;

  let subJsonPath = '';
  const subJsonPathArray: string[] = [];

  referencedEntityApiMapping.flattenedIdentityProperties.forEach((identityProperty) => {
    const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

    subJsonPath = targetPropertyFor(jsonPath, identityProperty);
    if (subJsonPath !== '') {
      if (apiMapping.isScalarReference) subJsonPathArray.push(`.${apiMapping.decollisionedTopLevelName}${subJsonPath}`);
      else subJsonPathArray.push(subJsonPath);
    }
  });

  return subJsonPathArray.join('');
}

function sourcePropertyForNonReference(jsonPath: string, property: EntityProperty): string {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (jsonPath.indexOf(`.${apiMapping.fullName}`) === -1) {
    return `.${apiMapping.fullName}`;
  }

  return '';
}

function targetPropertyForNonReference(jsonPath: string, property: EntityProperty): string {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (jsonPath.indexOf(`.${apiMapping.fullName}`) === -1) {
    if (property.parentEntity.type === 'association' || property.parentEntity.type === 'domainEntity') {
      if (apiMapping.decollisionedTopLevelName === apiMapping.fullName) return `.${apiMapping.fullName}`;
      return `.${apiMapping.decollisionedTopLevelName}.${apiMapping.fullName}`;
    }

    return `.${apiMapping.fullName}`;
  }

  return '';
}

function arrayForReferenceCollection(property: EntityProperty): string {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  return `.${apiMapping.decollisionedTopLevelName}[*].${apiMapping.referenceCollectionName}`;
}

function sourcePropertyFor(jsonPath: string, property: EntityProperty): string {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (apiMapping.isReferenceCollection) {
    return arrayForReferenceCollection(property);
  }
  if (apiMapping.isScalarReference) {
    return sourceObjectForReferentialProperty(jsonPath, property as ReferentialProperty);
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
  return sourcePropertyForNonReference(jsonPath, property);
}

function targetPropertyFor(jsonPath: string, property: EntityProperty): string {
  const { apiMapping } = property.data.edfiApiSchema as EntityPropertyApiSchemaData;

  if (apiMapping.isReferenceCollection) {
    return arrayForReferenceCollection(property as ReferentialProperty);
  }
  if (apiMapping.isScalarReference) {
    if (property.type === 'association' || property.type === 'domainEntity') {
      return targetObjectForReferentialProperty(jsonPath, property as ReferentialProperty);
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
  return targetPropertyForNonReference(jsonPath, property);
}

function sourceEqualityConstraintBuilder(mergeDirective: MergeDirective): string {
  let subJsonPath = '$';
  mergeDirective.sourcePropertyChain.forEach((propertyChainElement) => {
    subJsonPath += sourcePropertyFor(subJsonPath, propertyChainElement);
  });

  return subJsonPath;
}

function targetEqualityConstraintBuilder(mergeDirective: MergeDirective): string {
  let subJsonPath = '$';
  mergeDirective.targetPropertyChain.forEach((propertyChainElement) => {
    subJsonPath += targetPropertyFor(subJsonPath, propertyChainElement);
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
        equalityConstraint.sourceJsonPath = sourceEqualityConstraintBuilder(mergeDirective);
        equalityConstraint.targetJsonPath = targetEqualityConstraintBuilder(mergeDirective);
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
