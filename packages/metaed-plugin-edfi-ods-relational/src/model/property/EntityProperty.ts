import * as R from 'ramda';
import { getAllProperties, getAllTopLevelEntitiesForNamespaces } from '@edfi/metaed-core';
import { MetaEdEnvironment, EnhancerResult, EntityProperty } from '@edfi/metaed-core';
import { prependRoleNameToMetaEdName } from '../../shared/Utility';

export interface EntityPropertyEdfiOds {
  odsName: string;
  odsIsCollection: boolean;
  odsIsIdentityDatabaseType: boolean;
  odsIsUniqueIndex: boolean;
  odsContextPrefix: string;
  // True if this is a uniqueid property
  isUniqueIdProperty: boolean;
  // If this is a uniqueid property, the usi property spawned from it
  relatedUsiProperty?: EntityProperty;
  // True if this is an usi property
  isUsiProperty: boolean;
}

// Enhancer for object setup
const enhancerName = 'EntityPropertySetupEnhancer';

export function odsName(property: EntityProperty): string {
  return prependRoleNameToMetaEdName(property.metaEdName, property.roleName);
}
export function odsContextPrefix(property: EntityProperty): string {
  return R.isEmpty(property.shortenTo) || property.shortenTo == null ? property.roleName : property.shortenTo;
}

export function addEntityPropertyEdfiOdsTo(property: EntityProperty) {
  if (property.data.edfiOdsRelational == null) property.data.edfiOdsRelational = {};

  Object.assign(property.data.edfiOdsRelational, {
    odsName: odsName(property),
    odsIsCollection: property.isCollection,
    odsContextPrefix: odsContextPrefix(property),
    odsIsIdentityDatabaseType: false,
    odsIsUniqueIndex: false,
    isUniqueIdProperty: false,
    isUsiProperty: false,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  [
    ...getAllProperties(metaEd.propertyIndex),
    ...R.chain((x) => x.queryableFields, getAllTopLevelEntitiesForNamespaces(Array.from(metaEd.namespace.values()))),
  ].forEach((property: EntityProperty) => {
    addEntityPropertyEdfiOdsTo(property);
  });

  return {
    enhancerName,
    success: true,
  };
}
