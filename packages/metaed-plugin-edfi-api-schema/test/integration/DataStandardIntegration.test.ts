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
    expect(entity?.data.edfiApiSchema.allJsonPathsMapping).toMatchInlineSnapshot(`
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
    expect(entity?.data.edfiApiSchema.allJsonPathsMapping).toMatchInlineSnapshot(`
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
    expect(entity?.data.edfiApiSchema.allJsonPathsMapping).toMatchInlineSnapshot(`
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
    expect(entity?.data.edfiApiSchema.allJsonPathsMapping).toMatchInlineSnapshot(`
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
    expect(entity?.data.edfiApiSchema.allJsonPathsMapping).toMatchInlineSnapshot(`
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
    expect(entity?.data.edfiApiSchema.allJsonPathsMapping).toMatchInlineSnapshot(`
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
    expect(entity?.data.edfiApiSchema.allJsonPathsMapping).toMatchInlineSnapshot(`
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
    expect(entity?.data.edfiApiSchema.allJsonPathsMapping).toMatchInlineSnapshot(`
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
    expect(entity?.data.edfiApiSchema.allJsonPathsMapping).toMatchInlineSnapshot(`
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
    expect(entity?.data.edfiApiSchema.allJsonPathsMapping).toMatchInlineSnapshot(`
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
