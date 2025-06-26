// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import {
  EnhancerResult,
  MetaEdEnvironment,
  PropertyType,
  EntityProperty,
  TopLevelEntity,
  ReferentialProperty,
  isReferentialProperty,
} from '@edfi/metaed-core';
import { getPropertiesOfType } from '@edfi/metaed-core';

const enhancerName = 'MergeDirectiveEnhancer';

const referenceTypes: PropertyType[] = [
  'association',
  'choice',
  'common',
  'descriptor',
  'domainEntity',
  'enumeration',
  'inlineCommon',
  'schoolYearEnumeration',
  'sharedDecimal',
  'sharedInteger',
  'sharedShort',
  'sharedString',
];

function findProperty(
  entity: TopLevelEntity,
  pathStrings: string[],
  propertyChainAccumulator: EntityProperty[],
): EntityProperty | null {
  const propertyName: string | undefined = pathStrings.pop();
  if (propertyName == null) return null;

  // first, look for property on the entity
  let property: EntityProperty | undefined = entity.properties.find((x) => x.fullPropertyName === propertyName);

  if (property == null) {
    // look for property on a parallel extension entity
    entity.extendedBy.forEach((extensionEntity) => {
      // currently limiting to extensions in the same namespace
      if (extensionEntity.namespace === entity.namespace) {
        property = extensionEntity.properties.find((x) => x.fullPropertyName === propertyName);
      }
    });
  }

  if (property == null) {
    // look for property on immediate superclass of this entity
    if (entity.baseEntity != null) {
      property = entity.baseEntity.properties.find((x) => x.fullPropertyName === propertyName);
    }
  }

  // terminate if we never found the property
  if (property == null) return null;

  // include this property in the chain
  propertyChainAccumulator.push(property);

  // done if we hit the end of the path
  if (pathStrings.length === 0) return property;

  // if property isn't referential, terminate early because the remaining path is invalid - the chain recorded how far we got
  if (!isReferentialProperty(property)) return null;

  // continue down the path
  return findProperty((property as ReferentialProperty).referencedEntity, pathStrings, propertyChainAccumulator);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getPropertiesOfType(metaEd.propertyIndex, ...referenceTypes)
    // TODO: As of METAED-881, the current property here could also be one of the shared simple properties, which
    // are not currently extensions of ReferentialProperty but have an equivalent mergeDirectives field
    .map((x) => x as ReferentialProperty)
    .filter((x) => !R.isEmpty(x.mergeDirectives))
    .forEach((property) => {
      property.mergeDirectives.forEach((mergeDirective) => {
        const sourcePropertyChain: EntityProperty[] = [];
        const targetPropertyChain: EntityProperty[] = [];

        mergeDirective.sourceProperty = findProperty(
          property.parentEntity,
          R.reverse(mergeDirective.sourcePropertyPathStrings),
          sourcePropertyChain,
        );
        mergeDirective.sourceMap.sourceProperty = mergeDirective.sourceMap.sourcePropertyPathStrings;
        mergeDirective.sourcePropertyChain = sourcePropertyChain;
        mergeDirective.sourceMap.sourcePropertyChain = mergeDirective.sourceMap.sourcePropertyPathStrings;
        if (mergeDirective.sourceProperty) {
          mergeDirective.sourceProperty.mergeSourcedBy.push({ mergeDirective, parentProperty: property });
        }

        mergeDirective.targetProperty = findProperty(
          property.parentEntity,
          R.reverse(mergeDirective.targetPropertyPathStrings),
          targetPropertyChain,
        );
        mergeDirective.sourceMap.targetProperty = mergeDirective.sourceMap.targetPropertyPathStrings;
        mergeDirective.targetPropertyChain = targetPropertyChain;
        mergeDirective.sourceMap.targetPropertyChain = mergeDirective.sourceMap.targetPropertyPathStrings;
        if (mergeDirective.targetProperty) {
          mergeDirective.targetProperty.mergeTargetedBy.push({ mergeDirective, parentProperty: property });
        }
      });
    });

  return {
    enhancerName,
    success: true,
  };
}
