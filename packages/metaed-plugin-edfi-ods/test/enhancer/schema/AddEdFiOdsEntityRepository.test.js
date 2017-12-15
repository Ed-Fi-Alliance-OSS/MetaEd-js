// @flow
import { newMetaEdEnvironment } from 'metaed-core';
import type { MetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../../src/model/EdFiOdsEntityRepository';

describe('when BaseDescriptorTableCreatingEnhancer enhances', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(() => {
    enhance(metaEd);
  });

  it('should create plugin entity table', () => {
    expect((metaEd.plugin.get('edfiOds'): any).entity).toBeDefined();
    expect((metaEd.plugin.get('edfiOds'): any).entity.table).toBeDefined();
    expect((metaEd.plugin.get('edfiOds'): any).entity.table).toBeInstanceOf(Map);
    expect((metaEd.plugin.get('edfiOds'): any).entity.table.size).toBe(0);
    expect((metaEd.plugin.get('edfiOds'): any).entity.trigger).toBeDefined();
    expect((metaEd.plugin.get('edfiOds'): any).entity.trigger).toBeInstanceOf(Map);
    expect((metaEd.plugin.get('edfiOds'): any).entity.trigger.size).toBe(0);
    expect((metaEd.plugin.get('edfiOds'): any).entity.row).toBeDefined();
    expect((metaEd.plugin.get('edfiOds'): any).entity.row).toBeInstanceOf(Map);
    expect((metaEd.plugin.get('edfiOds'): any).entity.row.size).toBe(0);
  });
});

