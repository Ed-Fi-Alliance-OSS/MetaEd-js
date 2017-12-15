// @flow
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { getForeignKeys } from '../model/database/Table';
import { getTable } from './DiminisherHelper';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { EdFiOdsEntityRepository } from '../model/EdFiOdsEntityRepository';
import type { ForeignKey } from '../model/database/ForeignKey';
import type { Table } from '../model/database/Table';

// METAED-250
// Existing core follows inconsistent pattern on cascading deletes, so this diminisher matches it.
const enhancerName: string = 'ModifyCascadingDeletesDefinitionsDiminisher';
const targetVersions: string = '2.0.x';

const modifyCascadingDeletes = (repository: EdFiOdsEntityRepository) =>
  (parentTableName: string, foreignTableName: string, withDeleteCascade: boolean = false): void => {
    const table: ?Table = getTable(repository, parentTableName);
    if (table == null) return;

    const foreignKey: ?ForeignKey = getForeignKeys(table).find((x: ForeignKey) => x.foreignTableName === foreignTableName);
    if (foreignKey == null) return;
    foreignKey.withDeleteCascade = withDeleteCascade;
  };

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  const modifyCascadingDeletesFor = modifyCascadingDeletes(pluginEnvironment(metaEd).entity);
  modifyCascadingDeletesFor('AssessmentCategoryDescriptor', 'Descriptor');
  modifyCascadingDeletesFor('AssessmentIdentificationSystemDescriptor', 'Descriptor');
  modifyCascadingDeletesFor('CountryDescriptor', 'Descriptor');
  modifyCascadingDeletesFor('CourseIdentificationSystemDescriptor', 'Descriptor');
  modifyCascadingDeletesFor('EducationOrganizationIdentificationSystemDescriptor', 'Descriptor');
  modifyCascadingDeletesFor('StaffIdentificationSystemDescriptor', 'Descriptor');
  modifyCascadingDeletesFor('StudentIdentificationSystemDescriptor', 'Descriptor');
  modifyCascadingDeletesFor('TermDescriptor', 'Descriptor');
  modifyCascadingDeletesFor('CourseTranscriptEarnedAdditionalCredits', 'CourseTranscript');
  modifyCascadingDeletesFor('GradebookEntryLearningObjective', 'GradebookEntry');
  modifyCascadingDeletesFor('GraduationPlanRequiredAssessment', 'GraduationPlan');
  modifyCascadingDeletesFor('GraduationPlanRequiredAssessmentAssessmentPerformanceLevel', 'GraduationPlanRequiredAssessment');
  modifyCascadingDeletesFor('GraduationPlanRequiredAssessmentScore', 'GraduationPlanRequiredAssessment');
  modifyCascadingDeletesFor('LearningStandardGradeLevel', 'LearningStandard');
  modifyCascadingDeletesFor('LocalEducationAgencyFederalFunds', 'LocalEducationAgency');
  modifyCascadingDeletesFor('ReportCardGrade', 'ReportCard');
  modifyCascadingDeletesFor('ReportCardStudentCompetencyObjective', 'ReportCard');
  modifyCascadingDeletesFor('SessionAcademicWeek', 'Session');
  modifyCascadingDeletesFor('SessionGradingPeriod', 'Session');
  modifyCascadingDeletesFor('StateEducationAgencyFederalFunds', 'StateEducationAgency');

  return {
    enhancerName,
    success: true,
  };
}
