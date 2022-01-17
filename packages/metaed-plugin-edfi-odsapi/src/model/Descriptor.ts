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
