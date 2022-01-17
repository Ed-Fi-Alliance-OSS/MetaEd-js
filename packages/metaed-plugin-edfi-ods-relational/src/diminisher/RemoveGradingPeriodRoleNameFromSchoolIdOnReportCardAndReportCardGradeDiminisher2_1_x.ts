import { versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import {
  gradingPeriod,
  gradingPeriodSchoolId,
  gradingPeriodToSchoolIdOnParentTableOnly,
  schoolId,
  studentCompetencyObjective,
  studentLearningObjective,
} from './RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisherBase';
import { rewriteColumnId, rewriteForeignKeyId } from './DiminisherHelper';
import { tableEntities } from '../enhancer/EnhancerHelper';
import { Table } from '../model/database/Table';

// METAED-242
// ODS 2.1.x missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
// This is due to "key unification" in the ODS schema model
const enhancerName = 'RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_1_x';
const targetVersions = '2.1.x';

export const studentProgramAssociation = 'StudentProgramAssociation';
export const studentSectionAssociation = 'StudentSectionAssociation';
export const gradingPeriodToSchoolIdOnForeignTableOnly: [string, string, string, string] = [
  gradingPeriodSchoolId,
  schoolId,
  gradingPeriodSchoolId,
  gradingPeriodSchoolId,
];

function renameGradingPeriodSchoolIdToSchoolIdOnStudentLearningObjectiveTable(
  tablesForCoreNamespace: Map<string, Table>,
): void {
  const table: Table | undefined = tablesForCoreNamespace.get(studentLearningObjective);
  if (table == null) return;

  rewriteColumnId(table, gradingPeriodSchoolId, schoolId);
  rewriteForeignKeyId(table, gradingPeriod, ...gradingPeriodToSchoolIdOnParentTableOnly);
}

function renameGradingPeriodSchoolIdToSchoolIdOnStudentCompetencyObjectiveTable(
  tablesForCoreNamespace: Map<string, Table>,
): void {
  const table: Table | undefined = tablesForCoreNamespace.get(studentCompetencyObjective);
  if (table == null) return;

  rewriteColumnId(table, gradingPeriodSchoolId, schoolId);
  rewriteForeignKeyId(table, gradingPeriod, ...gradingPeriodToSchoolIdOnParentTableOnly);
}

function renameGradingPeriodSchoolIdToSchoolIdOnStudentCompetencyObjectiveStudentProgramAssociationTableFk(
  tablesForCoreNamespace: Map<string, Table>,
): void {
  const table: Table | undefined = tablesForCoreNamespace.get(studentCompetencyObjective + studentProgramAssociation);
  if (table == null) return;

  rewriteForeignKeyId(table, studentCompetencyObjective, ...gradingPeriodToSchoolIdOnForeignTableOnly);
}

function renameGradingPeriodSchoolIdToSchoolIdOnStudentCompetencyObjectiveStudentSectionAssociationTableFk(
  tablesForCoreNamespace: Map<string, Table>,
): void {
  const table: Table | undefined = tablesForCoreNamespace.get(studentCompetencyObjective + studentSectionAssociation);
  if (table == null) return;

  rewriteForeignKeyId(table, studentCompetencyObjective, ...gradingPeriodToSchoolIdOnForeignTableOnly);
}

function renameGradingPeriodSchoolIdToSchoolIdOnStudentLearningObjectiveStudentProgramAssociationTableFk(
  tablesForCoreNamespace: Map<string, Table>,
): void {
  const table: Table | undefined = tablesForCoreNamespace.get(studentLearningObjective + studentProgramAssociation);
  if (table == null) return;

  rewriteForeignKeyId(table, studentLearningObjective, ...gradingPeriodToSchoolIdOnForeignTableOnly);
}

function renameGradingPeriodSchoolIdToSchoolIdOnStudentLearningObjectiveStudentSectionAssociationTableFk(
  tablesForCoreNamespace: Map<string, Table>,
): void {
  const table: Table | undefined = tablesForCoreNamespace.get(studentLearningObjective + studentSectionAssociation);
  if (table == null) return;

  rewriteForeignKeyId(table, studentLearningObjective, ...gradingPeriodToSchoolIdOnForeignTableOnly);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  renameGradingPeriodSchoolIdToSchoolIdOnStudentLearningObjectiveTable(tablesForCoreNamespace);
  renameGradingPeriodSchoolIdToSchoolIdOnStudentCompetencyObjectiveTable(tablesForCoreNamespace);
  renameGradingPeriodSchoolIdToSchoolIdOnStudentCompetencyObjectiveStudentProgramAssociationTableFk(tablesForCoreNamespace);
  renameGradingPeriodSchoolIdToSchoolIdOnStudentCompetencyObjectiveStudentSectionAssociationTableFk(tablesForCoreNamespace);
  renameGradingPeriodSchoolIdToSchoolIdOnStudentLearningObjectiveStudentProgramAssociationTableFk(tablesForCoreNamespace);
  renameGradingPeriodSchoolIdToSchoolIdOnStudentLearningObjectiveStudentSectionAssociationTableFk(tablesForCoreNamespace);

  return {
    enhancerName,
    success: true,
  };
}
