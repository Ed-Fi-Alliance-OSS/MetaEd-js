// @flow
import R from 'ramda';
import { asCommonProperty } from 'metaed-core';
import type { CommonExtension, EntityProperty, MergedProperty, ReferentialProperty } from 'metaed-core';
import {
  addColumns,
  addForeignKey,
  createForeignKey,
  newTable,
  createForeignKeyUsingSourceReference,
} from '../../model/database/Table';
import { appendOverlapping } from '../../shared/Utility';
import { BuildStrategyDefault } from './BuildStrategy';
import { collectPrimaryKeys } from './PrimaryKeyCollector';
import { ColumnTransform } from '../../model/database/ColumnTransform';
import { ForeignKeyStrategy } from '../../model/database/ForeignKeyStrategy';
import { TableStrategy } from '../../model/database/TableStrategy';
import type { BuildStrategy } from './BuildStrategy';
import type { Column } from '../../model/database/Column';
import type { ColumnCreatorFactory } from './ColumnCreatorFactory';
import { foreignKeySourceReferenceFrom } from '../../model/database/ForeignKey';
import type { ForeignKey } from '../../model/database/ForeignKey';
import type { Table } from '../../model/database/Table';
import type { TableBuilder } from './TableBuilder';
import type { TableBuilderFactory } from './TableBuilderFactory';

function overlapCollapsingJoinTableName(parentEntityName: string, odsName: string) {
  return appendOverlapping(parentEntityName, odsName);
}

function buildJoinTables(
  property: ReferentialProperty,
  parentTableStrategy: TableStrategy,
  parentPrimaryKeys: Array<Column>,
  primaryKeys: Array<Column>,
  buildStrategy: BuildStrategy,
  joinTableName: string,
  joinTableSchema: string,
  tables: Array<Table>,
  tableFactory: TableBuilderFactory,
  parentIsRequired: ?boolean,
): void {
  const joinTable: Table = Object.assign(newTable(), {
    schema: joinTableSchema,
    name: joinTableName,
    description: property.documentation,
    isRequiredCollectionTable: property.isRequiredCollection && R.defaultTo(true)(parentIsRequired),
    includeCreateDateColumn: true,
    parentEntity: property.parentEntity,
  });
  tables.push(joinTable);

  let strategy: ?BuildStrategy = buildStrategy.undoLeafColumnsNullable();
  if (strategy != null) {
    if (property.isOptional) {
      strategy = strategy.suppressPrimaryKeyCreationFromPropertiesStrategy();
    } else if (property.data.edfiOds.ods_IsCollection) {
      strategy = strategy.undoSuppressPrimaryKeyCreationFromProperties();
    }
  }

  property.referencedEntity.data.edfiOds.ods_Properties.forEach((referenceProperty: EntityProperty) => {
    const tableBuilder: TableBuilder = tableFactory.tableBuilderFor(referenceProperty);
    // $FlowIgnore - strategy could be null
    tableBuilder.buildTables(referenceProperty, TableStrategy.default(joinTable), primaryKeys, strategy, tables);
  });

  const foreignKey: ForeignKey = createForeignKey(
    property,
    parentPrimaryKeys,
    parentTableStrategy.schema,
    parentTableStrategy.name,
    ForeignKeyStrategy.foreignColumnCascade(true, property.parentEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates),
  );
  addForeignKey(joinTable, foreignKey);
  addColumns(joinTable, parentPrimaryKeys, ColumnTransform.primaryKeyWithNewReferenceContext(parentTableStrategy.name));
}

function buildExtensionTables(
  property: ReferentialProperty,
  parentTableStrategy: TableStrategy,
  primaryKeys: Array<Column>,
  buildStrategy: BuildStrategy,
  joinTableName: string,
  joinTableSchema: string,
  tables: Array<Table>,
  tableFactory: TableBuilderFactory,
): void {
  const commonExtension: CommonExtension = R.prop('extender', property.referencedEntity);
  if (commonExtension == null) return;

  const extensionTable: Table = Object.assign(newTable(), {
    schema: commonExtension.namespaceInfo.namespace,
    name: overlapCollapsingJoinTableName(
      parentTableStrategy.name,
      property.data.edfiOds.ods_Name + commonExtension.namespaceInfo.extensionEntitySuffix,
    ),
    description: property.documentation,
    parentEntity: property.parentEntity,
  });
  tables.push(extensionTable);

  const foreignKey: ForeignKey = createForeignKeyUsingSourceReference(
    {
      ...foreignKeySourceReferenceFrom(property),
      isExtensionRelationship: true,
    },
    primaryKeys,
    joinTableSchema,
    joinTableName,
    ForeignKeyStrategy.foreignColumnCascade(true, property.parentEntity.data.edfiOds.ods_CascadePrimaryKeyUpdates),
  );

  addForeignKey(extensionTable, foreignKey);
  addColumns(extensionTable, primaryKeys, ColumnTransform.primaryKeyWithNewReferenceContext(joinTableName));

  commonExtension.data.edfiOds.ods_Properties.forEach((odsProperty: EntityProperty) => {
    const tableBuilder: TableBuilder = tableFactory.tableBuilderFor(odsProperty);
    tableBuilder.buildTables(odsProperty, TableStrategy.default(extensionTable), primaryKeys, BuildStrategyDefault, tables);
  });
}

export function commonPropertyTableBuilder(
  tableFactory: TableBuilderFactory,
  columnFactory: ColumnCreatorFactory,
): TableBuilder {
  return {
    buildTables(
      property: EntityProperty,
      parentTableStrategy: TableStrategy,
      parentPrimaryKeys: Array<Column>,
      buildStrategy: BuildStrategy,
      tables: Array<Table>,
      parentIsRequired: ?boolean,
    ): void {
      const commonProperty = asCommonProperty(property);
      let strategy: BuildStrategy = buildStrategy;

      if (commonProperty.mergedProperties.length > 0) {
        strategy = strategy.skipPath(
          commonProperty.mergedProperties.map((x: MergedProperty) => x.mergePropertyPath.slice(1)),
        );
      }

      const primaryKeys: Array<Column> = [];
      if (!commonProperty.isOptional) {
        primaryKeys.push(...collectPrimaryKeys(commonProperty.referencedEntity, strategy, columnFactory));
      }
      primaryKeys.push(...parentPrimaryKeys);

      const joinTableName: string = overlapCollapsingJoinTableName(
        parentTableStrategy.name,
        commonProperty.data.edfiOds.ods_Name,
      );

      // Schema depends on whether this is an extension override
      let joinTableSchema: string;

      if (commonProperty.isExtensionOverride) {
        joinTableSchema = commonProperty.referencedEntity.namespaceInfo.namespace;
      } else {
        joinTableSchema = parentTableStrategy.table.schema;
        buildJoinTables(
          commonProperty,
          parentTableStrategy,
          parentPrimaryKeys,
          primaryKeys,
          buildStrategy,
          joinTableName,
          joinTableSchema,
          tables,
          tableFactory,
          parentIsRequired,
        );
      }
      buildExtensionTables(
        commonProperty,
        parentTableStrategy,
        primaryKeys,
        buildStrategy,
        joinTableName,
        joinTableSchema,
        tables,
        tableFactory,
      );
    },
  };
}
