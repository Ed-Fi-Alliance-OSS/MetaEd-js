// @flow
import R from 'ramda';
import { newMetaEdEnvironment, newNamespaceInfo } from 'metaed-core';
import type { GeneratorResult, MetaEdEnvironment, NamespaceInfo } from 'metaed-core';
import { generate } from '../../src/generator/IdIndexesGenerator';
import { newTable } from '../../src/model/database/Table';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import type { Table } from '../../src/model/database/Table';

describe('when generating id indexes for core namespace table with no id', () => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const coreNamespace: string = 'edfi';
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: coreNamespace,
      isExtension: false,
    });
    metaEd.entity.namespaceInfo.set(coreNamespace, namespaceInfo);

    initializeEdFiOdsEntityRepository(metaEd);
    const table: Table = Object.assign(newTable(), {
      name: 'TableName',
      schema: coreNamespace,
      includeLastModifiedDateAndIdColumn: false,
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    result = await generate(metaEd);
  });

  it('should not generate id index', () => {
    expect(result.generatorName).toEqual('edfiOds.IdIndexesGenerator');
    expect(result.generatedOutput).toEqual([]);
  });
});

describe('when generating id indexes for core namespace table with no type', () => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const coreNamespace: string = 'edfi';
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: coreNamespace,
      isExtension: false,
    });
    metaEd.entity.namespaceInfo.set(coreNamespace, namespaceInfo);

    initializeEdFiOdsEntityRepository(metaEd);
    const table: Table = Object.assign(newTable(), {
      name: 'TableName',
      schema: coreNamespace,
      includeLastModifiedDateAndIdColumn: true,
      isTypeTable: false,
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    result = await generate(metaEd);
  });

  it('should generate correct id index', () => {
    expect(result.generatorName).toEqual('edfiOds.IdIndexesGenerator');
    expect(R.head(result.generatedOutput).fileName).toBe('0040-IdColumnUniqueIndexes.sql');
    expect(R.head(result.generatedOutput).namespace).toBe('edfi');
    expect(R.head(result.generatedOutput).folderName).toBe('/Database/SQLServer/ODS/Structure/');
    expect(R.head(result.generatedOutput).name).toBe('ODS Id Indexes');
    expect(R.head(result.generatedOutput).resultStream).toBeNull();
    expect(R.head(result.generatedOutput).resultString).toEqual(expect.stringMatching('FILLFACTOR = 75'));
    expect(R.head(result.generatedOutput).resultString).toMatchSnapshot();
  });
});

describe('when generating id indexes for core namespace table with type', () => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const coreNamespace: string = 'edfi';
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: coreNamespace,
      isExtension: false,
    });
    metaEd.entity.namespaceInfo.set(coreNamespace, namespaceInfo);

    initializeEdFiOdsEntityRepository(metaEd);
    const table: Table = Object.assign(newTable(), {
      name: 'TableNameType',
      schema: coreNamespace,
      includeLastModifiedDateAndIdColumn: true,
      isTypeTable: true,
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    result = await generate(metaEd);
  });

  it('should generate correct id index', () => {
    expect(result.generatorName).toEqual('edfiOds.IdIndexesGenerator');
    expect(R.head(result.generatedOutput).fileName).toBe('0040-IdColumnUniqueIndexes.sql');
    expect(R.head(result.generatedOutput).namespace).toBe('edfi');
    expect(R.head(result.generatedOutput).folderName).toBe('/Database/SQLServer/ODS/Structure/');
    expect(R.head(result.generatedOutput).name).toBe('ODS Id Indexes');
    expect(R.head(result.generatedOutput).resultStream).toBeNull();
    expect(R.head(result.generatedOutput).resultString).toEqual(expect.stringMatching('FILLFACTOR = 100'));
    expect(R.head(result.generatedOutput).resultString).toMatchSnapshot();
  });
});

describe('when generating id indexes for extension namespace table with no type', () => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const extensionNamespace: string = 'extension';
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: extensionNamespace,
      projectExtension: 'EXTENSION',
      isExtension: true,
    });
    metaEd.entity.namespaceInfo.set(extensionNamespace, namespaceInfo);

    initializeEdFiOdsEntityRepository(metaEd);
    const table: Table = Object.assign(newTable(), {
      name: 'TableName',
      schema: extensionNamespace,
      includeLastModifiedDateAndIdColumn: true,
      isTypeTable: false,
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    result = await generate(metaEd);
  });

  it('should generate correct id index', () => {
    expect(result.generatorName).toEqual('edfiOds.IdIndexesGenerator');
    expect(R.head(result.generatedOutput).fileName).toBe('0040-EXTENSION-extension-IdColumnUniqueIndexes.sql');
    expect(R.head(result.generatedOutput).namespace).toBe('extension');
    expect(R.head(result.generatedOutput).folderName).toBe('/Database/SQLServer/ODS/Structure/');
    expect(R.head(result.generatedOutput).name).toBe('ODS Id Indexes');
    expect(R.head(result.generatedOutput).resultStream).toBeNull();
    expect(R.head(result.generatedOutput).resultString).toEqual(expect.stringMatching('FILLFACTOR = 75'));
    expect(R.head(result.generatedOutput).resultString).toMatchSnapshot();
  });
});
