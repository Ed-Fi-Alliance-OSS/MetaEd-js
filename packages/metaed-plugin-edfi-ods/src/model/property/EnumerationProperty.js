// @flow
import type { MetaEdEnvironment, EnhancerResult, EnumerationProperty } from 'metaed-core';
import { normalizeEnumerationSuffix, prependWithContextToMetaEdName } from '../../shared/Utility';
import type { EntityPropertyEdfiOds } from './EntityProperty';

export type EnumerationPropertyEdfiOds = EntityPropertyEdfiOds & {
  ods_TypeifiedBaseName: string;
}

// Enhancer for object setup
const enhancerName: string = 'EnumerationPropertySetupEnhancer';

export function odsTypeifiedBaseName(property: EnumerationProperty) {
  return normalizeEnumerationSuffix(property.metaEdName);
}

export function odsEnumerationName(property: EnumerationProperty) {
  return normalizeEnumerationSuffix(prependWithContextToMetaEdName(property.metaEdName, property.withContext));
}

export function addEnumerationPropertyEdfiOdsTo(property: EnumerationProperty) {
  if (property.data.edfiOds == null) property.data.edfiOds = {};

  Object.assign(property.data.edfiOds, {
    ods_TypeifiedBaseName: odsTypeifiedBaseName(property),
    ods_Name: odsEnumerationName(property),
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
