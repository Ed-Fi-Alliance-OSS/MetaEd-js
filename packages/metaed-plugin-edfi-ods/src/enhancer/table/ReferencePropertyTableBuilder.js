// @flow
import R from 'ramda';
import { asReferentialProperty } from 'metaed-core';
import type { EntityProperty, MergedProperty, ReferentialProperty } from 'metaed-core';
import { addColumns, addForeignKey, createForeignKey, newTable } from '../../model/database/Table';
import { addSourceEntityProperty, addMergedReferenceContext } from '../../model/database/Column';
import { collectPrimaryKeys } from './PrimaryKeyCollector';
import { ColumnTransform } from '../../model/database/ColumnTransform';
import { ForeignKeyStrategy } from '../../model/database/ForeignKeyStrategy';
import { joinTableNamer } from './JoinTableNamer';
import type { BuildStrategy } from './BuildStrategy';
import type { Column } from '../../model/database/Column';
import type { ColumnCreatorFactory } from './ColumnCreatorFactory';
import type { ForeignKey } from '../../model/database/ForeignKey';
import type { Table } from '../../model/database/Table';
import type { TableBuilder } from './TableBuilder';
import type { TableStrategy } from '../../model/database/TableStrategy';

const referenceColumnBuilder = (
  referenceProperty: ReferentialProperty,
  parentTableStrategy: TableStrategy,
  buildStrategy: BuildStrategy,
  factory: ColumnCreatorFactory,
) => (columnStrategy: ColumnTransform): void => {
  //
  //
  //
  const primaryKeys: Array<Column> = collectPrimaryKeys(referenceProperty.referencedEntity, buildStrategy, factory);

  primaryKeys.forEach((pk: Column) => {
    pk.referenceContext = referenceProperty.data.edfiOds.ods_Name + pk.referenceContext;
    addMergedReferenceContext(pk, pk.referenceContext);
    addSourceEntityProperty(pk, referenceProperty);
  });
  addColumns(parentTableStrategy.table, primaryKeys, columnStrategy);
};

export function referencePropertyTableBuilder(factory: ColumnCreatorFactory): TableBuilder {
  return {
    buildTables(
      property: EntityProperty,
      parentTableStrategy: TableStrategy,
      parentPrimaryKeys: Array<Column>,
      buildStrategy: BuildStrategy,
      tables: Array<Table>,
      parentIsRequired: ?boolean,
    ): void {
      const referenceProperty: ReferentialProperty = asReferentialProperty(property);
      let strategy: BuildStrategy = buildStrategy;

      if (!R.isEmpty(referenceProperty.mergedProperties)) {
        strategy = strategy.skipPath(referenceProperty.mergedProperties.map((x: MergedProperty) => x.mergePropertyPath.slice(1)));
      }

      const buildColumns = referenceColumnBuilder(referenceProperty, parentTableStrategy, strategy, factory);
      if (referenceProperty.isPartOfIdentity) {
        buildColumns(ColumnTransform.primaryKeyWithContextCollapsible(referenceProperty.data.edfiOds.ods_ContextPrefix));
      }
      if (referenceProperty.isRequired) {
        buildColumns(strategy.leafColumns(ColumnTransform.notNullWithContext(referenceProperty.data.edfiOds.ods_ContextPrefix)));
      }
      if (referenceProperty.isOptional) {
        buildColumns(strategy.leafColumns(ColumnTransform.nullWithContext(referenceProperty.data.edfiOds.ods_ContextPrefix)));
      }

      if (!referenceProperty.data.edfiOds.ods_IsCollection) return;
      const joinTable: Table = Object.assign(newTable(), {
        schema: parentTableStrategy.table.schema,
        name: joinTableNamer(referenceProperty, parentTableStrategy.name, strategy.parentContext()),
        description: referenceProperty.documentation,
        isRequiredCollectionTable: referenceProperty.isRequiredCollection && R.defaultTo(true)(parentIsRequired),
        includeCreateDateColumn: true,
      });
      tables.push(joinTable);

      const foreignKey: ForeignKey = createForeignKey(
        parentPrimaryKeys,
        parentTableStrategy.schema,
        parentTableStrategy.name,
        ForeignKeyStrategy.foreignColumnCascade(true, referenceProperty.parentEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates),
      );
      addForeignKey(joinTable, foreignKey);
      addColumns(joinTable, parentPrimaryKeys, ColumnTransform.primaryKeyWithNewReferenceContext(parentTableStrategy.name));

      const primaryKeys: Array<Column> = collectPrimaryKeys(referenceProperty.referencedEntity, strategy, factory);
      primaryKeys.forEach((pk: Column) => addSourceEntityProperty(pk, property));
      addColumns(joinTable, primaryKeys, ColumnTransform.primaryKeyWithContext(referenceProperty.data.edfiOds.ods_ContextPrefix));
    },
  };
}
