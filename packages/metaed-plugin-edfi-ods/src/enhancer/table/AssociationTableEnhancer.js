// @flow
import { asTopLevelEntity, getEntitiesOfType } from 'metaed-core';
import type { TopLevelEntity, EnhancerResult, MetaEdEnvironment, ModelBase } from 'metaed-core';
import { addTables, buildMainTable, buildTablesFromProperties } from '../table/TableCreatingEntityEnhancerBase';
import type { Table } from '../../model/database/Table';

const enhancerName: string = 'AssociationTableEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfType(metaEd.entity, 'association')
    .map((x: ModelBase) => asTopLevelEntity(x))
      .forEach((entity: TopLevelEntity) => {
        const tables: Array<Table> = [];
        const mainTable: Table = buildMainTable(entity, true);
        tables.push(mainTable);
        buildTablesFromProperties(entity, mainTable, tables);
        entity.data.edfiOds.ods_Tables = tables;
        addTables(metaEd, tables);
      });

  return {
    enhancerName,
    success: true,
  };
}
