import * as R from 'ramda';
import { SemVer, asTopLevelEntity, getEntitiesOfTypeForNamespaces, targetTechnologyVersionFor } from '@edfi/metaed-core';
import { EnhancerResult, EntityProperty, MetaEdEnvironment, ModelBase, TopLevelEntity } from '@edfi/metaed-core';
import { addForeignKey } from '../../model/database/Table';
import { addTables, buildMainTable, buildTablesFromProperties } from './TableCreatingEntityEnhancerBase';
import { BuildStrategyDefault } from './BuildStrategy';
import { columnCreatorFactory } from './ColumnCreatorFactory';
import { newColumnPair } from '../../model/database/ColumnPair';
import { newForeignKey, addColumnPairs, newForeignKeySourceReference } from '../../model/database/ForeignKey';
import { Column } from '../../model/database/Column';
import { ColumnPair } from '../../model/database/ColumnPair';
import { ForeignKey } from '../../model/database/ForeignKey';
import { Table } from '../../model/database/Table';

const enhancerName = 'DomainEntitySubclassTableEnhancer';

function addForeignKeyToPrimaryKeyRename(table: Table, entity: TopLevelEntity, targetTechnologyVersion: SemVer): void {
  if (entity.baseEntity == null) return;

  entity.data.edfiOdsRelational.odsProperties.forEach((keyRenameProperty: EntityProperty) => {
    if (!keyRenameProperty.isIdentityRename) return;

    const foreignKey: ForeignKey = {
      ...newForeignKey(),
      withDeleteCascade: true,
      sourceReference: {
        ...newForeignKeySourceReference(),
        isPartOfIdentity: true,
        isSubclassRelationship: true,
      },
    };

    // null check for typescript
    if (entity.baseEntity != null) {
      foreignKey.foreignTableSchema = entity.baseEntity.namespace.namespaceName.toLowerCase();
      foreignKey.foreignTableNamespace = entity.baseEntity.namespace;
      foreignKey.foreignTableId = entity.baseEntity.data.edfiOdsRelational.odsTableId;
    }

    const localColumnIds: string[] = columnCreatorFactory
      .columnCreatorFor(keyRenameProperty, targetTechnologyVersion)
      .createColumns(keyRenameProperty, BuildStrategyDefault)
      .map((x: Column) => x.columnId);

    const baseColumnProperty: EntityProperty = R.head(
      (entity.baseEntity as TopLevelEntity).data.edfiOdsRelational.odsProperties.filter(
        (property: EntityProperty) => property.data.edfiOdsRelational.odsName === keyRenameProperty.baseKeyName,
      ),
    );

    const baseColumnIds: string[] = columnCreatorFactory
      .columnCreatorFor(baseColumnProperty, targetTechnologyVersion)
      .createColumns(baseColumnProperty, BuildStrategyDefault)
      .map((x: Column) => x.columnId);

    const columnPairs: ColumnPair[] = R.zipWith((localColumnName, baseColumnName) => ({
      ...newColumnPair(),
      parentTableColumnId: localColumnName,
      foreignTableColumnId: baseColumnName,
    }))(localColumnIds, baseColumnIds);

    addColumnPairs(foreignKey, columnPairs);
    addForeignKey(table, foreignKey);
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const targetTechnologyVersion = targetTechnologyVersionFor('edfiOdsRelational', metaEd);

  getEntitiesOfTypeForNamespaces(Array.from(metaEd.namespace.values()), 'domainEntitySubclass')
    .map((x: ModelBase) => asTopLevelEntity(x))
    .forEach((entity: TopLevelEntity) => {
      const tables: Table[] = [];
      const mainTable: Table = buildMainTable(metaEd, entity, false);
      mainTable.existenceReason.isSubclassTable = true;
      tables.push(mainTable);
      addForeignKeyToPrimaryKeyRename(mainTable, entity, targetTechnologyVersion);
      buildTablesFromProperties(entity, mainTable, tables, targetTechnologyVersion);
      entity.data.edfiOdsRelational.odsTables = tables;
      addTables(metaEd, tables);
    });

  return {
    enhancerName,
    success: true,
  };
}
