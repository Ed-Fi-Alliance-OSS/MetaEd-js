import { newMetaEdEnvironment, newAssociation, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Association, Namespace } from '@edfi/metaed-core';
import {
  newTable,
  initializeEdFiOdsRelationalEntityRepository,
  tableEntities,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { enhance } from '../../../src/enhancer/domainMetadata/AssociationAggregateEnhancer';
import { NoAggregate } from '../../../src/model/domainMetadata/Aggregate';
import { Aggregate } from '../../../src/model/domainMetadata/Aggregate';
import { EntityTable } from '../../../src/model/domainMetadata/EntityTable';

describe('when enhancing associations', (): void => {
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

    const association: Association = Object.assign(newAssociation(), {
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
    namespace.entity.association.set(association.metaEdName, association);

    enhance(metaEd);
    ({ aggregate } = association.data.edfiOdsApi);
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
