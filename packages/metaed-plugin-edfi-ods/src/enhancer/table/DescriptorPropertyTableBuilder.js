// @flow
import R from 'ramda';
import type { EntityProperty, ReferentialProperty } from 'metaed-core';
import { asReferentialProperty } from 'metaed-core';
import { addColumns, addForeignKey, createForeignKey, newTable } from '../../model/database/Table';
import { baseNameCollapsingJoinTableNamer } from './JoinTableNamer';
import { ColumnTransform, ColumnTransformPrimaryKey, ColumnTransformUnchanged } from '../../model/database/ColumnTransform';
import { ForeignKeyStrategy } from '../../model/database/ForeignKeyStrategy';
import type { BuildStrategy } from './BuildStrategy';
import type { Column } from '../../model/database/Column';
import type { ColumnCreator } from './ColumnCreator';
import type { ColumnCreatorFactory } from './ColumnCreatorFactory';
import type { ForeignKey } from '../../model/database/ForeignKey';
import type { Table } from '../../model/database/Table';
import type { TableBuilder } from './TableBuilder';
import type { TableStrategy } from '../../model/database/TableStrategy';

export function descriptorPropertyTableBuilder(factory: ColumnCreatorFactory): TableBuilder {
  return {
    buildTables(
      property: EntityProperty,
      parentTableStrategy: TableStrategy,
      parentPrimaryKeys: Array<Column>,
      buildStrategy: BuildStrategy,
      tables: Array<Table>,
      parentIsRequired: ?boolean,
    ): void {
      const descriptor: ReferentialProperty = asReferentialProperty(property);
      const columnCreator: ColumnCreator = factory.columnCreatorFor(descriptor);

      if (!descriptor.data.edfiOds.ods_IsCollection) {
        const descriptorColumn: Column = R.head(columnCreator.createColumns(descriptor, buildStrategy));
        addColumns(parentTableStrategy.table, [descriptorColumn], buildStrategy.leafColumns(ColumnTransformUnchanged));

        const foreignKey: ForeignKey = createForeignKey(
          [descriptorColumn],
          descriptor.referencedEntity.namespaceInfo.namespace,
          descriptor.referencedEntity.data.edfiOds.ods_DescriptorName,
          ForeignKeyStrategy.foreignColumnRename(`${descriptor.data.edfiOds.ods_DescriptorifiedBaseName}Id`),
        );
        addForeignKey(parentTableStrategy.table, foreignKey);
      } else {
        const joinTable: Table = Object.assign(newTable(), {
          schema: parentTableStrategy.table.schema,
          name: baseNameCollapsingJoinTableNamer(descriptor, parentTableStrategy.name, buildStrategy.parentContext()),
          description: descriptor.documentation,
          isRequiredCollectionTable: descriptor.isRequiredCollection && R.defaultTo(true)(parentIsRequired),
          includeCreateDateColumn: true,
        });
        tables.push(joinTable);

        const parentForeignKey: ForeignKey = createForeignKey(
          parentPrimaryKeys,
          parentTableStrategy.schema,
          parentTableStrategy.name,
          ForeignKeyStrategy.foreignColumnCascade(true, descriptor.parentEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates),
        );
        addForeignKey(joinTable, parentForeignKey);
        addColumns(joinTable, parentPrimaryKeys, ColumnTransform.primaryKeyWithNewReferenceContext(parentTableStrategy.name));

        const columns: Array<Column> = columnCreator.createColumns(descriptor, buildStrategy.columnNamerIgnoresWithContext());
        const foreignKey: ForeignKey = createForeignKey(
          columns,
          descriptor.referencedEntity.namespaceInfo.namespace,
          descriptor.referencedEntity.data.edfiOds.ods_DescriptorName,
          ForeignKeyStrategy.foreignColumnRename(`${descriptor.data.edfiOds.ods_DescriptorifiedBaseName}Id`),
        );
        addForeignKey(joinTable, foreignKey);
        addColumns(joinTable, columns, ColumnTransformPrimaryKey);
      }
    },
  };
}
