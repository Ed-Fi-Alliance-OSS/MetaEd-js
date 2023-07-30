import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  AssociationBuilder,
  ChoiceBuilder,
  CommonBuilder,
} from '@edfi/metaed-core';
import {
  associationReferenceEnhancer,
  choiceReferenceEnhancer,
  commonReferenceEnhancer,
  domainEntityReferenceEnhancer,
  mergeDirectiveEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as jsonSchemaEnhancer } from '../../src/enhancer/JsonSchemaEnhancer';
import { enhance as jsonPathsMappingEnhancer } from '../../src/enhancer/JsonPathsMappingEnhancer';

import { enhance } from '../../src/enhancer/EqualityConstraintEnhancer';

describe('when building domain entity with DomainEntity collection and single merge directive', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('GradingPeriod')
      .withDocumentation('doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withStringIdentity('SessionName', 'doc', '30')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withDomainEntityProperty('GradingPeriod', 'doc', false, true)
      .withMergeDirective('GradingPeriod.SchoolYear', 'SchoolYear')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
          "targetJsonPath": "$.schoolYearTypeReference.schoolYear",
        },
      ]
    `);
  });
});

describe('when building domain entity with single merge directive', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withMergeDirective('School', 'Session.School')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('CourseOffering');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.schoolReference.schoolId",
          "targetJsonPath": "$.sessionReference.schoolId",
        },
      ]
    `);
  });
});

describe('when building domain entity with DomainEntity collection and two merge directives', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('GradingPeriod')
      .withDocumentation('doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withStringIdentity('SessionName', 'doc', '30')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withDomainEntityProperty('GradingPeriod', 'doc', false, true)
      .withMergeDirective('GradingPeriod.SchoolYear', 'SchoolYear')
      .withMergeDirective('GradingPeriod.School', 'School')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
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
});

describe('when building domain entity with DomainEntity collection and single merge directive with multiple levels on target reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('ClassPeriod')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Section')
      .withDocumentation('doc')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('StudentSectionAttendanceEvent')
      .withDocumentation('doc')
      .withDomainEntityProperty('ClassPeriod', 'doc', false, true)
      .withDomainEntityIdentity('Section', 'doc')
      .withMergeDirective('ClassPeriod.School', 'Section.CourseOffering.Session.School')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('StudentSectionAttendanceEvent');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.classPeriods[*].classPeriodReference.schoolId",
          "targetJsonPath": "$.sectionReference.schoolId",
        },
      ]
    `);
  });
});

describe('when building domain entity with DomainEntity collection and single merge directive with multiple levels ending with simple type', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('ClassPeriod')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Section')
      .withDocumentation('doc')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('StudentSectionAttendanceEvent')
      .withDocumentation('doc')
      .withDomainEntityProperty('ClassPeriod', 'doc', false, true)
      .withDomainEntityIdentity('Section', 'doc')
      .withMergeDirective('ClassPeriod.School.SchoolId', 'Section.CourseOffering.Session.School.SchoolId')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('StudentSectionAttendanceEvent');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.classPeriods[*].classPeriodReference.schoolId",
          "targetJsonPath": "$.sectionReference.schoolId",
        },
      ]
    `);
  });
});

describe('when two domain entities with all four possible simple identities are merged on a reference', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityWithMerges = 'DomainEntityWithMerges';
  const domainEntityBeingMergedFrom = 'DomainEntityBeingMergedFrom';
  const domainEntityBeingMergedTo = 'DomainEntityBeingMergedTo';
  const booleanProperty = 'BooleanProperty';
  const schoolYear = 'SchoolYear';
  const integerProperty = 'IntegerProperty';
  const stringProperty = 'StringProperty';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityBeingMergedTo)
      .withDocumentation('doc')
      .withBooleanIdentity(booleanProperty, 'doc')
      .withEnumerationIdentity(schoolYear, 'doc')
      .withIntegerIdentity(integerProperty, 'doc')
      .withStringIdentity(stringProperty, 'doc', '10')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityBeingMergedFrom)
      .withDocumentation('doc')
      .withBooleanIdentity(booleanProperty, 'doc')
      .withEnumerationIdentity(schoolYear, 'doc')
      .withIntegerIdentity(integerProperty, 'doc')
      .withStringIdentity(stringProperty, 'doc', '10')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntityWithMerges)
      .withDocumentation('doc')

      .withDomainEntityIdentity(domainEntityBeingMergedFrom, 'doc')
      .withMergeDirective(
        `${domainEntityBeingMergedFrom}.${booleanProperty}`,
        `${domainEntityBeingMergedTo}.${booleanProperty}`,
      )
      .withMergeDirective(`${domainEntityBeingMergedFrom}.${schoolYear}`, `${domainEntityBeingMergedTo}.${schoolYear}`)
      .withMergeDirective(
        `${domainEntityBeingMergedFrom}.${integerProperty}`,
        `${domainEntityBeingMergedTo}.${integerProperty}`,
      )
      .withMergeDirective(
        `${domainEntityBeingMergedFrom}.${stringProperty}`,
        `${domainEntityBeingMergedTo}.${stringProperty}`,
      )
      .withDomainEntityIdentity(domainEntityBeingMergedTo, 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityWithMerges);
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.domainEntityBeingMergedFromReference.booleanProperty",
          "targetJsonPath": "$.domainEntityBeingMergedToReference.booleanProperty",
        },
        Object {
          "sourceJsonPath": "$.domainEntityBeingMergedFromReference.schoolYear",
          "targetJsonPath": "$.domainEntityBeingMergedToReference.schoolYear",
        },
        Object {
          "sourceJsonPath": "$.domainEntityBeingMergedFromReference.integerProperty",
          "targetJsonPath": "$.domainEntityBeingMergedToReference.integerProperty",
        },
        Object {
          "sourceJsonPath": "$.domainEntityBeingMergedFromReference.stringProperty",
          "targetJsonPath": "$.domainEntityBeingMergedToReference.stringProperty",
        },
      ]
    `);
  });
});

describe('when merging on both a reference and a simple identity down multiple levels on both references', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('SectionAttendanceTakenEvent')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Section', 'doc')
      .withDomainEntityIdentity('CalendarDate', 'doc')
      .withMergeDirective('CalendarDate.Calendar.School', 'Section.CourseOffering.Session.School')
      .withMergeDirective('CalendarDate.Calendar.SchoolYear', 'Section.CourseOffering.Session.SchoolYear')
      .withEndDomainEntity()

      .withStartDomainEntity('Section')
      .withDocumentation('doc')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CalendarDate')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Calendar', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Calendar')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('SectionAttendanceTakenEvent');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.calendarDateReference.schoolId",
          "targetJsonPath": "$.sectionReference.schoolId",
        },
        Object {
          "sourceJsonPath": "$.calendarDateReference.schoolYear",
          "targetJsonPath": "$.sectionReference.schoolYear",
        },
      ]
    `);
  });
});

describe('when merging on a reference with multiple levels of domain entities below it', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Section', 'doc')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withMergeDirective('CourseOffering', 'Section.CourseOffering')
      .withEndDomainEntity()

      .withStartDomainEntity('Section')
      .withDocumentation('doc')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withDomainEntityIdentity('CalendarDate', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CalendarDate')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Calendar', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Calendar')
      .withDocumentation('doc')
      .withIntegerIdentity('Days', 'doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('DomainEntityName');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.courseOfferingReference.days",
          "targetJsonPath": "$.sectionReference.days",
        },
        Object {
          "sourceJsonPath": "$.courseOfferingReference.schoolId",
          "targetJsonPath": "$.sectionReference.schoolId",
        },
        Object {
          "sourceJsonPath": "$.courseOfferingReference.schoolYear",
          "targetJsonPath": "$.sectionReference.schoolYear",
        },
      ]
    `);
  });
});

describe('when merging on a reference through a choice', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentCompetencyObjective')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Student', 'doc')
      .withChoiceProperty('StudentCompetencyObjectiveChoice', 'doc', false, false)
      .withMergeDirective('StudentCompetencyObjectiveChoice.StudentSectionAssociation.Student', 'Student')
      .withEndDomainEntity()

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withIntegerIdentity('StudentId', 'doc')
      .withEndDomainEntity()

      .withStartChoice('StudentCompetencyObjectiveChoice')
      .withDocumentation('doc')
      .withAssociationProperty('StudentSectionAssociation', 'doc', false, true)
      .withEndChoice()

      .withStartAssociation('StudentSectionAssociation')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('Student', 'doc')
      .withAssociationDomainEntityProperty('Section', 'doc')
      .withEndAssociation()

      .withStartDomainEntity('Section')
      .withDocumentation('doc')
      .withIntegerIdentity('SectionId', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    associationReferenceEnhancer(metaEd);
    choiceReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentCompetencyObjective');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentId",
          "targetJsonPath": "$.studentReference.studentId",
        },
      ]
    `);
  });
});

describe('when merging on a reference through a common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('StudentAssessment')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Assessment', 'doc')
      .withCommonProperty('StudentAssessmentItem', 'doc', false, true)
      .withMergeDirective('StudentAssessmentItem.AssessmentItem.Assessment', 'Assessment')
      .withEndDomainEntity()

      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('AssessmentItem')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Assessment', 'doc')
      .withEndDomainEntity()

      .withStartCommon('StudentAssessmentItem')
      .withDocumentation('doc')
      .withDomainEntityIdentity('AssessmentItem', 'doc')
      .withEndCommon()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    jsonSchemaEnhancer(metaEd);
    jsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentAssessment');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.items[*].assessmentItemReference.assessmentId",
          "targetJsonPath": "$.assessmentReference.assessmentId",
        },
      ]
    `);
  });
});
