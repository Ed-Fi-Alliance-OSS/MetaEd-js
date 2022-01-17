import { MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { newMetaEdEnvironment, newNamespace } from '@edfi/metaed-core';
import { enhance } from '../../src/diminisher/AddFksFromAcademicWeekToCalendarDateDiminisher';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newColumnPair } from '../../src/model/database/ColumnPair';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { Table } from '../../src/model/database/Table';

describe('when AddFksFromAcademicWeekToCalendarDateDiminisher diminishes AcademicWeek table', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const academicWeek = 'AcademicWeek';
  const beginDate = 'BeginDate';
  const calendarDate = 'CalendarDate';
  const date = 'Date';
  const endDate = 'EndDate';
  const schoolId = 'SchoolId';

  beforeAll(() => {
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = { ...newTable(), tableId: academicWeek };
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should add two foreign keys', (): void => {
    const { foreignKeys } = tableEntities(metaEd, namespace).get(academicWeek) as Table;
    expect(foreignKeys).toHaveLength(2);
  });

  it('should have sourceReference on each foreign key', (): void => {
    const { foreignKeys } = tableEntities(metaEd, namespace).get(academicWeek) as Table;
    expect(foreignKeys[0].sourceReference.isSyntheticRelationship).toBe(true);
    expect(foreignKeys[1].sourceReference.isSyntheticRelationship).toBe(true);
  });

  it('should have correct foreign key relationship for first foreign key', (): void => {
    const {
      foreignKeys: [foreignKey],
    } = tableEntities(metaEd, namespace).get(academicWeek) as Table;
    expect(foreignKey.columnPairs).toHaveLength(2);

    expect(foreignKey.parentTable.tableId).toBe(academicWeek);
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(schoolId);
    expect(foreignKey.columnPairs[foreignKey.columnPairs.length - 1].parentTableColumnId).toBe(beginDate);

    expect(foreignKey.foreignTableId).toBe(calendarDate);
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(schoolId);
    expect(foreignKey.columnPairs[foreignKey.columnPairs.length - 1].foreignTableColumnId).toBe(date);
  });

  it('should have correct foreign key relationship for second foreign key', (): void => {
    const {
      foreignKeys: [, foreignKey],
    } = tableEntities(metaEd, namespace).get(academicWeek) as Table;
    expect(foreignKey.columnPairs).toHaveLength(2);

    expect(foreignKey.parentTable.tableId).toBe(academicWeek);
    expect(foreignKey.columnPairs[0].parentTableColumnId).toBe(schoolId);
    expect(foreignKey.columnPairs[foreignKey.columnPairs.length - 1].parentTableColumnId).toBe(endDate);

    expect(foreignKey.foreignTableId).toBe(calendarDate);
    expect(foreignKey.columnPairs[0].foreignTableColumnId).toBe(schoolId);
    expect(foreignKey.columnPairs[foreignKey.columnPairs.length - 1].foreignTableColumnId).toBe(date);
  });
});

describe('when AddFksFromAcademicWeekToCalendarDateDiminisher diminishes AcademicWeek table with existing foreign keys to CalendarDate', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const academicWeek = 'AcademicWeek';

  beforeAll(() => {
    const namespaceName = 'EdFi';
    const schemaName = namespaceName.toLowerCase();
    const beginDate = 'BeginDate';
    const calendarDate = 'CalendarDate';
    const date = 'Date';
    const endDate = 'EndDate';
    const schoolId = 'SchoolId';
    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const table: Table = { ...newTable(), tableId: academicWeek };
    table.foreignKeys = [
      {
        ...newForeignKey(),
        parentTable: table,
        foreignTableSchema: schemaName,
        foreignTableId: calendarDate,
        columnPairs: [
          { ...newColumnPair(), parentTableColumnId: schoolId, foreignTableColumnId: schoolId },
          { ...newColumnPair(), parentTableColumnId: beginDate, foreignTableColumnId: date },
        ],
      },
      {
        ...newForeignKey(),
        parentTable: table,
        foreignTableSchema: schemaName,
        foreignTableId: calendarDate,
        columnPairs: [
          { ...newColumnPair(), parentTableColumnId: schoolId, foreignTableColumnId: schoolId },
          { ...newColumnPair(), parentTableColumnId: endDate, foreignTableColumnId: date },
        ],
      },
    ];
    tableEntities(metaEd, namespace).set(table.tableId, table);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should not modify existing foreign keys', (): void => {
    const { foreignKeys } = tableEntities(metaEd, namespace).get(academicWeek) as Table;
    expect(foreignKeys).toHaveLength(2);
    expect(foreignKeys[0].name).toBe('');
    expect(foreignKeys[foreignKeys.length - 1].name).toBe('');
    expect(foreignKeys[0].parentTable.tableId).toBe(academicWeek);
    expect(foreignKeys[foreignKeys.length - 1].parentTable.tableId).toBe(academicWeek);
  });
});
