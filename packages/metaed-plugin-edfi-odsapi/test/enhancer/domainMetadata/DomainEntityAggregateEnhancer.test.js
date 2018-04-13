// @flow
import { newMetaEdEnvironment, newDomainEntity, newNamespaceInfo } from 'metaed-core';
import type { MetaEdEnvironment, DomainEntity, NamespaceInfo } from 'metaed-core';
import { newTable } from 'metaed-plugin-edfi-ods';
import type { Table } from 'metaed-plugin-edfi-ods';
import { enhance } from '../../../src/enhancer/domainMetadata/DomainEntityAggregateEnhancer';
import type { NamespaceInfoEdfiOdsApi } from '../../../src/model/NamespaceInfo';
import { NoAggregate } from '../../../src/model/domainMetadata/Aggregate';
import type { Aggregate } from '../../../src/model/domainMetadata/Aggregate';
import type { EntityTable } from '../../../src/model/domainMetadata/EntityTable';

describe('when enhancing a domain entity', () => {
  const metaEdName: string = 'MetaEdName';
  const tableName: string = 'TableName';
  const namespace: string = 'namespace';

  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
    namespace,
    data: {
      edfiOdsApi: {
        aggregates: [],
      },
    },
  });

  let aggregate: Aggregate = NoAggregate;

  beforeAll(() => {
    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);

    const table: Table = {
      ...newTable(),
      name: tableName,
      schema: namespace,
    };

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace,
        data: {
          edfiOdsApi: {
            aggregates: [],
          },
        },
      }),
      data: {
        edfiOds: {
          ods_TableName: tableName,
          ods_Tables: [table],
        },
        edfiOdsApi: {},
      },
    });
    metaEd.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    enhance(metaEd);
    aggregate = domainEntity.data.edfiOdsApi.aggregate;
  });

  it('should add aggregate to namespace', () => {
    const namespaceInfoAggregates: Array<Aggregate> = ((namespaceInfo.data.edfiOdsApi: any): NamespaceInfoEdfiOdsApi)
      .aggregates;
    expect(namespaceInfoAggregates).toHaveLength(1);
    expect(namespaceInfoAggregates[0]).toBe(aggregate);
  });

  it('should create aggregate', () => {
    expect(aggregate).not.toBeNull();
    expect(aggregate.root).toBe(tableName);
    expect(aggregate.allowPrimaryKeyUpdates).toBe(false);
    expect(aggregate.isExtension).toBe(false);
  });

  it('should create entity tables', () => {
    expect(aggregate.entityTables).toHaveLength(1);
    const entityTable: EntityTable = aggregate.entityTables[0];
    expect(entityTable).not.toBeNull();
    expect(entityTable.schema).toBe(namespace);
    expect(entityTable.table).toBe(tableName);
  });
});

describe('when enhancing a domain entity that allows primary key updates', () => {
  const metaEdName: string = 'MetaEdName';
  const tableName: string = 'TableName';
  const namespace: string = 'namespace';

  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
    namespace,
    data: {
      edfiOdsApi: {
        aggregates: [],
      },
    },
  });

  let aggregate: Aggregate = NoAggregate;

  beforeAll(() => {
    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);

    const table: Table = {
      ...newTable(),
      name: tableName,
      schema: namespace,
    };

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName,
      allowPrimaryKeyUpdates: true,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace,
        data: {
          edfiOdsApi: {
            aggregates: [],
          },
        },
      }),
      data: {
        edfiOds: {
          ods_TableName: tableName,
          ods_Tables: [table],
        },
        edfiOdsApi: {},
      },
    });
    metaEd.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    enhance(metaEd);
    aggregate = domainEntity.data.edfiOdsApi.aggregate;
  });

  it('should create aggregate', () => {
    expect(aggregate).not.toBeNull();
    expect(aggregate.root).toBe(tableName);
    expect(aggregate.allowPrimaryKeyUpdates).toBe(true);
    expect(aggregate.isExtension).toBe(false);
  });

  it('should create entity tables', () => {
    expect(aggregate.entityTables).toHaveLength(1);
    const entityTable: EntityTable = aggregate.entityTables[0];
    expect(entityTable).not.toBeNull();
    expect(entityTable.schema).toBe(namespace);
    expect(entityTable.table).toBe(tableName);
  });
});

describe('when enhancing a domain entity that has a required collection table', () => {
  const metaEdName: string = 'MetaEdName';
  const tableName: string = 'TableName';
  const namespace: string = 'namespace';

  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
    namespace,
    data: {
      edfiOdsApi: {
        aggregates: [],
      },
    },
  });

  let aggregate: Aggregate = NoAggregate;

  beforeAll(() => {
    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);

    const table: Table = {
      ...newTable(),
      name: tableName,
      schema: namespace,
      isRequiredCollectionTable: true,
    };

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace,
        data: {
          edfiOdsApi: {
            aggregates: [],
          },
        },
      }),
      data: {
        edfiOds: {
          ods_TableName: tableName,
          ods_Tables: [table],
        },
        edfiOdsApi: {},
      },
    });
    metaEd.entity.domainEntity.set(domainEntity.metaEdName, domainEntity);

    enhance(metaEd);
    aggregate = domainEntity.data.edfiOdsApi.aggregate;
  });

  it('should add aggregate to namespace', () => {
    const namespaceInfoAggregates: Array<Aggregate> = ((namespaceInfo.data.edfiOdsApi: any): NamespaceInfoEdfiOdsApi)
      .aggregates;
    expect(namespaceInfoAggregates).toHaveLength(1);
    expect(namespaceInfoAggregates[0]).toBe(aggregate);
  });

  it('should create aggregate', () => {
    expect(aggregate).not.toBeNull();
    expect(aggregate.root).toBe(tableName);
    expect(aggregate.allowPrimaryKeyUpdates).toBe(false);
    expect(aggregate.isExtension).toBe(false);
  });

  it('should create entity tables', () => {
    expect(aggregate.entityTables).toHaveLength(1);
    const entityTable: EntityTable = aggregate.entityTables[0];
    expect(entityTable).not.toBeNull();
    expect(entityTable.schema).toBe(namespace);
    expect(entityTable.table).toBe(tableName);
    expect(entityTable.isRequiredCollection).toBe(true);
  });
});
