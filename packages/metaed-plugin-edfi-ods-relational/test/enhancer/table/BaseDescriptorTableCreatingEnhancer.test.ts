// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
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
