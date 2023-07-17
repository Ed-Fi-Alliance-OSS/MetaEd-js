import { asCommonProperty, getEntityFromNamespaceChain, Namespace, SemVer, versionSatisfies } from '@edfi/metaed-core';
import { ModelBase, EntityProperty, MergeDirective, ReferentialProperty } from '@edfi/metaed-core';
import {
  TableNameGroup,
  addForeignKey,
  newTable,
  newTableNameComponent,
  newTableExistenceReason,
  newTableNameGroup,
  addColumnsWithoutSort,
} from '../../model/database/Table';
import { BuildStrategyDefault } from './BuildStrategy';
import { collectPrimaryKeys } from './PrimaryKeyCollector';
import { ColumnTransform } from '../../model/database/ColumnTransform';
import { ForeignKeyStrategy } from '../../model/database/ForeignKeyStrategy';
import { TableStrategy } from '../../model/database/TableStrategy';
import { BuildStrategy } from './BuildStrategy';
import { Column, columnSortV7 } from '../../model/database/Column';
import { ColumnCreatorFactory } from './ColumnCreatorFactory';
import { foreignKeySourceReferenceFrom } from '../../model/database/ForeignKey';
import { ForeignKey, createForeignKeyUsingSourceReference } from '../../model/database/ForeignKey';
import { Table } from '../../model/database/Table';
import { TableBuilder } from './TableBuilder';
import { TableBuilderFactory } from './TableBuilderFactory';

function buildExtensionTables(
  property: ReferentialProperty,
  parentTableStrategy: TableStrategy,
  primaryKeys: Column[],
  _buildStrategy: BuildStrategy,
  joinTableId: string,
  joinTableNameGroup: TableNameGroup,
  joinTableSchema: string,
  joinTableNamespace: Namespace,
  tables: Table[],
  tableFactory: TableBuilderFactory,
  targetTechnologyVersion: SemVer,
): void {
  const commonExtension: ModelBase | null = getEntityFromNamespaceChain(
    property.metaEdName,
    // assume common extension is in same namespace
    property.namespace.namespaceName,
    property.namespace,
    'commonExtension',
  );
  if (commonExtension == null) return;

  const extensionTable: Table = {
    ...newTable(),
    namespace: commonExtension.namespace,
    schema: commonExtension.namespace.namespaceName.toLowerCase(),
    tableId:
      parentTableStrategy.tableId +
      property.data.edfiOdsRelational.odsName +
      commonExtension.namespace.extensionEntitySuffix,
    nameGroup: {
      ...newTableNameGroup(),
      nameElements: [
        parentTableStrategy.nameGroup,
        {
          ...newTableNameComponent(),
          name: property.data.edfiOdsRelational.odsName,
          isPropertyOdsName: true,
          sourceProperty: property,
        },
        {
          ...newTableNameComponent(),
          name: commonExtension.namespace.extensionEntitySuffix,
          isExtensionSuffix: true,
        },
      ],
      sourceProperty: property,
    },

    existenceReason: {
      ...newTableExistenceReason(),
      isExtensionTable: true,
      parentEntity: property.parentEntity,
    },
    description: property.documentation,
    parentEntity: property.parentEntity,
    includeCreateDateColumn: true,
    hideFromApiMetadata: true,
  };

  // don't add table unless the extension table will have columns that are not just the fk to the base table
  if (
    commonExtension.data.edfiOdsRelational.odsProperties.some(
      (propertyOnCommonExtension: EntityProperty) =>
        !propertyOnCommonExtension.data.edfiOdsRelational.odsIsCollection && propertyOnCommonExtension.type !== 'common',
    )
  ) {
    tables.push(extensionTable);
  }

  const foreignKey: ForeignKey = createForeignKeyUsingSourceReference(
    {
      ...foreignKeySourceReferenceFrom(property, { isSubtableRelationship: false }),
      isExtensionRelationship: true,
    },
    {
      foreignKeyColumns: primaryKeys,
      foreignTableSchema: joinTableSchema,
      foreignTableNamespace: joinTableNamespace,
      foreignTableId: joinTableId,
      strategy: ForeignKeyStrategy.foreignColumnCascade(
        true,
        property.parentEntity.data.edfiOdsRelational.odsCascadePrimaryKeyUpdates,
      ),
    },
  );

  addForeignKey(extensionTable, foreignKey);
  addColumnsWithoutSort(
    extensionTable,
    primaryKeys,
    ColumnTransform.primaryKeyWithNewReferenceContext(joinTableId),
    targetTechnologyVersion,
  );

  commonExtension.data.edfiOdsRelational.odsProperties.forEach((odsProperty: EntityProperty) => {
    const tableBuilder: TableBuilder = tableFactory.tableBuilderFor(odsProperty);
    tableBuilder.buildTables(
      odsProperty,
      TableStrategy.extension(extensionTable, joinTableSchema, joinTableNamespace, joinTableId, joinTableNameGroup),
      primaryKeys,
      BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      null,
    );
  });

  // For ODS/API 7.0+, we need to correct column sort order after iterating over odsProperties in MetaEd model order
  if (versionSatisfies(targetTechnologyVersion, '>=7.0.0')) {
    columnSortV7(extensionTable, primaryKeys);
  }
}

export function commonExtensionPropertyTableBuilder(
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

      buildExtensionTables(
        commonProperty,
        parentTableStrategy,
        primaryKeys,
        buildStrategy,
        joinTableId,
        joinTableNameGroup,
        commonProperty.referencedEntity.namespace.namespaceName.toLowerCase(),
        commonProperty.referencedEntity.namespace,
        tables,
        tableFactory,
        targetTechnologyVersion,
      );
    },
  };
}
