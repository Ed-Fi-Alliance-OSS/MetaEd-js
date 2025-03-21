// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { enhance } from '../../src/enhancer/ForeignKeyForeignTableReferenceEnhancer';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { ForeignKey } from '../../src/model/database/ForeignKey';
import { Table } from '../../src/model/database/Table';

describe('when ForeignKeyForeignTableReferenceEnhancer enhances table with foreign key', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentTableId = 'ParentTableId';
  const parentTable: Table = {
    ...newTable(),
    tableId: parentTableId,
    schema: 'edfi',
  };
  const foreignTableId = 'ForeignTableId';
  const foreignTable: Table = {
    ...newTable(),
    tableId: foreignTableId,
    schema: 'edfi',
  };

  beforeAll(() => {
    const foreignKey: ForeignKey = {
      ...newForeignKey(),
      foreignTableId,
      foreignTableNamespace: namespace,
    };
    parentTable.foreignKeys.push(foreignKey);

    initializeEdFiOdsRelationalEntityRepository(metaEd);
    tableEntities(metaEd, namespace).set(parentTable.tableId, parentTable);
    tableEntities(metaEd, namespace).set(foreignTable.tableId, foreignTable);
    enhance(metaEd);
  });

  it('should have foreign key with table set', (): void => {
    const foreignKey = R.head((tableEntities(metaEd, namespace).get(parentTableId) as Table).foreignKeys);
    expect(foreignKey.foreignTable).toBe(foreignTable);
  });
});
