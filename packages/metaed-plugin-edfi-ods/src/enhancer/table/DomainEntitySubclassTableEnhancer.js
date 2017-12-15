// @flow
import R from 'ramda';
import { asTopLevelEntity, getEntitiesOfType } from 'metaed-core';
import type { EnhancerResult, EntityProperty, MetaEdEnvironment, ModelBase, TopLevelEntity } from 'metaed-core';
import { addForeignKey } from '../../model/database/Table';
import { addTables, buildMainTable, buildTablesFromProperties } from '../table/TableCreatingEntityEnhancerBase';
import { BuildStrategyDefault } from './BuildStrategy';
import { columnCreatorFactory } from './ColumnCreatorFactory';
import { newColumnNamePair } from '../../model/database/ColumnNamePair';
import { newForeignKey, addColumnNamePairs } from '../../model/database/ForeignKey';
import type { Column } from '../../model/database/Column';
import type { ColumnNamePair } from '../../model/database/ColumnNamePair';
import type { ForeignKey } from '../../model/database/ForeignKey';
import type { Table } from '../../model/database/Table';

const enhancerName: string = 'DomainEntitySubclassTableEnhancer';

function addForeignKeyToPrimaryKeyRename(table: Table, entity: TopLevelEntity): void {
  // NOTE: This should make flow ignores unnecessary but does not
  if (entity.baseEntity == null) return;

  entity.data.edfiOds.ods_Properties.forEach((keyRenameProperty: EntityProperty) => {
    if (!keyRenameProperty.isIdentityRename) return;

    const foreignKey: ForeignKey = Object.assign(newForeignKey(), {
      // $FlowIgnore - baseEntity could be null/undefined
      foreignTableSchema: entity.baseEntity.namespaceInfo.namespace,
      // $FlowIgnore - baseEntity could be null/undefined
      foreignTableName: entity.baseEntity.data.edfiOds.ods_TableName,
      withDeleteCascade: true,
    });

    const localColumnNames: Array<string> = columnCreatorFactory.columnCreatorFor(keyRenameProperty)
      .createColumns(keyRenameProperty, BuildStrategyDefault)
      .map((x: Column) => x.name);

    // $FlowIgnore - baseEntity could be null/undefined
    const baseColumnProperty: EntityProperty = R.head(entity.baseEntity.data.edfiOds.ods_Properties
        .filter((property: EntityProperty) => property.data.edfiOds.ods_Name === keyRenameProperty.baseKeyName));

    const baseColumnNames: Array<string> = columnCreatorFactory.columnCreatorFor(baseColumnProperty)
        .createColumns(baseColumnProperty, BuildStrategyDefault)
        .map((x: Column) => x.name);

    const columnNamePairs: Array<ColumnNamePair> = R.zipWith(
        (localColumnName, baseColumnName) => Object.assign(newColumnNamePair(), {
          parentTableColumnName: localColumnName,
          foreignTableColumnName: baseColumnName,
        }),
      )(localColumnNames, baseColumnNames);

    addColumnNamePairs(foreignKey, columnNamePairs);
    addForeignKey(table, foreignKey);
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfType(metaEd.entity, 'domainEntitySubclass')
    .map((x: ModelBase) => asTopLevelEntity(x))
      .forEach((entity: TopLevelEntity) => {
        const tables: Array<Table> = [];
        const mainTable: Table = buildMainTable(entity, false);
        tables.push(mainTable);
        addForeignKeyToPrimaryKeyRename(mainTable, entity);
        buildTablesFromProperties(entity, mainTable, tables);
        entity.data.edfiOds.ods_Tables = tables;
        addTables(metaEd, tables);
      });

  return {
    enhancerName,
    success: true,
  };
}
