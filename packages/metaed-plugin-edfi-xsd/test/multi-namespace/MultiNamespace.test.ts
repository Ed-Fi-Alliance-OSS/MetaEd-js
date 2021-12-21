import path from 'path';
import { State, Namespace, executePipeline, newMetaEdConfiguration, newPipelineOptions, newState } from 'metaed-core';

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
      description: '',
    },
    {
      projectName: 'Grand Bend',
      namespaceName: 'Gb',
      projectExtension: 'GrandBend',
      projectVersion: '1.0.0',
      description: '',
    },
    {
      projectName: 'Sample',
      namespaceName: 'Sample',
      projectExtension: 'Sample',
      projectVersion: '1.0.0',
      description: '',
    },
  ],
};

describe('when building a simple core and two simple extension projects', (): void => {
  let state: State = newState();

  beforeAll(async (): Promise<void> => {
    state = {
      ...newState(),
      metaEdConfiguration,
      pipelineOptions: { ...newPipelineOptions(), runValidators: true, runEnhancers: true },
    };

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

  it('should have core entity definition', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('EdFi');
    if (namespace == null) throw new Error();
    const schemaSection = namespace.data.edfiXsd.xsdSchema.sections.find(
      (s) => s.complexTypes[0] && s.complexTypes[0].name === 'EdfiDomainEntity',
    );
    expect(schemaSection).toBeDefined();
  });

  it('should have gb entity definition', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('Gb');
    if (namespace == null) throw new Error();
    const schemaSection = namespace.data.edfiXsd.xsdSchema.sections.find(
      (s) => s.complexTypes[0] && s.complexTypes[0].name === 'GrandBend-GbDomainEntity',
    );
    expect(schemaSection).toBeDefined();
  });

  it('should have sample entity definition', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('Sample');
    if (namespace == null) throw new Error();
    const schemaSection = namespace.data.edfiXsd.xsdSchema.sections.find(
      (s) => s.complexTypes[0] && s.complexTypes[0].name === 'Sample-SampleDomainEntity',
    );
    expect(schemaSection).toBeDefined();
  });
});
