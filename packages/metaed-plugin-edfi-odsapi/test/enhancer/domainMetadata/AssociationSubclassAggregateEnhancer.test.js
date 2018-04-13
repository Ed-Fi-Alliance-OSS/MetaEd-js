// @flow
import { newMetaEdEnvironment, newAssociation, newAssociationSubclass, newNamespaceInfo } from 'metaed-core';
import type { MetaEdEnvironment, Association, AssociationSubclass, NamespaceInfo } from 'metaed-core';
import { newTable } from 'metaed-plugin-edfi-ods';
import type { Table } from 'metaed-plugin-edfi-ods';
import { enhance } from '../../../src/enhancer/domainMetadata/AssociationSubclassAggregateEnhancer';
import { NoAggregate } from '../../../src/model/domainMetadata/Aggregate';
import type { Aggregate } from '../../../src/model/domainMetadata/Aggregate';
import type { EntityTable } from '../../../src/model/domainMetadata/EntityTable';

describe('when enhancing association extensions', () => {
  const baseEntityName: string = 'BaseEntityName';
  const baseTableName: string = 'BaseTableName';
  const entityName: string = 'EntityName';
  const tableName: string = 'TableName';
  const namespace: string = 'namespace';

  let aggregate: Aggregate = NoAggregate;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespaceInfo: NamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace,
      data: {
        edfiOdsApi: {
          aggregates: [],
        },
      },
    });

    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);

    const baseEntity: Association = Object.assign(newAssociation(), {
      metaEdName: baseEntityName,
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
          ods_TableName: baseTableName,
        },
        edfiOdsApi: {},
      },
    });
    metaEd.entity.association.set(baseEntity.metaEdName, baseEntity);

    const table: Table = {
      ...newTable(),
      name: tableName,
      schema: namespace,
    };

    const entity: AssociationSubclass = Object.assign(newAssociationSubclass(), {
      metaEdName: entityName,
      baseEntity,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace,
        isExtension: true,
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
    metaEd.entity.associationSubclass.set(entity.metaEdName, entity);

    enhance(metaEd);
    aggregate = entity.data.edfiOdsApi.aggregate;
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
    expect(entityTable.isA).toBe(baseTableName);
  });
});
