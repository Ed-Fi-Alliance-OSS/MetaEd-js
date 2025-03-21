// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../../src/model/EdFiOdsRelationalEntityRepository';

describe('when BaseDescriptorTableEnhancer enhances', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);

  beforeAll(() => {
    enhance(metaEd);
  });

  it('should create plugin entity table', (): void => {
    expect((metaEd.plugin.get('edfiOdsRelational') as any).namespace.get(namespace)).toBeDefined();
    expect((metaEd.plugin.get('edfiOdsRelational') as any).namespace.get(namespace).table).toBeDefined();
    expect((metaEd.plugin.get('edfiOdsRelational') as any).namespace.get(namespace).table).toBeInstanceOf(Map);
    expect((metaEd.plugin.get('edfiOdsRelational') as any).namespace.get(namespace).table.size).toBe(0);
    expect((metaEd.plugin.get('edfiOdsRelational') as any).namespace.get(namespace).row).toBeDefined();
    expect((metaEd.plugin.get('edfiOdsRelational') as any).namespace.get(namespace).row).toBeInstanceOf(Map);
    expect((metaEd.plugin.get('edfiOdsRelational') as any).namespace.get(namespace).row.size).toBe(0);
  });
});
