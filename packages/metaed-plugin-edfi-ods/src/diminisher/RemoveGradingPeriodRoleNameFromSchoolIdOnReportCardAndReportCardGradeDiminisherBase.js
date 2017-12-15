// @flow
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { getTable, removeColumn, renameColumn, renameForeignKeyColumn } from './DiminisherHelper';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { EdFiOdsEntityRepository } from '../model/EdFiOdsEntityRepository';
import type { Table } from '../model/database/Table';

// METAED-241, METAED-242
// ODS 2.x missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
// This is due to "key unification" in the ODS schema model
// Rename StudentAcademicRecordReportCard.GradingPeriodSchoolId to StudentAcademicRecordReportCard.SchoolId
const enhancerName: string = 'RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase';

export const grade: string = 'Grade';
export const gradingPeriod: string = 'GradingPeriod';
export const reportCard: string = 'ReportCard';
export const schoolId: string = 'SchoolId';
export const studentAcademicRecord: string = 'StudentAcademicRecord';
export const studentCompetencyObjective: string = 'StudentCompetencyObjective';
export const studentLearningObjective: string = 'StudentLearningObjective';
export const gradingPeriodSchoolId: string = gradingPeriod + schoolId;
export const gradingPeriodToSchoolId: Array<string> = [gradingPeriodSchoolId, schoolId, gradingPeriodSchoolId, schoolId];
export const gradingPeriodToSchoolIdOnParentTableOnly: Array<string> = [schoolId, schoolId, gradingPeriodSchoolId, schoolId];

// METAED-242: Ed-Fi ODS 2.x missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
function renameGradingPeriodSchoolIdToSchoolIdOnReportCardTable(repository: EdFiOdsEntityRepository): void {
  const table: ?Table = getTable(repository, reportCard);
  if (table == null) return;

  renameColumn(table, gradingPeriodSchoolId, schoolId);
  renameForeignKeyColumn(table, gradingPeriod, ...gradingPeriodToSchoolIdOnParentTableOnly);
}

// METAED-242: Ed-Fi ODS 2.x missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
function removeGradingPeriodSchoolIdOnReportCardGradeTable(repository: EdFiOdsEntityRepository): void {
  const table: ?Table = getTable(repository, reportCard + grade);
  if (table == null) return;

  removeColumn(table, gradingPeriodSchoolId);
  renameForeignKeyColumn(table, reportCard, ...gradingPeriodToSchoolId);
}

// METAED-242: Ed-Fi ODS 2.x missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
function renameGradingPeriodSchoolIdToSchoolIdOnReportCardStudentCompetencyObjectiveTable(repository: EdFiOdsEntityRepository): void {
  const table: ?Table = getTable(repository, reportCard + studentCompetencyObjective);
  if (table == null) return;

  renameColumn(table, gradingPeriodSchoolId, schoolId);
  renameForeignKeyColumn(table, reportCard, ...gradingPeriodToSchoolId);
  renameForeignKeyColumn(table, studentCompetencyObjective, ...gradingPeriodToSchoolId);
}

// METAED-242: Ed-Fi ODS 2.x missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
function renameGradingPeriodSchoolIdToSchoolIdOnReportCardStudentLearningObjectiveTable(repository: EdFiOdsEntityRepository): void {
  const table: ?Table = getTable(repository, reportCard + studentLearningObjective);
  if (table == null) return;

  renameColumn(table, gradingPeriodSchoolId, schoolId);
  renameForeignKeyColumn(table, reportCard, ...gradingPeriodToSchoolId);
  renameForeignKeyColumn(table, studentLearningObjective, ...gradingPeriodToSchoolId);
}

// METAED-242: Ed-Fi ODS 2.x missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
function renameGradingPeriodSchoolIdToSchoolIdOnStudentAcademicRecordReportCardTable(repository: EdFiOdsEntityRepository): void {
  const table: ?Table = getTable(repository, studentAcademicRecord + reportCard);
  if (table == null) return;

  renameColumn(table, gradingPeriodSchoolId, schoolId);
  renameForeignKeyColumn(table, reportCard, ...gradingPeriodToSchoolId);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  // if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  renameGradingPeriodSchoolIdToSchoolIdOnReportCardTable(pluginEnvironment(metaEd).entity);
  removeGradingPeriodSchoolIdOnReportCardGradeTable(pluginEnvironment(metaEd).entity);
  renameGradingPeriodSchoolIdToSchoolIdOnReportCardStudentCompetencyObjectiveTable(pluginEnvironment(metaEd).entity);
  renameGradingPeriodSchoolIdToSchoolIdOnReportCardStudentLearningObjectiveTable(pluginEnvironment(metaEd).entity);
  renameGradingPeriodSchoolIdToSchoolIdOnStudentAcademicRecordReportCardTable(pluginEnvironment(metaEd).entity);

  return {
    enhancerName,
    success: true,
  };
}
