// @flow
import R from 'ramda';
import { getAllProperties, getAllTopLevelEntities } from 'metaed-core';
import type { MetaEdEnvironment, EnhancerResult, EntityProperty } from 'metaed-core';
import { prependWithContextToMetaEdName } from '../../shared/Utility';

export type EntityPropertyEdfiOds = {
  ods_Name: string;
  ods_IsCollection: boolean;
  ods_IsIdentityDatabaseType: boolean;
  ods_IsUniqueIndex: boolean;
  ods_ContextPrefix: string;
}

// Enhancer for object setup
const enhancerName: string = 'EntityPropertySetupEnhancer';

export function odsName(property: EntityProperty): string {
  return prependWithContextToMetaEdName(property.metaEdName, property.withContext);
}

export function odsIsCollection(property: EntityProperty): boolean {
  return property.isRequiredCollection || property.isOptionalCollection;
}

export function odsContextPrefix(property: EntityProperty): string {
  return R.isEmpty(property.shortenTo) || property.shortenTo == null ? property.withContext : property.shortenTo;
}

export function addEntityPropertyEdfiOdsTo(property: EntityProperty) {
  if (property.data.edfiOds == null) property.data.edfiOds = {};

  Object.assign(property.data.edfiOds, {
    ods_Name: odsName(property),
    ods_IsCollection: odsIsCollection(property),
    ods_ContextPrefix: odsContextPrefix(property),
    ods_IsIdentityDatabaseType: false,
    ods_IsUniqueIndex: false,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  [...getAllProperties(metaEd.propertyIndex), ...R.chain(x => x.queryableFields, getAllTopLevelEntities(metaEd.entity))]
  .forEach((property: EntityProperty) => {
    addEntityPropertyEdfiOdsTo(property);
  });

  return {
    enhancerName,
    success: true,
  };
}
