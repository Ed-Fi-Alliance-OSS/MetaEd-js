import { newMetaEdEnvironment, newNamespace, GeneratorResult, MetaEdEnvironment, Namespace } from 'metaed-core';
import {
  newTable,
  tableEntities,
  initializeEdFiOdsRelationalEntityRepository,
  Table,
} from 'metaed-plugin-edfi-ods-relational';
import { generate } from '../../src/generator/IdIndexesGenerator';

describe('when generating id indexes for core namespace table with no id', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.namespace.set(namespace.namespaceName, namespace);
    metaEd.plugin.set('edfiOdsPostgresql', {
      targetTechnologyVersion: '2.0.0',
      shortName: '',
      namespace: new Map(),
      config: {},
    });

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    const table: Table = {
      ...newTable(),
      tableId: 'TableName',
      schema: 'edfi',
      includeLastModifiedDateAndIdColumn: false,
      data: { edfiOdsPostgresql: { tableName: 'TableName', truncatedTableNameHash: 'abcdefabcdef' } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    result = await generate(metaEd);
  });

  it('should not generate id index', (): void => {
    expect(result.generatorName).toEqual('edfiOdsPostgresql.IdIndexesGenerator');
    expect(result.generatedOutput).toEqual([]);
  });
});

describe('when generating id indexes for core namespace table with no type', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.namespace.set(namespace.namespaceName, namespace);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    const table: Table = {
      ...newTable(),
      tableId: 'TableName',
      schema: 'edfi',
      includeLastModifiedDateAndIdColumn: true,
      isTypeTable: false,
      data: { edfiOdsPostgresql: { tableName: 'TableName', truncatedTableNameHash: 'abcdefabcdef' } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    result = await generate(metaEd);
  });

  it('should generate correct id index', (): void => {
    expect(result.generatorName).toEqual('edfiOdsPostgresql.IdIndexesGenerator');
    expect(result.generatedOutput[0].fileName).toBe('0040-IdColumnUniqueIndexes.sql');
    expect(result.generatedOutput[0].namespace).toBe('EdFi');
    expect(result.generatedOutput[0].folderName).toBe('/Database/PostgreSQL/ODS/Structure/');
    expect(result.generatedOutput[0].name).toBe('ODS PostgreSQL Id Indexes');
    expect(result.generatedOutput[0].resultStream).toBeNull();
    expect(result.generatedOutput[0].resultString).toMatchInlineSnapshot(`
      "CREATE UNIQUE INDEX IF NOT EXISTS UX_abcdefabcdef_Id ON edfi.TableName(Id);

      "
    `);
  });
});

describe('when generating id indexes for core namespace table with type', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.namespace.set(namespace.namespaceName, namespace);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    const table: Table = {
      ...newTable(),
      tableId: 'TableNameType',
      schema: 'edfi',
      includeLastModifiedDateAndIdColumn: true,
      isTypeTable: true,
      data: { edfiOdsPostgresql: { tableName: 'TableNameType', truncatedTableNameHash: 'abcdefabcdef' } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    result = await generate(metaEd);
  });

  it('should generate correct id index', (): void => {
    expect(result.generatorName).toEqual('edfiOdsPostgresql.IdIndexesGenerator');
    expect(result.generatedOutput[0].fileName).toBe('0040-IdColumnUniqueIndexes.sql');
    expect(result.generatedOutput[0].namespace).toBe('EdFi');
    expect(result.generatedOutput[0].folderName).toBe('/Database/PostgreSQL/ODS/Structure/');
    expect(result.generatedOutput[0].name).toBe('ODS PostgreSQL Id Indexes');
    expect(result.generatedOutput[0].resultStream).toBeNull();
    expect(result.generatedOutput[0].resultString).toMatchInlineSnapshot(`
      "CREATE UNIQUE INDEX IF NOT EXISTS UX_abcdefabcdef_Id ON edfi.TableNameType(Id);

      "
    `);
  });
});

describe('when generating id indexes for extension namespace table with no type', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName: 'Extension',
      isExtension: true,
      projectExtension: 'EXTENSION',
    };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.namespace.set(namespace.namespaceName, namespace);
    metaEd.plugin.set('edfiOdsPostgresql', {
      targetTechnologyVersion: '3.0.0',
      shortName: '',
      namespace: new Map(),
      config: {},
    });

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    const table: Table = {
      ...newTable(),
      tableId: 'TableName',
      schema: 'extension',
      includeLastModifiedDateAndIdColumn: true,
      isTypeTable: false,
      data: { edfiOdsPostgresql: { tableName: 'TableName', truncatedTableNameHash: 'abcdefabcdef' } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    result = await generate(metaEd);
  });

  it('should generate correct id index', (): void => {
    expect(result.generatorName).toEqual('edfiOdsPostgresql.IdIndexesGenerator');
    expect(result.generatedOutput[0].fileName).toBe('0040-EXTENSION-Extension-IdColumnUniqueIndexes.sql');
    expect(result.generatedOutput[0].namespace).toBe('Extension');
    expect(result.generatedOutput[0].folderName).toBe('/Database/PostgreSQL/ODS/Structure/');
    expect(result.generatedOutput[0].name).toBe('ODS PostgreSQL Id Indexes');
    expect(result.generatedOutput[0].resultStream).toBeNull();
    expect(result.generatedOutput[0].resultString).toMatchInlineSnapshot(`
      "CREATE UNIQUE INDEX IF NOT EXISTS UX_abcdefabcdef_Id ON extension.TableName(Id);

      "
    `);
  });
});
