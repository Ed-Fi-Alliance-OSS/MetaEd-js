// @flow
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import {
  gradingPeriod,
  gradingPeriodSchoolId,
  gradingPeriodToSchoolIdOnParentTableOnly,
  schoolId,
  studentCompetencyObjective,
  studentLearningObjective,
 } from './RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase';
import { getTable, removeColumn, renameForeignKeyColumn } from './DiminisherHelper';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { Column } from '../model/database/Column';
import type { EdFiOdsEntityRepository } from '../model/EdFiOdsEntityRepository';
import type { Table } from '../model/database/Table';

// METAED-242
// ODS 2.0 missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
// This is due to "key unification" in the ODS schema model
const enhancerName: string = 'RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_0_x';
const targetVersions: string = '2.0.x';

function makeColumnNonNullablePrimaryKey(table: Table, columnName: string): void {
  const column: ?Column = table.columns.find((x: Column) => x.name === columnName);
  if (column == null) return;

  column.isNullable = false;
  column.isPartOfPrimaryKey = true;
}

// METAED-242: Ed-Fi ODS 2.0 missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
function removeGradingPeriodSchoolIdOnStudentCompetencyObjectiveTable(repository: EdFiOdsEntityRepository): void {
  const table: ?Table = getTable(repository, studentCompetencyObjective);
  if (table == null) return;

  removeColumn(table, gradingPeriodSchoolId);
  renameForeignKeyColumn(table, gradingPeriod, ...gradingPeriodToSchoolIdOnParentTableOnly);
  makeColumnNonNullablePrimaryKey(table, schoolId);
}

// METAED-242: Ed-Fi ODS 2.0 missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
function removeGradingPeriodSchoolIdOnStudentLearningObjectiveTable(repository: EdFiOdsEntityRepository): void {
  const table: ?Table = getTable(repository, studentLearningObjective);
  if (table == null) return;

  removeColumn(table, gradingPeriodSchoolId);
  renameForeignKeyColumn(table, gradingPeriod, ...gradingPeriodToSchoolIdOnParentTableOnly);
  makeColumnNonNullablePrimaryKey(table, schoolId);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  removeGradingPeriodSchoolIdOnStudentCompetencyObjectiveTable(pluginEnvironment(metaEd).entity);
  removeGradingPeriodSchoolIdOnStudentLearningObjectiveTable(pluginEnvironment(metaEd).entity);

  return {
    enhancerName,
    success: true,
  };
}
