// @flow
import path from 'path';
import { executePipeline, newMetaEdConfiguration, newPipelineOptions, newState } from 'metaed-core';
import type { State, DomainEntity } from 'metaed-core';

jest.unmock('final-fs');
jest.setTimeout(30000);

const metaEdConfiguration = {
  ...newMetaEdConfiguration(),
  artifactDirectory: './MetaEdOutput/',
  pluginConfig: {
    edfiUnified: {
      targetTechnologyVersion: '3.0.0',
    },
    edfiOds: {
      targetTechnologyVersion: '3.0.0',
    },
    edfiOdsApi: {
      targetTechnologyVersion: '3.0.0',
    },
    edfiXsd: {
      targetTechnologyVersion: '3.0.0',
    },
    edfiHandbook: {
      targetTechnologyVersion: '3.0.0',
    },
    edfiInterchangeBrief: {
      targetTechnologyVersion: '3.0.0',
    },
    edfiXmlDictionary: {
      targetTechnologyVersion: '3.0.0',
    },
  },
  projectPaths: [
    path.resolve(__dirname, 'projects', 'edfi'),
    path.resolve(__dirname, 'projects', 'gb'),
    path.resolve(__dirname, 'projects', 'sample'),
  ],
  projects: [
    {
      projectName: 'Ed-Fi',
      namespace: 'edfi',
      projectExtension: '',
      projectVersion: '3.0.0',
    },
    {
      projectName: 'Grand Bend',
      namespace: 'gb',
      projectExtension: 'GrandBend',
      projectVersion: '1.0.0',
    },
    {
      projectName: 'Sample',
      namespace: 'sample',
      projectExtension: 'Sample',
      projectVersion: '1.0.0',
    },
  ],
};

describe('when building a simple core and two simple extension projects', () => {
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

  it('should have no validation errors', () => {
    expect(state.validationFailure.length).toBe(0);
  });

  it('should have built three domain entities', () => {
    const domainEntities: Map<string, DomainEntity> = state.metaEd.entity.domainEntity;
    expect(domainEntities.get('EdfiDomainEntity')).toBeDefined();
    expect(domainEntities.get('GbDomainEntity')).toBeDefined();
    expect(domainEntities.get('SampleDomainEntity')).toBeDefined();
  });

  it('should have core domain metadata aggregrate', () => {
    const edfiDomainEntity = state.metaEd.entity.domainEntity.get('EdfiDomainEntity');
    if (edfiDomainEntity == null) throw new Error();
    expect(edfiDomainEntity.data.edfiOdsApi.aggregate.root).toBe('EdfiDomainEntity');
    expect(edfiDomainEntity.data.edfiOdsApi.aggregate.schema).toBe('edfi');
  });

  it('should have gb domain metadata aggregate', () => {
    const gbDomainEntity = state.metaEd.entity.domainEntity.get('GbDomainEntity');
    if (gbDomainEntity == null) throw new Error();
    expect(gbDomainEntity.data.edfiOdsApi.aggregate.root).toBe('GbDomainEntity');
    expect(gbDomainEntity.data.edfiOdsApi.aggregate.schema).toBe('gb');
  });

  it('should have sample domain metadata aggregate', () => {
    const sampleDomainEntity = state.metaEd.entity.domainEntity.get('SampleDomainEntity');
    if (sampleDomainEntity == null) throw new Error();
    expect(sampleDomainEntity.data.edfiOdsApi.aggregate.root).toBe('SampleDomainEntity');
    expect(sampleDomainEntity.data.edfiOdsApi.aggregate.schema).toBe('sample');
  });

  it('should have core entity definition', () => {
    const namespaceInfo = Array.from(state.metaEd.entity.namespaceInfo.values()).find(n => n.namespace === 'edfi');
    if (namespaceInfo == null) throw new Error();
    const entityDefinition = namespaceInfo.data.edfiOdsApi.domainModelDefinition.entityDefinitions.find(
      ed => ed.name === 'EdfiDomainEntity',
    );
    expect(entityDefinition.schema).toBe('edfi');
  });

  it('should have gb entity definition', () => {
    const namespaceInfo = Array.from(state.metaEd.entity.namespaceInfo.values()).find(n => n.namespace === 'gb');
    if (namespaceInfo == null) throw new Error();
    const entityDefinition = namespaceInfo.data.edfiOdsApi.domainModelDefinition.entityDefinitions.find(
      ed => ed.name === 'GbDomainEntity',
    );
    expect(entityDefinition.schema).toBe('gb');
  });

  it('should have sample entity definition', () => {
    const namespaceInfo = Array.from(state.metaEd.entity.namespaceInfo.values()).find(n => n.namespace === 'sample');
    if (namespaceInfo == null) throw new Error();
    const entityDefinition = namespaceInfo.data.edfiOdsApi.domainModelDefinition.entityDefinitions.find(
      ed => ed.name === 'SampleDomainEntity',
    );
    expect(entityDefinition.schema).toBe('sample');
  });
});
