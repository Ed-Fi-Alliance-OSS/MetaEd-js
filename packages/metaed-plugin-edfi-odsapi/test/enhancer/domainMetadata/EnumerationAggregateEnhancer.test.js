// @flow
import { newMetaEdEnvironment, newEnumeration, newNamespaceInfo } from 'metaed-core';
import type { MetaEdEnvironment, Enumeration, NamespaceInfo } from 'metaed-core';
import { newTable } from 'metaed-plugin-edfi-ods';
import type { Table } from 'metaed-plugin-edfi-ods';
import { enhance } from '../../../src/enhancer/domainMetadata/EnumerationAggregateEnhancer';
import { NoAggregate } from '../../../src/model/domainMetadata/Aggregate';
import type { Aggregate } from '../../../src/model/domainMetadata/Aggregate';
import type { EntityTable } from '../../../src/model/domainMetadata/EntityTable';

describe('when enhancing enumerations', () => {
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

    const enumeration: Enumeration = Object.assign(newEnumeration(), {
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
    metaEd.entity.enumeration.set(enumeration.metaEdName, enumeration);

    enhance(metaEd);
    aggregate = enumeration.data.edfiOdsApi.aggregate;
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
