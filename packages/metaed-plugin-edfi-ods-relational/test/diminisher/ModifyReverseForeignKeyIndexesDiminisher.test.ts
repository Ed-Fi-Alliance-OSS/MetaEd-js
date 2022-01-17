import R from 'ramda';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/ModifyReverseForeignKeyIndexesDiminisher';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { ForeignKey } from '../../src/model/database/ForeignKey';
import { Table } from '../../src/model/database/Table';

describe('when ModifyReverseForeignKeyIndexesDiminisher diminishes matching table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const assessmentContentStandard = 'AssessmentContentStandard';
  const assessment = 'Assessment';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = { ...newTable(), tableId: assessmentContentStandard };
    table.foreignKeys = [
      { ...newForeignKey(), parentTable: table, foreignTableId: assessment, withReverseForeignKeyIndex: false },
    ];
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should modify with reverse foreign key index', (): void => {
    const foreignKey: ForeignKey = R.head(
      (tableEntities(metaEd, namespace).get(assessmentContentStandard) as Table).foreignKeys,
    );
    expect(foreignKey.parentTable.tableId).toBe(assessmentContentStandard);
    expect(foreignKey.foreignTableId).toBe(assessment);
    expect(foreignKey.withReverseForeignKeyIndex).toBe(true);
  });
});

describe('when ModifyReverseForeignKeyIndexesDiminisher diminishes non matching table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const parentTableName = 'ParentTableName';
  const foreignTableId = 'ForeignTableName';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = { ...newTable(), tableId: parentTableName };
    table.foreignKeys = [{ ...newForeignKey(), parentTable: table, foreignTableId, withReverseForeignKeyIndex: false }];
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should not modify with reverse foreign key index', (): void => {
    const foreignKey: ForeignKey = R.head((tableEntities(metaEd, namespace).get(parentTableName) as Table).foreignKeys);
    expect(foreignKey.parentTable.tableId).toBe(parentTableName);
    expect(foreignKey.foreignTableId).toBe(foreignTableId);
    expect(foreignKey.withReverseForeignKeyIndex).toBe(false);
  });
});
