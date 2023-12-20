import {
  CommonProperty,
  getEntityFromNamespaceChain,
  MetaEdPropertyPath,
  Namespace,
  SemVer,
  TopLevelEntity,
  versionSatisfies,
} from '@edfi/metaed-core';
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
import { foreignKeySourceReferenceFrom } from '../../model/database/ForeignKey';
import { ForeignKey, createForeignKeyUsingSourceReference } from '../../model/database/ForeignKey';
import { Table } from '../../model/database/Table';
import { buildTableFor, TableBuilderParameters } from './TableBuilder';
import { appendToPropertyPath } from '../EnhancerHelper';

function buildExtensionTables(
  originalEntity: TopLevelEntity,
  property: ReferentialProperty,
  parentTableStrategy: TableStrategy,
  primaryKeys: Column[],
  _buildStrategy: BuildStrategy,
  joinTableId: string,
  joinTableNameGroup: TableNameGroup,
  joinTableSchema: string,
  joinTableNamespace: Namespace,
  tables: Table[],
  currentPropertyPath: MetaEdPropertyPath,
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
    buildTableFor({
      originalEntity,
      property: odsProperty,
      parentTableStrategy: TableStrategy.extension(
        extensionTable,
        joinTableSchema,
        joinTableNamespace,
        joinTableId,
        joinTableNameGroup,
      ),
      parentPrimaryKeys: primaryKeys,
      buildStrategy: BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      parentIsRequired: null,
      currentPropertyPath: appendToPropertyPath(currentPropertyPath, odsProperty),
    });
  });

  // For ODS/API 7.0+, we need to correct column sort order after iterating over odsProperties in MetaEd model order
  if (versionSatisfies(targetTechnologyVersion, '>=7.0.0')) {
    columnSortV7(extensionTable, primaryKeys);
  }
}

export function commonExtensionPropertyTableBuilder({
  originalEntity,
  property,
  parentTableStrategy,
  parentPrimaryKeys,
  buildStrategy,
  tables,
  targetTechnologyVersion,
  currentPropertyPath,
}: TableBuilderParameters): void {
  const commonProperty: CommonProperty = property as CommonProperty;
  let strategy: BuildStrategy = buildStrategy;

  if (commonProperty.mergeDirectives.length > 0) {
    strategy = strategy.skipPath(
      commonProperty.mergeDirectives.map((x: MergeDirective) => x.sourcePropertyPathStrings.slice(1)),
    );
  }

  const primaryKeys: Column[] = [];
  if (!commonProperty.isOptional) {
    primaryKeys.push(
      ...collectPrimaryKeys(
        originalEntity,
        commonProperty.referencedEntity,
        strategy,
        currentPropertyPath,
        targetTechnologyVersion,
      ),
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
    originalEntity,
    commonProperty,
    parentTableStrategy,
    primaryKeys,
    buildStrategy,
    joinTableId,
    joinTableNameGroup,
    commonProperty.referencedEntity.namespace.namespaceName.toLowerCase(),
    commonProperty.referencedEntity.namespace,
    tables,
    currentPropertyPath,
    targetTechnologyVersion,
  );
}
