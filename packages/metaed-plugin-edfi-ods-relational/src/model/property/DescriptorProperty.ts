// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, DescriptorProperty } from '@edfi/metaed-core';
import { normalizeDescriptorSuffix } from '@edfi/metaed-core';
import { prependRoleNameToMetaEdName } from '../../shared/Utility';

import { EntityPropertyEdfiOds } from './EntityProperty';

export type DescriptorPropertyEdfiOds = EntityPropertyEdfiOds & {
  odsDescriptorifiedBaseName: string;
};

// Enhancer for object setup
const enhancerName = 'DescriptorPropertySetupEnhancer';

export function odsDescriptorfiedBaseName(property: DescriptorProperty) {
  return normalizeDescriptorSuffix(property.metaEdName);
}

export function odsDescriptorName(property: DescriptorProperty) {
  return normalizeDescriptorSuffix(prependRoleNameToMetaEdName(property.metaEdName, property.roleName));
}

export function addDescriptorPropertyEdfiOdsTo(property: DescriptorProperty) {
  if (property.data.edfiOdsRelational == null) property.data.edfiOdsRelational = {};

  Object.assign(property.data.edfiOdsRelational, {
    odsDescriptorifiedBaseName: odsDescriptorfiedBaseName(property),
    odsName: odsDescriptorName(property),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.descriptor.forEach((property: DescriptorProperty) => {
    addDescriptorPropertyEdfiOdsTo(property);
  });

  return {
    enhancerName,
    success: true,
  };
}
