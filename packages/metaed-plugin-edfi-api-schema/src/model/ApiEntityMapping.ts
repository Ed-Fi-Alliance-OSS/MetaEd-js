// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import type { EntityProperty, TopLevelEntity } from '@edfi/metaed-core';
import type { CollectedProperty } from './CollectedProperty';
import type { ReferenceGroup } from './ReferenceComponent';
import type { FlattenedIdentityProperty } from './FlattenedIdentityProperty';

/**
 * API shape metadata for a MetaEd entity.
 */
export type ApiEntityMapping = {
  /**
   * All of the identity properties of the entity, in sorted order.
   * Includes identity properties pulled up from InlineCommons
   */
  allIdentityProperties: EntityProperty[];

  /**
   * The non-reference properties that make up the identity
   * of the entity, in sorted order. Includes the paths showing
   * how the property came to be part of the identity.
   */
  flattenedIdentityProperties: FlattenedIdentityProperty[];

  /**
   * The ReferenceGroups of all of the properties of the entity.
   */
  referenceGroups: ReferenceGroup[];

  /**
   * ApiPropertyMappings of all of the descriptor API-expressed properties on the entity.
   */
  descriptorCollectedApiProperties: CollectedProperty[];

  /**
   * If the entity for this mapping is in a subclass/superclass relationship, this is the superclass entity
   * (MetaEd only allows a single level of subclassing.)
   *
   * Example 1: If the entity for this mapping is School (subclass of EducationOrganization),
   *            then superclass would be EducationOrganization.
   * Example 2: If the entity is GradingPeriod (not a subclass), assignableTo would be null.
   */
  superclass: TopLevelEntity | null;
};

export function newApiEntityMapping(): ApiEntityMapping {
  return {
    allIdentityProperties: [],
    flattenedIdentityProperties: [],
    referenceGroups: [],
    descriptorCollectedApiProperties: [],
    superclass: null,
  };
}

export const NoApiEntityMapping: ApiEntityMapping = deepFreeze({
  ...newApiEntityMapping(),
});
