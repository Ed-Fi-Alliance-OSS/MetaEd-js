// @flow
import type { EntityProperty, MetaEdEnvironment, PluginEnvironment, TopLevelEntity } from 'metaed-core';
import { BuildStrategyDefault } from './BuildStrategy';
import { cloneColumn } from '../../model/database/Column';
import { collectPrimaryKeys } from './PrimaryKeyCollector';
import { columnCreatorFactory } from './ColumnCreatorFactory';
import { newTable } from '../../model/database/Table';
import { pluginEnvironment } from '../EnhancerHelper';
import { tableBuilderFactory } from './TableBuilderFactory';
import { TableStrategy } from '../../model/database/TableStrategy';
import type { Column } from '../../model/database/Column';
import type { Table } from '../../model/database/Table';
import type { TableBuilder } from './TableBuilder';

// Build top level and sub level tables for the given top level entity,
// including columns for each property and cascading through special property types as needed
export function buildTablesFromProperties(
  entity: TopLevelEntity,
  mainTable: Table,
  tables: Array<Table>,
): void {
  const primaryKeys: Array<Column> =
    collectPrimaryKeys(entity, BuildStrategyDefault, columnCreatorFactory).map((x: Column) => cloneColumn(x));

  entity.data.edfiOds.ods_Properties.forEach((property: EntityProperty) => {
    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(property);
    tableBuilder.buildTables(property, TableStrategy.default(mainTable), primaryKeys, BuildStrategyDefault, tables);
  });
}

export function buildMainTable(entity: TopLevelEntity, withTimestamps: boolean): Table {
  const mainTable: Table = Object.assign(newTable(), {
    schema: entity.namespaceInfo.namespace,
    name: entity.data.edfiOds.ods_TableName,
    description: entity.documentation,
  });

  if (withTimestamps) {
    mainTable.includeCreateDateColumn = true;
    mainTable.includeLastModifiedDateAndIdColumn = true;
  }

  entity.data.edfiOds.ods_EntityTable = mainTable;

  return mainTable;
}

export function addTables(metaEd: MetaEdEnvironment, tables: Array<Table>): void {
  const plugin: ?PluginEnvironment = pluginEnvironment(metaEd);
  if (plugin == null) return;

  tables.forEach((table: Table) => plugin.entity.table.set(table.name, table));
}
