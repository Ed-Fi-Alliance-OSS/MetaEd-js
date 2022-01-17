import { versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { addColumnPairs, newForeignKey, newForeignKeySourceReference } from '../model/database/ForeignKey';
import { addForeignKey } from '../model/database/Table';
import { newColumnPair } from '../model/database/ColumnPair';
import { tableEntities } from '../enhancer/EnhancerHelper';
import { ColumnPair } from '../model/database/ColumnPair';
import { ForeignKey } from '../model/database/ForeignKey';
import { Table } from '../model/database/Table';

// METAED-266
// EdFi ODS 2.x has AcademicWeek has foreign keys to CalendarDate
const enhancerName = 'AddFksFromAcademicWeekToCalendarDateDiminisher';
const targetVersions = '2.x';

const coreNamespaceName = 'EdFi';
const coreSchema = 'edfi';

const academicWeek = 'AcademicWeek';
const beginDate = 'BeginDate';
const calendarDate = 'CalendarDate';
const date = 'Date';
const endDate = 'EndDate';
const schoolId = 'SchoolId';

function addForeignKeyToCalendarDate(table: Table | undefined, parentTableColumnId: string, coreNamespace: Namespace): void {
  if (
    table == null ||
    table.foreignKeys.find(
      (fk: ForeignKey) =>
        fk.foreignTableSchema === coreSchema &&
        fk.foreignTableId === calendarDate &&
        !!fk.columnPairs.find(
          (columnPair: ColumnPair) =>
            columnPair.parentTableColumnId === parentTableColumnId && columnPair.foreignTableColumnId === date,
        ),
    ) != null
  )
    return;

  const foreignKey: ForeignKey = {
    ...newForeignKey(),
    foreignTableSchema: coreSchema,
    foreignTableNamespace: coreNamespace,
    foreignTableId: calendarDate,
    withDeleteCascade: false,
    sourceReference: {
      ...newForeignKeySourceReference(),
      isSyntheticRelationship: true,
    },
  };

  addColumnPairs(foreignKey, [
    {
      ...newColumnPair(),
      parentTableColumnId: schoolId,
      foreignTableColumnId: schoolId,
    },
    {
      ...newColumnPair(),
      parentTableColumnId,
      foreignTableColumnId: date,
    },
  ]);
  addForeignKey(table, foreignKey);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get(coreNamespaceName);
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  const table: Table | undefined = tablesForCoreNamespace.get(academicWeek);
  addForeignKeyToCalendarDate(table, beginDate, coreNamespace);
  addForeignKeyToCalendarDate(table, endDate, coreNamespace);

  return {
    enhancerName,
    success: true,
  };
}
