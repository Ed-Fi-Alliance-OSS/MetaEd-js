import * as R from 'ramda';
import { EntityProperty, MergeDirective } from '@edfi/metaed-core';
import { isSharedProperty, asReferentialProperty } from '@edfi/metaed-core';
import { addColumns, addForeignKey, newTable, newTableExistenceReason } from '../../model/database/Table';
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

export function simplePropertyTableBuilder(factory: ColumnCreatorFactory): TableBuilder {
  return {
    buildTables(
      property: EntityProperty,
      parentTableStrategy: TableStrategy,
      parentPrimaryKeys: Column[],
      buildStrategy: BuildStrategy,
      tables: Table[],
      parentIsRequired: boolean | null,
    ): void {
      const columnCreator: ColumnCreator = factory.columnCreatorFor(property);

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
          parentPrimaryKeys,
          parentTableStrategy.schema,
          parentTableStrategy.schemaNamespace,
          parentTableStrategy.tableId,
          ForeignKeyStrategy.foreignColumnCascade(
            true,
            property.parentEntity.data.edfiOdsRelational.odsCascadePrimaryKeyUpdates,
          ),
        );
        addForeignKey(joinTable, foreignKey);

        addColumns(
          joinTable,
          parentPrimaryKeys,
          ColumnTransform.primaryKeyWithNewReferenceContext(parentTableStrategy.tableId),
        );
        addColumns(
          joinTable,
          columnCreator.createColumns(property, strategy.columnNamerIgnoresRoleName()),
          ColumnTransformPrimaryKey,
        );

        tables.push(joinTable);
      } else {
        addColumns(
          parentTableStrategy.table,
          columnCreator.createColumns(property, strategy),
          strategy.leafColumns(ColumnTransformUnchanged),
        );
      }
    },
  };
}
