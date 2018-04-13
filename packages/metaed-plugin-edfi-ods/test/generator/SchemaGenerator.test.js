// @flow
import R from 'ramda';
import { newMetaEdEnvironment, newNamespaceInfo } from 'metaed-core';
import type { GeneratorResult, MetaEdEnvironment, NamespaceInfo } from 'metaed-core';
import { generate } from '../../src/generator/SchemaGenerator';

describe('when generating schemas for core namespace', () => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'edfi',
      isExtension: false,
    });
    metaEd.entity.namespaceInfo.set('edfi', namespaceInfo);

    result = await generate(metaEd);
  });

  it('should generate correct schema', () => {
    expect(result.generatorName).toEqual('edfiOds.SchemaGenerator');
    expect(R.head(result.generatedOutput).fileName).toBe('0010-Schemas.sql');
    expect(R.head(result.generatedOutput).namespace).toBe('edfi');
    expect(R.head(result.generatedOutput).folderName).toBe('/Database/SQLServer/ODS/Structure/');
    expect(R.head(result.generatedOutput).name).toBe('ODS Schema');
    expect(R.head(result.generatedOutput).resultStream).toBeNull();
    expect(R.head(result.generatedOutput).resultString).toMatchSnapshot();
  });
});

describe('when generating schemas for extension namespace', () => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: 'extension',
      projectExtension: 'EXTENSION',
      isExtension: true,
    });
    metaEd.entity.namespaceInfo.set('extension', namespaceInfo);

    result = await generate(metaEd);
  });

  it('should generate correct schema', () => {
    expect(result.generatorName).toEqual('edfiOds.SchemaGenerator');
    expect(R.head(result.generatedOutput).fileName).toBe('0010-EXTENSION-extension-Schemas.sql');
    expect(R.head(result.generatedOutput).namespace).toBe('extension');
    expect(R.head(result.generatedOutput).folderName).toBe('/Database/SQLServer/ODS/Structure/');
    expect(R.head(result.generatedOutput).name).toBe('ODS Schema');
    expect(R.head(result.generatedOutput).resultStream).toBeNull();
    expect(R.head(result.generatedOutput).resultString).toMatchSnapshot();
  });
});
