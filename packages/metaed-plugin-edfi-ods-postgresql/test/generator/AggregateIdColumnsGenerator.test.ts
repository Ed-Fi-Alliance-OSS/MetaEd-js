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
    metaEd.plugin.set('edfiOdsPostgresql', {
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
      data: { edfiOdsPostgresql: { tableName: 'TableName' } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    result = await generate(metaEd);
  });

  it('should not generate aggregateId columns', (): void => {
    expect(result.generatorName).toEqual('edfiOdsPostgresql.AggregateIdColumnGenerator');
    expect(result.generatedOutput).toEqual([]);
  });
});

describe('when generating aggregateId columns for core namespace table for ODS/API < 7.3', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsPostgresql', {
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
      data: { edfiOdsPostgresql: { tableName: 'TableName' } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    result = await generate(metaEd);
  });

  it('should not generate aggregateId columns', (): void => {
    expect(result.generatorName).toEqual('edfiOdsPostgresql.AggregateIdColumnGenerator');
    expect(result.generatedOutput).toEqual([]);
  });
});

describe('when generating aggregateId columns for core namespace table with no type', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOdsPostgresql', {
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
      data: { edfiOdsPostgresql: { tableName: 'TableName' } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    result = await generate(metaEd);
  });

  it('should generate correct aggregateId columns', (): void => {
    expect(result.generatorName).toEqual('edfiOdsPostgresql.AggregateIdColumnGenerator');
    expect(result.generatedOutput[0]).toMatchInlineSnapshot(`
      Object {
        "fileName": "1500-AggregateIdColumns.sql",
        "folderName": "/Database/PostgreSQL/ODS/Structure/",
        "name": "ODS PostgreSQLr AggregateIdColumns",
        "namespace": "EdFi",
        "resultStream": null,
        "resultString": "
      CREATE SEQUENCE edfi.TableName_aggseq START WITH -2147483648 INCREMENT BY 1 MINVALUE -2147483648;
      ALTER TABLE edfi.TableName ADD COLUMN AggregateId int NOT NULL DEFAULT nextval('edfi.TableName_aggseq');
      CREATE INDEX ix_TableName_aggid ON edfi.TableName (AggregateId);

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
    metaEd.plugin.set('edfiOdsPostgresql', {
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
      data: { edfiOdsPostgresql: { tableName: 'TableNameType' } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    result = await generate(metaEd);
  });

  it('should generate correct aggregateId columns', (): void => {
    expect(result.generatorName).toEqual('edfiOdsPostgresql.AggregateIdColumnGenerator');
    expect(result.generatedOutput[0]).toMatchInlineSnapshot(`
      Object {
        "fileName": "1500-AggregateIdColumns.sql",
        "folderName": "/Database/PostgreSQL/ODS/Structure/",
        "name": "ODS PostgreSQLr AggregateIdColumns",
        "namespace": "EdFi",
        "resultStream": null,
        "resultString": "
      CREATE SEQUENCE edfi.TableNameType_aggseq START WITH -2147483648 INCREMENT BY 1 MINVALUE -2147483648;
      ALTER TABLE edfi.TableNameType ADD COLUMN AggregateId int NOT NULL DEFAULT nextval('edfi.TableNameType_aggseq');
      CREATE INDEX ix_TableNameType_aggid ON edfi.TableNameType (AggregateId);

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
    metaEd.plugin.set('edfiOdsPostgresql', {
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
      data: { edfiOdsPostgresql: { tableName: 'TableName' } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    result = await generate(metaEd);
  });

  it('should generate correct aggregateId columns', (): void => {
    expect(result.generatorName).toEqual('edfiOdsPostgresql.AggregateIdColumnGenerator');
    expect(result.generatedOutput[0]).toMatchInlineSnapshot(`
      Object {
        "fileName": "1500-EXTENSION-Extension-AggregateIdColumns.sql",
        "folderName": "/Database/PostgreSQL/ODS/Structure/",
        "name": "ODS PostgreSQLr AggregateIdColumns",
        "namespace": "Extension",
        "resultStream": null,
        "resultString": "
      CREATE SEQUENCE extension.TableName_aggseq START WITH -2147483648 INCREMENT BY 1 MINVALUE -2147483648;
      ALTER TABLE extension.TableName ADD COLUMN AggregateId int NOT NULL DEFAULT nextval('extension.TableName_aggseq');
      CREATE INDEX ix_TableName_aggid ON extension.TableName (AggregateId);

      ",
      }
    `);
  });
});
