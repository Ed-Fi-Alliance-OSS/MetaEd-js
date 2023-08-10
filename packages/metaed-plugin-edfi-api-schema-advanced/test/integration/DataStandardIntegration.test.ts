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

  it('should create the correct equality constraints for StudentAssessment', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentAssessment');
    expect(entity?.data.edfiApiSchemaAdvanced.equalityConstraints).toMatchInlineSnapshot(`
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

  it('should create the correct equality constraints for Session', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('Session');
    expect(entity?.data.edfiApiSchemaAdvanced.equalityConstraints).toMatchInlineSnapshot(`
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

  it('should create the correct equality constraints for StudentCompetencyObjective', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentCompetencyObjective');
    expect(entity?.data.edfiApiSchemaAdvanced.equalityConstraints).toMatchInlineSnapshot(`
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

  it('should create the correct equality constraints for StudentLearningObjective', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentLearningObjective');
    expect(entity?.data.edfiApiSchemaAdvanced.equalityConstraints).toMatchInlineSnapshot(`
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

  it('should create the correct equality constraints for StudentAssessment', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentAssessment');
    expect(entity?.data.edfiApiSchemaAdvanced.equalityConstraints).toMatchInlineSnapshot(`
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

  it('should create the correct equality constraints for Session', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('Session');
    expect(entity?.data.edfiApiSchemaAdvanced.equalityConstraints).toMatchInlineSnapshot(`
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

  it('should create the correct equality constraints for StudentCompetencyObjective', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentCompetencyObjective');
    expect(entity?.data.edfiApiSchemaAdvanced.equalityConstraints).toMatchInlineSnapshot(`
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

  it('should create the correct equality constraints for StudentAssessment', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentAssessment');
    expect(entity?.data.edfiApiSchemaAdvanced.equalityConstraints).toMatchInlineSnapshot(`
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

  it('should create the correct equality constraints for Session', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('Session');
    expect(entity?.data.edfiApiSchemaAdvanced.equalityConstraints).toMatchInlineSnapshot(`
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

  it('should create the correct equality constraints for StudentCompetencyObjective', () => {
    const entity = metaEd.namespace.get('EdFi')?.entity.domainEntity.get('StudentCompetencyObjective');
    expect(entity?.data.edfiApiSchemaAdvanced.equalityConstraints).toMatchInlineSnapshot(`
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
