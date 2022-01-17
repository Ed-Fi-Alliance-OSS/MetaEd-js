import { versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { removeColumn, rewriteColumnId, rewriteForeignKeyId } from './DiminisherHelper';
import { tableEntities } from '../enhancer/EnhancerHelper';
import { Table } from '../model/database/Table';

// METAED-241, METAED-242
// ODS 2.x missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
// This is due to "key unification" in the ODS schema model
// Rename StudentAcademicRecordReportCard.GradingPeriodSchoolId to StudentAcademicRecordReportCard.SchoolId
const enhancerName = 'RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase';
const targetVersions = '2.x';

export const grade = 'Grade';
export const gradingPeriod = 'GradingPeriod';
export const reportCard = 'ReportCard';
export const schoolId = 'SchoolId';
export const studentAcademicRecord = 'StudentAcademicRecord';
export const studentCompetencyObjective = 'StudentCompetencyObjective';
export const studentLearningObjective = 'StudentLearningObjective';
export const gradingPeriodSchoolId: string = gradingPeriod + schoolId;
export const gradingPeriodToSchoolId: [string, string, string, string] = [
  gradingPeriodSchoolId,
  schoolId,
  gradingPeriodSchoolId,
  schoolId,
];
export const gradingPeriodToSchoolIdOnParentTableOnly: [string, string, string, string] = [
  schoolId,
  schoolId,
  gradingPeriodSchoolId,
  schoolId,
];

// METAED-242: Ed-Fi ODS 2.x missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
function renameGradingPeriodSchoolIdToSchoolIdOnReportCardTable(tablesForCoreNamespace: Map<string, Table>): void {
  const table: Table | undefined = tablesForCoreNamespace.get(reportCard);
  if (table == null) return;

  rewriteColumnId(table, gradingPeriodSchoolId, schoolId);
  rewriteForeignKeyId(table, gradingPeriod, ...gradingPeriodToSchoolIdOnParentTableOnly);
}

// METAED-242: Ed-Fi ODS 2.x missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
function removeGradingPeriodSchoolIdOnReportCardGradeTable(tablesForCoreNamespace: Map<string, Table>): void {
  const table: Table | undefined = tablesForCoreNamespace.get(reportCard + grade);
  if (table == null) return;

  removeColumn(table, gradingPeriodSchoolId);
  rewriteForeignKeyId(table, reportCard, ...gradingPeriodToSchoolId);
}

// METAED-242: Ed-Fi ODS 2.x missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
function renameGradingPeriodSchoolIdToSchoolIdOnReportCardStudentCompetencyObjectiveTable(
  tablesForCoreNamespace: Map<string, Table>,
): void {
  const table: Table | undefined = tablesForCoreNamespace.get(reportCard + studentCompetencyObjective);
  if (table == null) return;

  rewriteColumnId(table, gradingPeriodSchoolId, schoolId);
  rewriteForeignKeyId(table, reportCard, ...gradingPeriodToSchoolId);
  rewriteForeignKeyId(table, studentCompetencyObjective, ...gradingPeriodToSchoolId);
}

// METAED-242: Ed-Fi ODS 2.x missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
function renameGradingPeriodSchoolIdToSchoolIdOnReportCardStudentLearningObjectiveTable(
  tablesForCoreNamespace: Map<string, Table>,
): void {
  const table: Table | undefined = tablesForCoreNamespace.get(reportCard + studentLearningObjective);
  if (table == null) return;

  rewriteColumnId(table, gradingPeriodSchoolId, schoolId);
  rewriteForeignKeyId(table, reportCard, ...gradingPeriodToSchoolId);
  rewriteForeignKeyId(table, studentLearningObjective, ...gradingPeriodToSchoolId);
}

// METAED-242: Ed-Fi ODS 2.x missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
function renameGradingPeriodSchoolIdToSchoolIdOnStudentAcademicRecordReportCardTable(
  tablesForCoreNamespace: Map<string, Table>,
): void {
  const table: Table | undefined = tablesForCoreNamespace.get(studentAcademicRecord + reportCard);
  if (table == null) return;

  rewriteColumnId(table, gradingPeriodSchoolId, schoolId);
  rewriteForeignKeyId(table, reportCard, ...gradingPeriodToSchoolId);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  renameGradingPeriodSchoolIdToSchoolIdOnReportCardTable(tablesForCoreNamespace);
  removeGradingPeriodSchoolIdOnReportCardGradeTable(tablesForCoreNamespace);
  renameGradingPeriodSchoolIdToSchoolIdOnReportCardStudentCompetencyObjectiveTable(tablesForCoreNamespace);
  renameGradingPeriodSchoolIdToSchoolIdOnReportCardStudentLearningObjectiveTable(tablesForCoreNamespace);
  renameGradingPeriodSchoolIdToSchoolIdOnStudentAcademicRecordReportCardTable(tablesForCoreNamespace);

  return {
    enhancerName,
    success: true,
  };
}
