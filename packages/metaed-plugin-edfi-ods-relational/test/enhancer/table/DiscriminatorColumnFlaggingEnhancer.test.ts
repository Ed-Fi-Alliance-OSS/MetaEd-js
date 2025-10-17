// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { defaultPluginTechVersion, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { newMetaEdEnvironment, newNamespace, newDomainEntity, newPluginEnvironment } from '@edfi/metaed-core';
import { enhance } from '../../../src/enhancer/table/DiscriminatorColumnFlaggingEnhancer';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../../src/model/EdFiOdsRelationalEntityRepository';
import { newTable } from '../../../src/model/database/Table';
import { tableEntities } from '../../../src/enhancer/EnhancerHelper';
import { Table } from '../../../src/model/database/Table';

describe('when DiscriminatorColumnFlaggingEnhancer enhances table with no parent', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.plugin.set(
    'edfiOdsRelational',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: defaultPluginTechVersion,
    }),
  );

  const tableName = 'TableName';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: tableName,
      schema: namespace.namespaceName,
      isAggregateRootTable: true, // FYI: not actually possible to be aggregate root without parent
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    enhance(metaEd);
  });

  it('should have hasDiscriminatorColumn set to false', (): void => {
    expect((tableEntities(metaEd, namespace).get(tableName) as Table).hasDiscriminatorColumn).toBe(false);
  });
});

describe('when DiscriminatorColumnFlaggingEnhancer enhances non aggregate root table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.plugin.set(
    'edfiOdsRelational',
    Object.assign(newPluginEnvironment(), {
      targetTechnologyVersion: defaultPluginTechVersion,
    }),
  );

  const tableName = 'TableName';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: tableName,
      schema: namespace.namespaceName,
      parentEntity: newDomainEntity(),
      isAggregateRootTable: false,
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    enhance(metaEd);
  });

  it('should have hasDiscriminatorColumn set to false', (): void => {
    expect((tableEntities(metaEd, namespace).get(tableName) as Table).hasDiscriminatorColumn).toBe(false);
  });
});
