// @flow
import { getEntitiesOfType } from 'metaed-core';
import type { EnhancerResult, MetaEdEnvironment, ModelBase } from 'metaed-core';
import { addTables } from '../table/TableCreatingEntityEnhancerBase';
import { enumerationTableCreator } from './EnumerationTableCreator';
import type { Table } from '../../model/database/Table';

const enhancerName: string = 'EnumerationTableEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfType(metaEd.entity, 'enumeration').forEach((entity: ModelBase) => {
    const table: Table = enumerationTableCreator.build(
      entity.metaEdName,
      entity.namespaceInfo.namespace,
      entity.documentation,
    );
    entity.data.edfiOds.ods_Tables = [table];
    addTables(metaEd, [table]);
  });

  return {
    enhancerName,
    success: true,
  };
}
