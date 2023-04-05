import path from 'path';
import {
  buildMetaEd,
  buildParseTree,
  initializeNamespaces,
  loadFileIndex,
  loadFiles,
  newMetaEdConfiguration,
  newState,
  runEnhancers,
  runValidators,
  setupPlugins,
  walkBuilders,
} from '@edfi/metaed-core';
import { State, Namespace } from '@edfi/metaed-core';
import { metaEdPlugins } from './PluginHelper';

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
  let state: State;

  beforeAll(async () => {
    state = {
      ...newState(),
      metaEdConfiguration,
      metaEdPlugins: metaEdPlugins(),
    };

    state.metaEd.dataStandardVersion = '3.0.0';

    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      runValidators(metaEdPlugin, state);
      await runEnhancers(metaEdPlugin, state);
    }
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

  it('should have core ods table', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('EdFi');
    if (namespace == null) throw new Error();
    const edfiDomainEntity = namespace.entity.domainEntity.get('EdfiDomainEntity');
    if (edfiDomainEntity == null) throw new Error();
    expect(edfiDomainEntity.data.edfiOdsRelational.odsTables[0].columns[0].columnId).toBe('EdfiPrimaryIdentity');
    expect(edfiDomainEntity.data.edfiOdsRelational.odsTables[0].schema).toBe('edfi');
  });

  it('should have gb ods table with reference to core', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('Gb');
    if (namespace == null) throw new Error();
    const gbDomainEntity = namespace.entity.domainEntity.get('GbDomainEntity');
    if (gbDomainEntity == null) throw new Error();
    expect(gbDomainEntity.data.edfiOdsRelational.odsTables[0].columns[0].columnId).toBe('GbPrimaryIdentity');
    expect(gbDomainEntity.data.edfiOdsRelational.odsTables[0].schema).toBe('gb');
    const gbDomainEntityFK = gbDomainEntity.data.edfiOdsRelational.odsTables[0].foreignKeys[0];
    expect(gbDomainEntityFK.foreignTableId).toBe('EdfiDomainEntity');
    expect(gbDomainEntityFK.foreignTableSchema).toBe('edfi');
  });

  it('should have sample ods table with reference to core', (): void => {
    const namespace: Namespace | undefined = state.metaEd.namespace.get('Sample');
    if (namespace == null) throw new Error();
    const sampleDomainEntity = namespace.entity.domainEntity.get('SampleDomainEntity');
    if (sampleDomainEntity == null) throw new Error();
    expect(sampleDomainEntity.data.edfiOdsRelational.odsTables[0].columns[0].columnId).toBe('SamplePrimaryIdentity');
    expect(sampleDomainEntity.data.edfiOdsRelational.odsTables[0].schema).toBe('sample');
    const sampleDomainEntityFK = sampleDomainEntity.data.edfiOdsRelational.odsTables[0].foreignKeys[0];
    expect(sampleDomainEntityFK.foreignTableId).toBe('EdfiDomainEntity');
    expect(sampleDomainEntityFK.foreignTableSchema).toBe('edfi');
  });
});
