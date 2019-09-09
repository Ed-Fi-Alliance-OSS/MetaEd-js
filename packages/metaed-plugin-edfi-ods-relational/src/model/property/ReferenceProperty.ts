import { EnhancerResult, EntityProperty, MetaEdEnvironment } from 'metaed-core';
import { getPropertiesOfType } from 'metaed-core';

export interface ReferencePropertyEdfiOds {
  odsDeleteCascadePrimaryKey: boolean;
  odsCausesCyclicUpdateCascade: boolean;
  odsIsReferenceToSuperclass: boolean;
  odsIsReferenceToExtensionParent: boolean;
}

// Enhancer for object setup
const enhancerName = 'ReferencePropertySetupEnhancer';

export function addReferencePropertyEdfiOdsTo(property: EntityProperty) {
  if (property.data.edfiOdsRelational == null) property.data.edfiOdsRelational = {};

  Object.assign(property.data.edfiOdsRelational, {
    odsDeleteCascadePrimaryKey: false,
    odsCausesCyclicUpdateCascade: false,
    odsIsReferenceToSuperclass: false,
    odsIsReferenceToExtensionParent: false,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getPropertiesOfType(metaEd.propertyIndex, 'association', 'domainEntity').forEach((property: EntityProperty) => {
    addReferencePropertyEdfiOdsTo(property);
  });

  return {
    enhancerName,
    success: true,
  };
}

export const isOdsReferenceProperty = (property: EntityProperty): boolean =>
  ['association', 'domainEntity'].includes(property.type);

export const isOdsMergeableProperty = (property: EntityProperty): boolean =>
  ['association', 'domainEntity', 'sharedDecimal', 'sharedInteger', 'sharedShort', 'sharedString'].includes(property.type);
