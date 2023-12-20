import * as R from 'ramda';
import { EntityProperty, ReferentialProperty, asReferentialProperty } from '@edfi/metaed-core';
import { addColumnsWithoutSort, addForeignKey, newTable, newTableExistenceReason } from '../../model/database/Table';
import { joinTableNamer } from './TableNaming';
import { ColumnTransform, ColumnTransformPrimaryKey, ColumnTransformUnchanged } from '../../model/database/ColumnTransform';
import { ForeignKeyStrategy } from '../../model/database/ForeignKeyStrategy';
import { Column } from '../../model/database/Column';
import { ForeignKey, createForeignKey } from '../../model/database/ForeignKey';
import { Table } from '../../model/database/Table';
import { createColumnFor } from './ColumnCreator';
import { TableBuilderParameters } from './TableBuilder';

const foreignKeyStrategyFor = (property: EntityProperty): ForeignKeyStrategy => {
  if (property.type === 'enumeration')
    return ForeignKeyStrategy.foreignColumnIdChange(`${property.data.edfiOdsRelational.odsTypeifiedBaseName}Id`);
  if (property.type === 'schoolYearEnumeration') return ForeignKeyStrategy.foreignColumnIdChange('SchoolYear');
  throw new Error('EnumerationPropertyTableBuilder received non-enumeration property');
};

export function enumerationPropertyTableBuilder({
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
  const enumerationProperty: ReferentialProperty = asReferentialProperty(property);

  if (!enumerationProperty.data.edfiOdsRelational.odsIsCollection) {
    const enumerationColumn: Column = createColumnFor(
      originalEntity,
      enumerationProperty,
      buildStrategy,
      currentPropertyPath,
      targetTechnologyVersion,
    )[0];
    const foreignKey: ForeignKey = createForeignKey(
      property,
      {
        foreignKeyColumns: [enumerationColumn],
        foreignTableSchema: enumerationProperty.referencedEntity.namespace.namespaceName.toLowerCase(),
        foreignTableNamespace: enumerationProperty.referencedEntity.namespace,
        foreignTableId: enumerationProperty.referencedEntity.data.edfiOdsRelational.odsTableId,
        strategy: foreignKeyStrategyFor(enumerationProperty),
      },
      { isSubtableRelationship: false },
    );
    addForeignKey(parentTableStrategy.table, foreignKey);
    addColumnsWithoutSort(
      parentTableStrategy.table,
      [enumerationColumn],
      buildStrategy.leafColumns(ColumnTransformUnchanged),
      targetTechnologyVersion,
    );
  } else {
    const { tableId, nameGroup } = joinTableNamer(enumerationProperty, parentTableStrategy, buildStrategy);
    const joinTable: Table = {
      ...newTable(),
      namespace: parentTableStrategy.schemaNamespace,
      schema: parentTableStrategy.schema,
      tableId,
      nameGroup,
      existenceReason: {
        ...newTableExistenceReason(),
        isImplementingCollection: true,
        sourceProperty: enumerationProperty,
      },
      description: enumerationProperty.documentation,
      isRequiredCollectionTable: enumerationProperty.isRequiredCollection && R.defaultTo(true)(parentIsRequired),
      includeCreateDateColumn: true,
      parentEntity: enumerationProperty.parentEntity,
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
          enumerationProperty.parentEntity.data.edfiOdsRelational.odsCascadePrimaryKeyUpdates,
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

    const columns: Column[] = createColumnFor(
      originalEntity,
      enumerationProperty,
      buildStrategy.columnNamerIgnoresRoleName(),
      currentPropertyPath,
      targetTechnologyVersion,
    );
    const foreignKey: ForeignKey = createForeignKey(
      property,
      {
        foreignKeyColumns: columns,
        foreignTableSchema: enumerationProperty.referencedEntity.namespace.namespaceName.toLowerCase(),
        foreignTableNamespace: enumerationProperty.referencedEntity.namespace,
        foreignTableId: enumerationProperty.referencedEntity.data.edfiOdsRelational.odsTableId,
        strategy: foreignKeyStrategyFor(enumerationProperty),
      },
      { isSubtableRelationship: false },
    );
    addForeignKey(joinTable, foreignKey);
    addColumnsWithoutSort(joinTable, columns, ColumnTransformPrimaryKey, targetTechnologyVersion);
  }
}
