import { newMetaEdEnvironment, newAssociation, newAssociationExtension, newNamespace, NoNamespace } from 'metaed-core';
import { MetaEdEnvironment, Association, AssociationExtension, Namespace } from 'metaed-core';
import { newTable } from 'metaed-plugin-edfi-ods';
import { Table } from 'metaed-plugin-edfi-ods';
import { enhance } from '../../../src/enhancer/domainMetadata/AssociationExtensionAggregateEnhancer';
import { NamespaceEdfiOdsApi } from '../../../src/model/Namespace';
import { NoAggregate } from '../../../src/model/domainMetadata/Aggregate';
import { Aggregate } from '../../../src/model/domainMetadata/Aggregate';
import { EntityTable } from '../../../src/model/domainMetadata/EntityTable';

describe('when enhancing association extensions', () => {
  const baseEntityName = 'BaseEntityName';
  const baseTableName = 'BaseTableName';
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

    const baseEntity: Association = Object.assign(newAssociation(), {
      metaEdName: baseEntityName,
      namespace,
      data: {
        edfiOds: {
          odsTableName: baseTableName,
        },
        edfiOdsApi: {},
      },
    });
    namespace.entity.association.set(baseEntity.metaEdName, baseEntity);

    const table: Table = {
      ...newTable(),
      name: tableName,
      nameComponents: [tableName],
      schema: extensionSchema,
    };

    const entity: AssociationExtension = Object.assign(newAssociationExtension(), {
      metaEdName: entityName,
      namespace: extensionNamespace,
      data: {
        edfiOds: {
          odsTableName: tableName,
          odsTables: [table],
        },
        edfiOdsApi: {},
      },
    });
    extensionNamespace.entity.associationExtension.set(entity.metaEdName, entity);

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
    expect(aggregate.root).toBe(tableName);
    expect(aggregate.allowPrimaryKeyUpdates).toBe(false);
    expect(aggregate.isExtension).toBe(true);
  });

  it('should create entity tables', () => {
    expect(aggregate.entityTables).toHaveLength(1);
    const entityTable: EntityTable = aggregate.entityTables[0];
    expect(entityTable).not.toBeNull();
    expect(entityTable.schema).toBe(extensionSchema);
    expect(entityTable.table).toBe(tableName);
  });
});
