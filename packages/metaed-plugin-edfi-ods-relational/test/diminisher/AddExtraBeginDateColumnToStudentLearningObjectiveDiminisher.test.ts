import R from 'ramda';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/AddExtraBeginDateColumnToStudentLearningObjectiveDiminisher';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newColumn } from '../../src/model/database/Column';
import { newColumnPair } from '../../src/model/database/ColumnPair';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { ForeignKey } from '../../src/model/database/ForeignKey';
import { Table } from '../../src/model/database/Table';

describe('when AddExtraBeginDateColumnToStudentLearningObjectiveDiminisher diminishes StudentLearningObjective table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const studentLearningObjective = 'StudentLearningObjective';
  const studentSectionAssociation = 'StudentSectionAssociation';
  const beginDate = 'BeginDate';
  const studentSectionAssociationBeginDate: string = studentSectionAssociation + beginDate;

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: studentLearningObjective,
      foreignKeys: [
        {
          ...newForeignKey(),
          foreignTableId: studentSectionAssociation,
          columnPairs: [{ ...newColumnPair(), parentTableColumnId: beginDate, foreignTableColumnId: beginDate }],
        },
      ],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should add StudentSectionAssociationBeginDate column', (): void => {
    const table: Table | undefined = tableEntities(metaEd, namespace).get(studentLearningObjective);
    expect(table).toBeDefined();
    if (table == null) throw new Error();
    expect(table.columns[0].columnId).toBe(studentSectionAssociationBeginDate);
    expect(table.columns[0].isNullable).toBe(true);
  });

  it('should have correct foreign key relationship', (): void => {
    const foreignKey: ForeignKey | null = R.head(
      (tableEntities(metaEd, namespace).get(studentLearningObjective) as any).foreignKeys,
    );
    if (foreignKey == null) throw new Error();
    expect(foreignKey.foreignTableId).toBe(studentSectionAssociation);
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(studentSectionAssociationBeginDate);
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(beginDate);
  });
});

describe('when AddExtraBeginDateColumnToStudentLearningObjectiveDiminisher diminishes StudentLearningObjective table with existing studentSectionAssociationBeginDate column', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const studentLearningObjective = 'StudentLearningObjective';
  const studentSectionAssociation = 'StudentSectionAssociation';
  const beginDate = 'BeginDate';
  const studentSectionAssociationBeginDate: string = studentSectionAssociation + beginDate;

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = {
      ...newTable(),
      tableId: studentLearningObjective,
      columns: [{ ...newColumn(), columnId: studentSectionAssociationBeginDate, isNullable: false }],
    };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should not modify StudentSectionAssociationBeginDate column', (): void => {
    const table: Table | undefined = tableEntities(metaEd, namespace).get(studentLearningObjective);
    expect(table).toBeDefined();
    if (table == null) throw new Error();
    expect(table.columns).toHaveLength(1);
    expect(table.columns[0].columnId).toBe(studentSectionAssociationBeginDate);
    expect(table.columns[0].isNullable).toBe(false);
  });

  it('should not modify foreign keys', (): void => {
    expect((tableEntities(metaEd, namespace).get(studentLearningObjective) as any).foreignKeys).toHaveLength(0);
  });
});
