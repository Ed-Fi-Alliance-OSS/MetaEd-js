import { MetaEdEnvironment, TopLevelEntity, Namespace } from '@edfi/metaed-core';
import {
  addEntityForNamespace,
  newAssociation,
  newDomainEntity,
  newMetaEdEnvironment,
  newNamespace,
} from '@edfi/metaed-core';
import { ComplexType } from '../../src/model/schema/ComplexType';
import { newElement, Element } from '../../src/model/schema/Element';
import { ComplexTypeItem } from '../../src/model/schema/ComplexTypeItem';
import { newComplexType } from '../../src/model/schema/ComplexType';
import { enhance } from '../../src/diminisher/ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher';

const testBase = (
  testEntityName: string,
  originalElementOrder: string[],
  diminishedElementOrder: string[],
  isAssociation: boolean = false,
): void => {
  let complexType: ComplexType;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
    metaEd.namespace.set(namespace.namespaceName, namespace);

    complexType = {
      ...newComplexType(),
      name: `${testEntityName}IdentityType`,
      items: originalElementOrder.reduce(
        (arr: ComplexTypeItem[], x: string) => arr.concat([{ ...newElement(), name: x } as ComplexTypeItem]),
        [],
      ),
    };

    const topLevelEntity1: TopLevelEntity = Object.assign(isAssociation ? newAssociation() : newDomainEntity(), {
      metaEdName: testEntityName,
      namespace,
      data: {
        edfiXsd: {
          xsdIdentityType: complexType,
        },
      },
    });
    addEntityForNamespace(topLevelEntity1);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have diminished order', (): void => {
    expect(complexType.items.map((x) => (x as Element).name)).toEqual(diminishedElementOrder);
  });
};

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes staffEducationOrganizationEmploymentAssociation', (): void => {
  testBase(
    'StaffEducationOrganizationEmploymentAssociation',
    ['StaffReference', 'EducationOrganizationReference', 'EmploymentStatus', 'HireDate'],
    ['EducationOrganizationReference', 'StaffReference', 'EmploymentStatus', 'HireDate'],
    true,
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes studentProgramAssociation', (): void => {
  testBase(
    'StudentProgramAssociation',
    ['StudentReference', 'ProgramReference', 'BeginDate', 'EducationOrganizationReference'],
    ['StudentReference', 'EducationOrganizationReference', 'ProgramReference', 'BeginDate'],
    true,
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes assessmentItem', (): void => {
  testBase('AssessmentItem', ['IdentificationCode', 'AssessmentReference'], ['AssessmentReference', 'IdentificationCode']);
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes classPeriod', (): void => {
  testBase('ClassPeriod', ['SchoolReference', 'ClassPeriodName'], ['ClassPeriodName', 'SchoolReference']);
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes courseOffering', (): void => {
  testBase(
    'CourseOffering',
    ['LocalCourseCode', 'SchoolReference', 'SessionReference'],
    ['LocalCourseCode', 'SessionReference', 'SchoolReference'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes gradebookEntry', (): void => {
  testBase(
    'GradebookEntry',
    ['GradebookEntryTitle', 'DateAssigned', 'SectionReference'],
    ['SectionReference', 'GradebookEntryTitle', 'DateAssigned'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes grade', (): void => {
  testBase(
    'Grade',
    ['GradeType', 'StudentSectionAssociationReference', 'GradingPeriodReference'],
    ['StudentSectionAssociationReference', 'GradingPeriodReference', 'GradeType'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes gradingPeriod', (): void => {
  testBase(
    'GradingPeriod',
    ['SchoolReference', 'GradingPeriod', 'BeginDate'],
    ['GradingPeriod', 'BeginDate', 'SchoolReference'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes intervention', (): void => {
  testBase(
    'Intervention',
    ['EducationOrganizationReference', 'InterventionIdentificationCode'],
    ['InterventionIdentificationCode', 'EducationOrganizationReference'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes interventionPrescription', (): void => {
  testBase(
    'InterventionPrescription',
    ['EducationOrganizationReference', 'InterventionPrescriptionIdentificationCode'],
    ['InterventionPrescriptionIdentificationCode', 'EducationOrganizationReference'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes location', (): void => {
  testBase(
    'Location',
    ['SchoolReference', 'ClassroomIdentificationCode'],
    ['ClassroomIdentificationCode', 'SchoolReference'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes objectiveAssessment', (): void => {
  testBase(
    'ObjectiveAssessment',
    ['IdentificationCode', 'AssessmentReference'],
    ['AssessmentReference', 'IdentificationCode'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes program', (): void => {
  testBase(
    'Program',
    ['EducationOrganizationReference', 'ProgramName', 'ProgramType'],
    ['ProgramType', 'ProgramName', 'EducationOrganizationReference'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes section', (): void => {
  testBase(
    'Section',
    ['UniqueSectionCode', 'SequenceOfCourse', 'CourseOfferingReference', 'LocationReference', 'ClassPeriodReference'],
    ['LocationReference', 'ClassPeriodReference', 'CourseOfferingReference', 'UniqueSectionCode', 'SequenceOfCourse'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes session', (): void => {
  testBase('Session', ['SchoolYear', 'Term', 'SchoolReference'], ['SchoolReference', 'SchoolYear', 'Term']);
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes studentAssessment', (): void => {
  testBase(
    'StudentAssessment',
    ['AdministrationDate', 'StudentReference', 'AssessmentReference'],
    ['StudentReference', 'AssessmentReference', 'AdministrationDate'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes studentCompetencyObjective', (): void => {
  testBase(
    'StudentCompetencyObjective',
    ['CompetencyObjectiveReference', 'GradingPeriodReference', 'StudentReference'],
    ['StudentReference', 'CompetencyObjectiveReference', 'GradingPeriodReference'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes studentLearningObjective', (): void => {
  testBase(
    'StudentLearningObjective',
    ['LearningObjectiveReference', 'GradingPeriodReference', 'StudentReference'],
    ['StudentReference', 'LearningObjectiveReference', 'GradingPeriodReference'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes with no matching association', (): void => {
  testBase(
    'AssociationName1',
    ['ElementName1', 'ElementName2', 'ElementName3'],
    ['ElementName1', 'ElementName2', 'ElementName3'],
    true,
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes with no matching domain entity', (): void => {
  testBase(
    'DomainEntityName1',
    ['ElementName1', 'ElementName2', 'ElementName3'],
    ['ElementName1', 'ElementName2', 'ElementName3'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes with no matching identity type items', (): void => {
  testBase(
    'AssessmentItem',
    ['ElementName1', 'ElementName2', 'ElementName3'],
    ['ElementName1', 'ElementName2', 'ElementName3'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes with no identity type items', (): void => {
  testBase('AssessmentItem', [], []);
});
