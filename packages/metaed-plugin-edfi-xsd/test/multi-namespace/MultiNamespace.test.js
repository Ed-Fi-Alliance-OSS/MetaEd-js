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

  it('should have core entity definition', () => {
    const namespaceInfo = Array.from(state.metaEd.entity.namespaceInfo.values()).find(n => n.namespace === 'edfi');
    if (namespaceInfo == null) throw new Error();
    const schemaSection = namespaceInfo.data.edfiXsd.xsd_Schema.sections.find(
      s => s.complexTypes[0] && s.complexTypes[0].name === 'EdfiDomainEntity',
    );
    expect(schemaSection).toBeDefined();
  });

  it('should have gb entity definition', () => {
    const namespaceInfo = Array.from(state.metaEd.entity.namespaceInfo.values()).find(n => n.namespace === 'gb');
    if (namespaceInfo == null) throw new Error();
    const schemaSection = namespaceInfo.data.edfiXsd.xsd_Schema.sections.find(
      s => s.complexTypes[0] && s.complexTypes[0].name === 'GrandBend-GbDomainEntity',
    );
    expect(schemaSection).toBeDefined();
  });

  it('should have sample entity definition', () => {
    const namespaceInfo = Array.from(state.metaEd.entity.namespaceInfo.values()).find(n => n.namespace === 'sample');
    if (namespaceInfo == null) throw new Error();
    const schemaSection = namespaceInfo.data.edfiXsd.xsd_Schema.sections.find(
      s => s.complexTypes[0] && s.complexTypes[0].name === 'Sample-SampleDomainEntity',
    );
    expect(schemaSection).toBeDefined();
  });
});
