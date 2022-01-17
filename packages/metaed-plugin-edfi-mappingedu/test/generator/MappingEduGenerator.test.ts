import { GeneratorResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { newNamespace, newMetaEdEnvironment } from '@edfi/metaed-core';
import { addEdFiMappingEduRepositoryTo } from '../../src/model/EdFiMappingEduRepository';
import { generate } from '../../src/generator/MappingEduGenerator';

describe('when generating output for namespace', (): void => {
  let result: GeneratorResult;

  beforeAll(async () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName: 'namespaceName',
    };
    metaEd.namespace.set(namespace.namespaceName, namespace);
    addEdFiMappingEduRepositoryTo(metaEd);
    result = await generate(metaEd);
  });

  it('should have correct generator result', (): void => {
    expect(result.generatorName).toEqual('edfiMappingedu.MappingEduGenerator');
    expect(result.generatedOutput[0].fileName).toBe('MappingEdu.xlsx');
    expect(result.generatedOutput[0].namespace).toBe('Documentation');
    expect(result.generatedOutput[0].folderName).toBe('MappingEdu');
    expect(result.generatedOutput[0].name).toBe('MappingEdu');
    expect(result.generatedOutput[0].resultString).toBe('');
    expect(result.generatedOutput[0].resultStream).toBeDefined();
    expect(result.generatedOutput[0].resultStream).toBeInstanceOf(Buffer);
  });
});
