import R from 'ramda';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/ModifyCascadingDeletesDefinitionsDiminisher';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { ForeignKey } from '../../src/model/database/ForeignKey';
import { Table } from '../../src/model/database/Table';

describe('when ModifyCascadingDeletesDefinitionsDiminisher diminishes matching table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const assessmentCategoryDescriptor = 'AssessmentCategoryDescriptor';
  const descriptor = 'Descriptor';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: assessmentCategoryDescriptor,
      foreignKeys: [{ ...newForeignKey(), foreignTableId: descriptor, withDeleteCascade: true }],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should modify with delete cascade', (): void => {
    const foreignKey: ForeignKey = R.head(
      (tableEntities(metaEd, namespace).get(assessmentCategoryDescriptor) as Table).foreignKeys,
    );
    expect(foreignKey.foreignTableId).toBe(descriptor);
    expect(foreignKey.withDeleteCascade).toBe(false);
  });
});

describe('when ModifyCascadingDeletesDefinitionsDiminisher diminishes non matching table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const tableName = 'TableName';
  const foreignTableId = 'ForeignTableName';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: tableName,
      foreignKeys: [{ ...newForeignKey(), foreignTableId, withDeleteCascade: true }],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should not modify with delete cascade', (): void => {
    const foreignKey: ForeignKey = R.head((tableEntities(metaEd, namespace).get(tableName) as Table).foreignKeys);
    expect(foreignKey.foreignTableId).toBe(foreignTableId);
    expect(foreignKey.withDeleteCascade).toBe(true);
  });
});
