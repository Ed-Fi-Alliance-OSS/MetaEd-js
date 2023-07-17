import * as R from 'ramda';
import { EntityProperty, ReferentialProperty, SemVer } from '@edfi/metaed-core';
import { asReferentialProperty } from '@edfi/metaed-core';
import {
  addColumnsWithSort,
  addColumnsWithoutSort,
  addForeignKey,
  newTable,
  newTableExistenceReason,
} from '../../model/database/Table';
import { joinTableNamer } from './TableNaming';
import { ColumnTransform, ColumnTransformPrimaryKey, ColumnTransformUnchanged } from '../../model/database/ColumnTransform';
import { ForeignKeyStrategy } from '../../model/database/ForeignKeyStrategy';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { ColumnCreator } from './ColumnCreator';
import { ColumnCreatorFactory } from './ColumnCreatorFactory';
import { ForeignKey, createForeignKey } from '../../model/database/ForeignKey';
import { Table } from '../../model/database/Table';
import { TableBuilder } from './TableBuilder';
import { TableStrategy } from '../../model/database/TableStrategy';

export function descriptorPropertyTableBuilder(factory: ColumnCreatorFactory): TableBuilder {
  return {
    buildTables(
      property: EntityProperty,
      parentTableStrategy: TableStrategy,
      parentPrimaryKeys: Column[],
      buildStrategy: BuildStrategy,
      tables: Table[],
      targetTechnologyVersion: SemVer,
      parentIsRequired: boolean | null,
    ): void {
      const descriptor: ReferentialProperty = asReferentialProperty(property);
      const columnCreator: ColumnCreator = factory.columnCreatorFor(descriptor, targetTechnologyVersion);

      if (!descriptor.data.edfiOdsRelational.odsIsCollection) {
        const descriptorColumn: Column = R.head(columnCreator.createColumns(descriptor, buildStrategy));
        addColumnsWithoutSort(
          parentTableStrategy.table,
          [descriptorColumn],
          buildStrategy.leafColumns(ColumnTransformUnchanged),
          targetTechnologyVersion,
        );

        const foreignKey: ForeignKey = createForeignKey(
          property,
          {
            foreignKeyColumns: [descriptorColumn],
            foreignTableSchema: descriptor.referencedEntity.namespace.namespaceName.toLowerCase(),
            foreignTableNamespace: descriptor.referencedEntity.namespace,
            foreignTableId: descriptor.referencedEntity.data.edfiOdsRelational.odsDescriptorName,
            strategy: ForeignKeyStrategy.foreignColumnIdChange(
              `${descriptor.data.edfiOdsRelational.odsDescriptorifiedBaseName}Id`,
            ),
          },
          { isSubtableRelationship: false },
        );
        addForeignKey(parentTableStrategy.table, foreignKey);
      } else {
        const { tableId, nameGroup } = joinTableNamer(descriptor, parentTableStrategy, buildStrategy);
        const joinTable: Table = {
          ...newTable(),
          // Are the next two lines correct?  EnumerationPropertyTableBuilder uses strategy properties directly rather than get from table, seems more correct
          namespace: parentTableStrategy.table.namespace,
          schema: parentTableStrategy.table.schema.toLowerCase(),
          tableId,
          nameGroup,
          existenceReason: {
            ...newTableExistenceReason(),
            isImplementingCollection: true,
            sourceProperty: descriptor,
          },
          description: descriptor.documentation,
          isRequiredCollectionTable: descriptor.isRequiredCollection && R.defaultTo(true)(parentIsRequired),
          includeCreateDateColumn: true,
          parentEntity: descriptor.parentEntity,
        };
        tables.push(joinTable);

        const parentForeignKey: ForeignKey = createForeignKey(
          property,
          {
            foreignKeyColumns: parentPrimaryKeys,
            foreignTableSchema: parentTableStrategy.schema,
            foreignTableNamespace: parentTableStrategy.schemaNamespace,
            foreignTableId: parentTableStrategy.tableId,
            strategy: ForeignKeyStrategy.foreignColumnCascade(
              true,
              descriptor.parentEntity.data.edfiOdsRelational.odsCascadePrimaryKeyUpdates,
            ),
          },
          { isSubtableRelationship: true },
        );
        addForeignKey(joinTable, parentForeignKey);
        addColumnsWithoutSort(
          joinTable,
          parentPrimaryKeys,
          ColumnTransform.primaryKeyWithNewReferenceContext(parentTableStrategy.tableId),
          targetTechnologyVersion,
        );

        const columns: Column[] = columnCreator.createColumns(descriptor, buildStrategy.columnNamerIgnoresRoleName());
        const foreignKey: ForeignKey = createForeignKey(
          property,
          {
            foreignKeyColumns: columns,
            foreignTableSchema: descriptor.referencedEntity.namespace.namespaceName.toLowerCase(),
            foreignTableNamespace: descriptor.referencedEntity.namespace,
            foreignTableId: descriptor.referencedEntity.data.edfiOdsRelational.odsDescriptorName,
            strategy: ForeignKeyStrategy.foreignColumnIdChange(
              `${descriptor.data.edfiOdsRelational.odsDescriptorifiedBaseName}Id`,
            ),
          },
          { isSubtableRelationship: false },
        );
        addForeignKey(joinTable, foreignKey);
        addColumnsWithSort(joinTable, columns, ColumnTransformPrimaryKey, targetTechnologyVersion);
      }
    },
  };
}
