import * as R from 'ramda';
import { MergeDirective } from '@edfi/metaed-core';
import { isSharedProperty, asReferentialProperty } from '@edfi/metaed-core';
import { addColumnsWithoutSort, addForeignKey, newTable, newTableExistenceReason } from '../../model/database/Table';
import { joinTableNamer } from './TableNaming';
import { ColumnTransform, ColumnTransformPrimaryKey, ColumnTransformUnchanged } from '../../model/database/ColumnTransform';
import { ForeignKeyStrategy } from '../../model/database/ForeignKeyStrategy';
import { BuildStrategy } from './BuildStrategy';
import { ForeignKey, createForeignKey } from '../../model/database/ForeignKey';
import { Table } from '../../model/database/Table';
import { simplePropertyColumnCreator } from './SimplePropertyColumnCreator';
import { TableBuilderParameters } from './TableBuilder';

export function simplePropertyTableBuilder({
  originalEntity,
  property,
  parentTableStrategy,
  parentPrimaryKeys,
  buildStrategy,
  tables,
  targetTechnologyVersion,
  currentPropertyPath,
  parentIsRequired,
}: TableBuilderParameters): void {
  let strategy: BuildStrategy = buildStrategy;

  // TODO: As of METAED-881, the property here could be a shared simple property, which
  // is not currently an extension of ReferentialProperty but has an equivalent mergeDirectives field
  if (isSharedProperty(property) && asReferentialProperty(property).mergeDirectives.length > 0) {
    strategy = strategy.skipPath(
      asReferentialProperty(property).mergeDirectives.map((x: MergeDirective) => x.sourcePropertyPathStrings.slice(1)),
    );
  }

  if (property.data.edfiOdsRelational.odsIsCollection) {
    const { tableId, nameGroup } = joinTableNamer(property, parentTableStrategy, strategy);
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
        sourceProperty: property,
      },
      description: property.documentation,
      isRequiredCollectionTable: property.isRequiredCollection && R.defaultTo(true)(parentIsRequired),
      includeCreateDateColumn: true,
      parentEntity: property.parentEntity,
    };

    const foreignKey: ForeignKey = createForeignKey(
      property,
      {
        foreignKeyColumns: parentPrimaryKeys,
        foreignTableSchema: parentTableStrategy.schema,
        foreignTableNamespace: parentTableStrategy.schemaNamespace,
        foreignTableId: parentTableStrategy.tableId,
        strategy: ForeignKeyStrategy.foreignColumnCascade(
          true,
          property.parentEntity.data.edfiOdsRelational.odsCascadePrimaryKeyUpdates,
        ),
      },
      { isSubtableRelationship: true },
    );
    addForeignKey(joinTable, foreignKey);

    addColumnsWithoutSort(
      joinTable,
      parentPrimaryKeys,
      ColumnTransform.primaryKeyWithNewReferenceContext(parentTableStrategy.tableId),
      targetTechnologyVersion,
    );
    addColumnsWithoutSort(
      joinTable,
      simplePropertyColumnCreator(originalEntity, property, strategy.columnNamerIgnoresRoleName(), currentPropertyPath),
      ColumnTransformPrimaryKey,
      targetTechnologyVersion,
    );

    tables.push(joinTable);
  } else {
    addColumnsWithoutSort(
      parentTableStrategy.table,
      simplePropertyColumnCreator(originalEntity, property, strategy, currentPropertyPath),
      strategy.leafColumns(ColumnTransformUnchanged),
      targetTechnologyVersion,
    );
  }
}
