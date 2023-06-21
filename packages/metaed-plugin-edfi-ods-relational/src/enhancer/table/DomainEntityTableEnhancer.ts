import { asTopLevelEntity, getEntitiesOfTypeForNamespaces, targetTechnologyVersionFor } from '@edfi/metaed-core';
import { TopLevelEntity, EnhancerResult, MetaEdEnvironment, ModelBase } from '@edfi/metaed-core';
import { addTables, buildMainTable, buildTablesFromProperties } from './TableCreatingEntityEnhancerBase';
import { Table } from '../../model/database/Table';

const enhancerName = 'DomainEntityTableEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfTypeForNamespaces(Array.from(metaEd.namespace.values()), 'domainEntity')
    .map((x: ModelBase) => asTopLevelEntity(x))
    .forEach((entity: TopLevelEntity) => {
      const tables: Table[] = [];
      const mainTable: Table = buildMainTable(metaEd, entity, true);
      tables.push(mainTable);
      buildTablesFromProperties(entity, mainTable, tables, targetTechnologyVersionFor('edfiOdsRelational', metaEd));
      entity.data.edfiOdsRelational.odsTables = tables;
      addTables(metaEd, tables);
    });

  return {
    enhancerName,
    success: true,
  };
}
