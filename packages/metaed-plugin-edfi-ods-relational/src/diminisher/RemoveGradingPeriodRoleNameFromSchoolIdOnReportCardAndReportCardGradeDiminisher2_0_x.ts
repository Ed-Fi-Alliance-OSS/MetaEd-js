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
import { removeColumn, rewriteForeignKeyId } from './DiminisherHelper';
import { tableEntities } from '../enhancer/EnhancerHelper';
import { Column } from '../model/database/Column';
import { Table } from '../model/database/Table';

// METAED-242
// ODS 2.0.x missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
// This is due to "key unification" in the ODS schema model
const enhancerName = 'RemoveGradingPeriodRoleNameFromSchoolIdOnReportCardAndReportCardGradeDiminisher2_0_x';
const targetVersions = '2.0.x || >=2.2.0 <3.0.0';

function makeColumnNonNullablePrimaryKey(table: Table, columnId: string): void {
  const column: Column | undefined = table.columns.find((x: Column) => x.columnId === columnId);
  if (column == null) return;

  column.isNullable = false;
  column.isPartOfPrimaryKey = true;
}

// METAED-242: Ed-Fi ODS 2.0 missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
function removeGradingPeriodSchoolIdOnStudentCompetencyObjectiveTable(tablesForCoreNamespace: Map<string, Table>): void {
  const table: Table | undefined = tablesForCoreNamespace.get(studentCompetencyObjective);
  if (table == null) return;

  removeColumn(table, gradingPeriodSchoolId);
  rewriteForeignKeyId(table, gradingPeriod, ...gradingPeriodToSchoolIdOnParentTableOnly);
  makeColumnNonNullablePrimaryKey(table, schoolId);
}

// METAED-242: Ed-Fi ODS 2.0 missing SchoolId with GradingPeriod context on ReportCard and ReportCardGrade
function removeGradingPeriodSchoolIdOnStudentLearningObjectiveTable(tablesForCoreNamespace: Map<string, Table>): void {
  const table: Table | undefined = tablesForCoreNamespace.get(studentLearningObjective);
  if (table == null) return;

  removeColumn(table, gradingPeriodSchoolId);
  rewriteForeignKeyId(table, gradingPeriod, ...gradingPeriodToSchoolIdOnParentTableOnly);
  makeColumnNonNullablePrimaryKey(table, schoolId);
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  removeGradingPeriodSchoolIdOnStudentCompetencyObjectiveTable(tablesForCoreNamespace);
  removeGradingPeriodSchoolIdOnStudentLearningObjectiveTable(tablesForCoreNamespace);

  return {
    enhancerName,
    success: true,
  };
}
