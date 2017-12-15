// @flow
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { getForeignKeys, getForeignKeyName } from '../model/database/Table';
import { getTable } from './DiminisherHelper';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { EdFiOdsEntityRepository } from '../model/EdFiOdsEntityRepository';
import type { ForeignKey } from '../model/database/ForeignKey';
import type { Table } from '../model/database/Table';

// ODS-1036
// Forcing some reverse foreign key indexes to generate even though they aren't needed
const enhancerName: string = 'ModifyReverseForeignKeyIndexesDiminisher';
const targetVersions: string = '2.0.x';

const modifyReverseForeignKeyIndex = (repository: EdFiOdsEntityRepository) =>
  (parentTableName: string, foreignKeyName: string, withReverseForeignKeyIndex: boolean = true): void => {
    const table: ?Table = getTable(repository, parentTableName);
    if (table == null) return;

    const foreignKey: ?ForeignKey = getForeignKeys(table).find((x: ForeignKey) => getForeignKeyName(x) === foreignKeyName);
    if (foreignKey == null) return;
    foreignKey.withReverseForeignKeyIndex = withReverseForeignKeyIndex;
  };

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  const modifyReverseForeignKeyIndexFor = modifyReverseForeignKeyIndex(pluginEnvironment(metaEd).entity);
  // one to one optional relationships
  modifyReverseForeignKeyIndexFor('AssessmentContentStandard', 'FK_AssessmentContentStandard_Assessment');
  modifyReverseForeignKeyIndexFor('AssessmentFamilyContentStandard', 'FK_AssessmentFamilyContentStandard_AssessmentFamily');
  modifyReverseForeignKeyIndexFor('GraduationPlanRequiredAssessmentAssessmentPerformanceLevel', 'FK_GraduationPlanRequiredAssessmentAssessmentPerformanceLevel_GraduationPlanRequiredAssessment');
  modifyReverseForeignKeyIndexFor('LearningObjectiveContentStandard', 'FK_LearningObjectiveContentStandard_LearningObjective');
  modifyReverseForeignKeyIndexFor('LearningStandardContentStandard', 'FK_LearningStandardContentStandard_LearningStandard');
  modifyReverseForeignKeyIndexFor('PostSecondaryEventPostSecondaryInstitution', 'FK_PostSecondaryEventPostSecondaryInstitution_PostSecondaryEvent');
  modifyReverseForeignKeyIndexFor('StudentAcademicRecordClassRanking', 'FK_StudentAcademicRecordClassRanking_StudentAcademicRecord');
  modifyReverseForeignKeyIndexFor('StudentLearningStyle', 'FK_StudentLearningStyle_Student');
  // subclass relationships
  modifyReverseForeignKeyIndexFor('EducationOrganizationNetwork', 'FK_EducationOrganizationNetwork_EducationOrganization');
  modifyReverseForeignKeyIndexFor('EducationServiceCenter', 'FK_EducationServiceCenter_EducationOrganization');
  modifyReverseForeignKeyIndexFor('LocalEducationAgency', 'FK_LocalEducationAgency_EducationOrganization');
  modifyReverseForeignKeyIndexFor('School', 'FK_School_EducationOrganization');
  modifyReverseForeignKeyIndexFor('StateEducationAgency', 'FK_StateEducationAgency_EducationOrganization');
  modifyReverseForeignKeyIndexFor('StudentCTEProgramAssociation', 'FK_StudentCTEProgramAssociation_StudentProgramAssociation');
  modifyReverseForeignKeyIndexFor('StudentMigrantEducationProgramAssociation', 'FK_StudentMigrantEducationProgramAssociation_StudentProgramAssociation');
  modifyReverseForeignKeyIndexFor('StudentSpecialEducationProgramAssociation', 'FK_StudentSpecialEducationProgramAssociation_StudentProgramAssociation');
  modifyReverseForeignKeyIndexFor('StudentTitleIPartAProgramAssociation', 'FK_StudentTitleIPartAProgramAssociation_StudentProgramAssociation');
  // descriptors
  modifyReverseForeignKeyIndexFor('AcademicSubjectDescriptor', 'FK_AcademicSubjectDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('AccommodationDescriptor', 'FK_AccommodationDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('AccountCodeDescriptor', 'FK_AccountCodeDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('AchievementCategoryDescriptor', 'FK_AchievementCategoryDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('AdministrativeFundingControlDescriptor', 'FK_AdministrativeFundingControlDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('AssessmentCategoryDescriptor', 'FK_AssessmentCategoryDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('AssessmentIdentificationSystemDescriptor', 'FK_AssessmentIdentificationSystemDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('AssessmentPeriodDescriptor', 'FK_AssessmentPeriodDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('AttendanceEventCategoryDescriptor', 'FK_AttendanceEventCategoryDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('BehaviorDescriptor', 'FK_BehaviorDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('CalendarEventDescriptor', 'FK_CalendarEventDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('ClassroomPositionDescriptor', 'FK_ClassroomPositionDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('CompetencyLevelDescriptor', 'FK_CompetencyLevelDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('ContinuationOfServicesReasonDescriptor', 'FK_ContinuationOfServicesReasonDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('CountryDescriptor', 'FK_CountryDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('CourseIdentificationSystemDescriptor', 'FK_CourseIdentificationSystemDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('CredentialFieldDescriptor', 'FK_CredentialFieldDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('DiagnosisDescriptor', 'FK_DiagnosisDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('DisabilityDescriptor', 'FK_DisabilityDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('DisciplineDescriptor', 'FK_DisciplineDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('EducationOrganizationIdentificationSystemDescriptor', 'FK_EducationOrganizationIdentificationSystemDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('EmploymentStatusDescriptor', 'FK_EmploymentStatusDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('EntryTypeDescriptor', 'FK_EntryTypeDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('ExitWithdrawTypeDescriptor', 'FK_ExitWithdrawTypeDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('GradeLevelDescriptor', 'FK_GradeLevelDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('GradingPeriodDescriptor', 'FK_GradingPeriodDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('GraduationPlanTypeDescriptor', 'FK_GraduationPlanTypeDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('LanguageDescriptor', 'FK_LanguageDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('LevelDescriptor', 'FK_LevelDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('LevelOfEducationDescriptor', 'FK_LevelOfEducationDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('LimitedEnglishProficiencyDescriptor', 'FK_LimitedEnglishProficiencyDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('PerformanceLevelDescriptor', 'FK_PerformanceLevelDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('ProgramAssignmentDescriptor', 'FK_ProgramAssignmentDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('ProgramCharacteristicDescriptor', 'FK_ProgramCharacteristicDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('ReasonExitedDescriptor', 'FK_ReasonExitedDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('ReporterDescriptionDescriptor', 'FK_ReporterDescriptionDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('ResidencyStatusDescriptor', 'FK_ResidencyStatusDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('ResponsibilityDescriptor', 'FK_ResponsibilityDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('SchoolFoodServicesEligibilityDescriptor', 'FK_SchoolFoodServicesEligibilityDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('SectionCharacteristicDescriptor', 'FK_SectionCharacteristicDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('SeparationReasonDescriptor', 'FK_SeparationReasonDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('ServiceDescriptor', 'FK_ServiceDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('SpecialEducationSettingDescriptor', 'FK_SpecialEducationSettingDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('StaffClassificationDescriptor', 'FK_StaffClassificationDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('StaffIdentificationSystemDescriptor', 'FK_StaffIdentificationSystemDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('StudentCharacteristicDescriptor', 'FK_StudentCharacteristicDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('StudentIdentificationSystemDescriptor', 'FK_StudentIdentificationSystemDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('TeachingCredentialDescriptor', 'FK_TeachingCredentialDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('TermDescriptor', 'FK_TermDescriptor_Descriptor');
  modifyReverseForeignKeyIndexFor('WeaponDescriptor', 'FK_WeaponDescriptor_Descriptor');

  return {
    enhancerName,
    success: true,
  };
}
