// @flow
import { asTopLevelEntity, allTopLevelEntityModelTypes, getEntitiesOfType } from 'metaed-core';
import type { MetaEdEnvironment, EnhancerResult, EntityProperty, TopLevelEntity } from 'metaed-core';
import { NoTable } from './database/Table';
import type { Table } from './database/Table';

export type TopLevelEntityEdfiOds = {
  ods_TableName: string;
  ods_CascadePrimaryKeyUpdates: boolean;
  ods_Properties: Array<EntityProperty>;
  ods_IdentityProperties: Array<EntityProperty>;
  ods_EntityTable: Table;
  ods_Tables: Array<Table>;
};

const enhancerName: string = 'OdsTopLevelEntitySetupEnhancer';

export function addTopLevelEntityEdfiOdsTo(topLevelEntity: TopLevelEntity) {
  if (topLevelEntity.data.edfiOds == null) topLevelEntity.data.edfiOds = {};

  Object.assign(topLevelEntity.data.edfiOds, {
    ods_TableName: '',
    ods_CascadePrimaryKeyUpdates: false,
    ods_Properties: [...topLevelEntity.properties],
    ods_IdentityProperties: [...topLevelEntity.identityProperties],
    ods_EntityTable: NoTable,
    ods_Tables: [],
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfType(
    metaEd.entity,
    'enumeration',
    'schoolYearEnumeration',
    ...allTopLevelEntityModelTypes,
  ).forEach(entity => {
    addTopLevelEntityEdfiOdsTo(asTopLevelEntity(entity));
  });


  return {
    enhancerName,
    success: true,
  };
}
