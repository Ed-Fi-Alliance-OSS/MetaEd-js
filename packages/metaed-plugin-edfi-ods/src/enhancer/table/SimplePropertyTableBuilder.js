// @flow
import R from 'ramda';
import type { EntityProperty } from 'metaed-core';
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

export function simplePropertyTableBuilder(factory: ColumnCreatorFactory): TableBuilder {
  return {
    buildTables(
      property: EntityProperty,
      parentTableStrategy: TableStrategy,
      parentPrimaryKeys: Array<Column>,
      buildStrategy: BuildStrategy,
      tables: Array<Table>,
      parentIsRequired: ?boolean,
    ): void {
      const columnCreator: ColumnCreator = factory.columnCreatorFor(property);

      if (property.data.edfiOds.ods_IsCollection) {
        const joinTable: Table = Object.assign(newTable(), {
          schema: parentTableStrategy.table.schema,
          name: baseNameCollapsingJoinTableNamer(property, parentTableStrategy.name, buildStrategy.parentContext()),
          description: property.documentation,
          isRequiredCollectionTable: property.isRequiredCollection && R.defaultTo(true)(parentIsRequired),
          includeCreateDateColumn: true,
        });

        const foreignKey: ForeignKey = createForeignKey(
          parentPrimaryKeys,
          parentTableStrategy.schema,
          parentTableStrategy.name,
          ForeignKeyStrategy.foreignColumnCascade(true, property.parentEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates),
        );
        addForeignKey(joinTable, foreignKey);

        addColumns(joinTable, parentPrimaryKeys, ColumnTransform.primaryKeyWithNewReferenceContext(parentTableStrategy.name));
        addColumns(
          joinTable,
          columnCreator.createColumns(property, buildStrategy.columnNamerIgnoresWithContext()),
          ColumnTransformPrimaryKey,
        );

        tables.push(joinTable);
      } else {
        addColumns(
          parentTableStrategy.table,
          columnCreator.createColumns(property, buildStrategy),
          buildStrategy.leafColumns(ColumnTransformUnchanged),
        );
      }
    },
  };
}
