// @flow
import { newMetaEdEnvironment, newDescriptor, newNamespaceInfo, normalizeEnumerationSuffix } from 'metaed-core';
import type { MetaEdEnvironment, Descriptor, NamespaceInfo } from 'metaed-core';
import { newTable } from 'metaed-plugin-edfi-ods';
import type { Table } from 'metaed-plugin-edfi-ods';
import { enhance } from '../../../src/enhancer/domainMetadata/DescriptorAggregateEnhancer';
import type { NamespaceInfoEdfiOdsApi } from '../../../src/model/NamespaceInfo';
import { NoAggregate } from '../../../src/model/domainMetadata/Aggregate';
import type { Aggregate } from '../../../src/model/domainMetadata/Aggregate';
import type { EntityTable } from '../../../src/model/domainMetadata/EntityTable';

describe('when enhancing descriptor with no map type', () => {
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
  let typeAggregate: Aggregate = NoAggregate;

  beforeAll(() => {
    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);
    aggregate = NoAggregate;
    typeAggregate = NoAggregate;

    const table: Table = {
      ...newTable(),
      name: tableName,
      schema: namespace,
    };

    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName,
      isMapTypeRequired: false,
      isMapTypeOptional: false,
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
        edfiOdsApi: {
          aggregate: NoAggregate,
          typeAggregate: NoAggregate,
        },
      },
    });
    metaEd.entity.descriptor.set(descriptor.metaEdName, descriptor);

    enhance(metaEd);
    aggregate = descriptor.data.edfiOdsApi.aggregate;
    typeAggregate = descriptor.data.edfiOdsApi.typeAggregate;
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
    expect(typeAggregate).toBe(NoAggregate);
  });

  it('should create entity tables', () => {
    expect(aggregate.entityTables).toHaveLength(1);
    const entityTable: EntityTable = aggregate.entityTables[0];
    expect(entityTable).not.toBeNull();
    expect(entityTable.schema).toBe(namespace);
    expect(entityTable.table).toBe(tableName);
  });
});

describe('when enhancing descriptor with map type', () => {
  const entityName: string = 'EntityName';
  const descriptorTableName: string = `${entityName}Descriptor`;
  const typeTableName: string = normalizeEnumerationSuffix(entityName);
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
  let typeAggregate: Aggregate = NoAggregate;

  beforeAll(() => {
    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);
    aggregate = NoAggregate;
    typeAggregate = NoAggregate;

    const descriptorTable: Table = {
      ...newTable(),
      name: descriptorTableName,
      schema: namespace,
    };

    const typeTable: Table = {
      ...newTable(),
      name: typeTableName,
      schema: namespace,
    };

    const descriptor: Descriptor = Object.assign(newDescriptor(), {
      metaEdName: entityName,
      isMapTypeRequired: true,
      isMapTypeOptional: false,
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
          ods_TableName: descriptorTableName,
          ods_Tables: [descriptorTable, typeTable],
          ods_IsMapType: true,
        },
        edfiOdsApi: {
          aggregate: NoAggregate,
          typeAggregate: NoAggregate,
        },
      },
    });
    metaEd.entity.descriptor.set(descriptor.metaEdName, descriptor);

    enhance(metaEd);
    aggregate = descriptor.data.edfiOdsApi.aggregate;
    typeAggregate = descriptor.data.edfiOdsApi.typeAggregate;
  });

  it('should add aggregate to namespace', () => {
    const namespaceInfoAggregates: Array<Aggregate> = ((namespaceInfo.data.edfiOdsApi: any): NamespaceInfoEdfiOdsApi)
      .aggregates;
    expect(namespaceInfoAggregates).toHaveLength(2);
    expect(namespaceInfoAggregates).toContain(aggregate);
    expect(namespaceInfoAggregates).toContain(typeAggregate);
  });

  it('should create aggregate', () => {
    expect(aggregate).not.toBeNull();
    expect(aggregate.root).toBe(descriptorTableName);
    expect(aggregate.allowPrimaryKeyUpdates).toBe(false);
    expect(aggregate.isExtension).toBe(false);
  });

  it('should create type aggregate', () => {
    expect(typeAggregate).not.toBeNull();
    expect(typeAggregate.root).toBe(typeTableName);
    expect(typeAggregate.allowPrimaryKeyUpdates).toBe(false);
    expect(typeAggregate.isExtension).toBe(false);
  });

  it('should create entity tables', () => {
    expect(aggregate.entityTables).toHaveLength(1);
    const descriptorEntityTable: EntityTable = aggregate.entityTables[0];
    expect(descriptorEntityTable).not.toBeNull();
    expect(descriptorEntityTable.schema).toBe(namespace);
    expect(descriptorEntityTable.table).toBe(descriptorTableName);

    expect(typeAggregate.entityTables).toHaveLength(1);
    const typeEntityTable: EntityTable = typeAggregate.entityTables[0];
    expect(typeEntityTable).not.toBeNull();
    expect(typeEntityTable.schema).toBe(namespace);
    expect(typeEntityTable.table).toBe(typeTableName);
  });
});
