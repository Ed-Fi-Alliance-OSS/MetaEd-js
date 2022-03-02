import { asTopLevelEntity, getEntitiesOfTypeForNamespaces } from '@edfi/metaed-core';
import { TopLevelEntity, EnhancerResult, MetaEdEnvironment, ModelBase } from '@edfi/metaed-core';
import { addTables, buildMainTable, buildTablesFromProperties } from './TableCreatingEntityEnhancerBase';
import { Table } from '../../model/database/Table';

const enhancerName = 'AssociationSubclassTableEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfTypeForNamespaces(Array.from(metaEd.namespace.values()), 'associationSubclass')
    .map((x: ModelBase) => asTopLevelEntity(x))
    .forEach((entity: TopLevelEntity) => {
      const tables: Table[] = [];
      const mainTable: Table = buildMainTable(metaEd, entity, false);
      mainTable.existenceReason.isSubclassTable = true;
      tables.push(mainTable);
      buildTablesFromProperties(entity, mainTable, tables);
      entity.data.edfiOdsRelational.odsTables = tables;
      addTables(metaEd, tables);
    });

  return {
    enhancerName,
    success: true,
  };
}
