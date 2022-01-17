import { versionSatisfies } from '@edfi/metaed-core';
import { EnhancerResult, MetaEdEnvironment, Namespace } from '@edfi/metaed-core';
import { tableEntities } from '../enhancer/EnhancerHelper';
import { ForeignKey } from '../model/database/ForeignKey';
import { Table } from '../model/database/Table';

// ODS-1036
// Forcing some reverse foreign key indexes to generate even though they aren't needed
const enhancerName = 'ModifyReverseForeignKeyIndexesDiminisher';
const targetVersions = '2.x';

const modifyReverseForeignKeyIndex =
  (tablesForCoreNamespace: Map<string, Table>) =>
  (parentTableId: string, foreignTableId: string, withReverseForeignKeyIndex: boolean = true): void => {
    const table: Table | undefined = tablesForCoreNamespace.get(parentTableId);
    if (table == null) return;

    const foreignKey: ForeignKey | undefined = table.foreignKeys.find(
      (x: ForeignKey) => x.foreignTableId === foreignTableId,
    );
    if (foreignKey == null) return;
    foreignKey.withReverseForeignKeyIndex = withReverseForeignKeyIndex;
  };

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (!versionSatisfies(metaEd.dataStandardVersion, targetVersions)) return { enhancerName, success: true };
  const coreNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (coreNamespace == null) return { enhancerName, success: false };
  const tablesForCoreNamespace: Map<string, Table> = tableEntities(metaEd, coreNamespace);

  const modifyReverseForeignKeyIndexFor = modifyReverseForeignKeyIndex(tablesForCoreNamespace);
  // one to one optional relationships
  modifyReverseForeignKeyIndexFor('AssessmentContentStandard', 'Assessment');
  modifyReverseForeignKeyIndexFor('AssessmentFamilyContentStandard', 'AssessmentFamily');
  modifyReverseForeignKeyIndexFor(
    'GraduationPlanRequiredAssessmentRequiredAssessmentPerformanceLevel',
    'GraduationPlanRequiredAssessment',
  );
  modifyReverseForeignKeyIndexFor('LearningObjectiveContentStandard', 'LearningObjective');
  modifyReverseForeignKeyIndexFor('LearningStandardContentStandard', 'LearningStandard');
  modifyReverseForeignKeyIndexFor('PostSecondaryEventPostSecondaryInstitution', 'PostSecondaryEvent');
  modifyReverseForeignKeyIndexFor('StudentAcademicRecordClassRanking', 'StudentAcademicRecord');
  modifyReverseForeignKeyIndexFor('StudentLearningStyle', 'Student');
  // subclass relationships
  modifyReverseForeignKeyIndexFor('EducationOrganizationNetwork', 'EducationOrganization');
  modifyReverseForeignKeyIndexFor('EducationServiceCenter', 'EducationOrganization');
  modifyReverseForeignKeyIndexFor('LocalEducationAgency', 'EducationOrganization');
  modifyReverseForeignKeyIndexFor('School', 'EducationOrganization');
  modifyReverseForeignKeyIndexFor('StateEducationAgency', 'EducationOrganization');
  modifyReverseForeignKeyIndexFor('StudentCTEProgramAssociation', 'StudentProgramAssociation');
  modifyReverseForeignKeyIndexFor('StudentMigrantEducationProgramAssociation', 'StudentProgramAssociation');
  modifyReverseForeignKeyIndexFor('StudentSpecialEducationProgramAssociation', 'StudentProgramAssociation');
  modifyReverseForeignKeyIndexFor('StudentTitleIPartAProgramAssociation', 'StudentProgramAssociation');
  // descriptors
  modifyReverseForeignKeyIndexFor('AcademicSubjectDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('AccommodationDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('AccountCodeDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('AchievementCategoryDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('AdministrativeFundingControlDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('AssessmentCategoryDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('AssessmentIdentificationSystemDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('AssessmentPeriodDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('AttendanceEventCategoryDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('BehaviorDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('CalendarEventDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('ClassroomPositionDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('CompetencyLevelDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('ContinuationOfServicesReasonDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('CountryDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('CourseIdentificationSystemDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('CredentialFieldDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('DiagnosisDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('DisabilityDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('DisciplineDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('EducationOrganizationIdentificationSystemDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('EmploymentStatusDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('EntryTypeDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('ExitWithdrawTypeDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('GradeLevelDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('GradingPeriodDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('GraduationPlanTypeDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('LanguageDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('LevelDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('LevelOfEducationDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('LimitedEnglishProficiencyDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('PerformanceLevelDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('ProgramAssignmentDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('ProgramCharacteristicDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('ReasonExitedDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('ReporterDescriptionDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('ResidencyStatusDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('ResponsibilityDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('SchoolFoodServicesEligibilityDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('SectionCharacteristicDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('SeparationReasonDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('ServiceDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('SpecialEducationSettingDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('StaffClassificationDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('StaffIdentificationSystemDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('StudentCharacteristicDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('StudentIdentificationSystemDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('TeachingCredentialDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('TermDescriptor', 'Descriptor');
  modifyReverseForeignKeyIndexFor('WeaponDescriptor', 'Descriptor');

  return {
    enhancerName,
    success: true,
  };
}
