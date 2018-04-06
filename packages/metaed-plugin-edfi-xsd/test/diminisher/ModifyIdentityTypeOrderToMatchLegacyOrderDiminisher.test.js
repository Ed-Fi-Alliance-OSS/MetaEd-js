// @flow
import type { MetaEdEnvironment, TopLevelEntity } from 'metaed-core';
import { addEntity, newAssociation, newDomainEntity, newMetaEdEnvironment } from 'metaed-core';
import type { ComplexType } from '../../src/model/schema/ComplexType';
import { asElement, newElement } from '../../src/model/schema/Element';
import type { ComplexTypeItem } from '../../src/model/schema/ComplexTypeItem';
import { newComplexType } from '../../src/model/schema/ComplexType';
import { enhance } from '../../src/diminisher/ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher';

const testBase = (
  testEntityName: string,
  originalElementOrder: Array<string>,
  diminishedElementOrder: Array<string>,
  isAssociation: boolean = false,
): void => {
  let complexType: ComplexType;

  beforeAll(() => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();

    complexType = Object.assign(newComplexType(), {
      name: `${testEntityName}IdentityType`,
      items: originalElementOrder.reduce(
        (arr: Array<ComplexTypeItem>, x: string) => arr.concat([Object.assign(newElement(), { name: x })]),
        [],
      ),
    });

    const topLevelEntity1: TopLevelEntity = Object.assign(isAssociation ? newAssociation() : newDomainEntity(), {
      metaEdName: testEntityName,
      data: {
        edfiXsd: {
          xsd_IdentityType: complexType,
        },
      },
    });
    addEntity(metaEd.entity, topLevelEntity1);

    metaEd.dataStandardVersion = '2.0.0';
    enhance(metaEd);
  });

  it('should have diminished order', () => {
    expect(complexType.items.map(x => asElement(x).name)).toEqual(diminishedElementOrder);
  });
};

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes staffEducationOrganizationEmploymentAssociation', () => {
  testBase(
    'StaffEducationOrganizationEmploymentAssociation',
    ['StaffReference', 'EducationOrganizationReference', 'EmploymentStatus', 'HireDate'],
    ['EducationOrganizationReference', 'StaffReference', 'EmploymentStatus', 'HireDate'],
    true,
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes studentProgramAssociation', () => {
  testBase(
    'StudentProgramAssociation',
    ['StudentReference', 'ProgramReference', 'BeginDate', 'EducationOrganizationReference'],
    ['StudentReference', 'EducationOrganizationReference', 'ProgramReference', 'BeginDate'],
    true,
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes assessmentItem', () => {
  testBase('AssessmentItem', ['IdentificationCode', 'AssessmentReference'], ['AssessmentReference', 'IdentificationCode']);
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes classPeriod', () => {
  testBase('ClassPeriod', ['SchoolReference', 'ClassPeriodName'], ['ClassPeriodName', 'SchoolReference']);
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes courseOffering', () => {
  testBase(
    'CourseOffering',
    ['LocalCourseCode', 'SchoolReference', 'SessionReference'],
    ['LocalCourseCode', 'SessionReference', 'SchoolReference'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes gradebookEntry', () => {
  testBase(
    'GradebookEntry',
    ['GradebookEntryTitle', 'DateAssigned', 'SectionReference'],
    ['SectionReference', 'GradebookEntryTitle', 'DateAssigned'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes grade', () => {
  testBase(
    'Grade',
    ['GradeType', 'StudentSectionAssociationReference', 'GradingPeriodReference'],
    ['StudentSectionAssociationReference', 'GradingPeriodReference', 'GradeType'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes gradingPeriod', () => {
  testBase(
    'GradingPeriod',
    ['SchoolReference', 'GradingPeriod', 'BeginDate'],
    ['GradingPeriod', 'BeginDate', 'SchoolReference'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes intervention', () => {
  testBase(
    'Intervention',
    ['EducationOrganizationReference', 'InterventionIdentificationCode'],
    ['InterventionIdentificationCode', 'EducationOrganizationReference'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes interventionPrescription', () => {
  testBase(
    'InterventionPrescription',
    ['EducationOrganizationReference', 'InterventionPrescriptionIdentificationCode'],
    ['InterventionPrescriptionIdentificationCode', 'EducationOrganizationReference'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes location', () => {
  testBase(
    'Location',
    ['SchoolReference', 'ClassroomIdentificationCode'],
    ['ClassroomIdentificationCode', 'SchoolReference'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes objectiveAssessment', () => {
  testBase(
    'ObjectiveAssessment',
    ['IdentificationCode', 'AssessmentReference'],
    ['AssessmentReference', 'IdentificationCode'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes program', () => {
  testBase(
    'Program',
    ['EducationOrganizationReference', 'ProgramName', 'ProgramType'],
    ['ProgramType', 'ProgramName', 'EducationOrganizationReference'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes section', () => {
  testBase(
    'Section',
    ['UniqueSectionCode', 'SequenceOfCourse', 'CourseOfferingReference', 'LocationReference', 'ClassPeriodReference'],
    ['LocationReference', 'ClassPeriodReference', 'CourseOfferingReference', 'UniqueSectionCode', 'SequenceOfCourse'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes session', () => {
  testBase('Session', ['SchoolYear', 'Term', 'SchoolReference'], ['SchoolReference', 'SchoolYear', 'Term']);
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes studentAssessment', () => {
  testBase(
    'StudentAssessment',
    ['AdministrationDate', 'StudentReference', 'AssessmentReference'],
    ['StudentReference', 'AssessmentReference', 'AdministrationDate'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes studentCompetencyObjective', () => {
  testBase(
    'StudentCompetencyObjective',
    ['CompetencyObjectiveReference', 'GradingPeriodReference', 'StudentReference'],
    ['StudentReference', 'CompetencyObjectiveReference', 'GradingPeriodReference'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes studentLearningObjective', () => {
  testBase(
    'StudentLearningObjective',
    ['LearningObjectiveReference', 'GradingPeriodReference', 'StudentReference'],
    ['StudentReference', 'LearningObjectiveReference', 'GradingPeriodReference'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes with no matching association', () => {
  testBase(
    'AssociationName1',
    ['ElementName1', 'ElementName2', 'ElementName3'],
    ['ElementName1', 'ElementName2', 'ElementName3'],
    true,
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes with no matching domain entity', () => {
  testBase(
    'DomainEntityName1',
    ['ElementName1', 'ElementName2', 'ElementName3'],
    ['ElementName1', 'ElementName2', 'ElementName3'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes with no matching identity type items', () => {
  testBase(
    'AssessmentItem',
    ['ElementName1', 'ElementName2', 'ElementName3'],
    ['ElementName1', 'ElementName2', 'ElementName3'],
  );
});

describe('when ModifyIdentityTypeOrderToMatchLegacyOrderDiminisher diminishes with no identity type items', () => {
  testBase('AssessmentItem', [], []);
});
