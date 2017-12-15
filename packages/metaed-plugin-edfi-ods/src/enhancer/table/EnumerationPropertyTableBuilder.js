// @flow
import R from 'ramda';
import { asReferentialProperty } from 'metaed-core';
import type { EntityProperty, PropertyType, ReferentialProperty } from 'metaed-core';
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

const foreignKeyStrategyFor = (property: EntityProperty): ForeignKeyStrategy => {
  const tableBuilder: { [PropertyType]: () => ForeignKeyStrategy } = {
    enumeration: () => ForeignKeyStrategy.foreignColumnRename(`${property.data.edfiOds.ods_TypeifiedBaseName}Id`),
    schoolYearEnumeration: () => ForeignKeyStrategy.foreignColumnRename('SchoolYear'),
  };
  return tableBuilder[property.type]();
};

export function enumerationPropertyTableBuilder(factory: ColumnCreatorFactory): TableBuilder {
  return {
    buildTables(
      property: EntityProperty,
      parentTableStrategy: TableStrategy,
      parentPrimaryKeys: Array<Column>,
      buildStrategy: BuildStrategy,
      tables: Array<Table>,
      parentIsRequired: ?boolean,
    ): void {
      const enumeration: ReferentialProperty = asReferentialProperty(property);
      const columnCreator: ColumnCreator = factory.columnCreatorFor(enumeration);

      if (!enumeration.data.edfiOds.ods_IsCollection) {
        const enumerationColumn: Column = R.head(columnCreator.createColumns(enumeration, buildStrategy));
        const foreignKey: ForeignKey = createForeignKey(
          [enumerationColumn],
          enumeration.referencedEntity.namespaceInfo.namespace,
          enumeration.referencedEntity.data.edfiOds.ods_TableName,
          foreignKeyStrategyFor(enumeration),
        );
        addForeignKey(parentTableStrategy.table, foreignKey);
        addColumns(parentTableStrategy.table, [enumerationColumn], buildStrategy.leafColumns(ColumnTransformUnchanged));
      } else {
        const joinTable: Table = Object.assign(newTable(), {
          schema: parentTableStrategy.schema,
          name: baseNameCollapsingJoinTableNamer(enumeration, parentTableStrategy.name, buildStrategy.parentContext()),
          description: enumeration.documentation,
          isRequiredCollectionTable: enumeration.isRequiredCollection && R.defaultTo(true)(parentIsRequired),
          includeCreateDateColumn: true,
        });
        tables.push(joinTable);

        const parentForeignKey: ForeignKey = createForeignKey(
          parentPrimaryKeys,
          parentTableStrategy.schema,
          parentTableStrategy.name,
          ForeignKeyStrategy.foreignColumnCascade(true, enumeration.parentEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates),
        );
        addForeignKey(joinTable, parentForeignKey);
        addColumns(joinTable, parentPrimaryKeys, ColumnTransform.primaryKeyWithNewReferenceContext(parentTableStrategy.name));

        const columns: Array<Column> = columnCreator.createColumns(enumeration, buildStrategy.columnNamerIgnoresWithContext());
        const foreignKey: ForeignKey = createForeignKey(
          columns,
          enumeration.referencedEntity.namespaceInfo.namespace,
          enumeration.referencedEntity.data.edfiOds.ods_TableName,
          foreignKeyStrategyFor(enumeration),
        );
        addForeignKey(joinTable, foreignKey);
        addColumns(joinTable, columns, ColumnTransformPrimaryKey);
      }
    },
  };
}
