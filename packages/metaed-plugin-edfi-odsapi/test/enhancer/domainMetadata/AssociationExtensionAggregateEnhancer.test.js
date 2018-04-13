// @flow
import {
  newMetaEdEnvironment,
  newAssociation,
  newAssociationExtension,
  newNamespaceInfo,
  NoNamespaceInfo,
} from 'metaed-core';
import type { MetaEdEnvironment, Association, AssociationExtension, NamespaceInfo } from 'metaed-core';
import { newTable } from 'metaed-plugin-edfi-ods';
import type { Table } from 'metaed-plugin-edfi-ods';
import { enhance } from '../../../src/enhancer/domainMetadata/AssociationExtensionAggregateEnhancer';
import type { NamespaceInfoEdfiOdsApi } from '../../../src/model/NamespaceInfo';
import { NoAggregate } from '../../../src/model/domainMetadata/Aggregate';
import type { Aggregate } from '../../../src/model/domainMetadata/Aggregate';
import type { EntityTable } from '../../../src/model/domainMetadata/EntityTable';

describe('when enhancing association extensions', () => {
  const baseEntityName: string = 'BaseEntityName';
  const baseTableName: string = 'BaseTableName';
  const entityName: string = 'EntityName';
  const tableName: string = 'TableName';
  const namespace: string = 'namespace';
  const extensionNamespace: string = 'extension';

  let aggregate: Aggregate = NoAggregate;
  let extensionNamespaceInfo: NamespaceInfo = NoNamespaceInfo;

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
    extensionNamespaceInfo = Object.assign(newNamespaceInfo(), {
      namespace: extensionNamespace,
      isExtension: true,
      data: {
        edfiOdsApi: {
          aggregates: [],
        },
      },
    });
    metaEd.entity.namespaceInfo.set(namespaceInfo.namespace, namespaceInfo);
    metaEd.entity.namespaceInfo.set(extensionNamespaceInfo.namespace, extensionNamespaceInfo);

    const baseEntity: Association = Object.assign(newAssociation(), {
      metaEdName: baseEntityName,
      namespaceInfo,
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
      schema: extensionNamespace,
    };

    const entity: AssociationExtension = Object.assign(newAssociationExtension(), {
      metaEdName: entityName,
      namespaceInfo: Object.assign(newNamespaceInfo(), {
        namespace: extensionNamespace,
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
    metaEd.entity.associationExtension.set(entity.metaEdName, entity);

    enhance(metaEd);
    aggregate = entity.data.edfiOdsApi.aggregate;
  });

  it('should add aggregate to namespace', () => {
    const extensionNamespaceInfoAggregates: Array<Aggregate> = ((extensionNamespaceInfo.data
      .edfiOdsApi: any): NamespaceInfoEdfiOdsApi).aggregates;
    expect(extensionNamespaceInfoAggregates).toHaveLength(1);
    expect(extensionNamespaceInfoAggregates[0]).toBe(aggregate);
  });

  it('should create aggregate', () => {
    expect(aggregate).not.toBeNull();
    expect(aggregate.root).toBe(tableName);
    expect(aggregate.allowPrimaryKeyUpdates).toBe(false);
    expect(aggregate.isExtension).toBe(true);
  });

  it('should create entity tables', () => {
    expect(aggregate.entityTables).toHaveLength(1);
    const entityTable: EntityTable = aggregate.entityTables[0];
    expect(entityTable).not.toBeNull();
    expect(entityTable.schema).toBe(extensionNamespace);
    expect(entityTable.table).toBe(tableName);
  });
});
