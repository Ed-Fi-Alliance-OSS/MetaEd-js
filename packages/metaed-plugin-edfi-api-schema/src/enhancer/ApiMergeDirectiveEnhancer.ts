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
import { pluralize, uncapitalize } from '../Utility';
import { newMerge } from '../model/EqualityConstraint';

const enhancerName = 'ApiMergeDirectiveEnhancer';

function targetProperty(mergeDirective: MergeDirective): EntityProperty {
  return mergeDirective.targetPropertyChain[mergeDirective.targetPropertyChain.length - 1];
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
    if (apiMapping.isReferenceCollection) jsonPathExpression += `.${apiMapping.referenceCollectionName}`;
    else if (apiMapping.isScalarReference) {
      if (propertyChainElement.type === 'association' || propertyChainElement.type === 'domainEntity') {
        const identityProperties = (propertyChainElement as ReferentialProperty).referencedEntity.identityProperties.map(
          (identityProperty) => `${uncapitalize(identityProperty.fullPropertyName)}=%value%`,
        );
        jsonPathExpression += '.';
        jsonPathExpression += identityProperties.join('&&');
      } else {
        jsonPathExpression += `.${apiMapping.decollisionedTopLevelName}`;
      }
    } else {
      jsonPathExpression += `.${apiMapping.fullName}=%value%`;
    }
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
    else if (apiMapping.isScalarReference) {
      if (propertyChainElement.type === 'association' || propertyChainElement.type === 'domainEntity') {
        const identityProperties = (propertyChainElement as ReferentialProperty).referencedEntity.identityProperties.map(
          (identityProperty) => `${uncapitalize(identityProperty.fullPropertyName)}=%value%`,
        );
        jsonPathExpression += '.';
        jsonPathExpression += identityProperties.join('&&');
      } else {
        jsonPathExpression += `.${apiMapping.decollisionedTopLevelName}`;
      }
    } else {
      jsonPathExpression += `.${apiMapping.fullName}=%value%`;
    }
  });

  if (property.isCollection) jsonPathExpression += ')]';

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
      apiMapping.qualityConstraints = [];
      (property as ReferentialProperty).mergeDirectives.forEach((mergeDirective) => {
        const merge = newMerge();
        merge.mergeSource = {
          ...sourceProperty(mergeDirective),
          jsonPath: mergeSourceBuilder(referentialProperty, mergeDirective),
        };
        merge.mergeTarget = {
          ...targetProperty(mergeDirective),
          jsonPath: mergeTargetBuilder(referentialProperty, mergeDirective),
        };
        apiMapping.qualityConstraints?.push(merge);
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
