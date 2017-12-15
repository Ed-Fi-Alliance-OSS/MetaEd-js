// @flow
import { newMetaEdEnvironment, newPluginEnvironment } from 'metaed-core';
import type { MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../../src/enhancer/table/BaseDescriptorTableCreatingEnhancer';
import { newEdFiOdsEntityRepository } from '../../../src/model/EdFiOdsEntityRepository';

describe('when BaseDescriptorTableCreatingEnhancer enhances', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(() => {
    const plugin = Object.assign(newPluginEnvironment(), {
      entity: newEdFiOdsEntityRepository(),
    });
    metaEd.plugin.set('edfiOds', plugin);

    enhance(metaEd);
  });

  it('should create descriptor table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.get('Descriptor')).toBeDefined();
  });

  it('should have eight descriptor columns', () => {
    const descriptorTable: any = (metaEd.plugin.get('edfiOds'): any).entity.table.get('Descriptor');
    expect(descriptorTable.columns).toHaveLength(8);
    expect(descriptorTable.columns.map(x => x.name)).toEqual([
      'DescriptorId',
      'Namespace',
      'CodeValue',
      'ShortDescription',
      'Description',
      'PriorDescriptorId',
      'EffectiveBeginDate',
      'EffectiveEndDate',
    ]);
    expect(descriptorTable.columns.map(x => x.type)).toEqual([
      'integer',
      'string',
      'string',
      'string',
      'string',
      'integer',
      'date',
      'date',
    ]);
  });
});

