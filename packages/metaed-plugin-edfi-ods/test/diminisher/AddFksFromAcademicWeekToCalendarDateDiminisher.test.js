// @flow
import R from 'ramda';
import type { MetaEdEnvironment } from 'metaed-core';
import { newMetaEdEnvironment } from 'metaed-core';
import { enhance } from '../../src/diminisher/AddFksFromAcademicWeekToCalendarDateDiminisher';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import { newColumnNamePair } from '../../src/model/database/ColumnNamePair';
import { newForeignKey } from '../../src/model/database/ForeignKey';
import { newTable } from '../../src/model/database/Table';
import { pluginEnvironment } from '../../src/enhancer/EnhancerHelper';
import type { ForeignKey } from '../../src/model/database/ForeignKey';
import type { Table } from '../../src/model/database/Table';

describe('when AddFksFromAcademicWeekToCalendarDateDiminisher diminishes AcademicWeek table', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const academicWeek: string = 'AcademicWeek';
  const beginDate: string = 'BeginDate';
  const calendarDate: string = 'CalendarDate';
  const date: string = 'Date';
  const endDate: string = 'EndDate';
  const schoolId: string = 'SchoolId';

  beforeAll(() => {
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: academicWeek,
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should add two foreign keys', () => {
    const foreignKeys: Array<ForeignKey> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(academicWeek).foreignKeys;
    expect(foreignKeys).toHaveLength(2);
  });

  it('should have correct foreign key relationship for first foreign key', () => {
    const foreignKey: ForeignKey = R.head((metaEd.plugin.get('edfiOds'): any).entity.table.get(academicWeek).foreignKeys);
    expect(foreignKey.columnNames).toHaveLength(2);

    expect(foreignKey.parentTableName).toBe(academicWeek);
    expect(R.head(foreignKey.columnNames).parentTableColumnName).toBe(schoolId);
    expect(R.last(foreignKey.columnNames).parentTableColumnName).toBe(beginDate);

    expect(foreignKey.foreignTableName).toBe(calendarDate);
    expect(R.head(foreignKey.columnNames).foreignTableColumnName).toBe(schoolId);
    expect(R.last(foreignKey.columnNames).foreignTableColumnName).toBe(date);
  });

  it('should have correct foreign key relationship for second foreign key', () => {
    const foreignKey: ForeignKey = R.last((metaEd.plugin.get('edfiOds'): any).entity.table.get(academicWeek).foreignKeys);
    expect(foreignKey.columnNames).toHaveLength(2);

    expect(foreignKey.parentTableName).toBe(academicWeek);
    expect(R.head(foreignKey.columnNames).parentTableColumnName).toBe(schoolId);
    expect(R.last(foreignKey.columnNames).parentTableColumnName).toBe(endDate);

    expect(foreignKey.foreignTableName).toBe(calendarDate);
    expect(R.head(foreignKey.columnNames).foreignTableColumnName).toBe(schoolId);
    expect(R.last(foreignKey.columnNames).foreignTableColumnName).toBe(date);
  });
});

describe('when AddFksFromAcademicWeekToCalendarDateDiminisher diminishes AcademicWeek table with existing foreign keys to CalendarDate', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const academicWeek: string = 'AcademicWeek';

  beforeAll(() => {
    const namespace: string = 'edfi';
    const beginDate: string = 'BeginDate';
    const calendarDate: string = 'CalendarDate';
    const date: string = 'Date';
    const endDate: string = 'EndDate';
    const schoolId: string = 'SchoolId';
    initializeEdFiOdsEntityRepository(metaEd);

    const table: Table = Object.assign(newTable(), {
      name: academicWeek,
      foreignKeys: [
        Object.assign(newForeignKey(), {
          foreignTableSchema: namespace,
          foreignTableName: calendarDate,
          columnNames: [
            Object.assign(newColumnNamePair(), {
              parentTableColumnName: schoolId,
              foreignTableColumnName: schoolId,
            }),
            Object.assign(newColumnNamePair(), {
              parentTableColumnName: beginDate,
              foreignTableColumnName: date,
            }),
          ],
        }),
        Object.assign(newForeignKey(), {
          foreignTableSchema: namespace,
          foreignTableName: calendarDate,
          columnNames: [
            Object.assign(newColumnNamePair(), {
              parentTableColumnName: schoolId,
              foreignTableColumnName: schoolId,
            }),
            Object.assign(newColumnNamePair(), {
              parentTableColumnName: endDate,
              foreignTableColumnName: date,
            }),
          ],
        }),
      ],
    });
    pluginEnvironment(metaEd).entity.table.set(table.name, table);

    metaEd.dataStandardVersion = '2.0.x';
    enhance(metaEd);
  });

  it('should not modify existing foreign keys', () => {
    const foreignKeys: Array<ForeignKey> = (metaEd.plugin.get('edfiOds'): any).entity.table.get(academicWeek).foreignKeys;
    expect(foreignKeys).toHaveLength(2);
    expect(R.head(foreignKeys).name).toBe('');
    expect(R.last(foreignKeys).name).toBe('');
    expect(R.head(foreignKeys).parentTableName).toBe('');
    expect(R.last(foreignKeys).parentTableName).toBe('');
  });
});
