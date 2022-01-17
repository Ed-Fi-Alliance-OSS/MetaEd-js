import { getEntitiesOfTypeForNamespaces } from '@edfi/metaed-core';
import { Descriptor, EnhancerResult, EntityProperty, MetaEdEnvironment, ModelBase, Namespace } from '@edfi/metaed-core';
import {
  addColumns,
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
import { columnCreatorFactory } from './ColumnCreatorFactory';
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
import { tableBuilderFactory } from './TableBuilderFactory';
import { TableStrategy } from '../../model/database/TableStrategy';
import { Column, newColumn, newColumnNameComponent } from '../../model/database/Column';
import { ForeignKey } from '../../model/database/ForeignKey';
import { Table } from '../../model/database/Table';
import { TableBuilder } from './TableBuilder';

const enhancerName = 'DescriptorTableEnhancer';

const PRIMARY_KEY_DESCRIPTOR =
  'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.';

function createTables(metaEd: MetaEdEnvironment, descriptor: Descriptor): Table[] {
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
  };
  addColumns(mainTable, [primaryKey], ColumnTransformUnchanged);

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

    addColumns(mainTable, [mapTypeColumn], ColumnTransformUnchanged);

    const mapTypeForeignKey: ForeignKey = createForeignKeyUsingSourceReference(
      {
        ...newForeignKeySourceReference(),
        isSyntheticRelationship: true,
      },
      getPrimaryKeys(mapTypeTable),
      mapTypeTable.schema,
      mapTypeTable.namespace,
      mapTypeTable.tableId,
      ForeignKeyStrategyDefault,
    );
    addForeignKey(mainTable, mapTypeForeignKey);
  }

  const primaryKeys: Column[] = collectPrimaryKeys(descriptor, BuildStrategyDefault, columnCreatorFactory);
  primaryKeys.push(primaryKey);
  descriptor.data.edfiOdsRelational.odsProperties.forEach((property: EntityProperty) => {
    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(property);
    tableBuilder.buildTables(property, TableStrategy.default(mainTable), primaryKeys, BuildStrategyDefault, tables, null);
  });

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
