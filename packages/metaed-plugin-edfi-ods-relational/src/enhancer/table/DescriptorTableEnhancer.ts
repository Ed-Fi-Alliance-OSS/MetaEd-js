import {
  MetaEdPropertyPath,
  SemVer,
  getEntitiesOfTypeForNamespaces,
  targetTechnologyVersionFor,
  versionSatisfies,
} from '@edfi/metaed-core';
import { Descriptor, EnhancerResult, EntityProperty, MetaEdEnvironment, ModelBase, Namespace } from '@edfi/metaed-core';
import {
  addColumnsWithoutSort,
  addForeignKey,
  getPrimaryKeys,
  newTable,
  newTableNameComponent,
  newTableExistenceReason,
  newTableNameGroup,
} from '../../model/database/Table';
import { addTables } from './TableCreatingEntityEnhancerBase';
import { BuildStrategyDefault } from './BuildStrategy';
import { collectPrimaryKeys } from './PrimaryKeyCollector';
import { ColumnTransformUnchanged } from '../../model/database/ColumnTransform';
import { enumerationTableCreator } from './EnumerationTableCreator';
import { ForeignKeyStrategyDefault } from '../../model/database/ForeignKeyStrategy';
import { newColumnPair } from '../../model/database/ColumnPair';
import {
  newForeignKey,
  addColumnPair,
  newForeignKeySourceReference,
  createForeignKeyUsingSourceReference,
} from '../../model/database/ForeignKey';
import { TableStrategy } from '../../model/database/TableStrategy';
import { Column, columnSortV7, newColumn, newColumnNameComponent } from '../../model/database/Column';
import { ForeignKey } from '../../model/database/ForeignKey';
import { Table } from '../../model/database/Table';
import { buildTableFor } from './TableBuilder';

const enhancerName = 'DescriptorTableEnhancer';

const PRIMARY_KEY_DESCRIPTOR =
  'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.';

function createTables(metaEd: MetaEdEnvironment, descriptor: Descriptor): Table[] {
  const targetTechnologyVersion: SemVer = targetTechnologyVersionFor('edfiOdsRelational', metaEd);
  const tables: Table[] = [];

  const mainTable: Table = {
    ...newTable(),
    namespace: descriptor.namespace,
    schema: descriptor.namespace.namespaceName.toLowerCase(),
    tableId: descriptor.data.edfiOdsRelational.odsTableId,
    nameGroup: {
      ...newTableNameGroup(),
      nameElements: [
        {
          ...newTableNameComponent(),
          name: descriptor.data.edfiOdsRelational.odsTableId,
          isDerivedFromEntityMetaEdName: true,
          sourceEntity: descriptor,
        },
      ],
      sourceEntity: descriptor,
    },

    existenceReason: {
      ...newTableExistenceReason(),
      isEntityMainTable: true,
      parentEntity: descriptor,
    },
    description: descriptor.documentation,
    parentEntity: descriptor,
  };
  descriptor.data.edfiOdsRelational.odsEntityTable = mainTable;

  tables.push(mainTable);

  const primaryKey: Column = {
    ...newColumn(),
    type: 'integer',
    columnId: `${descriptor.metaEdName}DescriptorId`,
    nameComponents: [
      {
        ...newColumnNameComponent(),
        name: descriptor.metaEdName,
        isMetaEdName: true,
        sourceEntity: descriptor,
      },
      {
        ...newColumnNameComponent(),
        name: 'DescriptorId',
        isSynthetic: true,
      },
    ],
    isPartOfPrimaryKey: true,
    isNullable: false,
    description: PRIMARY_KEY_DESCRIPTOR,
    propertyPath: '' as MetaEdPropertyPath, // Synthetic column
  };
  addColumnsWithoutSort(mainTable, [primaryKey], ColumnTransformUnchanged, targetTechnologyVersion);

  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  // Bail out if core namespace isn't defined
  if (coreNamespace == null) return tables;

  const foreignKey: ForeignKey = {
    ...newForeignKey(),
    foreignTableSchema: coreNamespace.namespaceName.toLowerCase(),
    foreignTableId: 'Descriptor',
    foreignTableNamespace: coreNamespace,
    withDeleteCascade: true,
    sourceReference: {
      ...newForeignKeySourceReference(),
      isPartOfIdentity: true,
      isSubclassRelationship: true,
    },
  };
  addColumnPair(foreignKey, {
    ...newColumnPair(),
    parentTableColumnId: `${mainTable.tableId}Id`,
    foreignTableColumnId: 'DescriptorId',
  });
  addForeignKey(mainTable, foreignKey);

  if (descriptor.data.edfiOdsRelational.odsIsMapType) {
    const mapTypeTable: Table = enumerationTableCreator.build(
      metaEd,
      descriptor,
      descriptor.mapTypeEnumeration.documentation,
    );
    tables.push(mapTypeTable);

    const firstPrimaryKey: Column = getPrimaryKeys(mapTypeTable)[0];
    const mapTypeColumn: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: firstPrimaryKey.columnId,
      nameComponents: firstPrimaryKey.nameComponents,
      isPartOfPrimaryKey: false,
      isNullable: descriptor.isMapTypeOptional,
      description: PRIMARY_KEY_DESCRIPTOR,
    };

    addColumnsWithoutSort(mainTable, [mapTypeColumn], ColumnTransformUnchanged, targetTechnologyVersion);

    const mapTypeForeignKey: ForeignKey = createForeignKeyUsingSourceReference(
      {
        ...newForeignKeySourceReference(),
        isSyntheticRelationship: true,
      },
      {
        foreignKeyColumns: getPrimaryKeys(mapTypeTable),
        foreignTableSchema: mapTypeTable.schema,
        foreignTableNamespace: mapTypeTable.namespace,
        foreignTableId: mapTypeTable.tableId,
        strategy: ForeignKeyStrategyDefault,
      },
    );
    addForeignKey(mainTable, mapTypeForeignKey);
  }

  const primaryKeys: Column[] = collectPrimaryKeys(
    descriptor,
    descriptor,
    BuildStrategyDefault,
    '' as MetaEdPropertyPath,
    targetTechnologyVersion,
  );
  primaryKeys.push(primaryKey);

  descriptor.data.edfiOdsRelational.odsProperties.forEach((property: EntityProperty) => {
    buildTableFor({
      originalEntity: descriptor,
      property,
      parentTableStrategy: TableStrategy.default(mainTable),
      parentPrimaryKeys: primaryKeys,
      buildStrategy: BuildStrategyDefault,
      tables,
      targetTechnologyVersion,
      parentIsRequired: null,
      currentPropertyPath: property.fullPropertyName as MetaEdPropertyPath,
    });
  });

  // For ODS/API 7.0+, we need to correct column sort order after iterating over odsProperties in MetaEd model order
  if (versionSatisfies(targetTechnologyVersion, '>=7.0.0')) {
    columnSortV7(mainTable, []);
  }

  return tables;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfTypeForNamespaces(Array.from(metaEd.namespace.values()), 'descriptor').forEach((entity: ModelBase) => {
    const tables: Table[] = createTables(metaEd, entity as Descriptor);
    entity.data.edfiOdsRelational.odsTables = tables;
    addTables(metaEd, tables);
  });

  return {
    enhancerName,
    success: true,
  };
}
