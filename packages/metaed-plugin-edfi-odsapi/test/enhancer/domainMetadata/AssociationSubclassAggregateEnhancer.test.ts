// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdEnvironment, newAssociation, newAssociationSubclass, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Association, AssociationSubclass, Namespace } from '@edfi/metaed-core';
import {
  newTable,
  initializeEdFiOdsRelationalEntityRepository,
  tableEntities,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { enhance } from '../../../src/enhancer/domainMetadata/AssociationSubclassAggregateEnhancer';
import { NoAggregate } from '../../../src/model/domainMetadata/Aggregate';
import { Aggregate } from '../../../src/model/domainMetadata/Aggregate';
import { EntityTable } from '../../../src/model/domainMetadata/EntityTable';

describe('when enhancing association extensions', (): void => {
  const baseEntityName = 'BaseEntityName';
  const baseTableName = 'BaseTableName';
  const entityName = 'EntityName';
  const tableName = 'TableName';
  const namespaceName = 'Namespace';
  const schema = namespaceName.toLowerCase();

  let aggregate: Aggregate = NoAggregate;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = {
      ...newNamespace(),
      namespaceName,
      data: {
        edfiOdsApi: {
          aggregates: [],
        },
      },
    };
    metaEd.namespace.set(namespace.namespaceName, namespace);
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const baseEntity: Association = Object.assign(newAssociation(), {
      metaEdName: baseEntityName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsTableId: baseTableName,
        },
        edfiOdsApi: {},
      },
    });
    namespace.entity.association.set(baseEntity.metaEdName, baseEntity);

    const baseTable: Table = {
      ...newTable(),
      tableId: baseTableName,
      schema,
      data: { edfiOdsSqlServer: { tableName: baseTableName } },
    };
    tableEntities(metaEd, namespace).set(baseTable.tableId, baseTable);

    const table: Table = {
      ...newTable(),
      tableId: tableName,
      schema,
      data: { edfiOdsSqlServer: { tableName } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    const entity: AssociationSubclass = Object.assign(newAssociationSubclass(), {
      metaEdName: entityName,
      baseEntity,
      namespace,
      data: {
        edfiOdsRelational: {
          odsTableId: tableName,
          odsTables: [table],
        },
        edfiOdsApi: {},
      },
    });
    namespace.entity.associationSubclass.set(entity.metaEdName, entity);

    enhance(metaEd);
    ({ aggregate } = entity.data.edfiOdsApi);
  });

  it('should create aggregate', (): void => {
    expect(aggregate).not.toBeNull();
    expect(aggregate.root).toBe(tableName);
    expect(aggregate.allowPrimaryKeyUpdates).toBe(false);
    expect(aggregate.isExtension).toBe(false);
  });

  it('should create entity tables', (): void => {
    expect(aggregate.entityTables).toHaveLength(1);
    const entityTable: EntityTable = aggregate.entityTables[0];
    expect(entityTable).not.toBeNull();
    expect(entityTable.schema).toBe(schema);
    expect(entityTable.table).toBe(tableName);
    expect(entityTable.isA).toBe(baseTableName);
  });
});
