import { newMetaEdEnvironment, newDomainEntity, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, DomainEntity, Namespace } from '@edfi/metaed-core';
import {
  newTable,
  tableEntities,
  initializeEdFiOdsRelationalEntityRepository,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { enhance } from '../../../src/enhancer/domainMetadata/DomainEntityAggregateEnhancer';
import { NamespaceEdfiOdsApi } from '../../../src/model/Namespace';
import { NoAggregate } from '../../../src/model/domainMetadata/Aggregate';
import { Aggregate } from '../../../src/model/domainMetadata/Aggregate';
import { EntityTable } from '../../../src/model/domainMetadata/EntityTable';

describe('when enhancing a domain entity', (): void => {
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

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    const table: Table = {
      ...newTable(),
      tableId: tableName,
      schema,
      data: { edfiOdsSqlServer: { tableName } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsTableId: tableName,
          odsTables: [table],
        },
        edfiOdsApi: {},
      },
    });
    namespace.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    enhance(metaEd);
    ({ aggregate } = domainEntity.data.edfiOdsApi);
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
  });

  it('should create entity tables', (): void => {
    expect(aggregate.entityTables).toHaveLength(1);
    const entityTable: EntityTable = aggregate.entityTables[0];
    expect(entityTable).not.toBeNull();
    expect(entityTable.schema).toBe(schema);
    expect(entityTable.table).toBe(tableName);
  });
});

describe('when enhancing a domain entity that allows primary key updates', (): void => {
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

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    const table: Table = {
      ...newTable(),
      tableId: tableName,
      schema,
      data: { edfiOdsSqlServer: { tableName } },
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName,
      allowPrimaryKeyUpdates: true,
      namespace,
      data: {
        edfiOdsRelational: {
          odsTableId: tableName,
          odsTables: [table],
        },
        edfiOdsApi: {},
      },
    });
    namespace.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    enhance(metaEd);
    ({ aggregate } = domainEntity.data.edfiOdsApi);
  });

  it('should create aggregate', (): void => {
    expect(aggregate).not.toBeNull();
    expect(aggregate.root).toBe(tableName);
    expect(aggregate.allowPrimaryKeyUpdates).toBe(true);
    expect(aggregate.isExtension).toBe(false);
  });

  it('should create entity tables', (): void => {
    expect(aggregate.entityTables).toHaveLength(1);
    const entityTable: EntityTable = aggregate.entityTables[0];
    expect(entityTable).not.toBeNull();
    expect(entityTable.schema).toBe(schema);
    expect(entityTable.table).toBe(tableName);
  });
});

describe('when enhancing a domain entity that has a required collection table', (): void => {
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

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);
    const table: Table = {
      ...newTable(),
      tableId: tableName,
      schema,
      data: { edfiOdsSqlServer: { tableName } },
      isRequiredCollectionTable: true,
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsTableId: tableName,
          odsTables: [table],
        },
        edfiOdsApi: {},
      },
    });
    namespace.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    enhance(metaEd);
    ({ aggregate } = domainEntity.data.edfiOdsApi);
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
  });

  it('should create entity tables', (): void => {
    expect(aggregate.entityTables).toHaveLength(1);
    const entityTable: EntityTable = aggregate.entityTables[0];
    expect(entityTable).not.toBeNull();
    expect(entityTable.schema).toBe(schema);
    expect(entityTable.table).toBe(tableName);
    expect(entityTable.isRequiredCollection).toBe(true);
  });
});
