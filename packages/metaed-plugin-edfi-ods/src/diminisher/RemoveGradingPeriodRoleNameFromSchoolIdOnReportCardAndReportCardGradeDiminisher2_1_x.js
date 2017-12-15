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
import { getTable, renameColumn, renameForeignKeyColumn } from './DiminisherHelper';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { EdFiOdsEntityRepository } from '../model/EdFiOdsEntityRepository';
import type { Table } from '../model/database/Table';

// METAED-242
// ODS 2.1 missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
// This is due to "key unification" in the ODS schema model
const enhancerName: string = 'RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_1_x';
const targetVersions: string = '2.1.x';

export const studentProgramAssociation: string = 'StudentProgramAssociation';
export const studentSectionAssociation: string = 'StudentSectionAssociation';
export const gradingPeriodToSchoolIdOnForeignTableOnly: Array<string> = [
  gradingPeriodSchoolId,
  schoolId,
  gradingPeriodSchoolId,
  gradingPeriodSchoolId,
];

function renameGradingPeriodSchoolIdToSchoolIdOnStudentLearningObjectiveTable(
  repository: EdFiOdsEntityRepository,
): void {
  const table: ?Table = getTable(repository, studentLearningObjective);
  if (table == null) return;

  renameColumn(table, gradingPeriodSchoolId, schoolId);
  renameForeignKeyColumn(table, gradingPeriod, ...gradingPeriodToSchoolIdOnParentTableOnly);
}

function renameGradingPeriodSchoolIdToSchoolIdOnStudentCompetencyObjectiveTable(
  repository: EdFiOdsEntityRepository,
): void {
  const table: ?Table = getTable(repository, studentCompetencyObjective);
  if (table == null) return;

  renameColumn(table, gradingPeriodSchoolId, schoolId);
  renameForeignKeyColumn(table, gradingPeriod, ...gradingPeriodToSchoolIdOnParentTableOnly);
}

function renameGradingPeriodSchoolIdToSchoolIdOnStudentCompetencyObjectiveStudentProgramAssociationTableFk(
  repository: EdFiOdsEntityRepository,
): void {
  const table: ?Table = getTable(repository, studentCompetencyObjective + studentProgramAssociation);
  if (table == null) return;

  renameForeignKeyColumn(table, studentCompetencyObjective, ...gradingPeriodToSchoolIdOnForeignTableOnly);
}

function renameGradingPeriodSchoolIdToSchoolIdOnStudentCompetencyObjectiveStudentSectionAssociationTableFk(
  repository: EdFiOdsEntityRepository,
): void {
  const table: ?Table = getTable(repository, studentCompetencyObjective + studentSectionAssociation);
  if (table == null) return;

  renameForeignKeyColumn(table, studentCompetencyObjective, ...gradingPeriodToSchoolIdOnForeignTableOnly);
}

function renameGradingPeriodSchoolIdToSchoolIdOnStudentLearningObjectiveStudentProgramAssociationTableFk(
  repository: EdFiOdsEntityRepository,
): void {
  const table: ?Table = getTable(repository, studentLearningObjective + studentProgramAssociation);
  if (table == null) return;

  renameForeignKeyColumn(table, studentLearningObjective, ...gradingPeriodToSchoolIdOnForeignTableOnly);
}

function renameGradingPeriodSchoolIdToSchoolIdOnStudentLearningObjectiveStudentSectionAssociationTableFk(
  repository: EdFiOdsEntityRepository,
): void {
  const table: ?Table = getTable(repository, studentLearningObjective + studentSectionAssociation);
  if (table == null) return;

  renameForeignKeyColumn(table, studentLearningObjective, ...gradingPeriodToSchoolIdOnForeignTableOnly);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  renameGradingPeriodSchoolIdToSchoolIdOnStudentLearningObjectiveTable(pluginEnvironment(metaEd).entity);
  renameGradingPeriodSchoolIdToSchoolIdOnStudentCompetencyObjectiveTable(pluginEnvironment(metaEd).entity);
  renameGradingPeriodSchoolIdToSchoolIdOnStudentCompetencyObjectiveStudentProgramAssociationTableFk(pluginEnvironment(metaEd).entity);
  renameGradingPeriodSchoolIdToSchoolIdOnStudentCompetencyObjectiveStudentSectionAssociationTableFk(pluginEnvironment(metaEd).entity);
  renameGradingPeriodSchoolIdToSchoolIdOnStudentLearningObjectiveStudentProgramAssociationTableFk(pluginEnvironment(metaEd).entity);
  renameGradingPeriodSchoolIdToSchoolIdOnStudentLearningObjectiveStudentSectionAssociationTableFk(pluginEnvironment(metaEd).entity);

  return {
    enhancerName,
    success: true,
  };
}
