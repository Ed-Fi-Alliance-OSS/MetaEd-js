// @flow
import type { MetaEdEnvironment, EnhancerResult, DescriptorProperty } from 'metaed-core';
import { normalizeDescriptorSuffix, prependWithContextToMetaEdName } from '../../shared/Utility';
import type { EntityPropertyEdfiOds } from './EntityProperty';

export type DescriptorPropertyEdfiOds = EntityPropertyEdfiOds & {
  ods_DescriptorfiedBaseName: string;
}

// Enhancer for object setup
const enhancerName: string = 'DescriptorPropertySetupEnhancer';

export function odsDescriptorfiedBaseName(property: DescriptorProperty) {
  return normalizeDescriptorSuffix(property.metaEdName);
}

export function odsDescriptorName(property: DescriptorProperty) {
  return normalizeDescriptorSuffix(prependWithContextToMetaEdName(property.metaEdName, property.withContext));
}

export function addDescriptorPropertyEdfiOdsTo(property: DescriptorProperty) {
  if (property.data.edfiOds == null) property.data.edfiOds = {};

  Object.assign(property.data.edfiOds, {
    ods_DescriptorifiedBaseName: odsDescriptorfiedBaseName(property),
    ods_Name: odsDescriptorName(property),
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
