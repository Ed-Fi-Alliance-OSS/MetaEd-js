// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newMetaEdEnvironment, newDescriptor, newNamespace, normalizeEnumerationSuffix } from '@edfi/metaed-core';
import { MetaEdEnvironment, Descriptor, Namespace } from '@edfi/metaed-core';
import {
  newTable,
  initializeEdFiOdsRelationalEntityRepository,
  tableEntities,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { enhance } from '../../../src/enhancer/domainMetadata/DescriptorAggregateEnhancer';
import { NamespaceEdfiOdsApi } from '../../../src/model/Namespace';
import { NoAggregate } from '../../../src/model/domainMetadata/Aggregate';
import { Aggregate } from '../../../src/model/domainMetadata/Aggregate';
import { EntityTable } from '../../../src/model/domainMetadata/EntityTable';

describe('when enhancing descriptor with no map type', (): void => {
  const metaEdName = 'MetaEdName';
  const tableName = 'TableName';
  const namespaceName = 'Namespace';
  const schema = namespaceName.toLowerCase();

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

  let aggregate: Aggregate = NoAggregate;
  let typeAggregate: Aggregate = NoAggregate;

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    aggregate = NoAggregate;
    typeAggregate = NoAggregate;

    const table: Table = {
      ...newTable(),
      tableId: tableName,
      schema,
      data: { edfiOdsSqlServer: { tableName } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName,
      isMapTypeRequired: false,
      isMapTypeOptional: false,
      namespace,
      data: {
        edfiOdsRelational: {
          odsTableId: tableName,
          odsTables: [table],
        },
        edfiOdsApi: {
          aggregate: NoAggregate,
          typeAggregate: NoAggregate,
        },
      },
    });
    namespace.entity.descriptor.set(descriptor.metaEdName, descriptor);

    enhance(metaEd);
    ({ aggregate, typeAggregate } = descriptor.data.edfiOdsApi);
  });

  it('should add aggregate to namespace', (): void => {
    const namespaceAggregates: Aggregate[] = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).aggregates;
    expect(namespaceAggregates).toHaveLength(1);
    expect(namespaceAggregates[0]).toBe(aggregate);
  });

  it('should create aggregate', (): void => {
    expect(aggregate).not.toBeNull();
    expect(aggregate.root).toBe(tableName);
    expect(aggregate.allowPrimaryKeyUpdates).toBe(false);
    expect(aggregate.isExtension).toBe(false);
    expect(typeAggregate).toBe(NoAggregate);
  });

  it('should create entity tables', (): void => {
    expect(aggregate.entityTables).toHaveLength(1);
    const entityTable: EntityTable = aggregate.entityTables[0];
    expect(entityTable).not.toBeNull();
    expect(entityTable.schema).toBe(schema);
    expect(entityTable.table).toBe(tableName);
  });
});

describe('when enhancing descriptor with map type', (): void => {
  const entityName = 'EntityName';
  const descriptorTableName = `${entityName}Descriptor`;
  const typeTableName: string = normalizeEnumerationSuffix(entityName);
  const namespaceName = 'Namespace';
  const schema = namespaceName.toLowerCase();

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

  let aggregate: Aggregate = NoAggregate;
  let typeAggregate: Aggregate = NoAggregate;

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    aggregate = NoAggregate;
    typeAggregate = NoAggregate;

    const descriptorTable: Table = {
      ...newTable(),
      tableId: descriptorTableName,
      schema,
      data: { edfiOdsSqlServer: { tableName: descriptorTableName } },
    };
    tableEntities(metaEd, namespace).set(descriptorTable.tableId, descriptorTable);

    const typeTable: Table = {
      ...newTable(),
      tableId: typeTableName,
      schema,
      data: { edfiOdsSqlServer: { tableName: typeTableName } },
    };
    tableEntities(metaEd, namespace).set(typeTable.tableId, typeTable);

    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: entityName,
      isMapTypeRequired: true,
      isMapTypeOptional: false,
      namespace,
      data: {
        edfiOdsRelational: {
          odsTableId: descriptorTableName,
          odsTables: [descriptorTable, typeTable],
          odsIsMapType: true,
        },
        edfiOdsApi: {
          aggregate: NoAggregate,
          typeAggregate: NoAggregate,
        },
      },
    });
    namespace.entity.descriptor.set(descriptor.metaEdName, descriptor);

    enhance(metaEd);
    ({ aggregate, typeAggregate } = descriptor.data.edfiOdsApi);
  });

  it('should add aggregate to namespace', (): void => {
    const namespaceAggregates: Aggregate[] = (namespace.data.edfiOdsApi as NamespaceEdfiOdsApi).aggregates;
    expect(namespaceAggregates).toHaveLength(2);
    expect(namespaceAggregates).toContain(aggregate);
    expect(namespaceAggregates).toContain(typeAggregate);
  });

  it('should create aggregate', (): void => {
    expect(aggregate).not.toBeNull();
    expect(aggregate.root).toBe(descriptorTableName);
    expect(aggregate.allowPrimaryKeyUpdates).toBe(false);
    expect(aggregate.isExtension).toBe(false);
  });

  it('should create type aggregate', (): void => {
    expect(typeAggregate).not.toBeNull();
    expect(typeAggregate.root).toBe(typeTableName);
    expect(typeAggregate.allowPrimaryKeyUpdates).toBe(false);
    expect(typeAggregate.isExtension).toBe(false);
  });

  it('should create entity tables', (): void => {
    expect(aggregate.entityTables).toHaveLength(1);
    const descriptorEntityTable: EntityTable = aggregate.entityTables[0];
    expect(descriptorEntityTable).not.toBeNull();
    expect(descriptorEntityTable.schema).toBe(schema);
    expect(descriptorEntityTable.table).toBe(descriptorTableName);

    expect(typeAggregate.entityTables).toHaveLength(1);
    const typeEntityTable: EntityTable = typeAggregate.entityTables[0];
    expect(typeEntityTable).not.toBeNull();
    expect(typeEntityTable.schema).toBe(schema);
    expect(typeEntityTable.table).toBe(typeTableName);
  });
});
