import { asTopLevelEntity, getEntitiesOfTypeForNamespaces } from 'metaed-core';
import { TopLevelEntity, EnhancerResult, MetaEdEnvironment, ModelBase } from 'metaed-core';
import { addTables, buildMainTable, buildTablesFromProperties } from './TableCreatingEntityEnhancerBase';
import { Table } from '../../model/database/Table';

const enhancerName = 'AssociationSubclassTableEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfTypeForNamespaces(Array.from(metaEd.namespace.values()), 'associationSubclass')
    .map((x: ModelBase) => asTopLevelEntity(x))
    .forEach((entity: TopLevelEntity) => {
      const tables: Array<Table> = [];
      const mainTable: Table = buildMainTable(metaEd, entity, false);
      tables.push(mainTable);
      buildTablesFromProperties(entity, mainTable, tables);
      entity.data.edfiOds.odsTables = tables;
      addTables(metaEd, tables);
    });

  return {
    enhancerName,
    success: true,
  };
}
