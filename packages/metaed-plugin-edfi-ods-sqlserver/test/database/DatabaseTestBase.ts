import { MetaEdEnvironment } from '@edfi/metaed-core';
import { initialize as initializeUnifiedPlugin } from '@edfi/metaed-plugin-edfi-unified';
import { initialize as initializeOdsRelationalPlugin } from '@edfi/metaed-plugin-edfi-ods-relational';
import { initialize as initializeOdsSqlServerPlugin } from '../../index';
import { generate as odsGenerate } from '../../src/generator/OdsGenerator';
import { generate as schemaGenerate } from '../../src/generator/SchemaGenerator';
import {
  disconnect,
  executeGeneratedSql,
  rollbackTransaction,
  beginTransaction,
  testDatabaseName,
} from './DatabaseConnection';
import { DatabaseColumn } from './DatabaseColumn';
import { DatabaseForeignKey } from './DatabaseForeignKey';
import { DatabaseIndex } from './DatabaseIndex';
import { DatabaseTable } from './DatabaseTable';

export const coreNamespace = 'EdFi';
export const extensionNamespace = 'Extension';
export const projectExtension = 'EXTENSION';

export async function testSuiteAfterAll() {
  await disconnect(testDatabaseName);
  await disconnect('master');
}

export async function testTearDown(databaseName: string = testDatabaseName): Promise<any> {
  await rollbackTransaction(databaseName);
  await beginTransaction(databaseName);
}

export function table(schema: string, name: string): DatabaseTable {
  return {
    schema,
    name,
  };
}

export function column(parentTableSchema: string, parentTableName: string, name: string): DatabaseColumn {
  return {
    parentTableSchema,
    parentTableName,
    name,
  };
}

export function foreignKey(parentTableColumn: DatabaseColumn[], foreignTableColumn: DatabaseColumn[]): DatabaseForeignKey {
  return {
    parentTable: table(parentTableColumn[0].parentTableSchema, parentTableColumn[0].parentTableName),
    parentColumns: parentTableColumn.map((dbColumn: DatabaseColumn) => dbColumn.name),
    foreignTable: table(foreignTableColumn[0].parentTableSchema, foreignTableColumn[0].parentTableName),
    foreignColumns: foreignTableColumn.map((dbColumn: DatabaseColumn) => dbColumn.name),
  };
}

export function index(primaryColumn: DatabaseColumn): DatabaseIndex {
  return {
    databaseTable: table(primaryColumn.parentTableSchema, primaryColumn.parentTableName),
    columns: [primaryColumn.name],
  };
}

// as found in DATA_TYPE column of INFORMATION_SCHEMA.COLUMNS system view
export const columnDataTypes = {
  bigint: 'bigint',
  bit: 'bit',
  date: 'date',
  datetime: 'datetime',
  datetime2: 'datetime2',
  decimal: 'decimal',
  integer: 'int',
  money: 'money',
  nvarchar: 'nvarchar',
  smallint: 'smallint',
  time: 'time',
  uniqueIdentifier: 'uniqueidentifier',
};

export async function enhanceGenerateAndExecuteSql(
  metaEd: MetaEdEnvironment,
  databaseName: string = testDatabaseName,
): Promise<any> {
  metaEd.dataStandardVersion = metaEd.dataStandardVersion === '0.0.0' ? '3.0.0' : metaEd.dataStandardVersion;
  initializeUnifiedPlugin().enhancer.forEach((enhance) => enhance(metaEd));
  initializeOdsRelationalPlugin().enhancer.forEach((enhance) => enhance(metaEd));
  initializeOdsSqlServerPlugin().enhancer.forEach((enhance) => enhance(metaEd));

  const sql: string[] = [];
  (await schemaGenerate(metaEd)).generatedOutput.forEach((result) => sql.push(result.resultString));
  (await odsGenerate(metaEd)).generatedOutput.forEach((result) => sql.push(result.resultString));
  await executeGeneratedSql(sql.join(''), databaseName);
}
