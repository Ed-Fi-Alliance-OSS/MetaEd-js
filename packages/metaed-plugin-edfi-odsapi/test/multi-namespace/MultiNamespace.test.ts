import path from 'path';
import { executePipeline, newMetaEdConfiguration, newPipelineOptions, newState } from '@edfi/metaed-core';
import { State, Namespace } from '@edfi/metaed-core';

jest.unmock('final-fs');
jest.setTimeout(30000);

const metaEdConfiguration = {
  ...newMetaEdConfiguration(),
  artifactDirectory: './MetaEdOutput/',
  defaultPluginTechVersion: '3.0.0',
  projectPaths: [
    path.resolve(__dirname, 'projects', 'edfi'),
    path.resolve(__dirname, 'projects', 'gb'),
    path.resolve(__dirname, 'projects', 'sample'),
  ],
  projects: [
    {
      projectName: 'Ed-Fi',
      namespaceName: 'EdFi',
      projectExtension: '',
      projectVersion: '3.0.0',
    },
    {
      projectName: 'Grand Bend',
      namespaceName: 'Gb',
      projectExtension: 'GrandBend',
      projectVersion: '1.0.0',
    },
    {
      projectName: 'Sample',
      namespaceName: 'Sample',
      projectExtension: 'Sample',
      projectVersion: '1.0.0',
    },
  ],
};

describe('when building a simple core and two simple extension projects', (): void => {
  let state: State = newState();

  beforeAll(async () => {
    state = Object.assign(newState(), {
      metaEdConfiguration,
      pipelineOptions: Object.assign(newPipelineOptions(), {
        runValidators: true,
        runEnhancers: true,
      }),
    });

    state.metaEd.dataStandardVersion = '3.0.0';
    state.pluginScanDirectory = path.resolve(__dirname, '../../..');
    await executePipeline(state);
  });

  it('should have no validation errors', (): void => {
    expect(state.validationFailure.length).toBe(0);
  });

  it('should have core domain entity', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('EdFi');
    if (namespace == null) throw new Error();
    expect(namespace.entity.domainEntity.get('EdfiDomainEntity')).toBeDefined();
  });

  it('should have gb domain entity', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('Gb');
    if (namespace == null) throw new Error();
    expect(namespace.entity.domainEntity.get('GbDomainEntity')).toBeDefined();
  });

  it('should have sample domain entity', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('Sample');
    if (namespace == null) throw new Error();
    expect(namespace.entity.domainEntity.get('SampleDomainEntity')).toBeDefined();
  });

  it('should have core domain metadata aggregrate', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('EdFi');
    if (namespace == null) throw new Error();
    const edfiDomainEntity = namespace.entity.domainEntity.get('EdfiDomainEntity');
    if (edfiDomainEntity == null) throw new Error();
    expect(edfiDomainEntity.data.edfiOdsApi.aggregate.root).toBe('EdfiDomainEntity');
    expect(edfiDomainEntity.data.edfiOdsApi.aggregate.schema).toBe('edfi');
  });

  it('should have gb domain metadata aggregate', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('Gb');
    if (namespace == null) throw new Error();
    const gbDomainEntity = namespace.entity.domainEntity.get('GbDomainEntity');
    if (gbDomainEntity == null) throw new Error();
    expect(gbDomainEntity.data.edfiOdsApi.aggregate.root).toBe('GbDomainEntity');
    expect(gbDomainEntity.data.edfiOdsApi.aggregate.schema).toBe('gb');
  });

  it('should have sample domain metadata aggregate', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('Sample');
    if (namespace == null) throw new Error();
    const sampleDomainEntity = namespace.entity.domainEntity.get('SampleDomainEntity');
    if (sampleDomainEntity == null) throw new Error();
    expect(sampleDomainEntity.data.edfiOdsApi.aggregate.root).toBe('SampleDomainEntity');
    expect(sampleDomainEntity.data.edfiOdsApi.aggregate.schema).toBe('sample');
  });

  it('should have core entity definition', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('EdFi');
    if (namespace == null) throw new Error();
    const entityDefinition = namespace.data.edfiOdsApi.domainModelDefinition.entityDefinitions.find(
      (ed) => ed.name === 'EdfiDomainEntity',
    );
    expect(entityDefinition.schema).toBe('edfi');
  });

  it('should have gb entity definition', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('Gb');
    if (namespace == null) throw new Error();
    const entityDefinition = namespace.data.edfiOdsApi.domainModelDefinition.entityDefinitions.find(
      (ed) => ed.name === 'GbDomainEntity',
    );
    expect(entityDefinition.schema).toBe('gb');
  });

  it('should have sample entity definition', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('Sample');
    if (namespace == null) throw new Error();
    const entityDefinition = namespace.data.edfiOdsApi.domainModelDefinition.entityDefinitions.find(
      (ed) => ed.name === 'SampleDomainEntity',
    );
    expect(entityDefinition.schema).toBe('sample');
  });
});
