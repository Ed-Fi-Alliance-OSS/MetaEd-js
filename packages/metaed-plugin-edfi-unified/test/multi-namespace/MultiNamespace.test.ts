import path from 'path';
import {
  executePipeline,
  newMetaEdConfiguration,
  newPipelineOptions,
  newState,
  asReferentialProperty,
} from '@edfi/metaed-core';
import { State } from '@edfi/metaed-core';

jest.unmock('final-fs');
jest.setTimeout(100000);

const metaEdConfiguration = {
  ...newMetaEdConfiguration(),
  artifactDirectory: './MetaEdOutput/',
  defaultPluginTechVersion: '2.0.0',
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
      projectVersion: '2.0.0',
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

    state.pluginScanDirectory = path.resolve(__dirname, '../../..');
    await executePipeline(state);
  });

  it('should have no validation errors', (): void => {
    expect(state.validationFailure.length).toBe(0);
  });

  it('should have extension domain entities referencing core entity (meaning unified enhancers ran)', (): void => {
    const coreNamespace = state.metaEd.namespace.get('EdFi');
    if (coreNamespace == null) throw new Error();
    const edfiDomainEntity = coreNamespace.entity.domainEntity.get('EdfiDomainEntity');
    if (edfiDomainEntity == null) throw new Error();
    expect(edfiDomainEntity.namespace.namespaceName).toBe('EdFi');

    const gbNamespace = state.metaEd.namespace.get('Gb');
    if (gbNamespace == null) throw new Error();
    const gbDomainEntity = gbNamespace.entity.domainEntity.get('GbDomainEntity');
    if (gbDomainEntity == null) throw new Error();
    expect(gbDomainEntity.namespace.namespaceName).toBe('Gb');
    expect(gbDomainEntity.properties[2].metaEdName).toBe('EdfiDomainEntity');
    expect(asReferentialProperty(gbDomainEntity.properties[2]).referencedEntity).toBe(edfiDomainEntity);

    const sampleNamespace = state.metaEd.namespace.get('Sample');
    if (sampleNamespace == null) throw new Error();
    const sampleDomainEntity = sampleNamespace.entity.domainEntity.get('SampleDomainEntity');
    if (sampleDomainEntity == null) throw new Error();
    expect(sampleDomainEntity.namespace.namespaceName).toBe('Sample');
    expect(sampleDomainEntity.properties[2].metaEdName).toBe('EdfiDomainEntity');
    expect(asReferentialProperty(sampleDomainEntity.properties[2]).referencedEntity).toBe(edfiDomainEntity);
  });
});
