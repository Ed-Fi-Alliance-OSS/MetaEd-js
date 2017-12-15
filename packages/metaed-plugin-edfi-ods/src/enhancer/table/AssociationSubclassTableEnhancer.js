// @flow
import { asTopLevelEntity, getEntitiesOfType } from 'metaed-core';
import type { TopLevelEntity, EnhancerResult, MetaEdEnvironment, ModelBase } from 'metaed-core';
import { addTables, buildMainTable, buildTablesFromProperties } from '../table/TableCreatingEntityEnhancerBase';
import type { Table } from '../../model/database/Table';

const enhancerName: string = 'AssociationSubclassTableEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfType(metaEd.entity, 'associationSubclass')
    .map((x: ModelBase) => asTopLevelEntity(x))
      .forEach((entity: TopLevelEntity) => {
        const tables: Array<Table> = [];
        const mainTable: Table = buildMainTable(entity, false);
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
