import R from 'ramda';
import { asReferentialProperty } from 'metaed-core';
import { EntityProperty, MergeDirective, ReferentialProperty } from 'metaed-core';
import {
  addColumns,
  addForeignKey,
  newTable,
  newTableExistenceReason,
  newTableNameGroup,
  TableNameComponent,
} from '../../model/database/Table';
import { addSourceEntityProperty, addMergedReferenceContext } from '../../model/database/Column';
import { collectPrimaryKeys } from './PrimaryKeyCollector';
import { ColumnTransform } from '../../model/database/ColumnTransform';
import { ForeignKeyStrategy } from '../../model/database/ForeignKeyStrategy';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';
import { ColumnCreatorFactory } from './ColumnCreatorFactory';
import { ForeignKey, createForeignKey } from '../../model/database/ForeignKey';
import { Table, newTableNameComponent } from '../../model/database/Table';
import { TableBuilder } from './TableBuilder';
import { TableStrategy } from '../../model/database/TableStrategy';

const referenceColumnBuilder =
  (
    referenceProperty: ReferentialProperty,
    parentTableStrategy: TableStrategy,
    buildStrategy: BuildStrategy,
    factory: ColumnCreatorFactory,
  ) =>
  (columnStrategy: ColumnTransform): void => {
    const primaryKeys: Column[] = collectPrimaryKeys(referenceProperty.referencedEntity, buildStrategy, factory);

    primaryKeys.forEach((pk: Column) => {
      pk.referenceContext = referenceProperty.data.edfiOdsRelational.odsName + pk.referenceContext;
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
      parentPrimaryKeys: Column[],
      buildStrategy: BuildStrategy,
      tables: Table[],
      parentIsRequired: boolean | null,
    ): void {
      const referenceProperty: ReferentialProperty = asReferentialProperty(property);
      let strategy: BuildStrategy = buildStrategy;

      if (!R.isEmpty(referenceProperty.mergeDirectives)) {
        strategy = strategy.skipPath(
          referenceProperty.mergeDirectives.map((x: MergeDirective) => x.sourcePropertyPathStrings.slice(1)),
        );
      }

      const buildColumns = referenceColumnBuilder(referenceProperty, parentTableStrategy, strategy, factory);
      if (referenceProperty.isPartOfIdentity) {
        buildColumns(ColumnTransform.primaryKeyRoleNameCollapsible(referenceProperty));
      }
      if (referenceProperty.isRequired) {
        buildColumns(strategy.leafColumns(ColumnTransform.notNullRoleName(referenceProperty)));
      }
      if (referenceProperty.isOptional) {
        buildColumns(strategy.leafColumns(ColumnTransform.nullRoleName(referenceProperty)));
      }

      if (!referenceProperty.data.edfiOdsRelational.odsIsCollection) return;

      const propertyRoleName = referenceProperty.roleName !== referenceProperty.metaEdName ? referenceProperty.roleName : '';

      const tableId =
        parentTableStrategy.tableId + strategy.parentContext() + propertyRoleName + referenceProperty.metaEdName;
      const nameComponents: TableNameComponent[] = [];

      strategy.parentContextProperties().forEach((parentContextProperty) => {
        if (parentContextProperty.data.edfiOdsRelational.odsContextPrefix !== '') {
          nameComponents.push({
            ...newTableNameComponent(),
            name: parentContextProperty.data.edfiOdsRelational.odsContextPrefix,
            isParentPropertyContext: true,
          });
        }
      });

      if (propertyRoleName !== '') {
        nameComponents.push({
          ...newTableNameComponent(),
          name: propertyRoleName,
          isPropertyRoleName: true,
          sourceProperty: property,
        });
      }

      nameComponents.push({
        ...newTableNameComponent(),
        name: referenceProperty.metaEdName,
        isPropertyMetaEdName: true,
        sourceProperty: property,
      });

      const joinTable: Table = {
        ...newTable(),
        // Are the next two lines correct?  EnumerationPropertyTableBuilder uses strategy properties directly rather than get from table, seems more correct
        namespace: parentTableStrategy.table.namespace,
        schema: parentTableStrategy.table.schema.toLowerCase(),
        tableId,
        nameGroup: {
          ...newTableNameGroup(),
          nameElements: [parentTableStrategy.nameGroup, ...nameComponents],
          sourceProperty: referenceProperty,
        },
        existenceReason: {
          ...newTableExistenceReason(),
          isImplementingCollection: true,
          sourceProperty: referenceProperty,
        },
        description: referenceProperty.documentation,
        isRequiredCollectionTable: referenceProperty.isRequiredCollection && R.defaultTo(true)(parentIsRequired),
        includeCreateDateColumn: true,
        parentEntity: referenceProperty.parentEntity,
      };
      tables.push(joinTable);

      const foreignKey: ForeignKey = createForeignKey(
        referenceProperty,
        parentPrimaryKeys,
        parentTableStrategy.schema,
        parentTableStrategy.schemaNamespace,
        parentTableStrategy.tableId,
        ForeignKeyStrategy.foreignColumnCascade(
          true,
          referenceProperty.parentEntity.data.edfiOdsRelational.odsCascadePrimaryKeyUpdates,
        ),
      );
      addForeignKey(joinTable, foreignKey);
      addColumns(
        joinTable,
        parentPrimaryKeys,
        ColumnTransform.primaryKeyWithNewReferenceContext(parentTableStrategy.tableId),
      );

      const primaryKeys: Column[] = collectPrimaryKeys(referenceProperty.referencedEntity, strategy, factory);
      primaryKeys.forEach((pk: Column) => addSourceEntityProperty(pk, property));
      addColumns(joinTable, primaryKeys, ColumnTransform.primaryKeyRoleName(referenceProperty));
    },
  };
}
