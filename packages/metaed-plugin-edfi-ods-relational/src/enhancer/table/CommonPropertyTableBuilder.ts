import * as R from 'ramda';
import { SemVer, asCommonProperty, versionSatisfies } from '@edfi/metaed-core';
import { EntityProperty, MergeDirective, ReferentialProperty, Namespace } from '@edfi/metaed-core';
import {
  TableNameGroup,
  addForeignKey,
  newTable,
  newTableNameComponent,
  newTableExistenceReason,
  newTableNameGroup,
  addColumnsWithoutSort,
} from '../../model/database/Table';
import { collectPrimaryKeys } from './PrimaryKeyCollector';
import { ColumnTransform } from '../../model/database/ColumnTransform';
import { ForeignKeyStrategy } from '../../model/database/ForeignKeyStrategy';
import { TableStrategy } from '../../model/database/TableStrategy';
import { BuildStrategy } from './BuildStrategy';
import { Column, columnSortV7 } from '../../model/database/Column';
import { ColumnCreatorFactory } from './ColumnCreatorFactory';
import { ForeignKey, createForeignKey } from '../../model/database/ForeignKey';
import { Table } from '../../model/database/Table';
import { TableBuilder } from './TableBuilder';
import { TableBuilderFactory } from './TableBuilderFactory';

function buildJoinTables(
  property: ReferentialProperty,
  parentTableStrategy: TableStrategy,
  parentPrimaryKeys: Column[],
  primaryKeys: Column[],
  buildStrategy: BuildStrategy,
  joinTableId: string,
  joinTableNameGroup: TableNameGroup,
  joinTableNamespace: Namespace,
  joinTableSchema: string,
  tables: Table[],
  tableFactory: TableBuilderFactory,
  targetTechnologyVersion: SemVer,
  parentIsRequired: boolean | null,
): void {
  const joinTable: Table = {
    ...newTable(),
    namespace: joinTableNamespace,
    schema: joinTableSchema.toLowerCase(),
    tableId: joinTableId,
    nameGroup: joinTableNameGroup,
    existenceReason: {
      ...newTableExistenceReason(),
      isImplementingCommon: true,
      sourceProperty: property,
    },
    description: property.documentation,
    isRequiredCollectionTable: property.isRequiredCollection && R.defaultTo(true)(parentIsRequired),
    includeCreateDateColumn: true,
    parentEntity: property.parentEntity,
  };
  tables.push(joinTable);

  let strategy: BuildStrategy = buildStrategy.undoLeafColumnsNullable();
  if (strategy != null) {
    if (property.isOptional) {
      strategy = strategy.suppressPrimaryKeyCreationFromPropertiesStrategy();
    } else if (property.data.edfiOdsRelational.odsIsCollection) {
      strategy = strategy.undoSuppressPrimaryKeyCreationFromProperties();
    }
  }

  // For ODS/API 7.0+, parent primary keys need to be added first
  if (versionSatisfies(targetTechnologyVersion, '>=7.0.0')) {
    addColumnsWithoutSort(
      joinTable,
      parentPrimaryKeys,
      ColumnTransform.primaryKeyWithNewReferenceContext(parentTableStrategy.tableId),
      targetTechnologyVersion,
    );
  }

  property.referencedEntity.data.edfiOdsRelational.odsProperties.forEach((referenceProperty: EntityProperty) => {
    const tableBuilder: TableBuilder = tableFactory.tableBuilderFor(referenceProperty);
    tableBuilder.buildTables(
      referenceProperty,
      TableStrategy.default(joinTable),
      primaryKeys,
      strategy,
      tables,
      targetTechnologyVersion,
      null,
    );
  });

  // For ODS/API 7.0+, we need to correct column sort order after iterating over odsProperties in MetaEd model order
  if (versionSatisfies(targetTechnologyVersion, '>=7.0.0')) {
    columnSortV7(joinTable, parentPrimaryKeys);
  }

  const foreignKey: ForeignKey = createForeignKey(
    property,
    parentPrimaryKeys,
    parentTableStrategy.schema,
    parentTableStrategy.schemaNamespace,
    parentTableStrategy.tableId,
    ForeignKeyStrategy.foreignColumnCascade(true, property.parentEntity.data.edfiOdsRelational.odsCascadePrimaryKeyUpdates),
  );
  addForeignKey(joinTable, foreignKey);

  // For ODS/API before 7.0, this is where parent PKs where added
  if (versionSatisfies(targetTechnologyVersion, '<7.0.0')) {
    addColumnsWithoutSort(
      joinTable,
      parentPrimaryKeys,
      ColumnTransform.primaryKeyWithNewReferenceContext(parentTableStrategy.tableId),
      targetTechnologyVersion,
    );
  }
}

export function commonPropertyTableBuilder(
  tableFactory: TableBuilderFactory,
  columnFactory: ColumnCreatorFactory,
): TableBuilder {
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
      const commonProperty = asCommonProperty(property);
      let strategy: BuildStrategy = buildStrategy;

      if (commonProperty.mergeDirectives.length > 0) {
        strategy = strategy.skipPath(
          commonProperty.mergeDirectives.map((x: MergeDirective) => x.sourcePropertyPathStrings.slice(1)),
        );
      }

      const primaryKeys: Column[] = [];
      if (!commonProperty.isOptional) {
        primaryKeys.push(
          ...collectPrimaryKeys(commonProperty.referencedEntity, strategy, columnFactory, targetTechnologyVersion),
        );
      }

      // For ODS/API 7+, parent primary keys come first
      if (versionSatisfies(targetTechnologyVersion, '>=7.0.0')) {
        primaryKeys.unshift(...parentPrimaryKeys);
      } else {
        primaryKeys.push(...parentPrimaryKeys);
      }
      const joinTableId: string = parentTableStrategy.tableId + commonProperty.data.edfiOdsRelational.odsName;

      const joinTableNameGroup: TableNameGroup = {
        ...newTableNameGroup(),
        nameElements: [
          parentTableStrategy.nameGroup,
          {
            ...newTableNameComponent(),
            name: commonProperty.data.edfiOdsRelational.odsName,
            isPropertyOdsName: true,
            sourceProperty: commonProperty,
          },
        ],
        sourceProperty: commonProperty,
      };

      buildJoinTables(
        commonProperty,
        parentTableStrategy,
        parentPrimaryKeys,
        primaryKeys,
        buildStrategy,
        joinTableId,
        joinTableNameGroup,
        parentTableStrategy.table.namespace,
        parentTableStrategy.table.schema,
        tables,
        tableFactory,
        targetTechnologyVersion,
        parentIsRequired,
      );
    },
  };
}
