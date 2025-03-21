// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';
import { EntityProperty, MergeDirectiveInfo, MetaEdPropertyPath, NoEntityProperty } from '@edfi/metaed-core';

/**
 * A flattened identity property is a simple property that is part of a reference identity for an
 * entity. It can come from a chain of identity references, in which case it is a "leaf" simple
 * property from the chain.
 *
 * propertyPaths is a list of all the reference property paths this "leaf" simple property
 * is a part of the identity for a given entity. For example, if it is a SchoolId on School,
 * in the context of a Section it is part of a Section's identity via this path of identity
 * references:
 *
 * Section.CourseOffering.Session.School.SchoolId
 *
 * It is also part of the identity of the paths of the higher level identity references:
 *
 * Section.CourseOffering.Session.School
 * Section.CourseOffering.Session
 * Section.CourseOffering
 * Section
 *
 * mergedAwayBy indicates that this flattened identity property is merged away due to a merge
 * directive. A merged away property is still visible in the document that it belongs to,
 * but is not expressed in a reference to that document.
 *
 * If a property is merged away, mergeCoveredBy refers to the FlattenedIdentityProperty that
 * is standing in for the merged away property.
 */
export type FlattenedIdentityProperty = {
  identityProperty: EntityProperty;
  propertyPaths: MetaEdPropertyPath[];
  propertyChain: EntityProperty[];
  mergedAwayBy: MergeDirectiveInfo | null;
  mergeCoveredBy: FlattenedIdentityProperty | null;
  mergeCovers: FlattenedIdentityProperty | null;
};

export function newFlattenedIdentityProperty(): FlattenedIdentityProperty {
  return {
    identityProperty: NoEntityProperty,
    propertyPaths: [],
    propertyChain: [],
    mergedAwayBy: null,
    mergeCoveredBy: null,
    mergeCovers: null,
  };
}

export const NoFlattenedIdentityProperty = deepFreeze(newFlattenedIdentityProperty());
