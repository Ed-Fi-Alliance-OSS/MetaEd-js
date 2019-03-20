// @flow
import R from 'ramda';
import { newMetaEdEnvironment, newNamespace } from 'metaed-core';
import type { GeneratorResult, MetaEdEnvironment, Namespace } from 'metaed-core';
import { generate } from '../../src/generator/OdsGenerator';
import { newSchemaContainer } from '../../src/model/database/SchemaContainer';

describe('when generating output for namespace', () => {
  const namespaceName: string = 'namespaceName';
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOds', { targetTechnologyVersion: '3.0.0', shortName: '', namespace: new Map(), config: {} });
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName,
      isExtension: false,
      data: {
        edfiOds: {
          ods_Schema: newSchemaContainer(),
        },
      },
    };
    metaEd.namespace.set(namespaceName, namespace);

    result = await generate(metaEd);
  });

  it('should generate empty output', () => {
    expect(result.generatorName).toEqual('edfiOds.OdsGenerator');
    expect(R.head(result.generatedOutput).fileName).toBe(`0020-${namespaceName}-Tables.sql`);
    expect(R.head(result.generatedOutput).namespace).toBe(namespaceName);
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
    metaEd.plugin.set('edfiOds', { targetTechnologyVersion: '3.0.0', shortName: '', namespace: new Map(), config: {} });
    const namespaceName: string = 'edfi';
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName,
      isExtension: false,
      data: {
        edfiOds: {
          ods_Schema: newSchemaContainer(),
        },
      },
    };
    metaEd.namespace.set(namespaceName, namespace);

    result = await generate(metaEd);
  });

  it('should generate correct file name', () => {
    expect(R.head(result.generatedOutput).fileName).toBe('0020-Tables.sql');
  });
});

describe('when generating output for extension namespace', () => {
  const namespaceName: string = 'extension';
  const projectExtension: string = 'EXTENSION';
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiOds', { targetTechnologyVersion: '3.0.0', shortName: '', namespace: new Map(), config: {} });
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName,
      projectExtension,
      isExtension: true,
      data: {
        edfiOds: {
          ods_Schema: newSchemaContainer(),
        },
      },
    };
    metaEd.namespace.set(namespaceName, namespace);

    result = await generate(metaEd);
  });

  it('should generate correct file name', () => {
    expect(R.head(result.generatedOutput).fileName).toBe(`0020-${projectExtension}-${namespaceName}-Tables.sql`);
  });
});
