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
