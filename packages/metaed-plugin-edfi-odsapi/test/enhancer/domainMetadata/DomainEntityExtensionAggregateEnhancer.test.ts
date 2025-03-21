// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  newDomainEntity,
  newDomainEntityExtension,
  newNamespace,
  NoNamespace,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, DomainEntity, DomainEntityExtension, Namespace } from '@edfi/metaed-core';
import {
  newTable,
  initializeEdFiOdsRelationalEntityRepository,
  tableEntities,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { enhance } from '../../../src/enhancer/domainMetadata/DomainEntityExtensionAggregateEnhancer';
import { NamespaceEdfiOdsApi } from '../../../src/model/Namespace';
import { NoAggregate } from '../../../src/model/domainMetadata/Aggregate';
import { Aggregate } from '../../../src/model/domainMetadata/Aggregate';
import { EntityTable } from '../../../src/model/domainMetadata/EntityTable';

describe('when enhancing domainEntity extensions', (): void => {
  const entityName = 'EntityName';
  const tableName = 'TableName';
  const namespaceName = 'Namespace';
  const extensionNamespaceName = 'Extension';
  const extensionSchema = extensionNamespaceName.toLowerCase();

  let aggregate: Aggregate = NoAggregate;
  let extensionNamespace: Namespace = NoNamespace;

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
    extensionNamespace = {
      ...newNamespace(),
      namespaceName: extensionNamespaceName,
      isExtension: true,
      data: {
        edfiOdsApi: {
          aggregates: [],
        },
      },
    };
    extensionNamespace.dependencies.push(namespace);
    metaEd.namespace.set(namespace.namespaceName, namespace);
    metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);

    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const baseEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: entityName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsTableId: tableName,
        },
        edfiOdsApi: {},
      },
    });
    namespace.entity.domainEntity.set(baseEntity.metaEdName, baseEntity);

    const baseEntityTable: Table = {
      ...newTable(),
      tableId: tableName,
      schema: 'namespace',
      data: { edfiOdsSqlServer: { tableName } },
    };
    tableEntities(metaEd, namespace).set(baseEntityTable.tableId, baseEntityTable);

    const table: Table = {
      ...newTable(),
      tableId: tableName,
      schema: extensionSchema,
      data: { edfiOdsSqlServer: { tableName } },
    };
    tableEntities(metaEd, extensionNamespace).set(table.tableId, table);

    const entity: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      metaEdName: entityName,
      namespace: extensionNamespace,
      baseEntity,
      data: {
        edfiOdsRelational: {
          odsTableId: tableName,
          odsTables: [table],
        },
        edfiOdsApi: {},
      },
    });
    extensionNamespace.entity.domainEntityExtension.set(entity.metaEdName, entity);

    enhance(metaEd);
    ({ aggregate } = entity.data.edfiOdsApi);
  });

  it('should add aggregate to namespace', (): void => {
    const extensionNamespaceAggregates: Aggregate[] = (extensionNamespace.data.edfiOdsApi as NamespaceEdfiOdsApi).aggregates;
    expect(extensionNamespaceAggregates).toHaveLength(1);
    expect(extensionNamespaceAggregates[0]).toBe(aggregate);
  });

  it('should create aggregate', (): void => {
    expect(aggregate).not.toBeNull();
    expect(aggregate.root).toBe(tableName);
    expect(aggregate.allowPrimaryKeyUpdates).toBe(false);
    expect(aggregate.isExtension).toBe(true);
  });

  it('should create entity tables', (): void => {
    expect(aggregate.entityTables).toHaveLength(1);
    const entityTable: EntityTable = aggregate.entityTables[0];
    expect(entityTable).not.toBeNull();
    expect(entityTable.schema).toBe(extensionSchema);
    expect(entityTable.table).toBe(tableName);
  });
});

describe('when enhancing domainEntity extension that has a required collection table', () => {
  const baseEntityName: string = 'BaseEntityName';
  const baseTableName: string = 'BaseTableName';
  const entityName: string = 'EntityName';
  const tableId: string = 'TableId';
  const namespaceName: string = 'namespace';
  const extensionNamespaceName: string = 'extension';

  let aggregate: Aggregate = NoAggregate;
  let extensionNamespace: Namespace = NoNamespace;

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
    extensionNamespace = {
      ...newNamespace(),
      namespaceName: extensionNamespaceName,
      isExtension: true,
      data: {
        edfiOdsApi: {
          aggregates: [],
        },
      },
    };
    extensionNamespace.dependencies.push(namespace);
    metaEd.namespace.set(namespace.namespaceName, namespace);
    metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);

    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const baseEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: baseEntityName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsTableId: baseTableName,
        },
        edfiOdsApi: {},
      },
    });
    namespace.entity.domainEntity.set(baseEntity.metaEdName, baseEntity);

    const baseEntityTable: Table = {
      ...newTable(),
      tableId,
      schema: namespaceName,
      data: { edfiOdsSqlServer: { tableName: tableId } },
    };
    tableEntities(metaEd, namespace).set(baseEntityTable.tableId, baseEntityTable);

    const table: Table = {
      ...newTable(),
      tableId,
      schema: extensionNamespaceName,
      isRequiredCollectionTable: true,
      data: { edfiOdsSqlServer: { tableName: tableId } },
    };
    tableEntities(metaEd, extensionNamespace).set(table.tableId, table);

    const entity: DomainEntityExtension = Object.assign(newDomainEntityExtension(), {
      metaEdName: entityName,
      namespace: extensionNamespace,
      baseEntity,
      data: {
        edfiOdsRelational: {
          odsTableId: tableId,
          odsTables: [table],
        },
        edfiOdsApi: {},
      },
    });
    extensionNamespace.entity.domainEntityExtension.set(entity.metaEdName, entity);

    enhance(metaEd);
    ({ aggregate } = entity.data.edfiOdsApi);
  });

  it('should add aggregate to namespace', () => {
    const extensionNamespaceAggregates: Array<Aggregate> = (extensionNamespace.data.edfiOdsApi as NamespaceEdfiOdsApi)
      .aggregates;
    expect(extensionNamespaceAggregates).toHaveLength(1);
    expect(extensionNamespaceAggregates[0]).toBe(aggregate);
  });

  it('should create aggregate', () => {
    expect(aggregate).not.toBeNull();
    expect(aggregate.root).toBe(tableId);
    expect(aggregate.allowPrimaryKeyUpdates).toBe(false);
    expect(aggregate.isExtension).toBe(true);
  });

  it('should create entity tables', () => {
    expect(aggregate.entityTables).toHaveLength(1);
    const entityTable: EntityTable = aggregate.entityTables[0];
    expect(entityTable).not.toBeNull();
    expect(entityTable.schema).toBe(extensionNamespaceName);
    expect(entityTable.table).toBe(tableId);
    expect(entityTable.isRequiredCollection).toBe(true);
  });
});
