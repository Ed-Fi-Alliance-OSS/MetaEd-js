// @flow
import { getEntitiesOfType } from 'metaed-core';
import type { EnhancerResult, MetaEdEnvironment, ModelBase } from 'metaed-core';
import { addTables } from '../table/TableCreatingEntityEnhancerBase';
import { schoolYearEnumerationTableCreator } from './SchoolYearEnumerationTableCreator';
import type { Table } from '../../model/database/Table';

const enhancerName: string = 'SchoolYearEnumerationTableEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfType(metaEd.entity, 'schoolYearEnumeration').forEach((entity: ModelBase) => {
    const table: Table = schoolYearEnumerationTableCreator.build(entity.namespaceInfo.namespace, entity.documentation);
    entity.data.edfiOds.ods_Tables = [table];
    addTables(metaEd, [table]);
  });

  return {
    enhancerName,
    success: true,
  };
}
