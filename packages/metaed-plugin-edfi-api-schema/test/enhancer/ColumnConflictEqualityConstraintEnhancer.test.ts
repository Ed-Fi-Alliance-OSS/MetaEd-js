// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  AssociationBuilder,
  ChoiceBuilder,
  CommonBuilder,
  EnumerationBuilder,
  DomainEntityExtensionBuilder,
  AssociationExtensionBuilder,
} from '@edfi/metaed-core';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as mergeJsonPathsMappingEnhancer } from '../../src/enhancer/MergeJsonPathsMappingEnhancer';

import { enhance } from '../../src/enhancer/ColumnConflictEqualityConstraintEnhancer';
import { metaEdPluginEnhancers } from '../integration/PluginHelper';

describe('when collection property conflicts with parent identity', () => {
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
      // Would normally go here: .withMergeDirective('GradingPeriod.SchoolYear', 'SchoolYear')
      .withEndDomainEntity()

      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEnumerationItem('2022')
      .withEndEnumeration()

      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.schoolYearTypeReference.schoolYear",
          "targetJsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
        },
      ]
    `);
  });
});

describe('when non-collection properties have naming conflict', () => {
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
      // Would normally go here: .withMergeDirective('School', 'Session.School')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('CourseOffering');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.sessionReference.schoolId",
          "targetJsonPath": "$.schoolReference.schoolId",
        },
      ]
    `);
  });
});

describe('when collection has multiple conflicts with parent identities', () => {
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
      // Would normally go here: .withMergeDirective('GradingPeriod.SchoolYear', 'SchoolYear')
      // Would normally go here: .withMergeDirective('GradingPeriod.School', 'School')
      .withEndDomainEntity()

      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEnumerationItem('2022')
      .withEndEnumeration()

      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.schoolYearTypeReference.schoolYear",
          "targetJsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolYear",
        },
        Object {
          "sourceJsonPath": "$.schoolReference.schoolId",
          "targetJsonPath": "$.gradingPeriods[*].gradingPeriodReference.schoolId",
        },
      ]
    `);
  });
});

describe('when collection conflict occurs through nested references', () => {
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
      // Would normally go here: .withMergeDirective('ClassPeriod.School', 'Section.CourseOffering.Session.School')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('StudentSectionAttendanceEvent');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.sectionReference.schoolId",
          "targetJsonPath": "$.classPeriods[*].classPeriodReference.schoolId",
        },
      ]
    `);
  });
});

describe('when collection conflict occurs through nested scalar property', () => {
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
      // Would normally go here: .withMergeDirective('ClassPeriod.School.SchoolId', 'Section.CourseOffering.Session.School.SchoolId')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('StudentSectionAttendanceEvent');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.sectionReference.schoolId",
          "targetJsonPath": "$.classPeriods[*].classPeriodReference.schoolId",
        },
      ]
    `);
  });
});

describe('when reference properties conflict across all identity types', () => {
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
      // Would normally go here: .withMergeDirective(
      //   `${domainEntityBeingMergedFrom}.${booleanProperty}`,
      //   `${domainEntityBeingMergedTo}.${booleanProperty}`,
      // )
      // Would normally go here: .withMergeDirective(`${domainEntityBeingMergedFrom}.${schoolYear}`, `${domainEntityBeingMergedTo}.${schoolYear}`)
      // Would normally go here: .withMergeDirective(
      //   `${domainEntityBeingMergedFrom}.${integerProperty}`,
      //   `${domainEntityBeingMergedTo}.${integerProperty}`,
      // )
      // Would normally go here: .withMergeDirective(
      //   `${domainEntityBeingMergedFrom}.${stringProperty}`,
      //   `${domainEntityBeingMergedTo}.${stringProperty}`,
      // )
      .withDomainEntityIdentity(domainEntityBeingMergedTo, 'doc')
      .withEndDomainEntity()

      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEnumerationItem('2022')
      .withEndEnumeration()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
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

describe('when conflicts occur in both reference and scalar properties through nesting', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('SectionAttendanceTakenEvent')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Section', 'doc')
      .withDomainEntityIdentity('CalendarDate', 'doc')
      // Would normally go here: .withMergeDirective('CalendarDate.Calendar.School', 'Section.CourseOffering.Session.School')
      // Would normally go here: .withMergeDirective('CalendarDate.Calendar.SchoolYear', 'Section.CourseOffering.Session.SchoolYear')
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

      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEnumerationItem('2022')
      .withEndEnumeration()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('SectionAttendanceTakenEvent');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.sectionReference.schoolId",
          "targetJsonPath": "$.calendarDateReference.schoolId",
        },
        Object {
          "sourceJsonPath": "$.sectionReference.schoolYear",
          "targetJsonPath": "$.calendarDateReference.schoolYear",
        },
      ]
    `);
  });
});

describe('when deeply nested reference creates conflict', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('DomainEntityName')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Section', 'doc')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      // Would normally go here: .withMergeDirective('CourseOffering', 'Section.CourseOffering')
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

      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEnumerationItem('2022')
      .withEndEnumeration()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('DomainEntityName');

    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.sectionReference.schoolId",
          "targetJsonPath": "$.courseOfferingReference.schoolId",
        },
        Object {
          "sourceJsonPath": "$.sectionReference.days",
          "targetJsonPath": "$.courseOfferingReference.days",
        },
        Object {
          "sourceJsonPath": "$.sectionReference.schoolYear",
          "targetJsonPath": "$.courseOfferingReference.schoolYear",
        },
      ]
    `);
  });
});

describe('when reference through choice has conflict', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentCompetencyObjective')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Student', 'doc')
      .withChoiceProperty('StudentCompetencyObjectiveChoice', 'doc', false, false)
      // Would normally go here: .withMergeDirective('StudentCompetencyObjectiveChoice.StudentSectionAssociation.Student', 'Student')
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

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentCompetencyObjective');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.studentReference.studentId",
          "targetJsonPath": "$.studentSectionAssociations[*].studentSectionAssociationReference.studentId",
        },
      ]
    `);
  });
});

describe('when reference through common collection has conflict', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('StudentAssessment')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Assessment', 'doc')
      .withCommonProperty('StudentAssessmentItem', 'doc', false, true)
      // Would normally go here: .withMergeDirective('StudentAssessmentItem.AssessmentItem.Assessment', 'Assessment')
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

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
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

describe('when domain entity extension creates conflict', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.dataStandardVersion = '5.0.0';
  const coreNamespaceName = 'EdFi';
  const extensionNamespaceName = 'Extension';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
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
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extensionNamespaceName, extensionNamespaceName)
      .withStartDomainEntityExtension(`${coreNamespaceName}.CourseOffering`)
      .withDomainEntityElement(`${coreNamespaceName}.Session`)
      .withDocumentation('doc')
      .withOptionalPropertyIndicator()
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    const coreNamespace = metaEd.namespace.get(coreNamespaceName);
    const extensionNamespace = metaEd.namespace.get(extensionNamespaceName);
    extensionNamespace?.dependencies.push(coreNamespace!);

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(extensionNamespaceName)?.entity.domainEntityExtension.get('CourseOffering');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$._ext.extension.sessionReference.schoolId",
          "targetJsonPath": "$.schoolReference.schoolId",
        },
      ]
    `);
  });
});

describe('when association extension creates conflict', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.dataStandardVersion = '5.0.0';
  const coreNamespaceName = 'EdFi';
  const extensionNamespaceName = 'Extension';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
      .withStartAssociation('StudentSchoolAssociation')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('Student', 'doc')
      .withAssociationDomainEntityProperty('School', 'doc')
      .withEndAssociation()

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withIntegerIdentity('StudentId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extensionNamespaceName, extensionNamespaceName)
      .withStartAssociationExtension(`${coreNamespaceName}.StudentSchoolAssociation`)
      .withDomainEntityElement(`${coreNamespaceName}.Session`)
      .withDocumentation('doc')
      .withOptionalPropertyIndicator()
      .withEndAssociationExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    const coreNamespace = metaEd.namespace.get(coreNamespaceName);
    const extensionNamespace = metaEd.namespace.get(extensionNamespaceName);
    extensionNamespace?.dependencies.push(coreNamespace!);

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(extensionNamespaceName)?.entity.associationExtension.get('StudentSchoolAssociation');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$._ext.extension.sessionReference.schoolId",
          "targetJsonPath": "$.schoolReference.schoolId",
        },
      ]
    `);
  });
});

describe('when merge directive uses UniqueId property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentAssessmentRegistration')
      .withDocumentation('doc')
      .withDomainEntityIdentity('StudentEducationOrganizationAssessmentAccommodation', 'doc')
      .withMergeDirective(
        'StudentEducationOrganizationAssessmentAccommodation.Student.StudentUniqueId',
        'StudentSchoolAssociation.Student.StudentUniqueId',
      )
      .withEndDomainEntity()

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('UniqueId', 'doc', '30', null, 'Student')
      .withEndDomainEntity()

      .withStartDomainEntity('StudentEducationOrganizationAssessmentAccommodation')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Student', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('StudentSchoolAssociation')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Student', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should not crash - no column conflicts though due to merge directives', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentAssessmentRegistration');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when common collection has partial identity match', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'CandidateEducatorPreparationProgramAssociation';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withDateIdentity('BeginDate', 'doc')
      .withCommonProperty('DegreeSpecialization', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('DegreeSpecialization')
      .withDocumentation('doc')
      .withDateIdentity('BeginDate', 'doc')
      .withStringIdentity('MajorSpecialization', 'doc', '255')
      .withStringProperty('MinorSpecialization', 'doc', false, false, '255')
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should not create equality constraints for partial identity matches', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when common collection has non-identity conflict with other identities', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'CandidateEducatorPreparationProgramAssociationVariation';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withDateIdentity('BeginDate', 'doc')
      .withCommonProperty('DegreeSpecialization', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('DegreeSpecialization')
      .withDocumentation('doc')
      .withDateProperty('BeginDate', 'doc', false, false)
      .withStringIdentity('MajorSpecialization', 'doc', '255')
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should not create equality constraints for non-identity in collection match', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when common collection has non-identity conflict without other identities', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'CandidateEducatorPreparationProgramAssociationVariation';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withDateIdentity('BeginDate', 'doc')
      .withCommonProperty('DegreeSpecialization', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('DegreeSpecialization')
      .withDocumentation('doc')
      .withDateProperty('BeginDate', 'doc', false, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create equality constraint for match because there is no other identity on collection', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.degreeSpecializations[*].beginDate",
          "targetJsonPath": "$.beginDate",
        },
      ]
    `);
  });
});

describe('when common collection has multiple partial identity matches', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'CandidateEducatorPreparationProgramAssociationVariation';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withDateIdentity('BeginDate', 'doc')
      .withStringIdentity('MajorSpecialization', 'doc', '255')
      .withCommonProperty('DegreeSpecialization', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('DegreeSpecialization')
      .withDocumentation('doc')
      .withDateIdentity('BeginDate', 'doc')
      .withStringIdentity('MajorSpecialization', 'doc', '255')
      .withStringIdentity('MinorSpecialization', 'doc', '255')
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should not create equality constraints for partial identity matches', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when common collection has single full identity match', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'CandidateEducatorPreparationProgramAssociationVariation';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withDateIdentity('BeginDate', 'doc')
      .withDateIdentity('EndDate', 'doc')
      .withCommonProperty('DegreeSpecialization', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('DegreeSpecialization')
      .withDocumentation('doc')
      .withDateIdentity('BeginDate', 'doc')
      .withStringProperty('MajorSpecialization', 'doc', false, false, '255')
      .withStringProperty('MinorSpecialization', 'doc', false, false, '255')
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create equality constraints for full identity match', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.degreeSpecializations[*].beginDate",
          "targetJsonPath": "$.beginDate",
        },
      ]
    `);
  });
});

describe('when common collection has multiple full identity matches', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'CandidateEducatorPreparationProgramAssociationVariation';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withDateIdentity('BeginDate', 'doc')
      .withStringIdentity('MajorSpecialization', 'doc', '255')
      .withCommonProperty('DegreeSpecialization', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('DegreeSpecialization')
      .withDocumentation('doc')
      .withDateIdentity('BeginDate', 'doc')
      .withStringIdentity('MajorSpecialization', 'doc', '255')
      .withStringProperty('MinorSpecialization', 'doc', false, false, '255')
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEdPluginEnhancers().forEach((enhancer) => enhancer(metaEd));
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create equality constraints for full identity match', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.degreeSpecializations[*].beginDate",
          "targetJsonPath": "$.beginDate",
        },
        Object {
          "sourceJsonPath": "$.degreeSpecializations[*].majorSpecialization",
          "targetJsonPath": "$.majorSpecialization",
        },
      ]
    `);
  });
});
