import { newMetaEdEnvironment, newNamespace, GeneratorResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import {
  newTable,
  tableEntities,
  initializeEdFiOdsRelationalEntityRepository,
  Table,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import { generate } from '../../src/generator/AggregateIdColumnGenerator';

describe('when generating aggregateId columns for core namespace table with no id', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsSqlServer', {
      targetTechnologyVersion: '7.3.0',
      shortName: '',
      namespace: new Map(),
      config: {},
    });

    metaEd.namespace.set(namespace.namespaceName, namespace);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    const table: Table = {
      ...newTable(),
      tableId: 'TableName',
      schema: 'edfi',
      isAggregateRootTable: false,
      data: { edfiOdsSqlServer: { tableName: 'TableName' } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    result = await generate(metaEd);
  });

  it('should not generate aggregateId columns', (): void => {
    expect(result.generatorName).toEqual('edfiOdsSqlServer.AggregateIdColumnGenerator');
    expect(result.generatedOutput).toEqual([]);
  });
});

describe('when generating aggregateId columns for core namespace table for ODS/API < 7.3', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsSqlServer', {
      targetTechnologyVersion: '7.0.0',
      shortName: '',
      namespace: new Map(),
      config: {},
    });

    metaEd.namespace.set(namespace.namespaceName, namespace);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    const table: Table = {
      ...newTable(),
      tableId: 'TableName',
      schema: 'edfi',
      isAggregateRootTable: true,
      isTypeTable: false,
      data: { edfiOdsSqlServer: { tableName: 'TableName' } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    result = await generate(metaEd);
  });

  it('should not generate aggregateId columns', (): void => {
    expect(result.generatorName).toEqual('edfiOdsSqlServer.AggregateIdColumnGenerator');
    expect(result.generatedOutput).toEqual([]);
  });
});

describe('when generating aggregateId columns for core namespace table with no type', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsSqlServer', {
      targetTechnologyVersion: '7.3.0',
      shortName: '',
      namespace: new Map(),
      config: {},
    });

    metaEd.namespace.set(namespace.namespaceName, namespace);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    const table: Table = {
      ...newTable(),
      tableId: 'TableName',
      schema: 'edfi',
      isAggregateRootTable: true,
      isTypeTable: false,
      data: { edfiOdsSqlServer: { tableName: 'TableName' } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    result = await generate(metaEd);
  });

  it('should generate correct aggregateId columns', (): void => {
    expect(result.generatorName).toEqual('edfiOdsSqlServer.AggregateIdColumnGenerator');
    expect(result.generatedOutput[0]).toMatchInlineSnapshot(`
      Object {
        "fileName": "1460-AggregateIdColumns.sql",
        "folderName": "/Database/SQLServer/ODS/Structure/",
        "name": "ODS SQL Server AggregateIdColumns",
        "namespace": "EdFi",
        "resultStream": null,
        "resultString": "CREATE SEQUENCE [edfi].[TableName_AggSeq] START WITH -2147483648 INCREMENT BY 1;
      ALTER TABLE [edfi].[TableName] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[TableName_AggSeq];
      CREATE INDEX [IX_TableName_AggregateId] ON [edfi].[TableName] (AggregateId);

      ",
      }
    `);
  });
});

describe('when generating aggregateId columns for core namespace table with type', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsSqlServer', {
      targetTechnologyVersion: '7.3.0',
      shortName: '',
      namespace: new Map(),
      config: {},
    });

    metaEd.namespace.set(namespace.namespaceName, namespace);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    const table: Table = {
      ...newTable(),
      tableId: 'TableNameType',
      schema: 'edfi',
      isAggregateRootTable: true,
      isTypeTable: true,
      data: { edfiOdsSqlServer: { tableName: 'TableNameType' } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    result = await generate(metaEd);
  });

  it('should generate correct aggregateId columns', (): void => {
    expect(result.generatorName).toEqual('edfiOdsSqlServer.AggregateIdColumnGenerator');
    expect(result.generatedOutput[0]).toMatchInlineSnapshot(`
      Object {
        "fileName": "1460-AggregateIdColumns.sql",
        "folderName": "/Database/SQLServer/ODS/Structure/",
        "name": "ODS SQL Server AggregateIdColumns",
        "namespace": "EdFi",
        "resultStream": null,
        "resultString": "CREATE SEQUENCE [edfi].[TableNameType_AggSeq] START WITH -2147483648 INCREMENT BY 1;
      ALTER TABLE [edfi].[TableNameType] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [edfi].[TableNameType_AggSeq];
      CREATE INDEX [IX_TableNameType_AggregateId] ON [edfi].[TableNameType] (AggregateId);

      ",
      }
    `);
  });
});

describe('when generating aggregateId columns for extension namespace table with no type', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName: 'Extension',
      isExtension: true,
      projectExtension: 'EXTENSION',
    };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsSqlServer', {
      targetTechnologyVersion: '7.3.0',
      shortName: '',
      namespace: new Map(),
      config: {},
    });

    metaEd.namespace.set(namespace.namespaceName, namespace);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    const table: Table = {
      ...newTable(),
      tableId: 'TableName',
      schema: 'extension',
      isAggregateRootTable: true,
      isTypeTable: false,
      data: { edfiOdsSqlServer: { tableName: 'TableName' } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    result = await generate(metaEd);
  });

  it('should generate correct aggregateId columns', (): void => {
    expect(result.generatorName).toEqual('edfiOdsSqlServer.AggregateIdColumnGenerator');
    expect(result.generatedOutput[0]).toMatchInlineSnapshot(`
      Object {
        "fileName": "1460-EXTENSION-Extension-AggregateIdColumns.sql",
        "folderName": "/Database/SQLServer/ODS/Structure/",
        "name": "ODS SQL Server AggregateIdColumns",
        "namespace": "Extension",
        "resultStream": null,
        "resultString": "CREATE SEQUENCE [extension].[TableName_AggSeq] START WITH -2147483648 INCREMENT BY 1;
      ALTER TABLE [extension].[TableName] ADD AggregateId int NOT NULL DEFAULT NEXT VALUE FOR [extension].[TableName_AggSeq];
      CREATE INDEX [IX_TableName_AggregateId] ON [extension].[TableName] (AggregateId);

      ",
      }
    `);
  });
});
