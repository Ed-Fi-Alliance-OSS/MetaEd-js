// @flow
import R from 'ramda';
import { orderByProp } from 'metaed-core';
import type { EnhancerResult, MetaEdEnvironment } from 'metaed-core';
import { getPrimaryKeys } from '../model/database/Table';
import { pluginEnvironment } from '../enhancer/EnhancerHelper';
import type { Column } from '../model/database/Column';
import type { EdFiOdsEntityRepository } from '../model/EdFiOdsEntityRepository';
import type { Table } from '../model/database/Table';

// METAED-630
// Orders primary key columns to match EdFi DS 2.0
const enhancerName: string = 'PrimaryKeyOrderDiminisher';
const targetVersions: string = '2.0.x';

function primaryKeyOrderFor(table: Table): Array<string> {
  const primaryKeysFor: { [tableName: string]: Array<string> } = {
    AcademicWeek: ['WeekIdentifier', 'SchoolId'],
    Account: ['EducationOrganizationId', 'AccountNumber', 'FiscalYear'],
    AccountabilityRating: ['RatingTitle', 'EducationOrganizationId', 'SchoolYear'],
    AccountCode: ['EducationOrganizationId', 'AccountNumber', 'FiscalYear', 'AccountCodeDescriptorId'],
    Actual: ['EducationOrganizationId', 'AccountNumber', 'FiscalYear', 'AsOfDate'],
    Assessment: ['AssessmentTitle', 'AssessedGradeLevelDescriptorId', 'AcademicSubjectDescriptorId', 'Version'],
    AssessmentContentStandard: ['AssessmentVersion', 'AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId'],
    AssessmentContentStandardAuthor: ['AssessmentVersion', 'AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Author'],
    AssessmentIdentificationCode: ['AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'AssessmentIdentificationSystemDescriptorId'],
    AssessmentItem: ['AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'IdentificationCode'],
    AssessmentItemLearningStandard: ['AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'IdentificationCode', 'LearningStandardId'],
    AssessmentLanguage: ['AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'LanguageDescriptorId'],
    AssessmentPerformanceLevel: ['PerformanceLevelDescriptorId', 'AssessmentReportingMethodTypeId', 'AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version'],
    AssessmentProgram: ['AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'EducationOrganizationId', 'ProgramTypeId', 'ProgramName'],
    AssessmentScore: ['AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'AssessmentReportingMethodTypeId'],
    AssessmentSection: ['AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'SchoolId', 'ClassPeriodName', 'ClassroomIdentificationCode', 'SchoolYear', 'LocalCourseCode', 'TermDescriptorId', 'UniqueSectionCode', 'SequenceOfCourse'],
    BellSchedule: ['BellScheduleName', 'GradeLevelDescriptorId', 'SchoolId', 'Date'],
    BellScheduleMeetingTime: ['SchoolId', 'GradeLevelDescriptorId', 'Date', 'BellScheduleName', 'ClassPeriodName', 'StartTime'],
    Budget: ['EducationOrganizationId', 'AccountNumber', 'FiscalYear', 'AsOfDate'],
    CalendarDate: ['SchoolId', 'Date'],
    CalendarDateCalendarEvent: ['SchoolId', 'Date', 'CalendarEventDescriptorId'],
    ClassPeriod: ['SchoolId', 'ClassPeriodName'],
    CohortProgram: ['EducationOrganizationId', 'CohortIdentifier', 'ProgramEducationOrganizationId', 'ProgramTypeId', 'ProgramName'],
    CompetencyObjective: ['Objective', 'ObjectiveGradeLevelDescriptorId', 'EducationOrganizationId'],
    ContractedStaff: ['StaffUSI', 'EducationOrganizationId', 'AccountNumber', 'FiscalYear', 'AsOfDate'],
    Course: ['EducationOrganizationId', 'CourseCode'],
    CourseCompetencyLevel: ['EducationOrganizationId', 'CourseCode', 'CompetencyLevelDescriptorId'],
    CourseIdentificationCode: ['EducationOrganizationId', 'CourseCode', 'CourseIdentificationSystemDescriptorId'],
    CourseLearningObjective: ['EducationOrganizationId', 'CourseCode', 'Objective', 'AcademicSubjectDescriptorId', 'ObjectiveGradeLevelDescriptorId'],
    CourseLearningStandard: ['EducationOrganizationId', 'CourseCode', 'LearningStandardId'],
    CourseLevelCharacteristic: ['EducationOrganizationId', 'CourseCode', 'CourseLevelCharacteristicTypeId'],
    CourseOfferedGradeLevel: ['EducationOrganizationId', 'CourseCode', 'GradeLevelDescriptorId'],
    CourseOfferingCurriculumUsed: ['SchoolId', 'SchoolYear', 'LocalCourseCode', 'CurriculumUsedTypeId', 'TermDescriptorId'],
    CourseTranscript: ['CourseAttemptResultTypeId', 'StudentUSI', 'EducationOrganizationId', 'CourseEducationOrganizationId', 'SchoolYear', 'TermDescriptorId', 'CourseCode'],
    CourseTranscriptEarnedAdditionalCredits: ['AdditionalCreditTypeId', 'CourseAttemptResultTypeId', 'StudentUSI', 'EducationOrganizationId', 'CourseEducationOrganizationId', 'SchoolYear', 'TermDescriptorId', 'CourseCode'],
    DisciplineAction: ['DisciplineActionIdentifier', 'StudentUSI', 'DisciplineDate'],
    DisciplineActionDiscipline: ['StudentUSI', 'DisciplineActionIdentifier', 'DisciplineDate', 'DisciplineDescriptorId'],
    DisciplineActionDisciplineIncident: ['StudentUSI', 'DisciplineActionIdentifier', 'DisciplineDate', 'SchoolId', 'IncidentIdentifier'],
    DisciplineActionStaff: ['StudentUSI', 'DisciplineActionIdentifier', 'DisciplineDate', 'StaffUSI'],
    DisciplineIncidentBehavior: ['SchoolId', 'IncidentIdentifier', 'BehaviorDescriptorId'],
    DisciplineIncidentWeapon: ['SchoolId', 'IncidentIdentifier', 'WeaponDescriptorId'],
    EdFiException: ['EdFiExceptionId'],
    EducationContentAuthor: ['ContentIdentifier', 'Author'],
    EducationOrganizationAddress: ['EducationOrganizationId', 'AddressTypeId'],
    EducationOrganizationCategory: ['EducationOrganizationId', 'EducationOrganizationCategoryTypeId'],
    EducationOrganizationInternationalAddress: ['EducationOrganizationId', 'AddressTypeId'],
    EducationOrganizationInterventionPrescriptionAssociation: ['EducationOrganizationId', 'InterventionPrescriptionIdentificationCode', 'InterventionPrescriptionEducationOrganizationId'],
    EducationOrganizationNetworkAssociation: ['MemberEducationOrganizationId', 'EducationOrganizationNetworkId'],
    FeederSchoolAssociation: ['FeederSchoolId', 'SchoolId', 'BeginDate'],
    Grade: ['GradingPeriodDescriptorId', 'GradingPeriodBeginDate', 'GradeTypeId', 'StudentUSI', 'SchoolId', 'ClassPeriodName', 'ClassroomIdentificationCode', 'LocalCourseCode', 'UniqueSectionCode', 'SequenceOfCourse', 'SchoolYear', 'TermDescriptorId', 'BeginDate'],
    GradebookEntry: ['GradebookEntryTitle', 'ClassroomIdentificationCode', 'SchoolId', 'ClassPeriodName', 'LocalCourseCode', 'SchoolYear', 'TermDescriptorId', 'UniqueSectionCode', 'SequenceOfCourse', 'DateAssigned'],
    GradebookEntryLearningObjective: ['SchoolId', 'ClassPeriodName', 'ClassroomIdentificationCode', 'GradebookEntryTitle', 'DateAssigned', 'Objective', 'AcademicSubjectDescriptorId', 'ObjectiveGradeLevelDescriptorId', 'SchoolYear', 'LocalCourseCode', 'TermDescriptorId', 'UniqueSectionCode', 'SequenceOfCourse'],
    GradebookEntryLearningStandard: ['SchoolId', 'ClassPeriodName', 'ClassroomIdentificationCode', 'GradebookEntryTitle', 'DateAssigned', 'LearningStandardId', 'SchoolYear', 'LocalCourseCode', 'TermDescriptorId', 'UniqueSectionCode', 'SequenceOfCourse'],
    GradingPeriod: ['GradingPeriodDescriptorId', 'SchoolId', 'BeginDate'],
    GraduationPlan: ['GraduationPlanTypeDescriptorId', 'EducationOrganizationId', 'GraduationSchoolYear'],
    GraduationPlanCreditsByCourse: ['EducationOrganizationId', 'GraduationPlanTypeDescriptorId', 'GraduationSchoolYear', 'CourseSetName'],
    GraduationPlanCreditsByCourseCourse: ['EducationOrganizationId', 'GraduationPlanTypeDescriptorId', 'GraduationSchoolYear', 'CourseSetName', 'CourseEducationOrganizationId', 'CourseCode'],
    GraduationPlanCreditsBySubject: ['EducationOrganizationId', 'AcademicSubjectDescriptorId', 'GraduationPlanTypeDescriptorId', 'GraduationSchoolYear'],
    GraduationPlanRequiredAssessment: ['AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'EducationOrganizationId', 'GraduationPlanTypeDescriptorId', 'GraduationSchoolYear'],
    GraduationPlanRequiredAssessmentAssessmentPerformanceLevel: ['AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'EducationOrganizationId', 'GraduationPlanTypeDescriptorId', 'GraduationSchoolYear'],
    GraduationPlanRequiredAssessmentScore: ['AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'EducationOrganizationId', 'GraduationPlanTypeDescriptorId', 'GraduationSchoolYear', 'AssessmentReportingMethodTypeId'],
    Intervention: ['InterventionIdentificationCode', 'EducationOrganizationId'],
    InterventionAppropriateGradeLevel: ['InterventionIdentificationCode', 'EducationOrganizationId', 'GradeLevelDescriptorId'],
    InterventionAppropriateSex: ['InterventionIdentificationCode', 'EducationOrganizationId', 'SexTypeId'],
    InterventionDiagnosis: ['InterventionIdentificationCode', 'EducationOrganizationId', 'DiagnosisDescriptorId'],
    InterventionEducationContent: ['InterventionIdentificationCode', 'EducationOrganizationId', 'ContentIdentifier'],
    InterventionInterventionPrescription: ['InterventionIdentificationCode', 'EducationOrganizationId', 'InterventionPrescriptionIdentificationCode', 'InterventionPrescriptionEducationOrganizationId'],
    InterventionLearningResourceMetadataURI: ['InterventionIdentificationCode', 'EducationOrganizationId', 'LearningResourceMetadataURI'],
    InterventionMeetingTime: ['InterventionIdentificationCode', 'EducationOrganizationId', 'SchoolId', 'ClassPeriodName'],
    InterventionPopulationServed: ['InterventionIdentificationCode', 'EducationOrganizationId', 'PopulationServedTypeId'],
    InterventionPrescription: ['InterventionPrescriptionIdentificationCode', 'EducationOrganizationId'],
    InterventionPrescriptionAppropriateGradeLevel: ['InterventionPrescriptionIdentificationCode', 'EducationOrganizationId', 'GradeLevelDescriptorId'],
    InterventionPrescriptionAppropriateSex: ['InterventionPrescriptionIdentificationCode', 'EducationOrganizationId', 'SexTypeId'],
    InterventionPrescriptionDiagnosis: ['InterventionPrescriptionIdentificationCode', 'EducationOrganizationId', 'DiagnosisDescriptorId'],
    InterventionPrescriptionEducationContent: ['InterventionPrescriptionIdentificationCode', 'EducationOrganizationId', 'ContentIdentifier'],
    InterventionPrescriptionLearningResourceMetadataURI: ['InterventionPrescriptionIdentificationCode', 'EducationOrganizationId', 'LearningResourceMetadataURI'],
    InterventionPrescriptionPopulationServed: ['InterventionPrescriptionIdentificationCode', 'EducationOrganizationId', 'PopulationServedTypeId'],
    InterventionPrescriptionURI: ['InterventionPrescriptionIdentificationCode', 'EducationOrganizationId', 'URI'],
    InterventionStaff: ['InterventionIdentificationCode', 'EducationOrganizationId', 'StaffUSI'],
    InterventionStudy: ['InterventionStudyIdentificationCode', 'EducationOrganizationId'],
    InterventionStudyAppropriateGradeLevel: ['InterventionStudyIdentificationCode', 'EducationOrganizationId', 'GradeLevelDescriptorId'],
    InterventionStudyAppropriateSex: ['InterventionStudyIdentificationCode', 'EducationOrganizationId', 'SexTypeId'],
    InterventionStudyEducationContent: ['InterventionStudyIdentificationCode', 'EducationOrganizationId', 'ContentIdentifier'],
    InterventionStudyInterventionEffectiveness: ['InterventionStudyIdentificationCode', 'EducationOrganizationId', 'DiagnosisDescriptorId', 'PopulationServedTypeId', 'GradeLevelDescriptorId'],
    InterventionStudyLearningResourceMetadataURI: ['InterventionStudyIdentificationCode', 'EducationOrganizationId', 'LearningResourceMetadataURI'],
    InterventionStudyPopulationServed: ['InterventionStudyIdentificationCode', 'EducationOrganizationId', 'PopulationServedTypeId'],
    InterventionStudyStateAbbreviation: ['InterventionStudyIdentificationCode', 'EducationOrganizationId', 'StateAbbreviationTypeId'],
    InterventionStudyURI: ['InterventionStudyIdentificationCode', 'EducationOrganizationId', 'URI'],
    InterventionURI: ['InterventionIdentificationCode', 'EducationOrganizationId', 'URI'],
    LearningObjective: ['Objective', 'AcademicSubjectDescriptorId', 'ObjectiveGradeLevelDescriptorId'],
    LearningObjectiveContentStandard: ['Objective', 'AcademicSubjectDescriptorId', 'ObjectiveGradeLevelDescriptorId'],
    LearningObjectiveContentStandardAuthor: ['Objective', 'AcademicSubjectDescriptorId', 'ObjectiveGradeLevelDescriptorId', 'Author'],
    LearningObjectiveLearningStandard: ['Objective', 'AcademicSubjectDescriptorId', 'ObjectiveGradeLevelDescriptorId', 'LearningStandardId'],
    LearningStandardContentStandardAuthor: ['LearningStandardId', 'Author'],
    LearningStandardGradeLevel: ['LearningStandardId', 'GradeLevelDescriptorId'],
    LearningStandardIdentificationCode: ['LearningStandardId', 'IdentificationCode', 'ContentStandardName'],
    LeaveEvent: ['StaffUSI', 'EventDate', 'LeaveEventCategoryTypeId'],
    LevelDescriptorGradeLevel: ['LevelDescriptorId', 'GradeLevelDescriptorId'],
    LocalEducationAgencyFederalFunds: ['LocalEducationAgencyId', 'FiscalYear'],
    Location: ['SchoolId', 'ClassroomIdentificationCode'],
    ObjectiveAssessment: ['AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'IdentificationCode'],
    ObjectiveAssessmentAssessmentItem: ['AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'IdentificationCode', 'AssessmentItemIdentificationCode'],
    ObjectiveAssessmentLearningObjective: ['AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'IdentificationCode', 'Objective'],
    ObjectiveAssessmentLearningStandard: ['AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'IdentificationCode', 'LearningStandardId'],
    ObjectiveAssessmentPerformanceLevel: ['AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'IdentificationCode', 'PerformanceLevelDescriptorId', 'AssessmentReportingMethodTypeId'],
    OpenStaffPosition: ['EducationOrganizationId', 'EmploymentStatusDescriptorId', 'StaffClassificationDescriptorId', 'RequisitionNumber', 'DatePosted'],
    OpenStaffPositionAcademicSubject: ['EducationOrganizationId', 'StaffClassificationDescriptorId', 'RequisitionNumber', 'DatePosted', 'AcademicSubjectDescriptorId', 'EmploymentStatusDescriptorId'],
    OpenStaffPositionInstructionalGradeLevel: ['EducationOrganizationId', 'StaffClassificationDescriptorId', 'RequisitionNumber', 'DatePosted', 'GradeLevelDescriptorId', 'EmploymentStatusDescriptorId'],
    ParentAddress: ['ParentUSI', 'AddressTypeId'],
    ParentElectronicMail: ['ParentUSI', 'ElectronicMailTypeId'],
    ParentIdentificationDocument: ['PersonalInformationVerificationTypeId', 'IdentificationDocumentUseTypeId', 'ParentUSI'],
    ParentInternationalAddress: ['ParentUSI', 'AddressTypeId'],
    ParentOtherName: ['ParentUSI', 'OtherNameTypeId'],
    Payroll: ['StaffUSI', 'EducationOrganizationId', 'AccountNumber', 'FiscalYear', 'AsOfDate'],
    PostSecondaryEvent: ['StudentUSI', 'PostSecondaryEventCategoryTypeId', 'EventDate'],
    PostSecondaryEventPostSecondaryInstitution: ['StudentUSI', 'PostSecondaryEventCategoryTypeId', 'EventDate'],
    PostSecondaryEventPostSecondaryInstitutionIdentificationCode: ['StudentUSI', 'PostSecondaryEventCategoryTypeId', 'EventDate', 'EducationOrganizationIdentificationSystemDescriptorId'],
    PostSecondaryEventPostSecondaryInstitutionMediumOfInstruction: ['StudentUSI', 'PostSecondaryEventCategoryTypeId', 'EventDate', 'MediumOfInstructionTypeId'],
    Program: ['EducationOrganizationId', 'ProgramTypeId', 'ProgramName'],
    ProgramCharacteristic: ['EducationOrganizationId', 'ProgramTypeId', 'ProgramCharacteristicDescriptorId', 'ProgramName'],
    ProgramLearningObjective: ['EducationOrganizationId', 'ProgramTypeId', 'Objective', 'AcademicSubjectDescriptorId', 'ObjectiveGradeLevelDescriptorId', 'ProgramName'],
    ProgramLearningStandard: ['EducationOrganizationId', 'ProgramTypeId', 'LearningStandardId', 'ProgramName'],
    ProgramService: ['EducationOrganizationId', 'ProgramTypeId', 'ServiceDescriptorId', 'ProgramName'],
    ReportCard: ['StudentUSI', 'EducationOrganizationId', 'GradingPeriodDescriptorId', 'GradingPeriodBeginDate', 'SchoolId'],
    ReportCardGrade: ['EducationOrganizationId', 'GradingPeriodDescriptorId', 'GradingPeriodBeginDate', 'GradeTypeId', 'StudentUSI', 'SchoolId', 'ClassPeriodName', 'ClassroomIdentificationCode', 'LocalCourseCode', 'UniqueSectionCode', 'SequenceOfCourse', 'SchoolYear', 'TermDescriptorId', 'BeginDate'],
    ReportCardStudentCompetencyObjective: ['StudentUSI', 'Objective', 'ObjectiveGradeLevelDescriptorId', 'ObjectiveEducationOrganizationId', 'GradingPeriodDescriptorId', 'GradingPeriodBeginDate', 'SchoolId', 'ReportCardEducationOrganizationId'],
    ReportCardStudentLearningObjective: ['ReportCardEducationOrganizationId', 'StudentUSI', 'Objective', 'AcademicSubjectDescriptorId', 'ObjectiveGradeLevelDescriptorId', 'GradingPeriodDescriptorId', 'GradingPeriodBeginDate', 'SchoolId'],
    RestraintEvent: ['StudentUSI', 'SchoolId', 'RestraintEventIdentifier', 'EventDate'],
    RestraintEventProgram: ['StudentUSI', 'SchoolId', 'RestraintEventIdentifier', 'EventDate', 'ProgramTypeId', 'ProgramName', 'EducationOrganizationId'],
    RestraintEventReason: ['StudentUSI', 'SchoolId', 'RestraintEventIdentifier', 'EventDate', 'RestraintEventReasonTypeId'],
    SchoolCategory: ['SchoolId', 'SchoolCategoryTypeId'],
    SchoolGradeLevel: ['SchoolId', 'GradeLevelDescriptorId'],
    Section: ['SchoolId', 'ClassPeriodName', 'ClassroomIdentificationCode', 'LocalCourseCode', 'TermDescriptorId', 'SchoolYear', 'UniqueSectionCode', 'SequenceOfCourse'],
    SectionAttendanceTakenEvent: ['SchoolId', 'ClassPeriodName', 'ClassroomIdentificationCode', 'LocalCourseCode', 'TermDescriptorId', 'SchoolYear', 'UniqueSectionCode', 'SequenceOfCourse', 'Date'],
    SectionCharacteristic: ['SectionCharacteristicDescriptorId', 'ClassroomIdentificationCode', 'SchoolId', 'ClassPeriodName', 'LocalCourseCode', 'SchoolYear', 'TermDescriptorId', 'UniqueSectionCode', 'SequenceOfCourse'],
    SectionProgram: ['ClassroomIdentificationCode', 'SchoolId', 'ClassPeriodName', 'LocalCourseCode', 'SchoolYear', 'TermDescriptorId', 'UniqueSectionCode', 'SequenceOfCourse', 'ProgramTypeId', 'ProgramName', 'EducationOrganizationId'],
    SessionAcademicWeek: ['SchoolId', 'WeekIdentifier', 'SchoolYear', 'TermDescriptorId'],
    SessionGradingPeriod: ['SchoolYear', 'TermDescriptorId', 'SchoolId', 'GradingPeriodDescriptorId', 'BeginDate'],
    StaffAddress: ['StaffUSI', 'AddressTypeId'],
    StaffCohortAssociation: ['StaffUSI', 'EducationOrganizationId', 'CohortIdentifier', 'BeginDate'],
    StaffCredential: ['StaffUSI', 'CredentialFieldDescriptorId', 'CredentialTypeId', 'LevelDescriptorId', 'TeachingCredentialDescriptorId', 'CredentialIssuanceDate'],
    StaffEducationOrganizationAssignmentAssociation: ['StaffUSI', 'EducationOrganizationId', 'StaffClassificationDescriptorId', 'BeginDate'],
    StaffEducationOrganizationEmploymentAssociation: ['EducationOrganizationId', 'StaffUSI', 'EmploymentStatusDescriptorId', 'HireDate'],
    StaffElectronicMail: ['StaffUSI', 'ElectronicMailTypeId'],
    StaffIdentificationCode: ['StaffUSI', 'StaffIdentificationSystemDescriptorId'],
    StaffIdentificationDocument: ['PersonalInformationVerificationTypeId', 'IdentificationDocumentUseTypeId', 'StaffUSI'],
    StaffInternationalAddress: ['StaffUSI', 'AddressTypeId'],
    StaffLanguage: ['StaffUSI', 'LanguageDescriptorId'],
    StaffLanguageUse: ['StaffUSI', 'LanguageDescriptorId', 'LanguageUseTypeId'],
    StaffOtherName: ['StaffUSI', 'OtherNameTypeId'],
    StaffProgramAssociation: ['ProgramEducationOrganizationId', 'ProgramTypeId', 'StaffUSI', 'BeginDate', 'ProgramName'],
    StaffRace: ['StaffUSI', 'RaceTypeId'],
    StaffSchoolAssociation: ['StaffUSI', 'ProgramAssignmentDescriptorId', 'SchoolId'],
    StaffSchoolAssociationAcademicSubject: ['StaffUSI', 'ProgramAssignmentDescriptorId', 'SchoolId', 'AcademicSubjectDescriptorId'],
    StaffSchoolAssociationGradeLevel: ['StaffUSI', 'ProgramAssignmentDescriptorId', 'SchoolId', 'GradeLevelDescriptorId'],
    StaffSectionAssociation: ['StaffUSI', 'ClassroomIdentificationCode', 'SchoolId', 'ClassPeriodName', 'LocalCourseCode', 'SchoolYear', 'TermDescriptorId', 'UniqueSectionCode', 'SequenceOfCourse'],
    StateEducationAgencyAccountability: ['StateEducationAgencyId', 'SchoolYear'],
    StateEducationAgencyFederalFunds: ['StateEducationAgencyId', 'FiscalYear'],
    StudentAcademicRecord: ['StudentUSI', 'EducationOrganizationId', 'SchoolYear', 'TermDescriptorId'],
    StudentAcademicRecordAcademicHonor: ['AcademicHonorCategoryTypeId', 'StudentUSI', 'SchoolYear', 'TermDescriptorId', 'EducationOrganizationId'],
    StudentAcademicRecordClassRanking: ['StudentUSI', 'SchoolYear', 'TermDescriptorId', 'EducationOrganizationId'],
    StudentAcademicRecordDiploma: ['StudentUSI', 'DiplomaTypeId', 'SchoolYear', 'TermDescriptorId', 'EducationOrganizationId', 'DiplomaAwardDate'],
    StudentAcademicRecordRecognition: ['RecognitionTypeId', 'StudentUSI', 'EducationOrganizationId', 'SchoolYear', 'TermDescriptorId'],
    StudentAcademicRecordReportCard: ['StudentUSI', 'SchoolYear', 'TermDescriptorId', 'EducationOrganizationId', 'GradingPeriodDescriptorId', 'GradingPeriodBeginDate', 'SchoolId'],
    StudentAddress: ['StudentUSI', 'AddressTypeId'],
    StudentAssessment: ['StudentUSI', 'AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'AdministrationDate'],
    StudentAssessmentAccommodation: ['StudentUSI', 'AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'AdministrationDate', 'AccommodationDescriptorId'],
    StudentAssessmentItem: ['StudentUSI', 'AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'IdentificationCode', 'AdministrationDate'],
    StudentAssessmentPerformanceLevel: ['StudentUSI', 'AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'AdministrationDate', 'PerformanceLevelDescriptorId'],
    StudentAssessmentScoreResult: ['StudentUSI', 'AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'AdministrationDate', 'AssessmentReportingMethodTypeId'],
    StudentAssessmentStudentObjectiveAssessment: ['StudentUSI', 'AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'IdentificationCode', 'AdministrationDate'],
    StudentAssessmentStudentObjectiveAssessmentPerformanceLevel: ['StudentUSI', 'AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'IdentificationCode', 'AdministrationDate', 'PerformanceLevelDescriptorId'],
    StudentAssessmentStudentObjectiveAssessmentScoreResult: ['StudentUSI', 'AssessmentTitle', 'AcademicSubjectDescriptorId', 'AssessedGradeLevelDescriptorId', 'Version', 'IdentificationCode', 'AdministrationDate', 'AssessmentReportingMethodTypeId'],
    StudentCharacteristic: ['StudentUSI', 'StudentCharacteristicDescriptorId'],
    StudentCohortAssociation: ['StudentUSI', 'EducationOrganizationId', 'CohortIdentifier', 'BeginDate'],
    StudentCohortAssociationSection: ['StudentUSI', 'ClassroomIdentificationCode', 'SchoolId', 'ClassPeriodName', 'LocalCourseCode', 'SchoolYear', 'TermDescriptorId', 'UniqueSectionCode', 'SequenceOfCourse', 'EducationOrganizationId', 'CohortIdentifier', 'BeginDate'],
    StudentCohortYear: ['StudentUSI', 'CohortYearTypeId', 'SchoolYear'],
    StudentCompetencyObjective: ['StudentUSI', 'Objective', 'ObjectiveGradeLevelDescriptorId', 'ObjectiveEducationOrganizationId', 'SchoolId', 'GradingPeriodDescriptorId', 'GradingPeriodBeginDate'],
    StudentCTEProgramAssociation: ['StudentUSI', 'EducationOrganizationId', 'ProgramTypeId', 'ProgramName', 'ProgramEducationOrganizationId', 'BeginDate'],
    StudentCTEProgramAssociationCTEProgram: ['StudentUSI', 'ProgramTypeId', 'ProgramEducationOrganizationId', 'BeginDate', 'CareerPathwayTypeId', 'ProgramName', 'EducationOrganizationId'],
    StudentDisability: ['StudentUSI', 'DisabilityDescriptorId'],
    StudentDisciplineIncidentAssociation: ['StudentUSI', 'SchoolId', 'IncidentIdentifier'],
    StudentDisciplineIncidentAssociationBehavior: ['StudentUSI', 'SchoolId', 'IncidentIdentifier', 'BehaviorDescriptorId'],
    StudentEducationOrganizationAssociation: ['StudentUSI', 'EducationOrganizationId', 'ResponsibilityDescriptorId'],
    StudentElectronicMail: ['StudentUSI', 'ElectronicMailTypeId'],
    StudentGradebookEntry: ['StudentUSI', 'ClassroomIdentificationCode', 'SchoolId', 'ClassPeriodName', 'LocalCourseCode', 'SchoolYear', 'TermDescriptorId', 'UniqueSectionCode', 'SequenceOfCourse', 'BeginDate', 'GradebookEntryTitle', 'DateAssigned'],
    StudentIdentificationCode: ['StudentUSI', 'AssigningOrganizationIdentificationCode', 'StudentIdentificationSystemDescriptorId'],
    StudentIdentificationDocument: ['PersonalInformationVerificationTypeId', 'IdentificationDocumentUseTypeId', 'StudentUSI'],
    StudentIndicator: ['StudentUSI', 'IndicatorName'],
    StudentInternationalAddress: ['StudentUSI', 'AddressTypeId'],
    StudentInterventionAssociation: ['StudentUSI', 'InterventionIdentificationCode', 'EducationOrganizationId'],
    StudentInterventionAssociationInterventionEffectiveness: ['StudentUSI', 'InterventionIdentificationCode', 'EducationOrganizationId', 'DiagnosisDescriptorId', 'PopulationServedTypeId', 'GradeLevelDescriptorId'],
    StudentInterventionAttendanceEvent: ['StudentUSI', 'InterventionIdentificationCode', 'EducationOrganizationId', 'EventDate', 'AttendanceEventCategoryDescriptorId'],
    StudentLanguage: ['StudentUSI', 'LanguageDescriptorId'],
    StudentLanguageUse: ['StudentUSI', 'LanguageDescriptorId', 'LanguageUseTypeId'],
    StudentLearningObjective: ['StudentUSI', 'Objective', 'AcademicSubjectDescriptorId', 'ObjectiveGradeLevelDescriptorId', 'GradingPeriodDescriptorId', 'GradingPeriodBeginDate', 'SchoolId'],
    StudentMigrantEducationProgramAssociation: ['StudentUSI', 'EducationOrganizationId', 'ProgramTypeId', 'ProgramName', 'ProgramEducationOrganizationId', 'BeginDate'],
    StudentOtherName: ['StudentUSI', 'OtherNameTypeId'],
    StudentParentAssociation: ['StudentUSI', 'ParentUSI'],
    StudentProgramAssociation: ['StudentUSI', 'EducationOrganizationId', 'ProgramTypeId', 'ProgramName', 'ProgramEducationOrganizationId', 'BeginDate'],
    StudentProgramAssociationService: ['StudentUSI', 'EducationOrganizationId', 'ProgramTypeId', 'ProgramName', 'ProgramEducationOrganizationId', 'BeginDate', 'ServiceDescriptorId'],
    StudentProgramAttendanceEvent: ['StudentUSI', 'ProgramEducationOrganizationId', 'ProgramTypeId', 'EventDate', 'AttendanceEventCategoryDescriptorId', 'ProgramName', 'EducationOrganizationId'],
    StudentProgramParticipation: ['StudentUSI', 'ProgramTypeId'],
    StudentProgramParticipationProgramCharacteristic: ['StudentUSI', 'ProgramTypeId', 'ProgramCharacteristicDescriptorId'],
    StudentRace: ['StudentUSI', 'RaceTypeId'],
    StudentSchoolAssociation: ['StudentUSI', 'SchoolId', 'EntryDate'],
    StudentSchoolAssociationEducationPlan: ['StudentUSI', 'SchoolId', 'EntryDate', 'EducationPlanTypeId'],
    StudentSchoolAttendanceEvent: ['StudentUSI', 'SchoolId', 'SchoolYear', 'EventDate', 'AttendanceEventCategoryDescriptorId', 'TermDescriptorId'],
    StudentSectionAssociation: ['StudentUSI', 'SchoolId', 'ClassPeriodName', 'ClassroomIdentificationCode', 'LocalCourseCode', 'UniqueSectionCode', 'SequenceOfCourse', 'SchoolYear', 'TermDescriptorId', 'BeginDate'],
    StudentSectionAttendanceEvent: ['StudentUSI', 'ClassroomIdentificationCode', 'SchoolId', 'ClassPeriodName', 'LocalCourseCode', 'SchoolYear', 'TermDescriptorId', 'UniqueSectionCode', 'SequenceOfCourse', 'EventDate', 'AttendanceEventCategoryDescriptorId'],
    StudentSpecialEducationProgramAssociation: ['StudentUSI', 'EducationOrganizationId', 'ProgramTypeId', 'ProgramName', 'ProgramEducationOrganizationId', 'BeginDate'],
    StudentSpecialEducationProgramAssociationServiceProvider: ['StudentUSI', 'ProgramTypeId', 'ProgramEducationOrganizationId', 'BeginDate', 'StaffUSI', 'ProgramName', 'EducationOrganizationId'],
    StudentTitleIPartAProgramAssociation: ['StudentUSI', 'EducationOrganizationId', 'ProgramTypeId', 'ProgramName', 'ProgramEducationOrganizationId', 'BeginDate'],
  };

  return R.propOr([], table.name)(primaryKeysFor);
}

function modifyPrimaryKeyColumnOrder(repository: EdFiOdsEntityRepository): void {
  repository.table.forEach((table: Table) => {
    const primaryKeyOrder: Array<string> = primaryKeyOrderFor(table);
    if (primaryKeyOrder.length === 0) return;

    const primaryKeys: Array<Column> = orderByProp('name')(getPrimaryKeys(table));
    const primaryKeyLookup: { [primaryKeyName: string]: Column } = R.groupBy(R.prop('name'), primaryKeys);
    const primaryKeyFor: (primaryKeyName: string) => Column = R.prop(R.__, primaryKeyLookup);

    table.primaryKeys = R.compose(
      R.union(R.__, primaryKeys),
      R.chain((pkName: string) => primaryKeyFor(pkName)),
    )(primaryKeyOrder);
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (metaEd.dataStandardVersion !== targetVersions) return { enhancerName, success: true };

  modifyPrimaryKeyColumnOrder(pluginEnvironment(metaEd).entity);

  return {
    enhancerName,
    success: true,
  };
}

/*
(SELECT
    '(SELECT ''' + TABLE_NAME + ''' AS TableName,
        (SELECT CONCAT(
            (SELECT ''"'' + col.COLUMN_NAME + ''", ''
                FROM
                    [EdFi_Ods_Empty_v2.0].INFORMATION_SCHEMA.TABLE_CONSTRAINTS tab,
                    [EdFi_Ods_Empty_v2.0].INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE col,
                    [EdFi_Ods_Empty_v2.0].INFORMATION_SCHEMA.KEY_COLUMN_USAGE pos
                WHERE
                    tab.TABLE_NAME = ''' + TABLE_NAME + '''
                    AND tab.Constraint_Name = col.Constraint_Name
                    AND col.Constraint_Name = pos.Constraint_Name
                    AND col.COLUMN_NAME = pos.COLUMN_NAME
                    AND CONSTRAINT_TYPE = ''PRIMARY KEY''
                ORDER BY
                    ORDINAL_POSITION
                FOR XML PATH('''')) ,''''
            ) AS result
        ) AS Columns
    EXCEPT
    SELECT ''' + TABLE_NAME + ''' AS TableName,
        (SELECT CONCAT(
        (SELECT ''"'' + col.COLUMN_NAME + ''", ''
            FROM
                [EdFi_Ods_Empty_DS2.0_Deployed].INFORMATION_SCHEMA.TABLE_CONSTRAINTS tab,
                [EdFi_Ods_Empty_DS2.0_Deployed].INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE col,
                [EdFi_Ods_Empty_DS2.0_Deployed].INFORMATION_SCHEMA.KEY_COLUMN_USAGE pos
            WHERE
                tab.TABLE_NAME = ''' + TABLE_NAME + '''
                AND tab.Constraint_Name = col.Constraint_Name
                AND col.Constraint_Name = pos.Constraint_Name
                AND col.COLUMN_NAME = pos.COLUMN_NAME
                AND CONSTRAINT_TYPE = ''PRIMARY KEY''
            ORDER BY
                ORDINAL_POSITION
            FOR XML PATH('''')) ,''''
        ) AS result
    ) AS Columns) UNION' --NOTE: REMOVE LAST UNION
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'edfi')
*/
