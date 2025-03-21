// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  EnhancerResult,
  Descriptor,
  normalizeDescriptorSuffix,
  getAllEntitiesOfType,
} from '@edfi/metaed-core';

export interface DescriptorEdfiOds {
  odsDescriptorName: string;
  odsIsMapType: boolean;
}

const enhancerName = 'OdsDescriptorSetupEnhancer';

export function addDescriptorEdfiOdsTo(descriptor: Descriptor) {
  if (descriptor.data.edfiOdsRelational == null) descriptor.data.edfiOdsRelational = {};

  Object.assign(descriptor.data.edfiOdsRelational, {
    odsDescriptorName: normalizeDescriptorSuffix(descriptor.metaEdName),
    odsIsMapType: descriptor.isMapTypeRequired || descriptor.isMapTypeOptional,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'descriptor') as Descriptor[]).forEach((descriptor: Descriptor) => {
    addDescriptorEdfiOdsTo(descriptor);
  });

  return {
    enhancerName,
    success: true,
  };
}
