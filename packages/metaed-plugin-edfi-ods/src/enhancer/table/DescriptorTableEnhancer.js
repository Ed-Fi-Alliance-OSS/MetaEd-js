// @flow
import R from 'ramda';
import { getEntitiesOfType } from 'metaed-core';
import type {
  Descriptor,
  EnhancerResult,
  EntityProperty,
  MetaEdEnvironment,
  ModelBase,
} from 'metaed-core';
import { addColumns, addForeignKey, createForeignKey, getPrimaryKeys, newTable } from '../../model/database/Table';
import { addTables } from '../table/TableCreatingEntityEnhancerBase';
import { BuildStrategyDefault } from './BuildStrategy';
import { collectPrimaryKeys } from './PrimaryKeyCollector';
import { columnCreatorFactory } from './ColumnCreatorFactory';
import { ColumnTransformUnchanged } from '../../model/database/ColumnTransform';
import { enumerationTableCreator } from './EnumerationTableCreator';
import { ForeignKeyStrategyDefault } from '../../model/database/ForeignKeyStrategy';
import { newColumnNamePair } from '../../model/database/ColumnNamePair';
import { newForeignKey, addColumnNamePair } from '../../model/database/ForeignKey';
import { newIntegerColumn } from '../../model/database/Column';
import { tableBuilderFactory } from './TableBuilderFactory';
import { TableStrategy } from '../../model/database/TableStrategy';
import type { Column } from '../../model/database/Column';
import type { ForeignKey } from '../../model/database/ForeignKey';
import type { Table } from '../../model/database/Table';
import type { TableBuilder } from './TableBuilder';

const enhancerName: string = 'DescriptorTableEnhancer';

const PRIMARY_KEY_DESCRIPTOR: string = 'A unique identifier used as Primary Key, not derived from business logic, when acting as Foreign Key, references the parent table.';

function createTables(descriptor: Descriptor): Array<Table> {
  const tables: Array<Table> = [];

  const mainTable: Table = Object.assign(newTable(), {
    schema: descriptor.namespaceInfo.namespace,
    name: descriptor.data.edfiOds.ods_TableName,
    description: descriptor.documentation,
  });
  tables.push(mainTable);

  const primaryKey: Column = Object.assign(newIntegerColumn(), {
    name: `${descriptor.metaEdName}DescriptorId`,
    isPartOfPrimaryKey: true,
    isNullable: false,
    description: PRIMARY_KEY_DESCRIPTOR,
  });
  addColumns(mainTable, [primaryKey], ColumnTransformUnchanged);

  const foreignKey: ForeignKey = Object.assign(newForeignKey(), {
    foreignTableSchema: 'edfi',
    foreignTableName: 'Descriptor',
    withDeleteCascade: true,
  });
  addColumnNamePair(foreignKey, Object.assign(newColumnNamePair(), {
    parentTableColumnName: `${mainTable.name}Id`,
    foreignTableColumnName: 'DescriptorId',
  }));
  addForeignKey(mainTable, foreignKey);

  if (descriptor.data.edfiOds.ods_IsMapType) {
    const mapTypeTable: Table = enumerationTableCreator.build(
      descriptor.metaEdName,
      descriptor.namespaceInfo.namespace,
      descriptor.mapTypeEnumeration.documentation,
    );
    tables.push(mapTypeTable);

    addColumns(mainTable, [
      Object.assign(newIntegerColumn(), {
        name: R.head(getPrimaryKeys(mapTypeTable)).name,
        isPartOfPrimaryKey: false,
        isNullable: descriptor.isMapTypeOptional,
        description: PRIMARY_KEY_DESCRIPTOR,
      }),
    ], ColumnTransformUnchanged);

    const mapTypeForeignKey: ForeignKey = createForeignKey(
      getPrimaryKeys(mapTypeTable),
      mapTypeTable.schema,
      mapTypeTable.name,
      ForeignKeyStrategyDefault,
    );
    addForeignKey(mainTable, mapTypeForeignKey);
  }

  const primaryKeys: Array<Column> = collectPrimaryKeys(descriptor, BuildStrategyDefault, columnCreatorFactory);
  primaryKeys.push(primaryKey);
  descriptor.data.edfiOds.ods_Properties.forEach((property: EntityProperty) => {
    const tableBuilder: TableBuilder = tableBuilderFactory.tableBuilderFor(property);
    tableBuilder.buildTables(property, TableStrategy.default(mainTable), primaryKeys, BuildStrategyDefault, tables);
  });

  return tables;
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getEntitiesOfType(metaEd.entity, 'descriptor').forEach((entity: ModelBase) => {
    const tables: Array<Table> = createTables(((entity: any): Descriptor));
    entity.data.edfiOds.ods_Tables = tables;
    addTables(metaEd, tables);
  });

  return {
    enhancerName,
    success: true,
  };
}
