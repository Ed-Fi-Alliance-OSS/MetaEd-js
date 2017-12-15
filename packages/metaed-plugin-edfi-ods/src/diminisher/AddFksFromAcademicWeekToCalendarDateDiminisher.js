// @flow
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { addColumnNamePairs, newForeignKey } from '../model/database/ForeignKey';
import { addForeignKey, getForeignKeys } from '../model/database/Table';
import { getTable } from './DiminisherHelper';
import { newColumnNamePair } from '../model/database/ColumnNamePair';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { ColumnNamePair } from '../model/database/ColumnNamePair';
import type { ForeignKey } from '../model/database/ForeignKey';
import type { Table } from '../model/database/Table';

// METAED-266
// EdFi ODS 2.0 has AcademicWeek has foreign keys to CalendarDate
const enhancerName: string = 'AddFksFromAcademicWeekToCalendarDateDiminisher';
const targetVersions: string = '2.0.x';

const namespace: string = 'edfi';

const academicWeek: string = 'AcademicWeek';
const beginDate: string = 'BeginDate';
const calendarDate: string = 'CalendarDate';
const date: string = 'Date';
const endDate: string = 'EndDate';
const schoolId: string = 'SchoolId';

function addForeignKeyToCalendarDate(table: ?Table, parentTableColumnName: string): void {
  if (table == null || getForeignKeys(table).find(
    (fk: ForeignKey) =>
      fk.foreignTableSchema === namespace
      && fk.foreignTableName === calendarDate
      && fk.columnNames.find(
        (columnNamePair: ColumnNamePair) =>
        columnNamePair.parentTableColumnName === parentTableColumnName
        && columnNamePair.foreignTableColumnName === date,
      ),
    ) != null) return;

  const foreignKey: ForeignKey = Object.assign(newForeignKey(), {
    foreignTableSchema: namespace,
    foreignTableName: calendarDate,
    withDeleteCascade: false,
  });

  addColumnNamePairs(foreignKey, [
    Object.assign(newColumnNamePair(), {
      parentTableColumnName: schoolId,
      foreignTableColumnName: schoolId,
    }),
    Object.assign(newColumnNamePair(), {
      parentTableColumnName,
      foreignTableColumnName: date,
    }),
  ]);
  addForeignKey(table, foreignKey);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  const table: ?Table = getTable(pluginEnvironment(metaEd).entity, academicWeek);
  addForeignKeyToCalendarDate(table, beginDate);
  addForeignKeyToCalendarDate(table, endDate);

  return {
    enhancerName,
    success: true,
  };
}
