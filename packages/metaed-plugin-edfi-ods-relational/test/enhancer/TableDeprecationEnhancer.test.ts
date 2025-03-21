// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, Namespace, newDomainEntity, newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/TableDeprecationEnhancer';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newTable, Table } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';

describe('when table parent entity has deprecation', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';
  const deprecationReason = 'DeprecationReason';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    const parentEntity = { ...newDomainEntity(), isDeprecated: true, deprecationReason };
    const table: Table = { ...newTable(), tableId: tableName, parentEntity };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    enhance(metaEd);
  });

  it('should have correct deprecation status', (): void => {
    const { isDeprecated, deprecationReasons } = tableEntities(metaEd, namespace).get(tableName) as Table;
    expect(isDeprecated).toBe(true);
    expect(deprecationReasons).toHaveLength(1);
    expect(deprecationReasons[0]).toBe(deprecationReason);
  });
});
