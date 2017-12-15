// @flow
import type { MetaEdEnvironment, EnhancerResult, Descriptor } from 'metaed-core';
import { normalizeDescriptorSuffix } from '../shared/Utility';

export type DescriptorEdfiOds = {
  ods_DescriptorName: string;
  ods_IsMapType: boolean;
};

const enhancerName: string = 'OdsDescriptorSetupEnhancer';

export function addDescriptorEdfiOdsTo(descriptor: Descriptor) {
  if (descriptor.data.edfiOds == null) descriptor.data.edfiOds = {};

  Object.assign(descriptor.data.edfiOds, {
    ods_DescriptorName: normalizeDescriptorSuffix(descriptor.metaEdName),
    ods_IsMapType: descriptor.isMapTypeRequired || descriptor.isMapTypeOptional,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.entity.descriptor.forEach((descriptor: Descriptor) => {
    addDescriptorEdfiOdsTo(descriptor);
  });

  return {
    enhancerName,
    success: true,
  };
}
