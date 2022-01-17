import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { GeneratorResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { generate } from '../../src/generator/SchemaGenerator';

describe('when generating schemas for core namespace', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName: 'EdFi',
      isExtension: false,
    };
    metaEd.namespace.set('EdFi', namespace);

    result = await generate(metaEd);
  });

  it('should generate correct schema', (): void => {
    expect(result.generatorName).toEqual('edfiOdsSqlServer.SchemaGenerator');
    expect(result.generatedOutput[0].fileName).toBe('0010-Schemas.sql');
    expect(result.generatedOutput[0].namespace).toBe('EdFi');
    expect(result.generatedOutput[0].folderName).toBe('/Database/SQLServer/ODS/Structure/');
    expect(result.generatedOutput[0].name).toBe('ODS SQL Server Schema');
    expect(result.generatedOutput[0].resultStream).toBeNull();
    expect(result.generatedOutput[0].resultString).toMatchSnapshot();
  });
});

describe('when generating schemas for extension namespace', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName: 'Extension',
      projectExtension: 'EXTENSION',
      isExtension: true,
    };
    metaEd.namespace.set('Extension', namespace);

    result = await generate(metaEd);
  });

  it('should generate correct schema', (): void => {
    expect(result.generatorName).toEqual('edfiOdsSqlServer.SchemaGenerator');
    expect(result.generatedOutput[0].fileName).toBe('0010-EXTENSION-Extension-Schemas.sql');
    expect(result.generatedOutput[0].namespace).toBe('Extension');
    expect(result.generatedOutput[0].folderName).toBe('/Database/SQLServer/ODS/Structure/');
    expect(result.generatedOutput[0].name).toBe('ODS SQL Server Schema');
    expect(result.generatedOutput[0].resultStream).toBeNull();
    expect(result.generatedOutput[0].resultString).toMatchSnapshot();
  });
});
