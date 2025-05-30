// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  defaultPluginTechVersion,
  MetaEdEnvironment,
  Namespace,
  newMetaEdEnvironment,
  newNamespace,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import {
  initializeEdFiOdsRelationalEntityRepository,
  newTable,
  tableEntities,
  Table,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import { enhance } from '../../src/enhancer/AddOwnershipTokenColumnTableEnhancer';
import { enhance as tableSetupEnhancer, TableEdfiOdsRecordOwnership } from '../../src/model/Table';

describe('when AddOwnershipTokenColumnTableEnhancer enhances aggregate root table for ODS/API 5.1', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';

  beforeAll(() => {
    metaEd.plugin.set('edfiOdsRecordOwnership', {
      ...newPluginEnvironment(),
      targetTechnologyVersion: defaultPluginTechVersion,
    });

    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: tableName,
      schema: namespace.namespaceName,
      isAggregateRootTable: true,
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);
    tableSetupEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have hasOwnershipTokenColumn property set to true', (): void => {
    const table: Table = tableEntities(metaEd, namespace).get(tableName) as Table;
    expect((table.data.edfiOdsRecordOwnership as TableEdfiOdsRecordOwnership).hasOwnershipTokenColumn).toBe(true);
  });
});

describe('when AddOwnershipTokenColumnTableEnhancer enhances non-aggregate root table for ODS/API 5.1', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';

  beforeAll(() => {
    metaEd.plugin.set('edfiOdsRecordOwnership', {
      ...newPluginEnvironment(),
      targetTechnologyVersion: defaultPluginTechVersion,
    });

    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: tableName,
      schema: namespace.namespaceName,
      isAggregateRootTable: false,
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);
    tableSetupEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have hasOwnershipTokenColumn property set to true', (): void => {
    const table: Table = tableEntities(metaEd, namespace).get(tableName) as Table;
    expect((table.data.edfiOdsRecordOwnership as TableEdfiOdsRecordOwnership).hasOwnershipTokenColumn).toBe(false);
  });
});
