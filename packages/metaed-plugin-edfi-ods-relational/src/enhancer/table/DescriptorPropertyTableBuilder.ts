import * as R from 'ramda';
import type { ReferentialProperty } from '@edfi/metaed-core';
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
import { Column } from '../../model/database/Column';
import { ForeignKey, createForeignKey } from '../../model/database/ForeignKey';
import { Table } from '../../model/database/Table';
import { descriptorPropertyColumnCreator } from './DescriptorPropertyColumnCreator';
import { TableBuilderParameters } from './TableBuilder';

export function descriptorPropertyTableBuilder({
  originalEntity,
  property,
  parentTableStrategy,
  parentPrimaryKeys,
  buildStrategy,
  tables,
  targetTechnologyVersion,
  parentIsRequired,
  currentPropertyPath,
}: TableBuilderParameters): void {
  const descriptor: ReferentialProperty = property as ReferentialProperty;

  if (!descriptor.data.edfiOdsRelational.odsIsCollection) {
    const descriptorColumn: Column = descriptorPropertyColumnCreator(
      originalEntity,
      descriptor,
      buildStrategy,
      currentPropertyPath,
    )[0];

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

    const columns: Column[] = descriptorPropertyColumnCreator(
      originalEntity,
      descriptor,
      buildStrategy.columnNamerIgnoresRoleName(),
      currentPropertyPath,
    );
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
}
