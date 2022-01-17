import { versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities } from '../enhancer/EnhancerHelper';
import { ForeignKey } from '../model/database/ForeignKey';
import { Table } from '../model/database/Table';

// METAED-250
// Existing core follows inconsistent pattern on cascading deletes, so this diminisher matches it.
const enhancerName = 'ModifyCascadingDeletesDefinitionsDiminisher';
const targetVersions = '2.x';

const modifyCascadingDeletes =
  (tablesForCoreNamespace: Map<string, Table>) =>
  (parentTableId: string, foreignTableId: string, withDeleteCascade: boolean = false): void => {
    const table: Table | undefined = tablesForCoreNamespace.get(parentTableId);
    if (table == null) return;

    const foreignKey: ForeignKey | undefined = table.foreignKeys.find(
      (x: ForeignKey) => x.foreignTableId === foreignTableId,
    );
    if (foreignKey == null) return;
    foreignKey.withDeleteCascade = withDeleteCascade;
  };

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  const modifyCascadingDeletesFor = modifyCascadingDeletes(tablesForCoreNamespace);
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
  modifyCascadingDeletesFor(
    'GraduationPlanRequiredAssessmentRequiredAssessmentPerformanceLevel',
    'GraduationPlanRequiredAssessment',
  );
  modifyCascadingDeletesFor('GraduationPlanRequiredAssessmentRequiredAssessmentScore', 'GraduationPlanRequiredAssessment');
  modifyCascadingDeletesFor('LearningStandardGradeLevel', 'LearningStandard');
  modifyCascadingDeletesFor('LocalEducationAgencyLocalEducationAgencyFederalFunds', 'LocalEducationAgency');
  modifyCascadingDeletesFor('ReportCardGrade', 'ReportCard');
  modifyCascadingDeletesFor('ReportCardStudentCompetencyObjective', 'ReportCard');
  modifyCascadingDeletesFor('SessionAcademicWeek', 'Session');
  modifyCascadingDeletesFor('SessionGradingPeriod', 'Session');
  modifyCascadingDeletesFor('StateEducationAgencyStateEducationAgencyFederalFunds', 'StateEducationAgency');

  return {
    enhancerName,
    success: true,
  };
}
