import { State, MetaEdEnvironment, newMetaEdEnvironment } from '@edfi/metaed-core';
import {
  buildMetaEd,
  buildParseTree,
  loadFileIndex,
  loadFiles,
  initializeNamespaces,
  newMetaEdConfiguration,
  newState,
  runEnhancers,
  setupPlugins,
  walkBuilders,
} from '@edfi/metaed-core';
import { metaEdPlugins } from './PluginHelper';
import { Snapshotable, snapshotify } from '../enhancer/AllJsonPathsMappingEnhancer.test';

jest.setTimeout(40000);

describe('when generating api schema targeting tech version 5.3 with data standard 3.3b', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '5.3.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-3.3b/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '3.3.1-b',
          description: 'A description',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEd,
      metaEdConfiguration,
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '3.3.1-b';

    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      await runEnhancers(metaEdPlugin, state);
    }
  });

  it('should create the correct JSON path mappings for StudentAssessment', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentAssessment');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "Accommodation": Array [
          "$.accommodations[*].accommodationDescriptor",
        ],
        "AdministrationDate": Array [
          "$.administrationDate",
        ],
        "AdministrationEndDate": Array [
          "$.administrationEndDate",
        ],
        "AdministrationEnvironment": Array [
          "$.administrationEnvironmentDescriptor",
        ],
        "AdministrationLanguage": Array [
          "$.administrationLanguageDescriptor",
        ],
        "Assessment": Array [
          "$.assessmentReference.assessmentIdentifier",
          "$.assessmentReference.namespace",
        ],
        "Assessment.AssessmentIdentifier": Array [
          "$.assessmentReference.assessmentIdentifier",
        ],
        "Assessment.Namespace": Array [
          "$.assessmentReference.namespace",
        ],
        "EventCircumstance": Array [
          "$.eventCircumstanceDescriptor",
        ],
        "EventDescription": Array [
          "$.eventDescription",
        ],
        "PerformanceLevel.AssessmentReportingMethod": Array [
          "$.performanceLevels[*].assessmentReportingMethodDescriptor",
        ],
        "PerformanceLevel.PerformanceLevel": Array [
          "$.performanceLevels[*].performanceLevelDescriptor",
        ],
        "PerformanceLevel.PerformanceLevelMet": Array [
          "$.performanceLevels[*].performanceLevelMet",
        ],
        "PlatformType": Array [
          "$.platformTypeDescriptor",
        ],
        "ReasonNotTested": Array [
          "$.reasonNotTestedDescriptor",
        ],
        "RetestIndicator": Array [
          "$.retestIndicatorDescriptor",
        ],
        "SchoolYear": Array [
          "$.schoolYearTypeReference.schoolYear",
        ],
        "ScoreResult.AssessmentReportingMethod": Array [
          "$.scoreResults[*].assessmentReportingMethodDescriptor",
        ],
        "ScoreResult.Result": Array [
          "$.scoreResults[*].result",
        ],
        "ScoreResult.ResultDatatypeType": Array [
          "$.scoreResults[*].resultDatatypeTypeDescriptor",
        ],
        "SerialNumber": Array [
          "$.serialNumber",
        ],
        "Student": Array [
          "$.studentReference.studentUniqueId",
        ],
        "Student.StudentUniqueId": Array [
          "$.studentReference.studentUniqueId",
        ],
        "StudentAssessmentIdentifier": Array [
          "$.studentAssessmentIdentifier",
        ],
        "StudentAssessmentItem.AssessmentItem": Array [
          "$.items[*].assessmentItemReference.assessmentIdentifier",
          "$.items[*].assessmentItemReference.identificationCode",
          "$.items[*].assessmentItemReference.namespace",
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment": Array [
          "$.items[*].assessmentItemReference.assessmentIdentifier",
          "$.items[*].assessmentItemReference.namespace",
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment.AssessmentIdentifier": Array [
          "$.items[*].assessmentItemReference.assessmentIdentifier",
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment.Namespace": Array [
          "$.items[*].assessmentItemReference.namespace",
        ],
        "StudentAssessmentItem.AssessmentItem.IdentificationCode": Array [
          "$.items[*].assessmentItemReference.identificationCode",
        ],
        "StudentAssessmentItem.AssessmentItemResult": Array [
          "$.items[*].assessmentItemResultDescriptor",
        ],
        "StudentAssessmentItem.AssessmentResponse": Array [
          "$.items[*].assessmentResponse",
        ],
        "StudentAssessmentItem.DescriptiveFeedback": Array [
          "$.items[*].descriptiveFeedback",
        ],
        "StudentAssessmentItem.RawScoreResult": Array [
          "$.items[*].rawScoreResult",
        ],
        "StudentAssessmentItem.ResponseIndicator": Array [
          "$.items[*].responseIndicatorDescriptor",
        ],
        "StudentAssessmentItem.TimeAssessed": Array [
          "$.items[*].timeAssessed",
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment": Array [
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.identificationCode",
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment": Array [
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.AssessmentIdentifier": Array [
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.Namespace": Array [
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.IdentificationCode": Array [
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.identificationCode",
        ],
        "StudentObjectiveAssessment.PerformanceLevel.AssessmentReportingMethod": Array [
          "$.studentObjectiveAssessments[*].performanceLevels[*].assessmentReportingMethodDescriptor",
        ],
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevel": Array [
          "$.studentObjectiveAssessments[*].performanceLevels[*].performanceLevelDescriptor",
        ],
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevelMet": Array [
          "$.studentObjectiveAssessments[*].performanceLevels[*].performanceLevelMet",
        ],
        "StudentObjectiveAssessment.ScoreResult.AssessmentReportingMethod": Array [
          "$.studentObjectiveAssessments[*].scoreResults[*].assessmentReportingMethodDescriptor",
        ],
        "StudentObjectiveAssessment.ScoreResult.Result": Array [
          "$.studentObjectiveAssessments[*].scoreResults[*].result",
        ],
        "StudentObjectiveAssessment.ScoreResult.ResultDatatypeType": Array [
          "$.studentObjectiveAssessments[*].scoreResults[*].resultDatatypeTypeDescriptor",
        ],
        "WhenAssessedGradeLevel": Array [
          "$.whenAssessedGradeLevelDescriptor",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "Accommodation": true,
        "AdministrationDate": true,
        "AdministrationEndDate": true,
        "AdministrationEnvironment": true,
        "AdministrationLanguage": true,
        "Assessment": true,
        "Assessment.AssessmentIdentifier": false,
        "Assessment.Namespace": false,
        "EventCircumstance": true,
        "EventDescription": true,
        "PerformanceLevel.AssessmentReportingMethod": true,
        "PerformanceLevel.PerformanceLevel": true,
        "PerformanceLevel.PerformanceLevelMet": true,
        "PlatformType": true,
        "ReasonNotTested": true,
        "RetestIndicator": true,
        "SchoolYear": true,
        "ScoreResult.AssessmentReportingMethod": true,
        "ScoreResult.Result": true,
        "ScoreResult.ResultDatatypeType": true,
        "SerialNumber": true,
        "Student": true,
        "Student.StudentUniqueId": false,
        "StudentAssessmentIdentifier": true,
        "StudentAssessmentItem.AssessmentItem": true,
        "StudentAssessmentItem.AssessmentItem.Assessment": false,
        "StudentAssessmentItem.AssessmentItem.Assessment.AssessmentIdentifier": false,
        "StudentAssessmentItem.AssessmentItem.Assessment.Namespace": false,
        "StudentAssessmentItem.AssessmentItem.IdentificationCode": false,
        "StudentAssessmentItem.AssessmentItemResult": true,
        "StudentAssessmentItem.AssessmentResponse": true,
        "StudentAssessmentItem.DescriptiveFeedback": true,
        "StudentAssessmentItem.RawScoreResult": true,
        "StudentAssessmentItem.ResponseIndicator": true,
        "StudentAssessmentItem.TimeAssessed": true,
        "StudentObjectiveAssessment.ObjectiveAssessment": true,
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment": false,
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.AssessmentIdentifier": false,
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.Namespace": false,
        "StudentObjectiveAssessment.ObjectiveAssessment.IdentificationCode": false,
        "StudentObjectiveAssessment.PerformanceLevel.AssessmentReportingMethod": true,
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevel": true,
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevelMet": true,
        "StudentObjectiveAssessment.ScoreResult.AssessmentReportingMethod": true,
        "StudentObjectiveAssessment.ScoreResult.Result": true,
        "StudentObjectiveAssessment.ScoreResult.ResultDatatypeType": true,
        "WhenAssessedGradeLevel": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "Accommodation": "Accommodation",
        "AdministrationDate": "AdministrationDate",
        "AdministrationEndDate": "AdministrationEndDate",
        "AdministrationEnvironment": "AdministrationEnvironment",
        "AdministrationLanguage": "AdministrationLanguage",
        "Assessment": "Assessment",
        "EventCircumstance": "EventCircumstance",
        "EventDescription": "EventDescription",
        "PerformanceLevel.AssessmentReportingMethod": "AssessmentReportingMethod",
        "PerformanceLevel.PerformanceLevel": "PerformanceLevel",
        "PerformanceLevel.PerformanceLevelMet": "PerformanceLevelMet",
        "PlatformType": "PlatformType",
        "ReasonNotTested": "ReasonNotTested",
        "RetestIndicator": "RetestIndicator",
        "SchoolYear": "SchoolYear",
        "ScoreResult.AssessmentReportingMethod": "AssessmentReportingMethod",
        "ScoreResult.Result": "Result",
        "ScoreResult.ResultDatatypeType": "ResultDatatypeType",
        "SerialNumber": "SerialNumber",
        "Student": "Student",
        "StudentAssessmentIdentifier": "StudentAssessmentIdentifier",
        "StudentAssessmentItem.AssessmentItem": "AssessmentItem",
        "StudentAssessmentItem.AssessmentItemResult": "AssessmentItemResult",
        "StudentAssessmentItem.AssessmentResponse": "AssessmentResponse",
        "StudentAssessmentItem.DescriptiveFeedback": "DescriptiveFeedback",
        "StudentAssessmentItem.RawScoreResult": "RawScoreResult",
        "StudentAssessmentItem.ResponseIndicator": "ResponseIndicator",
        "StudentAssessmentItem.TimeAssessed": "TimeAssessed",
        "StudentObjectiveAssessment.ObjectiveAssessment": "ObjectiveAssessment",
        "StudentObjectiveAssessment.PerformanceLevel.AssessmentReportingMethod": "AssessmentReportingMethod",
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevel": "PerformanceLevel",
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevelMet": "PerformanceLevelMet",
        "StudentObjectiveAssessment.ScoreResult.AssessmentReportingMethod": "AssessmentReportingMethod",
        "StudentObjectiveAssessment.ScoreResult.Result": "Result",
        "StudentObjectiveAssessment.ScoreResult.ResultDatatypeType": "ResultDatatypeType",
        "WhenAssessedGradeLevel": "WhenAssessedGradeLevel",
      }
    `);
  });

  it('should create the correct equality constraints for StudentAssessment', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentAssessment');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.items[*].assessmentItemReference.assessmentIdentifier",
          "targetJsonPath": "$.assessmentReference.assessmentIdentifier",
        },
        Object {
          "sourceJsonPath": "$.items[*].assessmentItemReference.namespace",
          "targetJsonPath": "$.assessmentReference.namespace",
        },
        Object {
          "sourceJsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
          "targetJsonPath": "$.assessmentReference.assessmentIdentifier",
        },
        Object {
          "sourceJsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
          "targetJsonPath": "$.assessmentReference.namespace",
        },
      ]
    `);
  });

  it('should create the correct JSON path mappings for Session', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('Session');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AcademicWeek": Array [
          "$.academicWeeks[*].academicWeekReference.schoolId",
          "$.academicWeeks[*].academicWeekReference.weekIdentifier",
        ],
        "AcademicWeek.School": Array [
          "$.academicWeeks[*].academicWeekReference.schoolId",
        ],
        "AcademicWeek.School.SchoolId": Array [
          "$.academicWeeks[*].academicWeekReference.schoolId",
        ],
        "AcademicWeek.WeekIdentifier": Array [
          "$.academicWeeks[*].academicWeekReference.weekIdentifier",
        ],
        "BeginDate": Array [
          "$.beginDate",
        ],
        "EndDate": Array [
          "$.endDate",
        ],
        "GradingPeriod": Array [
          "$.gradingPeriods[*].gradingPeriodReference.gradingPeriodDescriptor",
          "$.gradingPeriods[*].gradingPeriodReference.periodSequence",
          "$.gradingPeriods[*].gradingPeriodReference.schoolId",
          "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
        ],
        "GradingPeriod.GradingPeriod": Array [
          "$.gradingPeriods[*].gradingPeriodReference.gradingPeriodDescriptor",
        ],
        "GradingPeriod.PeriodSequence": Array [
          "$.gradingPeriods[*].gradingPeriodReference.periodSequence",
        ],
        "GradingPeriod.School": Array [
          "$.gradingPeriods[*].gradingPeriodReference.schoolId",
        ],
        "GradingPeriod.School.SchoolId": Array [
          "$.gradingPeriods[*].gradingPeriodReference.schoolId",
        ],
        "GradingPeriod.SchoolYear": Array [
          "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
        ],
        "School": Array [
          "$.schoolReference.schoolId",
        ],
        "School.SchoolId": Array [
          "$.schoolReference.schoolId",
        ],
        "SchoolYear": Array [
          "$.schoolYearTypeReference.schoolYear",
        ],
        "SessionName": Array [
          "$.sessionName",
        ],
        "Term": Array [
          "$.termDescriptor",
        ],
        "TotalInstructionalDays": Array [
          "$.totalInstructionalDays",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AcademicWeek": true,
        "AcademicWeek.School": false,
        "AcademicWeek.School.SchoolId": false,
        "AcademicWeek.WeekIdentifier": false,
        "BeginDate": true,
        "EndDate": true,
        "GradingPeriod": true,
        "GradingPeriod.GradingPeriod": false,
        "GradingPeriod.PeriodSequence": false,
        "GradingPeriod.School": false,
        "GradingPeriod.School.SchoolId": false,
        "GradingPeriod.SchoolYear": false,
        "School": true,
        "School.SchoolId": false,
        "SchoolYear": true,
        "SessionName": true,
        "Term": true,
        "TotalInstructionalDays": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AcademicWeek": "AcademicWeek",
        "BeginDate": "BeginDate",
        "EndDate": "EndDate",
        "GradingPeriod": "GradingPeriod",
        "School": "School",
        "SchoolYear": "SchoolYear",
        "SessionName": "SessionName",
        "Term": "Term",
        "TotalInstructionalDays": "TotalInstructionalDays",
      }
    `);
  });

  it('should create the correct equality constraints for Session', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('Session');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
          "targetJsonPath": "$.schoolYearTypeReference.schoolYear",
        },
        Object {
          "sourceJsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolId",
          "targetJsonPath": "$.schoolReference.schoolId",
        },
      ]
    `);
  });

  it('should create the correct JSON path mappings for StudentCompetencyObjective', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentCompetencyObjective');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "CompetencyLevel": Array [
          "$.competencyLevelDescriptor",
        ],
        "CompetencyObjective": Array [
          "$.competencyObjectiveReference.educationOrganizationId",
          "$.competencyObjectiveReference.objective",
          "$.competencyObjectiveReference.objectiveGradeLevelDescriptor",
        ],
        "CompetencyObjective.EducationOrganization": Array [
          "$.competencyObjectiveReference.educationOrganizationId",
        ],
        "CompetencyObjective.EducationOrganization.EducationOrganizationId": Array [
          "$.competencyObjectiveReference.educationOrganizationId",
        ],
        "CompetencyObjective.Objective": Array [
          "$.competencyObjectiveReference.objective",
        ],
        "CompetencyObjective.ObjectiveGradeLevel": Array [
          "$.competencyObjectiveReference.objectiveGradeLevelDescriptor",
        ],
        "DiagnosticStatement": Array [
          "$.diagnosticStatement",
        ],
        "GradingPeriod": Array [
          "$.gradingPeriodReference.gradingPeriodDescriptor",
          "$.gradingPeriodReference.periodSequence",
          "$.gradingPeriodReference.schoolId",
          "$.gradingPeriodReference.schoolYear",
        ],
        "GradingPeriod.GradingPeriod": Array [
          "$.gradingPeriodReference.gradingPeriodDescriptor",
        ],
        "GradingPeriod.PeriodSequence": Array [
          "$.gradingPeriodReference.periodSequence",
        ],
        "GradingPeriod.School": Array [
          "$.gradingPeriodReference.schoolId",
        ],
        "GradingPeriod.School.SchoolId": Array [
          "$.gradingPeriodReference.schoolId",
        ],
        "GradingPeriod.SchoolYear": Array [
          "$.gradingPeriodReference.schoolYear",
        ],
        "Student": Array [
          "$.studentReference.studentUniqueId",
        ],
        "Student.StudentUniqueId": Array [
          "$.studentReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.beginDate",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.BeginDate": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.beginDate",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization.EducationOrganizationId": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization.EducationOrganizationId": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramName": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramType": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student.StudentUniqueId": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.beginDate",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.BeginDate": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.beginDate",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.LocalCourseCode": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School.SchoolId": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School.SchoolId": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SchoolYear": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SessionName": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.SectionIdentifier": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student.StudentUniqueId": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "CompetencyLevel": true,
        "CompetencyObjective": true,
        "CompetencyObjective.EducationOrganization": false,
        "CompetencyObjective.EducationOrganization.EducationOrganizationId": false,
        "CompetencyObjective.Objective": false,
        "CompetencyObjective.ObjectiveGradeLevel": false,
        "DiagnosticStatement": true,
        "GradingPeriod": true,
        "GradingPeriod.GradingPeriod": false,
        "GradingPeriod.PeriodSequence": false,
        "GradingPeriod.School": false,
        "GradingPeriod.School.SchoolId": false,
        "GradingPeriod.SchoolYear": false,
        "Student": true,
        "Student.StudentUniqueId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation": true,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.BeginDate": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization.EducationOrganizationId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization.EducationOrganizationId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramName": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramType": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student.StudentUniqueId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation": true,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.BeginDate": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.LocalCourseCode": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School.SchoolId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School.SchoolId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SchoolYear": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SessionName": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.SectionIdentifier": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student.StudentUniqueId": false,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "CompetencyLevel": "CompetencyLevel",
        "CompetencyObjective": "CompetencyObjective",
        "DiagnosticStatement": "DiagnosticStatement",
        "GradingPeriod": "GradingPeriod",
        "Student": "Student",
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation": "GeneralStudentProgramAssociation",
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation": "StudentSectionAssociation",
      }
    `);
  });

  it('should create the correct equality constraints for StudentCompetencyObjective', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentCompetencyObjective');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
          "targetJsonPath": "$.studentReference.studentUniqueId",
        },
        Object {
          "sourceJsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
          "targetJsonPath": "$.studentReference.studentUniqueId",
        },
      ]
    `);
  });
  it('should create the correct JSON path mappings for StudentLearningObjective', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentLearningObjective');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "CompetencyLevel": Array [
          "$.competencyLevelDescriptor",
        ],
        "DiagnosticStatement": Array [
          "$.diagnosticStatement",
        ],
        "GradingPeriod": Array [
          "$.gradingPeriodReference.gradingPeriodDescriptor",
          "$.gradingPeriodReference.periodSequence",
          "$.gradingPeriodReference.schoolId",
          "$.gradingPeriodReference.schoolYear",
        ],
        "GradingPeriod.GradingPeriod": Array [
          "$.gradingPeriodReference.gradingPeriodDescriptor",
        ],
        "GradingPeriod.PeriodSequence": Array [
          "$.gradingPeriodReference.periodSequence",
        ],
        "GradingPeriod.School": Array [
          "$.gradingPeriodReference.schoolId",
        ],
        "GradingPeriod.School.SchoolId": Array [
          "$.gradingPeriodReference.schoolId",
        ],
        "GradingPeriod.SchoolYear": Array [
          "$.gradingPeriodReference.schoolYear",
        ],
        "LearningObjective": Array [
          "$.learningObjectiveReference.learningObjectiveId",
          "$.learningObjectiveReference.namespace",
        ],
        "LearningObjective.LearningObjectiveId": Array [
          "$.learningObjectiveReference.learningObjectiveId",
        ],
        "LearningObjective.Namespace": Array [
          "$.learningObjectiveReference.namespace",
        ],
        "Student": Array [
          "$.studentReference.studentUniqueId",
        ],
        "Student.StudentUniqueId": Array [
          "$.studentReference.studentUniqueId",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.beginDate",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.BeginDate": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.beginDate",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization.EducationOrganizationId": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization.EducationOrganizationId": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramName": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramType": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student.StudentUniqueId": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.beginDate",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.BeginDate": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.beginDate",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.LocalCourseCode": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School.SchoolId": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School.SchoolId": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SchoolYear": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SessionName": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.SectionIdentifier": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student.StudentUniqueId": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "CompetencyLevel": true,
        "DiagnosticStatement": true,
        "GradingPeriod": true,
        "GradingPeriod.GradingPeriod": false,
        "GradingPeriod.PeriodSequence": false,
        "GradingPeriod.School": false,
        "GradingPeriod.School.SchoolId": false,
        "GradingPeriod.SchoolYear": false,
        "LearningObjective": true,
        "LearningObjective.LearningObjectiveId": false,
        "LearningObjective.Namespace": false,
        "Student": true,
        "Student.StudentUniqueId": false,
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation": true,
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.BeginDate": false,
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization": false,
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization.EducationOrganizationId": false,
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program": false,
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization": false,
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization.EducationOrganizationId": false,
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramName": false,
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramType": false,
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student": false,
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student.StudentUniqueId": false,
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation": true,
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.BeginDate": false,
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section": false,
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering": false,
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.LocalCourseCode": false,
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School": false,
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School.SchoolId": false,
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session": false,
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School": false,
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School.SchoolId": false,
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SchoolYear": false,
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SessionName": false,
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.SectionIdentifier": false,
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student": false,
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student.StudentUniqueId": false,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "CompetencyLevel": "CompetencyLevel",
        "DiagnosticStatement": "DiagnosticStatement",
        "GradingPeriod": "GradingPeriod",
        "LearningObjective": "LearningObjective",
        "Student": "Student",
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation": "GeneralStudentProgramAssociation",
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation": "StudentSectionAssociation",
      }
    `);
  });

  it('should create the correct equality constraints for StudentLearningObjective', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentLearningObjective');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
          "targetJsonPath": "$.studentReference.studentUniqueId",
        },
        Object {
          "sourceJsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
          "targetJsonPath": "$.studentReference.studentUniqueId",
        },
      ]
    `);
  });
});

describe('when generating api schema targeting tech version 6.1 with data standard 4.0', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '6.1.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-4.0/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '4.0.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEd,
      metaEdConfiguration,
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '4.0.0';

    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      await runEnhancers(metaEdPlugin, state);
    }
  });

  it('should create the correct JSON path mappings for StudentAssessment', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentAssessment');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "Accommodation": Array [
          "$.accommodations[*].accommodationDescriptor",
        ],
        "AdministrationDate": Array [
          "$.administrationDate",
        ],
        "AdministrationEndDate": Array [
          "$.administrationEndDate",
        ],
        "AdministrationEnvironment": Array [
          "$.administrationEnvironmentDescriptor",
        ],
        "AdministrationLanguage": Array [
          "$.administrationLanguageDescriptor",
        ],
        "AssessedMinutes": Array [
          "$.assessedMinutes",
        ],
        "Assessment": Array [
          "$.assessmentReference.assessmentIdentifier",
          "$.assessmentReference.namespace",
        ],
        "Assessment.AssessmentIdentifier": Array [
          "$.assessmentReference.assessmentIdentifier",
        ],
        "Assessment.Namespace": Array [
          "$.assessmentReference.namespace",
        ],
        "AssessmentPeriod.AssessmentPeriod": Array [
          "$.period.assessmentPeriodDescriptor",
        ],
        "AssessmentPeriod.BeginDate": Array [
          "$.period.beginDate",
        ],
        "AssessmentPeriod.EndDate": Array [
          "$.period.endDate",
        ],
        "EventCircumstance": Array [
          "$.eventCircumstanceDescriptor",
        ],
        "EventDescription": Array [
          "$.eventDescription",
        ],
        "PerformanceLevel.AssessmentReportingMethod": Array [
          "$.performanceLevels[*].assessmentReportingMethodDescriptor",
        ],
        "PerformanceLevel.PerformanceLevel": Array [
          "$.performanceLevels[*].performanceLevelDescriptor",
        ],
        "PerformanceLevel.PerformanceLevelIndicatorName": Array [
          "$.performanceLevels[*].performanceLevelIndicatorName",
        ],
        "PlatformType": Array [
          "$.platformTypeDescriptor",
        ],
        "ReasonNotTested": Array [
          "$.reasonNotTestedDescriptor",
        ],
        "ReportedSchool": Array [
          "$.reportedSchoolReference.schoolId",
        ],
        "ReportedSchool.SchoolId": Array [
          "$.reportedSchoolReference.schoolId",
        ],
        "ReportedSchoolIdentifier": Array [
          "$.reportedSchoolIdentifier",
        ],
        "RetestIndicator": Array [
          "$.retestIndicatorDescriptor",
        ],
        "SchoolYear": Array [
          "$.schoolYearTypeReference.schoolYear",
        ],
        "ScoreResult.AssessmentReportingMethod": Array [
          "$.scoreResults[*].assessmentReportingMethodDescriptor",
        ],
        "ScoreResult.Result": Array [
          "$.scoreResults[*].result",
        ],
        "ScoreResult.ResultDatatypeType": Array [
          "$.scoreResults[*].resultDatatypeTypeDescriptor",
        ],
        "SerialNumber": Array [
          "$.serialNumber",
        ],
        "Student": Array [
          "$.studentReference.studentUniqueId",
        ],
        "Student.StudentUniqueId": Array [
          "$.studentReference.studentUniqueId",
        ],
        "StudentAssessmentIdentifier": Array [
          "$.studentAssessmentIdentifier",
        ],
        "StudentAssessmentItem.AssessmentItem": Array [
          "$.items[*].assessmentItemReference.assessmentIdentifier",
          "$.items[*].assessmentItemReference.identificationCode",
          "$.items[*].assessmentItemReference.namespace",
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment": Array [
          "$.items[*].assessmentItemReference.assessmentIdentifier",
          "$.items[*].assessmentItemReference.namespace",
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment.AssessmentIdentifier": Array [
          "$.items[*].assessmentItemReference.assessmentIdentifier",
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment.Namespace": Array [
          "$.items[*].assessmentItemReference.namespace",
        ],
        "StudentAssessmentItem.AssessmentItem.IdentificationCode": Array [
          "$.items[*].assessmentItemReference.identificationCode",
        ],
        "StudentAssessmentItem.AssessmentItemResult": Array [
          "$.items[*].assessmentItemResultDescriptor",
        ],
        "StudentAssessmentItem.AssessmentResponse": Array [
          "$.items[*].assessmentResponse",
        ],
        "StudentAssessmentItem.DescriptiveFeedback": Array [
          "$.items[*].descriptiveFeedback",
        ],
        "StudentAssessmentItem.ItemNumber": Array [
          "$.items[*].itemNumber",
        ],
        "StudentAssessmentItem.RawScoreResult": Array [
          "$.items[*].rawScoreResult",
        ],
        "StudentAssessmentItem.ResponseIndicator": Array [
          "$.items[*].responseIndicatorDescriptor",
        ],
        "StudentAssessmentItem.TimeAssessed": Array [
          "$.items[*].timeAssessed",
        ],
        "StudentObjectiveAssessment.AdministrationDate": Array [
          "$.studentObjectiveAssessments[*].administrationDate",
        ],
        "StudentObjectiveAssessment.AdministrationEndDate": Array [
          "$.studentObjectiveAssessments[*].administrationEndDate",
        ],
        "StudentObjectiveAssessment.AssessedMinutes": Array [
          "$.studentObjectiveAssessments[*].assessedMinutes",
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment": Array [
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.identificationCode",
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment": Array [
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.AssessmentIdentifier": Array [
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.Namespace": Array [
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.IdentificationCode": Array [
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.identificationCode",
        ],
        "StudentObjectiveAssessment.PerformanceLevel.AssessmentReportingMethod": Array [
          "$.studentObjectiveAssessments[*].performanceLevels[*].assessmentReportingMethodDescriptor",
        ],
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevel": Array [
          "$.studentObjectiveAssessments[*].performanceLevels[*].performanceLevelDescriptor",
        ],
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevelIndicatorName": Array [
          "$.studentObjectiveAssessments[*].performanceLevels[*].performanceLevelIndicatorName",
        ],
        "StudentObjectiveAssessment.ScoreResult.AssessmentReportingMethod": Array [
          "$.studentObjectiveAssessments[*].scoreResults[*].assessmentReportingMethodDescriptor",
        ],
        "StudentObjectiveAssessment.ScoreResult.Result": Array [
          "$.studentObjectiveAssessments[*].scoreResults[*].result",
        ],
        "StudentObjectiveAssessment.ScoreResult.ResultDatatypeType": Array [
          "$.studentObjectiveAssessments[*].scoreResults[*].resultDatatypeTypeDescriptor",
        ],
        "WhenAssessedGradeLevel": Array [
          "$.whenAssessedGradeLevelDescriptor",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "Accommodation": true,
        "AdministrationDate": true,
        "AdministrationEndDate": true,
        "AdministrationEnvironment": true,
        "AdministrationLanguage": true,
        "AssessedMinutes": true,
        "Assessment": true,
        "Assessment.AssessmentIdentifier": false,
        "Assessment.Namespace": false,
        "AssessmentPeriod.AssessmentPeriod": true,
        "AssessmentPeriod.BeginDate": true,
        "AssessmentPeriod.EndDate": true,
        "EventCircumstance": true,
        "EventDescription": true,
        "PerformanceLevel.AssessmentReportingMethod": true,
        "PerformanceLevel.PerformanceLevel": true,
        "PerformanceLevel.PerformanceLevelIndicatorName": true,
        "PlatformType": true,
        "ReasonNotTested": true,
        "ReportedSchool": true,
        "ReportedSchool.SchoolId": false,
        "ReportedSchoolIdentifier": true,
        "RetestIndicator": true,
        "SchoolYear": true,
        "ScoreResult.AssessmentReportingMethod": true,
        "ScoreResult.Result": true,
        "ScoreResult.ResultDatatypeType": true,
        "SerialNumber": true,
        "Student": true,
        "Student.StudentUniqueId": false,
        "StudentAssessmentIdentifier": true,
        "StudentAssessmentItem.AssessmentItem": true,
        "StudentAssessmentItem.AssessmentItem.Assessment": false,
        "StudentAssessmentItem.AssessmentItem.Assessment.AssessmentIdentifier": false,
        "StudentAssessmentItem.AssessmentItem.Assessment.Namespace": false,
        "StudentAssessmentItem.AssessmentItem.IdentificationCode": false,
        "StudentAssessmentItem.AssessmentItemResult": true,
        "StudentAssessmentItem.AssessmentResponse": true,
        "StudentAssessmentItem.DescriptiveFeedback": true,
        "StudentAssessmentItem.ItemNumber": true,
        "StudentAssessmentItem.RawScoreResult": true,
        "StudentAssessmentItem.ResponseIndicator": true,
        "StudentAssessmentItem.TimeAssessed": true,
        "StudentObjectiveAssessment.AdministrationDate": true,
        "StudentObjectiveAssessment.AdministrationEndDate": true,
        "StudentObjectiveAssessment.AssessedMinutes": true,
        "StudentObjectiveAssessment.ObjectiveAssessment": true,
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment": false,
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.AssessmentIdentifier": false,
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.Namespace": false,
        "StudentObjectiveAssessment.ObjectiveAssessment.IdentificationCode": false,
        "StudentObjectiveAssessment.PerformanceLevel.AssessmentReportingMethod": true,
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevel": true,
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevelIndicatorName": true,
        "StudentObjectiveAssessment.ScoreResult.AssessmentReportingMethod": true,
        "StudentObjectiveAssessment.ScoreResult.Result": true,
        "StudentObjectiveAssessment.ScoreResult.ResultDatatypeType": true,
        "WhenAssessedGradeLevel": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "Accommodation": "Accommodation",
        "AdministrationDate": "AdministrationDate",
        "AdministrationEndDate": "AdministrationEndDate",
        "AdministrationEnvironment": "AdministrationEnvironment",
        "AdministrationLanguage": "AdministrationLanguage",
        "AssessedMinutes": "AssessedMinutes",
        "Assessment": "Assessment",
        "AssessmentPeriod.AssessmentPeriod": "AssessmentPeriod",
        "AssessmentPeriod.BeginDate": "BeginDate",
        "AssessmentPeriod.EndDate": "EndDate",
        "EventCircumstance": "EventCircumstance",
        "EventDescription": "EventDescription",
        "PerformanceLevel.AssessmentReportingMethod": "AssessmentReportingMethod",
        "PerformanceLevel.PerformanceLevel": "PerformanceLevel",
        "PerformanceLevel.PerformanceLevelIndicatorName": "PerformanceLevelIndicatorName",
        "PlatformType": "PlatformType",
        "ReasonNotTested": "ReasonNotTested",
        "ReportedSchool": "ReportedSchool",
        "ReportedSchoolIdentifier": "ReportedSchoolIdentifier",
        "RetestIndicator": "RetestIndicator",
        "SchoolYear": "SchoolYear",
        "ScoreResult.AssessmentReportingMethod": "AssessmentReportingMethod",
        "ScoreResult.Result": "Result",
        "ScoreResult.ResultDatatypeType": "ResultDatatypeType",
        "SerialNumber": "SerialNumber",
        "Student": "Student",
        "StudentAssessmentIdentifier": "StudentAssessmentIdentifier",
        "StudentAssessmentItem.AssessmentItem": "AssessmentItem",
        "StudentAssessmentItem.AssessmentItemResult": "AssessmentItemResult",
        "StudentAssessmentItem.AssessmentResponse": "AssessmentResponse",
        "StudentAssessmentItem.DescriptiveFeedback": "DescriptiveFeedback",
        "StudentAssessmentItem.ItemNumber": "ItemNumber",
        "StudentAssessmentItem.RawScoreResult": "RawScoreResult",
        "StudentAssessmentItem.ResponseIndicator": "ResponseIndicator",
        "StudentAssessmentItem.TimeAssessed": "TimeAssessed",
        "StudentObjectiveAssessment.AdministrationDate": "AdministrationDate",
        "StudentObjectiveAssessment.AdministrationEndDate": "AdministrationEndDate",
        "StudentObjectiveAssessment.AssessedMinutes": "AssessedMinutes",
        "StudentObjectiveAssessment.ObjectiveAssessment": "ObjectiveAssessment",
        "StudentObjectiveAssessment.PerformanceLevel.AssessmentReportingMethod": "AssessmentReportingMethod",
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevel": "PerformanceLevel",
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevelIndicatorName": "PerformanceLevelIndicatorName",
        "StudentObjectiveAssessment.ScoreResult.AssessmentReportingMethod": "AssessmentReportingMethod",
        "StudentObjectiveAssessment.ScoreResult.Result": "Result",
        "StudentObjectiveAssessment.ScoreResult.ResultDatatypeType": "ResultDatatypeType",
        "WhenAssessedGradeLevel": "WhenAssessedGradeLevel",
      }
    `);
  });

  it('should create the correct equality constraints for StudentAssessment', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentAssessment');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.items[*].assessmentItemReference.assessmentIdentifier",
          "targetJsonPath": "$.assessmentReference.assessmentIdentifier",
        },
        Object {
          "sourceJsonPath": "$.items[*].assessmentItemReference.namespace",
          "targetJsonPath": "$.assessmentReference.namespace",
        },
        Object {
          "sourceJsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
          "targetJsonPath": "$.assessmentReference.assessmentIdentifier",
        },
        Object {
          "sourceJsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
          "targetJsonPath": "$.assessmentReference.namespace",
        },
      ]
    `);
  });

  it('should create the correct JSON path mappings for Session', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('Session');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AcademicWeek": Array [
          "$.academicWeeks[*].academicWeekReference.schoolId",
          "$.academicWeeks[*].academicWeekReference.weekIdentifier",
        ],
        "AcademicWeek.School": Array [
          "$.academicWeeks[*].academicWeekReference.schoolId",
        ],
        "AcademicWeek.School.SchoolId": Array [
          "$.academicWeeks[*].academicWeekReference.schoolId",
        ],
        "AcademicWeek.WeekIdentifier": Array [
          "$.academicWeeks[*].academicWeekReference.weekIdentifier",
        ],
        "BeginDate": Array [
          "$.beginDate",
        ],
        "EndDate": Array [
          "$.endDate",
        ],
        "GradingPeriod": Array [
          "$.gradingPeriods[*].gradingPeriodReference.gradingPeriodDescriptor",
          "$.gradingPeriods[*].gradingPeriodReference.periodSequence",
          "$.gradingPeriods[*].gradingPeriodReference.schoolId",
          "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
        ],
        "GradingPeriod.GradingPeriod": Array [
          "$.gradingPeriods[*].gradingPeriodReference.gradingPeriodDescriptor",
        ],
        "GradingPeriod.PeriodSequence": Array [
          "$.gradingPeriods[*].gradingPeriodReference.periodSequence",
        ],
        "GradingPeriod.School": Array [
          "$.gradingPeriods[*].gradingPeriodReference.schoolId",
        ],
        "GradingPeriod.School.SchoolId": Array [
          "$.gradingPeriods[*].gradingPeriodReference.schoolId",
        ],
        "GradingPeriod.SchoolYear": Array [
          "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
        ],
        "School": Array [
          "$.schoolReference.schoolId",
        ],
        "School.SchoolId": Array [
          "$.schoolReference.schoolId",
        ],
        "SchoolYear": Array [
          "$.schoolYearTypeReference.schoolYear",
        ],
        "SessionName": Array [
          "$.sessionName",
        ],
        "Term": Array [
          "$.termDescriptor",
        ],
        "TotalInstructionalDays": Array [
          "$.totalInstructionalDays",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AcademicWeek": true,
        "AcademicWeek.School": false,
        "AcademicWeek.School.SchoolId": false,
        "AcademicWeek.WeekIdentifier": false,
        "BeginDate": true,
        "EndDate": true,
        "GradingPeriod": true,
        "GradingPeriod.GradingPeriod": false,
        "GradingPeriod.PeriodSequence": false,
        "GradingPeriod.School": false,
        "GradingPeriod.School.SchoolId": false,
        "GradingPeriod.SchoolYear": false,
        "School": true,
        "School.SchoolId": false,
        "SchoolYear": true,
        "SessionName": true,
        "Term": true,
        "TotalInstructionalDays": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AcademicWeek": "AcademicWeek",
        "BeginDate": "BeginDate",
        "EndDate": "EndDate",
        "GradingPeriod": "GradingPeriod",
        "School": "School",
        "SchoolYear": "SchoolYear",
        "SessionName": "SessionName",
        "Term": "Term",
        "TotalInstructionalDays": "TotalInstructionalDays",
      }
    `);
  });

  it('should create the correct equality constraints for Session', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('Session');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
          "targetJsonPath": "$.schoolYearTypeReference.schoolYear",
        },
        Object {
          "sourceJsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolId",
          "targetJsonPath": "$.schoolReference.schoolId",
        },
      ]
    `);
  });

  it('should create the correct JSON path mappings for StudentCompetencyObjective', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentCompetencyObjective');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "CompetencyLevel": Array [
          "$.competencyLevelDescriptor",
        ],
        "CompetencyObjective": Array [
          "$.competencyObjectiveReference.educationOrganizationId",
          "$.competencyObjectiveReference.objective",
          "$.competencyObjectiveReference.objectiveGradeLevelDescriptor",
        ],
        "CompetencyObjective.EducationOrganization": Array [
          "$.competencyObjectiveReference.educationOrganizationId",
        ],
        "CompetencyObjective.EducationOrganization.EducationOrganizationId": Array [
          "$.competencyObjectiveReference.educationOrganizationId",
        ],
        "CompetencyObjective.Objective": Array [
          "$.competencyObjectiveReference.objective",
        ],
        "CompetencyObjective.ObjectiveGradeLevel": Array [
          "$.competencyObjectiveReference.objectiveGradeLevelDescriptor",
        ],
        "DiagnosticStatement": Array [
          "$.diagnosticStatement",
        ],
        "GradingPeriod": Array [
          "$.gradingPeriodReference.gradingPeriodDescriptor",
          "$.gradingPeriodReference.periodSequence",
          "$.gradingPeriodReference.schoolId",
          "$.gradingPeriodReference.schoolYear",
        ],
        "GradingPeriod.GradingPeriod": Array [
          "$.gradingPeriodReference.gradingPeriodDescriptor",
        ],
        "GradingPeriod.PeriodSequence": Array [
          "$.gradingPeriodReference.periodSequence",
        ],
        "GradingPeriod.School": Array [
          "$.gradingPeriodReference.schoolId",
        ],
        "GradingPeriod.School.SchoolId": Array [
          "$.gradingPeriodReference.schoolId",
        ],
        "GradingPeriod.SchoolYear": Array [
          "$.gradingPeriodReference.schoolYear",
        ],
        "Student": Array [
          "$.studentReference.studentUniqueId",
        ],
        "Student.StudentUniqueId": Array [
          "$.studentReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.beginDate",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.BeginDate": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.beginDate",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization.EducationOrganizationId": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization.EducationOrganizationId": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramName": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramType": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student.StudentUniqueId": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.beginDate",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.BeginDate": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.beginDate",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.LocalCourseCode": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School.SchoolId": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School.SchoolId": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SchoolYear": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SessionName": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.SectionIdentifier": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student.StudentUniqueId": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "CompetencyLevel": true,
        "CompetencyObjective": true,
        "CompetencyObjective.EducationOrganization": false,
        "CompetencyObjective.EducationOrganization.EducationOrganizationId": false,
        "CompetencyObjective.Objective": false,
        "CompetencyObjective.ObjectiveGradeLevel": false,
        "DiagnosticStatement": true,
        "GradingPeriod": true,
        "GradingPeriod.GradingPeriod": false,
        "GradingPeriod.PeriodSequence": false,
        "GradingPeriod.School": false,
        "GradingPeriod.School.SchoolId": false,
        "GradingPeriod.SchoolYear": false,
        "Student": true,
        "Student.StudentUniqueId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation": true,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.BeginDate": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization.EducationOrganizationId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization.EducationOrganizationId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramName": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramType": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student.StudentUniqueId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation": true,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.BeginDate": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.LocalCourseCode": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School.SchoolId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School.SchoolId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SchoolYear": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SessionName": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.SectionIdentifier": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student.StudentUniqueId": false,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "CompetencyLevel": "CompetencyLevel",
        "CompetencyObjective": "CompetencyObjective",
        "DiagnosticStatement": "DiagnosticStatement",
        "GradingPeriod": "GradingPeriod",
        "Student": "Student",
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation": "GeneralStudentProgramAssociation",
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation": "StudentSectionAssociation",
      }
    `);
  });

  it('should create the correct equality constraints for StudentCompetencyObjective', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentCompetencyObjective');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
          "targetJsonPath": "$.studentReference.studentUniqueId",
        },
        Object {
          "sourceJsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
          "targetJsonPath": "$.studentReference.studentUniqueId",
        },
      ]
    `);
  });
});

describe('when generating api schema targeting tech version 7.0 with data standard 5.0-pre.1', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '7.0.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-5.0-pre.1/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '4.0.0',
          description: '',
        },
      ],
    };

    const state: State = {
      ...newState(),
      metaEd,
      metaEdConfiguration,
      metaEdPlugins: metaEdPlugins(),
    };
    state.metaEd.dataStandardVersion = '4.0.0';

    setupPlugins(state);
    loadFiles(state);
    loadFileIndex(state);
    buildParseTree(buildMetaEd, state);
    await walkBuilders(state);
    initializeNamespaces(state);
    // eslint-disable-next-line no-restricted-syntax
    for (const metaEdPlugin of state.metaEdPlugins) {
      await runEnhancers(metaEdPlugin, state);
    }
  });

  it('should create the correct JSON path mappings for StudentAssessment', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentAssessment');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "Accommodation": Array [
          "$.accommodations[*].accommodationDescriptor",
        ],
        "AdministrationDate": Array [
          "$.administrationDate",
        ],
        "AdministrationEndDate": Array [
          "$.administrationEndDate",
        ],
        "AdministrationEnvironment": Array [
          "$.administrationEnvironmentDescriptor",
        ],
        "AdministrationLanguage": Array [
          "$.administrationLanguageDescriptor",
        ],
        "AssessedMinutes": Array [
          "$.assessedMinutes",
        ],
        "Assessment": Array [
          "$.assessmentReference.assessmentIdentifier",
          "$.assessmentReference.namespace",
        ],
        "Assessment.AssessmentIdentifier": Array [
          "$.assessmentReference.assessmentIdentifier",
        ],
        "Assessment.Namespace": Array [
          "$.assessmentReference.namespace",
        ],
        "AssessmentPeriod.AssessmentPeriod": Array [
          "$.period.assessmentPeriodDescriptor",
        ],
        "AssessmentPeriod.BeginDate": Array [
          "$.period.beginDate",
        ],
        "AssessmentPeriod.EndDate": Array [
          "$.period.endDate",
        ],
        "EventCircumstance": Array [
          "$.eventCircumstanceDescriptor",
        ],
        "EventDescription": Array [
          "$.eventDescription",
        ],
        "PerformanceLevel.AssessmentReportingMethod": Array [
          "$.performanceLevels[*].assessmentReportingMethodDescriptor",
        ],
        "PerformanceLevel.PerformanceLevel": Array [
          "$.performanceLevels[*].performanceLevelDescriptor",
        ],
        "PerformanceLevel.PerformanceLevelIndicatorName": Array [
          "$.performanceLevels[*].performanceLevelIndicatorName",
        ],
        "PlatformType": Array [
          "$.platformTypeDescriptor",
        ],
        "ReasonNotTested": Array [
          "$.reasonNotTestedDescriptor",
        ],
        "ReportedSchool": Array [
          "$.reportedSchoolReference.schoolId",
        ],
        "ReportedSchool.SchoolId": Array [
          "$.reportedSchoolReference.schoolId",
        ],
        "ReportedSchoolIdentifier": Array [
          "$.reportedSchoolIdentifier",
        ],
        "RetestIndicator": Array [
          "$.retestIndicatorDescriptor",
        ],
        "SchoolYear": Array [
          "$.schoolYearTypeReference.schoolYear",
        ],
        "ScoreResult.AssessmentReportingMethod": Array [
          "$.scoreResults[*].assessmentReportingMethodDescriptor",
        ],
        "ScoreResult.Result": Array [
          "$.scoreResults[*].result",
        ],
        "ScoreResult.ResultDatatypeType": Array [
          "$.scoreResults[*].resultDatatypeTypeDescriptor",
        ],
        "SerialNumber": Array [
          "$.serialNumber",
        ],
        "Student": Array [
          "$.studentReference.studentUniqueId",
        ],
        "Student.StudentUniqueId": Array [
          "$.studentReference.studentUniqueId",
        ],
        "StudentAssessmentIdentifier": Array [
          "$.studentAssessmentIdentifier",
        ],
        "StudentAssessmentItem.AssessmentItem": Array [
          "$.items[*].assessmentItemReference.assessmentIdentifier",
          "$.items[*].assessmentItemReference.identificationCode",
          "$.items[*].assessmentItemReference.namespace",
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment": Array [
          "$.items[*].assessmentItemReference.assessmentIdentifier",
          "$.items[*].assessmentItemReference.namespace",
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment.AssessmentIdentifier": Array [
          "$.items[*].assessmentItemReference.assessmentIdentifier",
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment.Namespace": Array [
          "$.items[*].assessmentItemReference.namespace",
        ],
        "StudentAssessmentItem.AssessmentItem.IdentificationCode": Array [
          "$.items[*].assessmentItemReference.identificationCode",
        ],
        "StudentAssessmentItem.AssessmentItemResult": Array [
          "$.items[*].assessmentItemResultDescriptor",
        ],
        "StudentAssessmentItem.AssessmentResponse": Array [
          "$.items[*].assessmentResponse",
        ],
        "StudentAssessmentItem.DescriptiveFeedback": Array [
          "$.items[*].descriptiveFeedback",
        ],
        "StudentAssessmentItem.ItemNumber": Array [
          "$.items[*].itemNumber",
        ],
        "StudentAssessmentItem.RawScoreResult": Array [
          "$.items[*].rawScoreResult",
        ],
        "StudentAssessmentItem.ResponseIndicator": Array [
          "$.items[*].responseIndicatorDescriptor",
        ],
        "StudentAssessmentItem.TimeAssessed": Array [
          "$.items[*].timeAssessed",
        ],
        "StudentObjectiveAssessment.AdministrationDate": Array [
          "$.studentObjectiveAssessments[*].administrationDate",
        ],
        "StudentObjectiveAssessment.AdministrationEndDate": Array [
          "$.studentObjectiveAssessments[*].administrationEndDate",
        ],
        "StudentObjectiveAssessment.AssessedMinutes": Array [
          "$.studentObjectiveAssessments[*].assessedMinutes",
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment": Array [
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.identificationCode",
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment": Array [
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.AssessmentIdentifier": Array [
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.Namespace": Array [
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.IdentificationCode": Array [
          "$.studentObjectiveAssessments[*].objectiveAssessmentReference.identificationCode",
        ],
        "StudentObjectiveAssessment.PerformanceLevel.AssessmentReportingMethod": Array [
          "$.studentObjectiveAssessments[*].performanceLevels[*].assessmentReportingMethodDescriptor",
        ],
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevel": Array [
          "$.studentObjectiveAssessments[*].performanceLevels[*].performanceLevelDescriptor",
        ],
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevelIndicatorName": Array [
          "$.studentObjectiveAssessments[*].performanceLevels[*].performanceLevelIndicatorName",
        ],
        "StudentObjectiveAssessment.ScoreResult.AssessmentReportingMethod": Array [
          "$.studentObjectiveAssessments[*].scoreResults[*].assessmentReportingMethodDescriptor",
        ],
        "StudentObjectiveAssessment.ScoreResult.Result": Array [
          "$.studentObjectiveAssessments[*].scoreResults[*].result",
        ],
        "StudentObjectiveAssessment.ScoreResult.ResultDatatypeType": Array [
          "$.studentObjectiveAssessments[*].scoreResults[*].resultDatatypeTypeDescriptor",
        ],
        "WhenAssessedGradeLevel": Array [
          "$.whenAssessedGradeLevelDescriptor",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "Accommodation": true,
        "AdministrationDate": true,
        "AdministrationEndDate": true,
        "AdministrationEnvironment": true,
        "AdministrationLanguage": true,
        "AssessedMinutes": true,
        "Assessment": true,
        "Assessment.AssessmentIdentifier": false,
        "Assessment.Namespace": false,
        "AssessmentPeriod.AssessmentPeriod": true,
        "AssessmentPeriod.BeginDate": true,
        "AssessmentPeriod.EndDate": true,
        "EventCircumstance": true,
        "EventDescription": true,
        "PerformanceLevel.AssessmentReportingMethod": true,
        "PerformanceLevel.PerformanceLevel": true,
        "PerformanceLevel.PerformanceLevelIndicatorName": true,
        "PlatformType": true,
        "ReasonNotTested": true,
        "ReportedSchool": true,
        "ReportedSchool.SchoolId": false,
        "ReportedSchoolIdentifier": true,
        "RetestIndicator": true,
        "SchoolYear": true,
        "ScoreResult.AssessmentReportingMethod": true,
        "ScoreResult.Result": true,
        "ScoreResult.ResultDatatypeType": true,
        "SerialNumber": true,
        "Student": true,
        "Student.StudentUniqueId": false,
        "StudentAssessmentIdentifier": true,
        "StudentAssessmentItem.AssessmentItem": true,
        "StudentAssessmentItem.AssessmentItem.Assessment": false,
        "StudentAssessmentItem.AssessmentItem.Assessment.AssessmentIdentifier": false,
        "StudentAssessmentItem.AssessmentItem.Assessment.Namespace": false,
        "StudentAssessmentItem.AssessmentItem.IdentificationCode": false,
        "StudentAssessmentItem.AssessmentItemResult": true,
        "StudentAssessmentItem.AssessmentResponse": true,
        "StudentAssessmentItem.DescriptiveFeedback": true,
        "StudentAssessmentItem.ItemNumber": true,
        "StudentAssessmentItem.RawScoreResult": true,
        "StudentAssessmentItem.ResponseIndicator": true,
        "StudentAssessmentItem.TimeAssessed": true,
        "StudentObjectiveAssessment.AdministrationDate": true,
        "StudentObjectiveAssessment.AdministrationEndDate": true,
        "StudentObjectiveAssessment.AssessedMinutes": true,
        "StudentObjectiveAssessment.ObjectiveAssessment": true,
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment": false,
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.AssessmentIdentifier": false,
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.Namespace": false,
        "StudentObjectiveAssessment.ObjectiveAssessment.IdentificationCode": false,
        "StudentObjectiveAssessment.PerformanceLevel.AssessmentReportingMethod": true,
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevel": true,
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevelIndicatorName": true,
        "StudentObjectiveAssessment.ScoreResult.AssessmentReportingMethod": true,
        "StudentObjectiveAssessment.ScoreResult.Result": true,
        "StudentObjectiveAssessment.ScoreResult.ResultDatatypeType": true,
        "WhenAssessedGradeLevel": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "Accommodation": "Accommodation",
        "AdministrationDate": "AdministrationDate",
        "AdministrationEndDate": "AdministrationEndDate",
        "AdministrationEnvironment": "AdministrationEnvironment",
        "AdministrationLanguage": "AdministrationLanguage",
        "AssessedMinutes": "AssessedMinutes",
        "Assessment": "Assessment",
        "AssessmentPeriod.AssessmentPeriod": "AssessmentPeriod",
        "AssessmentPeriod.BeginDate": "BeginDate",
        "AssessmentPeriod.EndDate": "EndDate",
        "EventCircumstance": "EventCircumstance",
        "EventDescription": "EventDescription",
        "PerformanceLevel.AssessmentReportingMethod": "AssessmentReportingMethod",
        "PerformanceLevel.PerformanceLevel": "PerformanceLevel",
        "PerformanceLevel.PerformanceLevelIndicatorName": "PerformanceLevelIndicatorName",
        "PlatformType": "PlatformType",
        "ReasonNotTested": "ReasonNotTested",
        "ReportedSchool": "ReportedSchool",
        "ReportedSchoolIdentifier": "ReportedSchoolIdentifier",
        "RetestIndicator": "RetestIndicator",
        "SchoolYear": "SchoolYear",
        "ScoreResult.AssessmentReportingMethod": "AssessmentReportingMethod",
        "ScoreResult.Result": "Result",
        "ScoreResult.ResultDatatypeType": "ResultDatatypeType",
        "SerialNumber": "SerialNumber",
        "Student": "Student",
        "StudentAssessmentIdentifier": "StudentAssessmentIdentifier",
        "StudentAssessmentItem.AssessmentItem": "AssessmentItem",
        "StudentAssessmentItem.AssessmentItemResult": "AssessmentItemResult",
        "StudentAssessmentItem.AssessmentResponse": "AssessmentResponse",
        "StudentAssessmentItem.DescriptiveFeedback": "DescriptiveFeedback",
        "StudentAssessmentItem.ItemNumber": "ItemNumber",
        "StudentAssessmentItem.RawScoreResult": "RawScoreResult",
        "StudentAssessmentItem.ResponseIndicator": "ResponseIndicator",
        "StudentAssessmentItem.TimeAssessed": "TimeAssessed",
        "StudentObjectiveAssessment.AdministrationDate": "AdministrationDate",
        "StudentObjectiveAssessment.AdministrationEndDate": "AdministrationEndDate",
        "StudentObjectiveAssessment.AssessedMinutes": "AssessedMinutes",
        "StudentObjectiveAssessment.ObjectiveAssessment": "ObjectiveAssessment",
        "StudentObjectiveAssessment.PerformanceLevel.AssessmentReportingMethod": "AssessmentReportingMethod",
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevel": "PerformanceLevel",
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevelIndicatorName": "PerformanceLevelIndicatorName",
        "StudentObjectiveAssessment.ScoreResult.AssessmentReportingMethod": "AssessmentReportingMethod",
        "StudentObjectiveAssessment.ScoreResult.Result": "Result",
        "StudentObjectiveAssessment.ScoreResult.ResultDatatypeType": "ResultDatatypeType",
        "WhenAssessedGradeLevel": "WhenAssessedGradeLevel",
      }
    `);
  });

  it('should create the correct equality constraints for StudentAssessment', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentAssessment');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.items[*].assessmentItemReference.assessmentIdentifier",
          "targetJsonPath": "$.assessmentReference.assessmentIdentifier",
        },
        Object {
          "sourceJsonPath": "$.items[*].assessmentItemReference.namespace",
          "targetJsonPath": "$.assessmentReference.namespace",
        },
        Object {
          "sourceJsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
          "targetJsonPath": "$.assessmentReference.assessmentIdentifier",
        },
        Object {
          "sourceJsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
          "targetJsonPath": "$.assessmentReference.namespace",
        },
      ]
    `);
  });

  it('should create the correct JSON path mappings for Session', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('Session');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AcademicWeek": Array [
          "$.academicWeeks[*].academicWeekReference.schoolId",
          "$.academicWeeks[*].academicWeekReference.weekIdentifier",
        ],
        "AcademicWeek.School": Array [
          "$.academicWeeks[*].academicWeekReference.schoolId",
        ],
        "AcademicWeek.School.SchoolId": Array [
          "$.academicWeeks[*].academicWeekReference.schoolId",
        ],
        "AcademicWeek.WeekIdentifier": Array [
          "$.academicWeeks[*].academicWeekReference.weekIdentifier",
        ],
        "BeginDate": Array [
          "$.beginDate",
        ],
        "EndDate": Array [
          "$.endDate",
        ],
        "GradingPeriod": Array [
          "$.gradingPeriods[*].gradingPeriodReference.gradingPeriodDescriptor",
          "$.gradingPeriods[*].gradingPeriodReference.periodSequence",
          "$.gradingPeriods[*].gradingPeriodReference.schoolId",
          "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
        ],
        "GradingPeriod.GradingPeriod": Array [
          "$.gradingPeriods[*].gradingPeriodReference.gradingPeriodDescriptor",
        ],
        "GradingPeriod.PeriodSequence": Array [
          "$.gradingPeriods[*].gradingPeriodReference.periodSequence",
        ],
        "GradingPeriod.School": Array [
          "$.gradingPeriods[*].gradingPeriodReference.schoolId",
        ],
        "GradingPeriod.School.SchoolId": Array [
          "$.gradingPeriods[*].gradingPeriodReference.schoolId",
        ],
        "GradingPeriod.SchoolYear": Array [
          "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
        ],
        "School": Array [
          "$.schoolReference.schoolId",
        ],
        "School.SchoolId": Array [
          "$.schoolReference.schoolId",
        ],
        "SchoolYear": Array [
          "$.schoolYearTypeReference.schoolYear",
        ],
        "SessionName": Array [
          "$.sessionName",
        ],
        "Term": Array [
          "$.termDescriptor",
        ],
        "TotalInstructionalDays": Array [
          "$.totalInstructionalDays",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AcademicWeek": true,
        "AcademicWeek.School": false,
        "AcademicWeek.School.SchoolId": false,
        "AcademicWeek.WeekIdentifier": false,
        "BeginDate": true,
        "EndDate": true,
        "GradingPeriod": true,
        "GradingPeriod.GradingPeriod": false,
        "GradingPeriod.PeriodSequence": false,
        "GradingPeriod.School": false,
        "GradingPeriod.School.SchoolId": false,
        "GradingPeriod.SchoolYear": false,
        "School": true,
        "School.SchoolId": false,
        "SchoolYear": true,
        "SessionName": true,
        "Term": true,
        "TotalInstructionalDays": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AcademicWeek": "AcademicWeek",
        "BeginDate": "BeginDate",
        "EndDate": "EndDate",
        "GradingPeriod": "GradingPeriod",
        "School": "School",
        "SchoolYear": "SchoolYear",
        "SessionName": "SessionName",
        "Term": "Term",
        "TotalInstructionalDays": "TotalInstructionalDays",
      }
    `);
  });

  it('should create the correct equality constraints for Session', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('Session');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
          "targetJsonPath": "$.schoolYearTypeReference.schoolYear",
        },
        Object {
          "sourceJsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolId",
          "targetJsonPath": "$.schoolReference.schoolId",
        },
      ]
    `);
  });

  it('should create the correct JSON path mappings for StudentCompetencyObjective', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentCompetencyObjective');
    const mappings: Snapshotable = snapshotify(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "CompetencyLevel": Array [
          "$.competencyLevelDescriptor",
        ],
        "CompetencyObjective": Array [
          "$.competencyObjectiveReference.educationOrganizationId",
          "$.competencyObjectiveReference.objective",
          "$.competencyObjectiveReference.objectiveGradeLevelDescriptor",
        ],
        "CompetencyObjective.EducationOrganization": Array [
          "$.competencyObjectiveReference.educationOrganizationId",
        ],
        "CompetencyObjective.EducationOrganization.EducationOrganizationId": Array [
          "$.competencyObjectiveReference.educationOrganizationId",
        ],
        "CompetencyObjective.Objective": Array [
          "$.competencyObjectiveReference.objective",
        ],
        "CompetencyObjective.ObjectiveGradeLevel": Array [
          "$.competencyObjectiveReference.objectiveGradeLevelDescriptor",
        ],
        "DiagnosticStatement": Array [
          "$.diagnosticStatement",
        ],
        "GradingPeriod": Array [
          "$.gradingPeriodReference.gradingPeriodDescriptor",
          "$.gradingPeriodReference.periodSequence",
          "$.gradingPeriodReference.schoolId",
          "$.gradingPeriodReference.schoolYear",
        ],
        "GradingPeriod.GradingPeriod": Array [
          "$.gradingPeriodReference.gradingPeriodDescriptor",
        ],
        "GradingPeriod.PeriodSequence": Array [
          "$.gradingPeriodReference.periodSequence",
        ],
        "GradingPeriod.School": Array [
          "$.gradingPeriodReference.schoolId",
        ],
        "GradingPeriod.School.SchoolId": Array [
          "$.gradingPeriodReference.schoolId",
        ],
        "GradingPeriod.SchoolYear": Array [
          "$.gradingPeriodReference.schoolYear",
        ],
        "Student": Array [
          "$.studentReference.studentUniqueId",
        ],
        "Student.StudentUniqueId": Array [
          "$.studentReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.beginDate",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.BeginDate": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.beginDate",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization.EducationOrganizationId": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization.EducationOrganizationId": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramName": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramType": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student.StudentUniqueId": Array [
          "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.beginDate",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.BeginDate": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.beginDate",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.LocalCourseCode": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School.SchoolId": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School.SchoolId": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SchoolYear": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SessionName": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.SectionIdentifier": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student.StudentUniqueId": Array [
          "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "CompetencyLevel": true,
        "CompetencyObjective": true,
        "CompetencyObjective.EducationOrganization": false,
        "CompetencyObjective.EducationOrganization.EducationOrganizationId": false,
        "CompetencyObjective.Objective": false,
        "CompetencyObjective.ObjectiveGradeLevel": false,
        "DiagnosticStatement": true,
        "GradingPeriod": true,
        "GradingPeriod.GradingPeriod": false,
        "GradingPeriod.PeriodSequence": false,
        "GradingPeriod.School": false,
        "GradingPeriod.School.SchoolId": false,
        "GradingPeriod.SchoolYear": false,
        "Student": true,
        "Student.StudentUniqueId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation": true,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.BeginDate": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization.EducationOrganizationId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization.EducationOrganizationId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramName": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramType": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student.StudentUniqueId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation": true,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.BeginDate": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.LocalCourseCode": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School.SchoolId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School.SchoolId": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SchoolYear": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SessionName": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.SectionIdentifier": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student": false,
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student.StudentUniqueId": false,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "CompetencyLevel": "CompetencyLevel",
        "CompetencyObjective": "CompetencyObjective",
        "DiagnosticStatement": "DiagnosticStatement",
        "GradingPeriod": "GradingPeriod",
        "Student": "Student",
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation": "GeneralStudentProgramAssociation",
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation": "StudentSectionAssociation",
      }
    `);
  });

  it('should create the correct equality constraints for StudentCompetencyObjective', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentCompetencyObjective');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
          "targetJsonPath": "$.studentReference.studentUniqueId",
        },
        Object {
          "sourceJsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
          "targetJsonPath": "$.studentReference.studentUniqueId",
        },
      ]
    `);
  });
});
