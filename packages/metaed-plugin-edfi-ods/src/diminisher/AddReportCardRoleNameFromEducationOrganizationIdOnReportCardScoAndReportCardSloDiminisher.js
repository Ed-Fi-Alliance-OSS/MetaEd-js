// @flow
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { getTable, renameColumn, renameForeignKeyColumn } from './DiminisherHelper';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { Column } from '../model/database/Column';
import type { EdFiOdsEntityRepository } from '../model/EdFiOdsEntityRepository';
import type { Table } from '../model/database/Table';

// METAED-243
// ReportCardStudentCompetencyObjective and ReportCardStudentLearningObjective have unnecessary context for EducationOrganizationId
const enhancerName: string = 'AddReportCardRoleNameFromEducationOrganizationIdOnReportCardScoAndReportCardSloDiminisher';
const targetVersions: string = '2.0.x';

const reportCardStudentCompetencyObjective: string = 'ReportCardStudentCompetencyObjective';
const reportCardEducationOrganizationId: string = 'ReportCardEducationOrganizationId';
const reportCardStudentLearningObjective: string = 'ReportCardStudentLearningObjective';
const educationOrganizationId: string = 'EducationOrganizationId';
const reportCard: string = 'ReportCard';

function renameEducationOrganizationIdToReportCardEducationOrganizationIdOnReportCardStudentCompetencyObjectiveTable(repository: EdFiOdsEntityRepository): void {
  const table: ?Table = getTable(repository, reportCardStudentCompetencyObjective);
  if (table == null) return;
  if (table.columns.find((column: Column) => column.name === reportCardEducationOrganizationId) != null) return;

  renameColumn(table, educationOrganizationId, reportCardEducationOrganizationId);
  renameForeignKeyColumn(
    table,
    reportCard,
    educationOrganizationId,
    educationOrganizationId,
    educationOrganizationId,
    reportCardEducationOrganizationId,
  );
}

function renameEducationOrganizationIdToReportCardEducationOrganizationIdOnReportCardStudentLearningObjectiveTable(repository: EdFiOdsEntityRepository): void {
  const table: ?Table = getTable(repository, reportCardStudentLearningObjective);
  if (table == null) return;
  if (table.columns.find((column: Column) => column.name === reportCardEducationOrganizationId) != null) return;

  renameColumn(table, educationOrganizationId, reportCardEducationOrganizationId);
  renameForeignKeyColumn(
    table,
    reportCard,
    educationOrganizationId,
    educationOrganizationId,
    educationOrganizationId,
    reportCardEducationOrganizationId,
  );
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  renameEducationOrganizationIdToReportCardEducationOrganizationIdOnReportCardStudentCompetencyObjectiveTable(pluginEnvironment(metaEd).entity);
  renameEducationOrganizationIdToReportCardEducationOrganizationIdOnReportCardStudentLearningObjectiveTable(pluginEnvironment(metaEd).entity);

  return {
    enhancerName,
    success: true,
  };
}
