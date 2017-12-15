// @flow
import type { EnhancerResult, EntityProperty, MetaEdEnvironment, PropertyType } from 'metaed-core';
import { getPropertiesOfType } from 'metaed-core';

export type ReferencePropertyEdfiOds = {
  ods_DeleteCascadePrimaryKey: boolean;
  ods_CausesCyclicUpdateCascade: boolean;
}

// Enhancer for object setup
const enhancerName: string = 'ReferencePropertySetupEnhancer';

export function addReferencePropertyEdfiOdsTo(property: EntityProperty) {
  if (property.data.edfiOds == null) property.data.edfiOds = {};

  Object.assign(property.data.edfiOds, {
    ods_DeleteCascadePrimaryKey: false,
    ods_CausesCyclicUpdateCascade: false,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getPropertiesOfType(metaEd.propertyIndex, 'association', 'domainEntity')
    .forEach((property: EntityProperty) => {
      addReferencePropertyEdfiOdsTo(property);
    });

  return {
    enhancerName,
    success: true,
  };
}

const referenceProperty: Array<PropertyType> = ['association', 'domainEntity'];
export const isOdsReferenceProperty = (property: EntityProperty): boolean => referenceProperty.includes(property.type);
