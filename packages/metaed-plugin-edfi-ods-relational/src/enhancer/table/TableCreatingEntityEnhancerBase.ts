import { EntityProperty, MetaEdEnvironment, TopLevelEntity } from '@edfi/metaed-core';
import { BuildStrategyDefault } from './BuildStrategy';
import { cloneColumn } from '../../model/database/Column';
import { collectPrimaryKeys } from './PrimaryKeyCollector';
import { columnCreatorFactory } from './ColumnCreatorFactory';
import { newTable, newTableNameComponent, newTableExistenceReason, newTableNameGroup } from '../../model/database/Table';
import { tableEntities } from '../EnhancerHelper';
import { tableBuilderFactory } from './TableBuilderFactory';
import { TableStrategy } from '../../model/database/TableStrategy';
import { Column } from '../../model/database/Column';
import { Table } from '../../model/database/Table';
import { TableBuilder } from './TableBuilder';

// Build top level and sub level tables for the given top level entity,
// including columns for each property and cascading through special property types as needed
export function buildTablesFromProperties(entity: TopLevelEntity, mainTable: Table, tables: Table[]): void {
  const primaryKeys: Column[] = collectPrimaryKeys(entity, BuildStrategyDefault, columnCreatorFactory).map((x: Column) =>
    cloneColumn(x),
  );

  entity.data.edfiOdsRelational.odsProperties.forEach((property: EntityProperty) => {
    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(property);
    tableBuilder.buildTables(property, TableStrategy.default(mainTable), primaryKeys, BuildStrategyDefault, tables, null);
  });
}

// @ts-ignore - "metaEd" is never read
export function buildMainTable(metaEd: MetaEdEnvironment, entity: TopLevelEntity, aggregateRootTable: boolean): Table {
  const mainTable: Table = {
    ...newTable(),
    namespace: entity.namespace,
    schema: entity.namespace.namespaceName.toLowerCase(),
    tableId: entity.data.edfiOdsRelational.odsTableId,
    nameGroup: {
      ...newTableNameGroup(),
      nameElements: [
        {
          ...newTableNameComponent(),
          name: entity.data.edfiOdsRelational.odsTableId,
          isDerivedFromEntityMetaEdName: true,
          sourceEntity: entity,
        },
      ],
      sourceEntity: entity,
    },

    existenceReason: {
      ...newTableExistenceReason(),
      isEntityMainTable: true,
      parentEntity: entity,
    },
    description: entity.documentation,
    parentEntity: entity,
    isEntityMainTable: true,
  };

  if (aggregateRootTable) {
    mainTable.includeCreateDateColumn = true;
    mainTable.includeLastModifiedDateAndIdColumn = true;
    mainTable.isAggregateRootTable = true;
  }

  entity.data.edfiOdsRelational.odsEntityTable = mainTable;

  return mainTable;
}

export function addTables(metaEd: MetaEdEnvironment, tables: Table[]): void {
  tables.forEach((table: Table) => {
    tableEntities(metaEd, table.namespace).set(table.tableId, table);
  });
}
