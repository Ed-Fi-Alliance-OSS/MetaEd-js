// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, EnumerationProperty } from '@edfi/metaed-core';
import { normalizeEnumerationSuffix } from '@edfi/metaed-core';
import { prependRoleNameToMetaEdName } from '../../shared/Utility';
import { EntityPropertyEdfiOds } from './EntityProperty';

export type EnumerationPropertyEdfiOds = EntityPropertyEdfiOds & {
  odsTypeifiedBaseName: string;
};

// Enhancer for object setup
const enhancerName = 'EnumerationPropertySetupEnhancer';

export function odsTypeifiedBaseName(property: EnumerationProperty) {
  return normalizeEnumerationSuffix(property.metaEdName);
}

export function odsEnumerationName(property: EnumerationProperty) {
  return normalizeEnumerationSuffix(prependRoleNameToMetaEdName(property.metaEdName, property.roleName));
}

export function addEnumerationPropertyEdfiOdsTo(property: EnumerationProperty) {
  if (property.data.edfiOdsRelational == null) property.data.edfiOdsRelational = {};

  Object.assign(property.data.edfiOdsRelational, {
    odsTypeifiedBaseName: odsTypeifiedBaseName(property),
    odsName: odsEnumerationName(property),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.enumeration.forEach((property: EnumerationProperty) => {
    addEnumerationPropertyEdfiOdsTo(property);
  });

  return {
    enhancerName,
    success: true,
  };
}
