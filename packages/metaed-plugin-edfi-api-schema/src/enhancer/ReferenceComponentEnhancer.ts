// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/* eslint-disable no-use-before-define */

// may be a candidate for future addition to metaed-plugin-edfi-unified-advanced
import {
  EnhancerResult,
  MetaEdEnvironment,
  ReferentialProperty,
  EntityProperty,
  getAllProperties,
  InlineCommonProperty,
  TopLevelEntity,
} from '@edfi/metaed-core';
import { EntityPropertyApiSchemaData } from '../model/EntityPropertyApiSchemaData';
import { newReferenceElement, ReferenceComponent, newReferenceGroup } from '../model/ReferenceComponent';

const enhancerName = 'ReferenceComponentEnhancer';

/**
 * Builds reference components from InlineCommons with identity properties on the entity
 */
function referenceComponentsFromInlineCommons(entity: TopLevelEntity): ReferenceComponent[] {
  const inlineCommonProperties: InlineCommonProperty[] = entity.properties
    .filter((property) => property.type === 'inlineCommon')
    .map((property) => property as InlineCommonProperty);

  return inlineCommonProperties.map((inlineCommonProperty) => buildReferenceComponent(inlineCommonProperty));
}

/**
 * Recursively build ReferenceComponents for a given property.
 */
function buildReferenceComponent(sourceProperty: EntityProperty): ReferenceComponent {
  if (
    sourceProperty.type === 'association' ||
    sourceProperty.type === 'domainEntity' ||
    sourceProperty.type === 'inlineCommon'
  ) {
    const { referencedEntity } = sourceProperty as ReferentialProperty;
    const referenceComponents: ReferenceComponent[] = referencedEntity.identityProperties.map((identityProperty) =>
      buildReferenceComponent(identityProperty),
    );
    referenceComponents.push(...referenceComponentsFromInlineCommons(referencedEntity));

    referenceComponents.sort((a, b) => a.sourceProperty.fullPropertyName.localeCompare(b.sourceProperty.fullPropertyName));
    return {
      ...newReferenceGroup(),
      sourceProperty,
      referenceComponents,
    };
  }
  return {
    ...newReferenceElement(),
    sourceProperty,
  };
}

/**
 * This enhancer builds a ReferenceComponent object graph for every property.
 * The ReferenceComponent is added directly to the property.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllProperties(metaEd.propertyIndex).forEach((property) => {
    (property.data.edfiApiSchema as EntityPropertyApiSchemaData).referenceComponent = buildReferenceComponent(property);
  });

  return {
    enhancerName,
    success: true,
  };
}
