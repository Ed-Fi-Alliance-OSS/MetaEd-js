import { newMetaEdEnvironment, newNamespace } from 'metaed-core';
import { MetaEdEnvironment, Namespace } from 'metaed-core';
import { enhance } from '../../../src/enhancer/table/BaseDescriptorTableEnhancer';
import { addEdFiOdsRelationalEntityRepositoryTo } from '../../../src/model/EdFiOdsRelationalEntityRepository';
import { tableEntities } from '../../../src/enhancer/EnhancerHelper';
import { Table } from '../../../src/model/database/Table';

describe('when BaseDescriptorTableEnhancer enhances', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);

  beforeAll(() => {
    addEdFiOdsRelationalEntityRepositoryTo(metaEd);
    enhance(metaEd);
  });

  it('should create descriptor table', (): void => {
    expect(tableEntities(metaEd, namespace).get('Descriptor')).toBeDefined();
  });

  it('should have eight descriptor columns', (): void => {
    const descriptorTable: Table = tableEntities(metaEd, namespace).get('Descriptor') as Table;
    expect(descriptorTable.columns).toHaveLength(8);
    expect(descriptorTable.columns.map((x) => x.columnId)).toEqual([
      'DescriptorId',
      'Namespace',
      'CodeValue',
      'ShortDescription',
      'Description',
      'PriorDescriptorId',
      'EffectiveBeginDate',
      'EffectiveEndDate',
    ]);
    expect(descriptorTable.columns.map((x) => x.type)).toEqual([
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
