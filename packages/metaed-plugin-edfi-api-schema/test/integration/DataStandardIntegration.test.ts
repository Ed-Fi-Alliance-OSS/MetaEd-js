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
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.accommodations[*].accommodationDescriptor",
            "propertyName": "Accommodation",
          },
        ],
        "AdministrationDate": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.administrationDate",
            "propertyName": "AdministrationDate",
          },
        ],
        "AdministrationEndDate": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.administrationEndDate",
            "propertyName": "AdministrationEndDate",
          },
        ],
        "AdministrationEnvironment": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.administrationEnvironmentDescriptor",
            "propertyName": "AdministrationEnvironment",
          },
        ],
        "AdministrationLanguage": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.administrationLanguageDescriptor",
            "propertyName": "Language",
          },
        ],
        "Assessment": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.assessmentReference.assessmentIdentifier",
            "propertyName": "Assessment",
          },
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.assessmentReference.namespace",
            "propertyName": "Assessment",
          },
        ],
        "Assessment.AssessmentIdentifier": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.assessmentReference.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
        ],
        "Assessment.Namespace": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.assessmentReference.namespace",
            "propertyName": "Namespace",
          },
        ],
        "EventCircumstance": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.eventCircumstanceDescriptor",
            "propertyName": "EventCircumstance",
          },
        ],
        "EventDescription": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.eventDescription",
            "propertyName": "Description",
          },
        ],
        "PerformanceLevel.AssessmentReportingMethod": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.performanceLevels[*].assessmentReportingMethodDescriptor",
            "propertyName": "AssessmentReportingMethod",
          },
        ],
        "PerformanceLevel.PerformanceLevel": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.performanceLevels[*].performanceLevelDescriptor",
            "propertyName": "PerformanceLevel",
          },
        ],
        "PerformanceLevel.PerformanceLevelMet": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.performanceLevels[*].performanceLevelMet",
            "propertyName": "PerformanceLevelMet",
          },
        ],
        "PlatformType": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.platformTypeDescriptor",
            "propertyName": "PlatformType",
          },
        ],
        "ReasonNotTested": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.reasonNotTestedDescriptor",
            "propertyName": "ReasonNotTested",
          },
        ],
        "RetestIndicator": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.retestIndicatorDescriptor",
            "propertyName": "RetestIndicator",
          },
        ],
        "SchoolYear": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.schoolYearTypeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "ScoreResult.AssessmentReportingMethod": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.scoreResults[*].assessmentReportingMethodDescriptor",
            "propertyName": "AssessmentReportingMethod",
          },
        ],
        "ScoreResult.Result": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.scoreResults[*].result",
            "propertyName": "Result",
          },
        ],
        "ScoreResult.ResultDatatypeType": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.scoreResults[*].resultDatatypeTypeDescriptor",
            "propertyName": "ResultDatatypeType",
          },
        ],
        "SerialNumber": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.serialNumber",
            "propertyName": "SerialNumber",
          },
        ],
        "Student": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.studentReference.studentUniqueId",
            "propertyName": "Student",
          },
        ],
        "Student.StudentUniqueId": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.studentReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentAssessmentIdentifier": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.studentAssessmentIdentifier",
            "propertyName": "StudentAssessmentIdentifier",
          },
        ],
        "StudentAssessmentItem.AssessmentItem": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].assessmentItemReference.assessmentIdentifier",
            "propertyName": "AssessmentItem",
          },
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].assessmentItemReference.identificationCode",
            "propertyName": "AssessmentItem",
          },
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].assessmentItemReference.namespace",
            "propertyName": "AssessmentItem",
          },
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.items[*].assessmentItemReference.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.items[*].assessmentItemReference.namespace",
            "propertyName": "Namespace",
          },
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment.AssessmentIdentifier": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.items[*].assessmentItemReference.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment.Namespace": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.items[*].assessmentItemReference.namespace",
            "propertyName": "Namespace",
          },
        ],
        "StudentAssessmentItem.AssessmentItem.IdentificationCode": Array [
          Object {
            "entityName": "AssessmentItem",
            "jsonPath": "$.items[*].assessmentItemReference.identificationCode",
            "propertyName": "IdentificationCode",
          },
        ],
        "StudentAssessmentItem.AssessmentItemResult": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].assessmentItemResultDescriptor",
            "propertyName": "AssessmentItemResult",
          },
        ],
        "StudentAssessmentItem.AssessmentResponse": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].assessmentResponse",
            "propertyName": "AssessmentResponse",
          },
        ],
        "StudentAssessmentItem.DescriptiveFeedback": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].descriptiveFeedback",
            "propertyName": "DescriptiveFeedback",
          },
        ],
        "StudentAssessmentItem.RawScoreResult": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].rawScoreResult",
            "propertyName": "RawScoreResult",
          },
        ],
        "StudentAssessmentItem.ResponseIndicator": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].responseIndicatorDescriptor",
            "propertyName": "ResponseIndicator",
          },
        ],
        "StudentAssessmentItem.TimeAssessed": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].timeAssessed",
            "propertyName": "TimeAssessed",
          },
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment": Array [
          Object {
            "entityName": "StudentObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
            "propertyName": "ObjectiveAssessment",
          },
          Object {
            "entityName": "StudentObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.identificationCode",
            "propertyName": "ObjectiveAssessment",
          },
          Object {
            "entityName": "StudentObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
            "propertyName": "ObjectiveAssessment",
          },
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
            "propertyName": "Namespace",
          },
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.AssessmentIdentifier": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.Namespace": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
            "propertyName": "Namespace",
          },
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.IdentificationCode": Array [
          Object {
            "entityName": "ObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.identificationCode",
            "propertyName": "IdentificationCode",
          },
        ],
        "StudentObjectiveAssessment.PerformanceLevel.AssessmentReportingMethod": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.studentObjectiveAssessments[*].performanceLevels[*].assessmentReportingMethodDescriptor",
            "propertyName": "AssessmentReportingMethod",
          },
        ],
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevel": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.studentObjectiveAssessments[*].performanceLevels[*].performanceLevelDescriptor",
            "propertyName": "PerformanceLevel",
          },
        ],
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevelMet": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.studentObjectiveAssessments[*].performanceLevels[*].performanceLevelMet",
            "propertyName": "PerformanceLevelMet",
          },
        ],
        "StudentObjectiveAssessment.ScoreResult.AssessmentReportingMethod": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.studentObjectiveAssessments[*].scoreResults[*].assessmentReportingMethodDescriptor",
            "propertyName": "AssessmentReportingMethod",
          },
        ],
        "StudentObjectiveAssessment.ScoreResult.Result": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.studentObjectiveAssessments[*].scoreResults[*].result",
            "propertyName": "Result",
          },
        ],
        "StudentObjectiveAssessment.ScoreResult.ResultDatatypeType": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.studentObjectiveAssessments[*].scoreResults[*].resultDatatypeTypeDescriptor",
            "propertyName": "ResultDatatypeType",
          },
        ],
        "WhenAssessedGradeLevel": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.whenAssessedGradeLevelDescriptor",
            "propertyName": "GradeLevel",
          },
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
          Object {
            "entityName": "Session",
            "jsonPath": "$.academicWeeks[*].academicWeekReference.schoolId",
            "propertyName": "AcademicWeek",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.academicWeeks[*].academicWeekReference.weekIdentifier",
            "propertyName": "AcademicWeek",
          },
        ],
        "AcademicWeek.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.academicWeeks[*].academicWeekReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "AcademicWeek.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.academicWeeks[*].academicWeekReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "AcademicWeek.WeekIdentifier": Array [
          Object {
            "entityName": "AcademicWeek",
            "jsonPath": "$.academicWeeks[*].academicWeekReference.weekIdentifier",
            "propertyName": "WeekIdentifier",
          },
        ],
        "BeginDate": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.beginDate",
            "propertyName": "BeginDate",
          },
        ],
        "EndDate": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.endDate",
            "propertyName": "EndDate",
          },
        ],
        "GradingPeriod": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.gradingPeriodDescriptor",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.periodSequence",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolId",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
            "propertyName": "GradingPeriod",
          },
        ],
        "GradingPeriod.GradingPeriod": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.gradingPeriodDescriptor",
            "propertyName": "GradingPeriod",
          },
        ],
        "GradingPeriod.PeriodSequence": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.periodSequence",
            "propertyName": "PeriodSequence",
          },
        ],
        "GradingPeriod.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "GradingPeriod.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "GradingPeriod.SchoolYear": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "School": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.schoolReference.schoolId",
            "propertyName": "School",
          },
        ],
        "School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.schoolReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "SchoolYear": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.schoolYearTypeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "SessionName": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "Term": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.termDescriptor",
            "propertyName": "Term",
          },
        ],
        "TotalInstructionalDays": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.totalInstructionalDays",
            "propertyName": "TotalInstructionalDays",
          },
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
        Object {
          "sourceJsonPath": "$.schoolReference.schoolId",
          "targetJsonPath": "$.academicWeeks[*].academicWeekReference.schoolId",
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
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.competencyLevelDescriptor",
            "propertyName": "CompetencyLevel",
          },
        ],
        "CompetencyObjective": Array [
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.educationOrganizationId",
            "propertyName": "CompetencyObjective",
          },
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.objective",
            "propertyName": "CompetencyObjective",
          },
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.objectiveGradeLevelDescriptor",
            "propertyName": "CompetencyObjective",
          },
        ],
        "CompetencyObjective.EducationOrganization": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.educationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "CompetencyObjective.EducationOrganization.EducationOrganizationId": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.educationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "CompetencyObjective.Objective": Array [
          Object {
            "entityName": "CompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.objective",
            "propertyName": "Objective",
          },
        ],
        "CompetencyObjective.ObjectiveGradeLevel": Array [
          Object {
            "entityName": "CompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.objectiveGradeLevelDescriptor",
            "propertyName": "GradeLevel",
          },
        ],
        "DiagnosticStatement": Array [
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.diagnosticStatement",
            "propertyName": "DiagnosticStatement",
          },
        ],
        "GradingPeriod": Array [
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.gradingPeriodReference.gradingPeriodDescriptor",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.gradingPeriodReference.periodSequence",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.gradingPeriodReference.schoolId",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.gradingPeriodReference.schoolYear",
            "propertyName": "GradingPeriod",
          },
        ],
        "GradingPeriod.GradingPeriod": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriodReference.gradingPeriodDescriptor",
            "propertyName": "GradingPeriod",
          },
        ],
        "GradingPeriod.PeriodSequence": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriodReference.periodSequence",
            "propertyName": "PeriodSequence",
          },
        ],
        "GradingPeriod.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.gradingPeriodReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "GradingPeriod.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.gradingPeriodReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "GradingPeriod.SchoolYear": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriodReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "Student": Array [
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.studentReference.studentUniqueId",
            "propertyName": "Student",
          },
        ],
        "Student.StudentUniqueId": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.studentReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation": Array [
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.beginDate",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programEducationOrganizationId",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
            "propertyName": "GeneralStudentProgramAssociation",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.BeginDate": Array [
          Object {
            "entityName": "GeneralStudentProgramAssociation",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.beginDate",
            "propertyName": "BeginDate",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization.EducationOrganizationId": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programEducationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
          Object {
            "entityName": "Program",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
            "propertyName": "ProgramName",
          },
          Object {
            "entityName": "Program",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
            "propertyName": "ProgramType",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programEducationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization.EducationOrganizationId": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programEducationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramName": Array [
          Object {
            "entityName": "Program",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
            "propertyName": "ProgramName",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramType": Array [
          Object {
            "entityName": "Program",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
            "propertyName": "ProgramType",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student.StudentUniqueId": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation": Array [
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.beginDate",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
            "propertyName": "StudentSectionAssociation",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.BeginDate": Array [
          Object {
            "entityName": "StudentSectionAssociation",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.beginDate",
            "propertyName": "BeginDate",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
            "propertyName": "LocalCourseCode",
          },
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "SchoolYear",
          },
          Object {
            "entityName": "Section",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
            "propertyName": "SectionIdentifier",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
            "propertyName": "LocalCourseCode",
          },
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "SchoolYear",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.LocalCourseCode": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
            "propertyName": "LocalCourseCode",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "SchoolYear",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SchoolYear": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SessionName": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.SectionIdentifier": Array [
          Object {
            "entityName": "Section",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
            "propertyName": "SectionIdentifier",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student.StudentUniqueId": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
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
          Object {
            "entityName": "StudentLearningObjective",
            "jsonPath": "$.competencyLevelDescriptor",
            "propertyName": "CompetencyLevel",
          },
        ],
        "DiagnosticStatement": Array [
          Object {
            "entityName": "StudentLearningObjective",
            "jsonPath": "$.diagnosticStatement",
            "propertyName": "DiagnosticStatement",
          },
        ],
        "GradingPeriod": Array [
          Object {
            "entityName": "StudentLearningObjective",
            "jsonPath": "$.gradingPeriodReference.gradingPeriodDescriptor",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "StudentLearningObjective",
            "jsonPath": "$.gradingPeriodReference.periodSequence",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "StudentLearningObjective",
            "jsonPath": "$.gradingPeriodReference.schoolId",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "StudentLearningObjective",
            "jsonPath": "$.gradingPeriodReference.schoolYear",
            "propertyName": "GradingPeriod",
          },
        ],
        "GradingPeriod.GradingPeriod": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriodReference.gradingPeriodDescriptor",
            "propertyName": "GradingPeriod",
          },
        ],
        "GradingPeriod.PeriodSequence": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriodReference.periodSequence",
            "propertyName": "PeriodSequence",
          },
        ],
        "GradingPeriod.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.gradingPeriodReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "GradingPeriod.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.gradingPeriodReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "GradingPeriod.SchoolYear": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriodReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "LearningObjective": Array [
          Object {
            "entityName": "StudentLearningObjective",
            "jsonPath": "$.learningObjectiveReference.learningObjectiveId",
            "propertyName": "LearningObjective",
          },
          Object {
            "entityName": "StudentLearningObjective",
            "jsonPath": "$.learningObjectiveReference.namespace",
            "propertyName": "LearningObjective",
          },
        ],
        "LearningObjective.LearningObjectiveId": Array [
          Object {
            "entityName": "LearningObjective",
            "jsonPath": "$.learningObjectiveReference.learningObjectiveId",
            "propertyName": "LearningObjectiveId",
          },
        ],
        "LearningObjective.Namespace": Array [
          Object {
            "entityName": "LearningObjective",
            "jsonPath": "$.learningObjectiveReference.namespace",
            "propertyName": "Namespace",
          },
        ],
        "Student": Array [
          Object {
            "entityName": "StudentLearningObjective",
            "jsonPath": "$.studentReference.studentUniqueId",
            "propertyName": "Student",
          },
        ],
        "Student.StudentUniqueId": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.studentReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation": Array [
          Object {
            "entityName": "StudentLearningObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.beginDate",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentLearningObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentLearningObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programEducationOrganizationId",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentLearningObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentLearningObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentLearningObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
            "propertyName": "GeneralStudentProgramAssociation",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.BeginDate": Array [
          Object {
            "entityName": "GeneralStudentProgramAssociation",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.beginDate",
            "propertyName": "BeginDate",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization.EducationOrganizationId": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programEducationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
          Object {
            "entityName": "Program",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
            "propertyName": "ProgramName",
          },
          Object {
            "entityName": "Program",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
            "propertyName": "ProgramType",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programEducationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization.EducationOrganizationId": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programEducationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramName": Array [
          Object {
            "entityName": "Program",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
            "propertyName": "ProgramName",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramType": Array [
          Object {
            "entityName": "Program",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
            "propertyName": "ProgramType",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student.StudentUniqueId": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation": Array [
          Object {
            "entityName": "StudentLearningObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.beginDate",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentLearningObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentLearningObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentLearningObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentLearningObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentLearningObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentLearningObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
            "propertyName": "StudentSectionAssociation",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.BeginDate": Array [
          Object {
            "entityName": "StudentSectionAssociation",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.beginDate",
            "propertyName": "BeginDate",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
            "propertyName": "LocalCourseCode",
          },
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "SchoolYear",
          },
          Object {
            "entityName": "Section",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
            "propertyName": "SectionIdentifier",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
            "propertyName": "LocalCourseCode",
          },
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "SchoolYear",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.LocalCourseCode": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
            "propertyName": "LocalCourseCode",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "SchoolYear",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SchoolYear": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SessionName": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.SectionIdentifier": Array [
          Object {
            "entityName": "Section",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
            "propertyName": "SectionIdentifier",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentLearningObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student.StudentUniqueId": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
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
          projectVersion: '5.0.0',
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
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.accommodations[*].accommodationDescriptor",
            "propertyName": "Accommodation",
          },
        ],
        "AdministrationDate": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.administrationDate",
            "propertyName": "AdministrationDate",
          },
        ],
        "AdministrationEndDate": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.administrationEndDate",
            "propertyName": "AdministrationEndDate",
          },
        ],
        "AdministrationEnvironment": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.administrationEnvironmentDescriptor",
            "propertyName": "AdministrationEnvironment",
          },
        ],
        "AdministrationLanguage": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.administrationLanguageDescriptor",
            "propertyName": "Language",
          },
        ],
        "AssessedMinutes": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.assessedMinutes",
            "propertyName": "AssessedMinutes",
          },
        ],
        "Assessment": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.assessmentReference.assessmentIdentifier",
            "propertyName": "Assessment",
          },
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.assessmentReference.namespace",
            "propertyName": "Assessment",
          },
        ],
        "Assessment.AssessmentIdentifier": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.assessmentReference.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
        ],
        "Assessment.Namespace": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.assessmentReference.namespace",
            "propertyName": "Namespace",
          },
        ],
        "AssessmentPeriod.AssessmentPeriod": Array [
          Object {
            "entityName": "AssessmentPeriod",
            "jsonPath": "$.period.assessmentPeriodDescriptor",
            "propertyName": "AssessmentPeriod",
          },
        ],
        "AssessmentPeriod.BeginDate": Array [
          Object {
            "entityName": "AssessmentPeriod",
            "jsonPath": "$.period.beginDate",
            "propertyName": "BeginDate",
          },
        ],
        "AssessmentPeriod.EndDate": Array [
          Object {
            "entityName": "AssessmentPeriod",
            "jsonPath": "$.period.endDate",
            "propertyName": "EndDate",
          },
        ],
        "EventCircumstance": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.eventCircumstanceDescriptor",
            "propertyName": "EventCircumstance",
          },
        ],
        "EventDescription": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.eventDescription",
            "propertyName": "Description",
          },
        ],
        "PerformanceLevel.AssessmentReportingMethod": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.performanceLevels[*].assessmentReportingMethodDescriptor",
            "propertyName": "AssessmentReportingMethod",
          },
        ],
        "PerformanceLevel.PerformanceLevel": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.performanceLevels[*].performanceLevelDescriptor",
            "propertyName": "PerformanceLevel",
          },
        ],
        "PerformanceLevel.PerformanceLevelIndicatorName": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.performanceLevels[*].performanceLevelIndicatorName",
            "propertyName": "PerformanceLevelIndicatorName",
          },
        ],
        "PlatformType": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.platformTypeDescriptor",
            "propertyName": "PlatformType",
          },
        ],
        "ReasonNotTested": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.reasonNotTestedDescriptor",
            "propertyName": "ReasonNotTested",
          },
        ],
        "ReportedSchool": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.reportedSchoolReference.schoolId",
            "propertyName": "School",
          },
        ],
        "ReportedSchool.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.reportedSchoolReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "ReportedSchoolIdentifier": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.reportedSchoolIdentifier",
            "propertyName": "SchoolIdentifier",
          },
        ],
        "RetestIndicator": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.retestIndicatorDescriptor",
            "propertyName": "RetestIndicator",
          },
        ],
        "SchoolYear": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.schoolYearTypeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "ScoreResult.AssessmentReportingMethod": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.scoreResults[*].assessmentReportingMethodDescriptor",
            "propertyName": "AssessmentReportingMethod",
          },
        ],
        "ScoreResult.Result": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.scoreResults[*].result",
            "propertyName": "Result",
          },
        ],
        "ScoreResult.ResultDatatypeType": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.scoreResults[*].resultDatatypeTypeDescriptor",
            "propertyName": "ResultDatatypeType",
          },
        ],
        "SerialNumber": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.serialNumber",
            "propertyName": "SerialNumber",
          },
        ],
        "Student": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.studentReference.studentUniqueId",
            "propertyName": "Student",
          },
        ],
        "Student.StudentUniqueId": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.studentReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentAssessmentIdentifier": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.studentAssessmentIdentifier",
            "propertyName": "StudentAssessmentIdentifier",
          },
        ],
        "StudentAssessmentItem.AssessmentItem": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].assessmentItemReference.assessmentIdentifier",
            "propertyName": "AssessmentItem",
          },
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].assessmentItemReference.identificationCode",
            "propertyName": "AssessmentItem",
          },
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].assessmentItemReference.namespace",
            "propertyName": "AssessmentItem",
          },
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.items[*].assessmentItemReference.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.items[*].assessmentItemReference.namespace",
            "propertyName": "Namespace",
          },
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment.AssessmentIdentifier": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.items[*].assessmentItemReference.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment.Namespace": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.items[*].assessmentItemReference.namespace",
            "propertyName": "Namespace",
          },
        ],
        "StudentAssessmentItem.AssessmentItem.IdentificationCode": Array [
          Object {
            "entityName": "AssessmentItem",
            "jsonPath": "$.items[*].assessmentItemReference.identificationCode",
            "propertyName": "IdentificationCode",
          },
        ],
        "StudentAssessmentItem.AssessmentItemResult": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].assessmentItemResultDescriptor",
            "propertyName": "AssessmentItemResult",
          },
        ],
        "StudentAssessmentItem.AssessmentResponse": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].assessmentResponse",
            "propertyName": "AssessmentResponse",
          },
        ],
        "StudentAssessmentItem.DescriptiveFeedback": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].descriptiveFeedback",
            "propertyName": "DescriptiveFeedback",
          },
        ],
        "StudentAssessmentItem.ItemNumber": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].itemNumber",
            "propertyName": "ItemNumber",
          },
        ],
        "StudentAssessmentItem.RawScoreResult": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].rawScoreResult",
            "propertyName": "RawScoreResult",
          },
        ],
        "StudentAssessmentItem.ResponseIndicator": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].responseIndicatorDescriptor",
            "propertyName": "ResponseIndicator",
          },
        ],
        "StudentAssessmentItem.TimeAssessed": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].timeAssessed",
            "propertyName": "TimeAssessed",
          },
        ],
        "StudentObjectiveAssessment.AdministrationDate": Array [
          Object {
            "entityName": "StudentObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].administrationDate",
            "propertyName": "AdministrationDate",
          },
        ],
        "StudentObjectiveAssessment.AdministrationEndDate": Array [
          Object {
            "entityName": "StudentObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].administrationEndDate",
            "propertyName": "AdministrationEndDate",
          },
        ],
        "StudentObjectiveAssessment.AssessedMinutes": Array [
          Object {
            "entityName": "StudentObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].assessedMinutes",
            "propertyName": "AssessedMinutes",
          },
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment": Array [
          Object {
            "entityName": "StudentObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
            "propertyName": "ObjectiveAssessment",
          },
          Object {
            "entityName": "StudentObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.identificationCode",
            "propertyName": "ObjectiveAssessment",
          },
          Object {
            "entityName": "StudentObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
            "propertyName": "ObjectiveAssessment",
          },
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
            "propertyName": "Namespace",
          },
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.AssessmentIdentifier": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.Namespace": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
            "propertyName": "Namespace",
          },
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.IdentificationCode": Array [
          Object {
            "entityName": "ObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.identificationCode",
            "propertyName": "IdentificationCode",
          },
        ],
        "StudentObjectiveAssessment.PerformanceLevel.AssessmentReportingMethod": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.studentObjectiveAssessments[*].performanceLevels[*].assessmentReportingMethodDescriptor",
            "propertyName": "AssessmentReportingMethod",
          },
        ],
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevel": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.studentObjectiveAssessments[*].performanceLevels[*].performanceLevelDescriptor",
            "propertyName": "PerformanceLevel",
          },
        ],
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevelIndicatorName": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.studentObjectiveAssessments[*].performanceLevels[*].performanceLevelIndicatorName",
            "propertyName": "PerformanceLevelIndicatorName",
          },
        ],
        "StudentObjectiveAssessment.ScoreResult.AssessmentReportingMethod": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.studentObjectiveAssessments[*].scoreResults[*].assessmentReportingMethodDescriptor",
            "propertyName": "AssessmentReportingMethod",
          },
        ],
        "StudentObjectiveAssessment.ScoreResult.Result": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.studentObjectiveAssessments[*].scoreResults[*].result",
            "propertyName": "Result",
          },
        ],
        "StudentObjectiveAssessment.ScoreResult.ResultDatatypeType": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.studentObjectiveAssessments[*].scoreResults[*].resultDatatypeTypeDescriptor",
            "propertyName": "ResultDatatypeType",
          },
        ],
        "WhenAssessedGradeLevel": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.whenAssessedGradeLevelDescriptor",
            "propertyName": "GradeLevel",
          },
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
          Object {
            "entityName": "Session",
            "jsonPath": "$.academicWeeks[*].academicWeekReference.schoolId",
            "propertyName": "AcademicWeek",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.academicWeeks[*].academicWeekReference.weekIdentifier",
            "propertyName": "AcademicWeek",
          },
        ],
        "AcademicWeek.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.academicWeeks[*].academicWeekReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "AcademicWeek.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.academicWeeks[*].academicWeekReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "AcademicWeek.WeekIdentifier": Array [
          Object {
            "entityName": "AcademicWeek",
            "jsonPath": "$.academicWeeks[*].academicWeekReference.weekIdentifier",
            "propertyName": "WeekIdentifier",
          },
        ],
        "BeginDate": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.beginDate",
            "propertyName": "BeginDate",
          },
        ],
        "EndDate": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.endDate",
            "propertyName": "EndDate",
          },
        ],
        "GradingPeriod": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.gradingPeriodDescriptor",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.periodSequence",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolId",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
            "propertyName": "GradingPeriod",
          },
        ],
        "GradingPeriod.GradingPeriod": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.gradingPeriodDescriptor",
            "propertyName": "GradingPeriod",
          },
        ],
        "GradingPeriod.PeriodSequence": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.periodSequence",
            "propertyName": "PeriodSequence",
          },
        ],
        "GradingPeriod.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "GradingPeriod.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "GradingPeriod.SchoolYear": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "School": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.schoolReference.schoolId",
            "propertyName": "School",
          },
        ],
        "School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.schoolReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "SchoolYear": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.schoolYearTypeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "SessionName": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "Term": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.termDescriptor",
            "propertyName": "Term",
          },
        ],
        "TotalInstructionalDays": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.totalInstructionalDays",
            "propertyName": "TotalInstructionalDays",
          },
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
        Object {
          "sourceJsonPath": "$.schoolReference.schoolId",
          "targetJsonPath": "$.academicWeeks[*].academicWeekReference.schoolId",
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
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.competencyLevelDescriptor",
            "propertyName": "CompetencyLevel",
          },
        ],
        "CompetencyObjective": Array [
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.educationOrganizationId",
            "propertyName": "CompetencyObjective",
          },
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.objective",
            "propertyName": "CompetencyObjective",
          },
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.objectiveGradeLevelDescriptor",
            "propertyName": "CompetencyObjective",
          },
        ],
        "CompetencyObjective.EducationOrganization": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.educationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "CompetencyObjective.EducationOrganization.EducationOrganizationId": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.educationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "CompetencyObjective.Objective": Array [
          Object {
            "entityName": "CompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.objective",
            "propertyName": "Objective",
          },
        ],
        "CompetencyObjective.ObjectiveGradeLevel": Array [
          Object {
            "entityName": "CompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.objectiveGradeLevelDescriptor",
            "propertyName": "GradeLevel",
          },
        ],
        "DiagnosticStatement": Array [
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.diagnosticStatement",
            "propertyName": "DiagnosticStatement",
          },
        ],
        "GradingPeriod": Array [
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.gradingPeriodReference.gradingPeriodDescriptor",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.gradingPeriodReference.periodSequence",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.gradingPeriodReference.schoolId",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.gradingPeriodReference.schoolYear",
            "propertyName": "GradingPeriod",
          },
        ],
        "GradingPeriod.GradingPeriod": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriodReference.gradingPeriodDescriptor",
            "propertyName": "GradingPeriod",
          },
        ],
        "GradingPeriod.PeriodSequence": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriodReference.periodSequence",
            "propertyName": "PeriodSequence",
          },
        ],
        "GradingPeriod.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.gradingPeriodReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "GradingPeriod.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.gradingPeriodReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "GradingPeriod.SchoolYear": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriodReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "Student": Array [
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.studentReference.studentUniqueId",
            "propertyName": "Student",
          },
        ],
        "Student.StudentUniqueId": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.studentReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation": Array [
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.beginDate",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programEducationOrganizationId",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
            "propertyName": "GeneralStudentProgramAssociation",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.BeginDate": Array [
          Object {
            "entityName": "GeneralStudentProgramAssociation",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.beginDate",
            "propertyName": "BeginDate",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization.EducationOrganizationId": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programEducationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
          Object {
            "entityName": "Program",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
            "propertyName": "ProgramName",
          },
          Object {
            "entityName": "Program",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
            "propertyName": "ProgramType",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programEducationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization.EducationOrganizationId": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programEducationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramName": Array [
          Object {
            "entityName": "Program",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
            "propertyName": "ProgramName",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramType": Array [
          Object {
            "entityName": "Program",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
            "propertyName": "ProgramType",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student.StudentUniqueId": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation": Array [
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.beginDate",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
            "propertyName": "StudentSectionAssociation",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.BeginDate": Array [
          Object {
            "entityName": "StudentSectionAssociation",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.beginDate",
            "propertyName": "BeginDate",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
            "propertyName": "LocalCourseCode",
          },
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "SchoolYear",
          },
          Object {
            "entityName": "Section",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
            "propertyName": "SectionIdentifier",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
            "propertyName": "LocalCourseCode",
          },
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "SchoolYear",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.LocalCourseCode": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
            "propertyName": "LocalCourseCode",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "SchoolYear",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SchoolYear": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SessionName": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.SectionIdentifier": Array [
          Object {
            "entityName": "Section",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
            "propertyName": "SectionIdentifier",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student.StudentUniqueId": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
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

describe('when generating api schema targeting tech version 7.0 with data standard 5.0', (): void => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

  beforeAll(async () => {
    const metaEdConfiguration = {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: '7.1.0',
      projectPaths: ['./node_modules/@edfi/ed-fi-model-5.0/'],
      projects: [
        {
          projectName: 'Ed-Fi',
          namespaceName: 'EdFi',
          projectExtension: '',
          projectVersion: '5.0.0',
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
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.accommodations[*].accommodationDescriptor",
            "propertyName": "Accommodation",
          },
        ],
        "AdministrationDate": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.administrationDate",
            "propertyName": "AdministrationDate",
          },
        ],
        "AdministrationEndDate": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.administrationEndDate",
            "propertyName": "AdministrationEndDate",
          },
        ],
        "AdministrationEnvironment": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.administrationEnvironmentDescriptor",
            "propertyName": "AdministrationEnvironment",
          },
        ],
        "AdministrationLanguage": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.administrationLanguageDescriptor",
            "propertyName": "Language",
          },
        ],
        "AssessedMinutes": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.assessedMinutes",
            "propertyName": "AssessedMinutes",
          },
        ],
        "Assessment": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.assessmentReference.assessmentIdentifier",
            "propertyName": "Assessment",
          },
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.assessmentReference.namespace",
            "propertyName": "Assessment",
          },
        ],
        "Assessment.AssessmentIdentifier": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.assessmentReference.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
        ],
        "Assessment.Namespace": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.assessmentReference.namespace",
            "propertyName": "Namespace",
          },
        ],
        "AssessmentPeriod.AssessmentPeriod": Array [
          Object {
            "entityName": "AssessmentPeriod",
            "jsonPath": "$.period.assessmentPeriodDescriptor",
            "propertyName": "AssessmentPeriod",
          },
        ],
        "AssessmentPeriod.BeginDate": Array [
          Object {
            "entityName": "AssessmentPeriod",
            "jsonPath": "$.period.beginDate",
            "propertyName": "BeginDate",
          },
        ],
        "AssessmentPeriod.EndDate": Array [
          Object {
            "entityName": "AssessmentPeriod",
            "jsonPath": "$.period.endDate",
            "propertyName": "EndDate",
          },
        ],
        "EventCircumstance": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.eventCircumstanceDescriptor",
            "propertyName": "EventCircumstance",
          },
        ],
        "EventDescription": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.eventDescription",
            "propertyName": "Description",
          },
        ],
        "PerformanceLevel.AssessmentReportingMethod": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.performanceLevels[*].assessmentReportingMethodDescriptor",
            "propertyName": "AssessmentReportingMethod",
          },
        ],
        "PerformanceLevel.PerformanceLevel": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.performanceLevels[*].performanceLevelDescriptor",
            "propertyName": "PerformanceLevel",
          },
        ],
        "PerformanceLevel.PerformanceLevelIndicatorName": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.performanceLevels[*].performanceLevelIndicatorName",
            "propertyName": "PerformanceLevelIndicatorName",
          },
        ],
        "PlatformType": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.platformTypeDescriptor",
            "propertyName": "PlatformType",
          },
        ],
        "ReasonNotTested": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.reasonNotTestedDescriptor",
            "propertyName": "ReasonNotTested",
          },
        ],
        "ReportedSchool": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.reportedSchoolReference.schoolId",
            "propertyName": "School",
          },
        ],
        "ReportedSchool.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.reportedSchoolReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "ReportedSchoolIdentifier": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.reportedSchoolIdentifier",
            "propertyName": "SchoolIdentifier",
          },
        ],
        "RetestIndicator": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.retestIndicatorDescriptor",
            "propertyName": "RetestIndicator",
          },
        ],
        "SchoolYear": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.schoolYearTypeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "ScoreResult.AssessmentReportingMethod": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.scoreResults[*].assessmentReportingMethodDescriptor",
            "propertyName": "AssessmentReportingMethod",
          },
        ],
        "ScoreResult.Result": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.scoreResults[*].result",
            "propertyName": "Result",
          },
        ],
        "ScoreResult.ResultDatatypeType": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.scoreResults[*].resultDatatypeTypeDescriptor",
            "propertyName": "ResultDatatypeType",
          },
        ],
        "SerialNumber": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.serialNumber",
            "propertyName": "SerialNumber",
          },
        ],
        "Student": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.studentReference.studentUniqueId",
            "propertyName": "Student",
          },
        ],
        "Student.StudentUniqueId": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.studentReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentAssessmentIdentifier": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.studentAssessmentIdentifier",
            "propertyName": "StudentAssessmentIdentifier",
          },
        ],
        "StudentAssessmentItem.AssessmentItem": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].assessmentItemReference.assessmentIdentifier",
            "propertyName": "AssessmentItem",
          },
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].assessmentItemReference.identificationCode",
            "propertyName": "AssessmentItem",
          },
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].assessmentItemReference.namespace",
            "propertyName": "AssessmentItem",
          },
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.items[*].assessmentItemReference.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.items[*].assessmentItemReference.namespace",
            "propertyName": "Namespace",
          },
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment.AssessmentIdentifier": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.items[*].assessmentItemReference.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
        ],
        "StudentAssessmentItem.AssessmentItem.Assessment.Namespace": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.items[*].assessmentItemReference.namespace",
            "propertyName": "Namespace",
          },
        ],
        "StudentAssessmentItem.AssessmentItem.IdentificationCode": Array [
          Object {
            "entityName": "AssessmentItem",
            "jsonPath": "$.items[*].assessmentItemReference.identificationCode",
            "propertyName": "IdentificationCode",
          },
        ],
        "StudentAssessmentItem.AssessmentItemResult": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].assessmentItemResultDescriptor",
            "propertyName": "AssessmentItemResult",
          },
        ],
        "StudentAssessmentItem.AssessmentResponse": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].assessmentResponse",
            "propertyName": "AssessmentResponse",
          },
        ],
        "StudentAssessmentItem.DescriptiveFeedback": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].descriptiveFeedback",
            "propertyName": "DescriptiveFeedback",
          },
        ],
        "StudentAssessmentItem.ItemNumber": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].itemNumber",
            "propertyName": "ItemNumber",
          },
        ],
        "StudentAssessmentItem.RawScoreResult": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].rawScoreResult",
            "propertyName": "RawScoreResult",
          },
        ],
        "StudentAssessmentItem.ResponseIndicator": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].responseIndicatorDescriptor",
            "propertyName": "ResponseIndicator",
          },
        ],
        "StudentAssessmentItem.TimeAssessed": Array [
          Object {
            "entityName": "StudentAssessmentItem",
            "jsonPath": "$.items[*].timeAssessed",
            "propertyName": "TimeAssessed",
          },
        ],
        "StudentObjectiveAssessment.AdministrationDate": Array [
          Object {
            "entityName": "StudentObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].administrationDate",
            "propertyName": "AdministrationDate",
          },
        ],
        "StudentObjectiveAssessment.AdministrationEndDate": Array [
          Object {
            "entityName": "StudentObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].administrationEndDate",
            "propertyName": "AdministrationEndDate",
          },
        ],
        "StudentObjectiveAssessment.AssessedMinutes": Array [
          Object {
            "entityName": "StudentObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].assessedMinutes",
            "propertyName": "AssessedMinutes",
          },
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment": Array [
          Object {
            "entityName": "StudentObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
            "propertyName": "ObjectiveAssessment",
          },
          Object {
            "entityName": "StudentObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.identificationCode",
            "propertyName": "ObjectiveAssessment",
          },
          Object {
            "entityName": "StudentObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
            "propertyName": "ObjectiveAssessment",
          },
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
            "propertyName": "Namespace",
          },
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.AssessmentIdentifier": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.Assessment.Namespace": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.namespace",
            "propertyName": "Namespace",
          },
        ],
        "StudentObjectiveAssessment.ObjectiveAssessment.IdentificationCode": Array [
          Object {
            "entityName": "ObjectiveAssessment",
            "jsonPath": "$.studentObjectiveAssessments[*].objectiveAssessmentReference.identificationCode",
            "propertyName": "IdentificationCode",
          },
        ],
        "StudentObjectiveAssessment.PerformanceLevel.AssessmentReportingMethod": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.studentObjectiveAssessments[*].performanceLevels[*].assessmentReportingMethodDescriptor",
            "propertyName": "AssessmentReportingMethod",
          },
        ],
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevel": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.studentObjectiveAssessments[*].performanceLevels[*].performanceLevelDescriptor",
            "propertyName": "PerformanceLevel",
          },
        ],
        "StudentObjectiveAssessment.PerformanceLevel.PerformanceLevelIndicatorName": Array [
          Object {
            "entityName": "PerformanceLevel",
            "jsonPath": "$.studentObjectiveAssessments[*].performanceLevels[*].performanceLevelIndicatorName",
            "propertyName": "PerformanceLevelIndicatorName",
          },
        ],
        "StudentObjectiveAssessment.ScoreResult.AssessmentReportingMethod": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.studentObjectiveAssessments[*].scoreResults[*].assessmentReportingMethodDescriptor",
            "propertyName": "AssessmentReportingMethod",
          },
        ],
        "StudentObjectiveAssessment.ScoreResult.Result": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.studentObjectiveAssessments[*].scoreResults[*].result",
            "propertyName": "Result",
          },
        ],
        "StudentObjectiveAssessment.ScoreResult.ResultDatatypeType": Array [
          Object {
            "entityName": "ScoreResult",
            "jsonPath": "$.studentObjectiveAssessments[*].scoreResults[*].resultDatatypeTypeDescriptor",
            "propertyName": "ResultDatatypeType",
          },
        ],
        "WhenAssessedGradeLevel": Array [
          Object {
            "entityName": "StudentAssessment",
            "jsonPath": "$.whenAssessedGradeLevelDescriptor",
            "propertyName": "GradeLevel",
          },
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
          Object {
            "entityName": "Session",
            "jsonPath": "$.academicWeeks[*].academicWeekReference.schoolId",
            "propertyName": "AcademicWeek",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.academicWeeks[*].academicWeekReference.weekIdentifier",
            "propertyName": "AcademicWeek",
          },
        ],
        "AcademicWeek.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.academicWeeks[*].academicWeekReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "AcademicWeek.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.academicWeeks[*].academicWeekReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "AcademicWeek.WeekIdentifier": Array [
          Object {
            "entityName": "AcademicWeek",
            "jsonPath": "$.academicWeeks[*].academicWeekReference.weekIdentifier",
            "propertyName": "WeekIdentifier",
          },
        ],
        "BeginDate": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.beginDate",
            "propertyName": "BeginDate",
          },
        ],
        "EndDate": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.endDate",
            "propertyName": "EndDate",
          },
        ],
        "GradingPeriod": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.gradingPeriodDescriptor",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.gradingPeriodName",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolId",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
            "propertyName": "GradingPeriod",
          },
        ],
        "GradingPeriod.GradingPeriod": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.gradingPeriodDescriptor",
            "propertyName": "GradingPeriod",
          },
        ],
        "GradingPeriod.GradingPeriodName": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.gradingPeriodName",
            "propertyName": "GradingPeriodName",
          },
        ],
        "GradingPeriod.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "GradingPeriod.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "GradingPeriod.SchoolYear": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "School": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.schoolReference.schoolId",
            "propertyName": "School",
          },
        ],
        "School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.schoolReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "SchoolYear": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.schoolYearTypeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "SessionName": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "Term": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.termDescriptor",
            "propertyName": "Term",
          },
        ],
        "TotalInstructionalDays": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.totalInstructionalDays",
            "propertyName": "TotalInstructionalDays",
          },
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
        "GradingPeriod.GradingPeriodName": false,
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
        Object {
          "sourceJsonPath": "$.schoolReference.schoolId",
          "targetJsonPath": "$.academicWeeks[*].academicWeekReference.schoolId",
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
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.competencyLevelDescriptor",
            "propertyName": "CompetencyLevel",
          },
        ],
        "CompetencyObjective": Array [
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.educationOrganizationId",
            "propertyName": "CompetencyObjective",
          },
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.objective",
            "propertyName": "CompetencyObjective",
          },
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.objectiveGradeLevelDescriptor",
            "propertyName": "CompetencyObjective",
          },
        ],
        "CompetencyObjective.EducationOrganization": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.educationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "CompetencyObjective.EducationOrganization.EducationOrganizationId": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.educationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "CompetencyObjective.Objective": Array [
          Object {
            "entityName": "CompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.objective",
            "propertyName": "Objective",
          },
        ],
        "CompetencyObjective.ObjectiveGradeLevel": Array [
          Object {
            "entityName": "CompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.objectiveGradeLevelDescriptor",
            "propertyName": "GradeLevel",
          },
        ],
        "DiagnosticStatement": Array [
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.diagnosticStatement",
            "propertyName": "DiagnosticStatement",
          },
        ],
        "GradingPeriod": Array [
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.gradingPeriodReference.gradingPeriodDescriptor",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.gradingPeriodReference.gradingPeriodName",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.gradingPeriodReference.schoolId",
            "propertyName": "GradingPeriod",
          },
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.gradingPeriodReference.schoolYear",
            "propertyName": "GradingPeriod",
          },
        ],
        "GradingPeriod.GradingPeriod": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriodReference.gradingPeriodDescriptor",
            "propertyName": "GradingPeriod",
          },
        ],
        "GradingPeriod.GradingPeriodName": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriodReference.gradingPeriodName",
            "propertyName": "GradingPeriodName",
          },
        ],
        "GradingPeriod.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.gradingPeriodReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "GradingPeriod.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.gradingPeriodReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "GradingPeriod.SchoolYear": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.gradingPeriodReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "Student": Array [
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.studentReference.studentUniqueId",
            "propertyName": "Student",
          },
        ],
        "Student.StudentUniqueId": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.studentReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation": Array [
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.beginDate",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programEducationOrganizationId",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
            "propertyName": "GeneralStudentProgramAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
            "propertyName": "GeneralStudentProgramAssociation",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.BeginDate": Array [
          Object {
            "entityName": "GeneralStudentProgramAssociation",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.beginDate",
            "propertyName": "BeginDate",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.EducationOrganization.EducationOrganizationId": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.educationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programEducationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
          Object {
            "entityName": "Program",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
            "propertyName": "ProgramName",
          },
          Object {
            "entityName": "Program",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
            "propertyName": "ProgramType",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programEducationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.EducationOrganization.EducationOrganizationId": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programEducationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramName": Array [
          Object {
            "entityName": "Program",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programName",
            "propertyName": "ProgramName",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Program.ProgramType": Array [
          Object {
            "entityName": "Program",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.programTypeDescriptor",
            "propertyName": "ProgramType",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.GeneralStudentProgramAssociation.Student.StudentUniqueId": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.generalStudentProgramAssociations[*].generalStudentProgramAssociationReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation": Array [
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.beginDate",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "StudentSectionAssociation",
          },
          Object {
            "entityName": "StudentCompetencyObjectiveSectionOrProgramChoice",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
            "propertyName": "StudentSectionAssociation",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.BeginDate": Array [
          Object {
            "entityName": "StudentSectionAssociation",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.beginDate",
            "propertyName": "BeginDate",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
            "propertyName": "LocalCourseCode",
          },
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "SchoolYear",
          },
          Object {
            "entityName": "Section",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
            "propertyName": "SectionIdentifier",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
            "propertyName": "LocalCourseCode",
          },
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "SchoolYear",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.LocalCourseCode": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.localCourseCode",
            "propertyName": "LocalCourseCode",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "SchoolYear",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SchoolYear": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.CourseOffering.Session.SessionName": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Section.SectionIdentifier": Array [
          Object {
            "entityName": "Section",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.sectionIdentifier",
            "propertyName": "SectionIdentifier",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
        ],
        "StudentCompetencyObjectiveSectionOrProgramChoice.StudentSectionAssociation.Student.StudentUniqueId": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentUniqueId",
            "propertyName": "UniqueId",
          },
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
        "GradingPeriod.GradingPeriodName": false,
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
