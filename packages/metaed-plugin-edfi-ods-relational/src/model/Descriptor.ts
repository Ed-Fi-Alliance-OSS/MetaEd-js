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
