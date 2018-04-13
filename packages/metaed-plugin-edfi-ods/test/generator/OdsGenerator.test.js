// @flow
import R from 'ramda';
import { newMetaEdEnvironment, newNamespaceInfo } from 'metaed-core';
import type { GeneratorResult, MetaEdEnvironment, NamespaceInfo } from 'metaed-core';
import { generate } from '../../src/generator/OdsGenerator';
import { newSchemaContainer } from '../../src/model/database/SchemaContainer';

describe('when generating output for namespace', () => {
  const namespace: string = 'namespaceName';
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      isExtension: false,
      data: {
        edfiOds: {
          ods_Schema: newSchemaContainer(),
        },
      },
    });
    metaEd.entity.namespaceInfo.set(namespace, namespaceInfo);

    result = await generate(metaEd);
  });

  it('should generate empty output', () => {
    expect(result.generatorName).toEqual('edfiOds.OdsGenerator');
    expect(R.head(result.generatedOutput).fileName).toBe(`0020-${namespace}-Tables.sql`);
    expect(R.head(result.generatedOutput).namespace).toBe(namespace);
    expect(R.head(result.generatedOutput).folderName).toBe('/Database/SQLServer/ODS/Structure/');
    expect(R.head(result.generatedOutput).name).toBe('ODS Tables');
    expect(R.head(result.generatedOutput).resultStream).toBeNull();
    expect(R.head(result.generatedOutput).resultString).toBe('');
  });
});

describe('when generating output for core namespace', () => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: string = 'edfi';
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      isExtension: false,
      data: {
        edfiOds: {
          ods_Schema: newSchemaContainer(),
        },
      },
    });
    metaEd.entity.namespaceInfo.set(namespace, namespaceInfo);

    result = await generate(metaEd);
  });

  it('should generate correct file name', () => {
    expect(R.head(result.generatedOutput).fileName).toBe('0020-Tables.sql');
  });
});

describe('when generating output for extension namespace', () => {
  const namespace: string = 'extension';
  const projectExtension: string = 'EXTENSION';
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      projectExtension,
      isExtension: true,
      data: {
        edfiOds: {
          ods_Schema: newSchemaContainer(),
        },
      },
    });
    metaEd.entity.namespaceInfo.set(namespace, namespaceInfo);

    result = await generate(metaEd);
  });

  it('should generate correct file name', () => {
    expect(R.head(result.generatedOutput).fileName).toBe(`0020-${projectExtension}-${namespace}-Tables.sql`);
  });
});
