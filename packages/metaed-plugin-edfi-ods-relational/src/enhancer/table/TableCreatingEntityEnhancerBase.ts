import { EntityProperty, MetaEdEnvironment, SemVer, TopLevelEntity, versionSatisfies } from '@edfi/metaed-core';
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
export function buildTablesFromProperties(
  entity: TopLevelEntity,
  mainTable: Table,
  tables: Table[],
  targetTechnologyVersion: SemVer,
): void {
  const primaryKeys: Column[] = collectPrimaryKeys(entity, BuildStrategyDefault, columnCreatorFactory).map((x: Column) =>
    cloneColumn(x),
  );

  // For ODS/API 7+, collected primary keys of main tables need to be sorted
  if (versionSatisfies(targetTechnologyVersion, '>=7.0.0')) {
    primaryKeys.sort((a: Column, b: Column) => a.columnId.localeCompare(b.columnId));
  }

  entity.data.edfiOdsRelational.odsProperties.forEach((property: EntityProperty) => {
    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(property);
    tableBuilder.buildTables(
      property,
      TableStrategy.default(mainTable),
      primaryKeys,
      BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      null,
    );
  });

  // For ODS/API 7+, primary keys of main table needs to be brought to the front and sorted
  if (versionSatisfies(targetTechnologyVersion, '>=7.0.0')) {
    mainTable.columns.sort((a: Column, b: Column) => {
      // If neither are PKs, ignore
      if (!a.isPartOfPrimaryKey && !b.isPartOfPrimaryKey) return 0;
      // If first is a PK and second is not, it stays first
      if (a.isPartOfPrimaryKey && !b.isPartOfPrimaryKey) return -1;
      // If second is a PK and first is not, it needs to move up
      if (!a.isPartOfPrimaryKey && b.isPartOfPrimaryKey) return 1;
      // If they are both primary keys, order alphabetically
      return a.columnId.localeCompare(b.columnId);
    });
  }
}

export function buildMainTable(_metaEd: MetaEdEnvironment, entity: TopLevelEntity, aggregateRootTable: boolean): Table {
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
