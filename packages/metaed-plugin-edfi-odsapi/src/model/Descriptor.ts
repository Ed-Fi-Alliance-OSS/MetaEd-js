// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, Descriptor } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { NoAggregate } from './domainMetadata/Aggregate';
import { Aggregate } from './domainMetadata/Aggregate';

export interface DescriptorEdfiOdsApi {
  typeAggregate: Aggregate;
}

const enhancerName = 'DescriptorSetupEnhancer';

export function addDescriptorEdfiOdsApiTo(descriptor: Descriptor) {
  if (descriptor.data.edfiOdsApi == null) descriptor.data.edfiOdsApi = {};

  Object.assign(descriptor.data.edfiOdsApi, {
    typeAggregate: NoAggregate,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'descriptor') as Descriptor[]).forEach((descriptor: Descriptor) => {
    addDescriptorEdfiOdsApiTo(descriptor);
  });

  return {
    enhancerName,
    success: true,
  };
}
