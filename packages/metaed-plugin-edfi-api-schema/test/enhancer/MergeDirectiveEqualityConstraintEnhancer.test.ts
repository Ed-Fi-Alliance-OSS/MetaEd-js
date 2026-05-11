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
  DomainEntityExtensionBuilder,
  AssociationExtensionBuilder,
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
import { enhance as mergeJsonPathsMappingEnhancer } from '../../src/enhancer/MergeJsonPathsMappingEnhancer';
import { enhance as mergeCoveringFlattenedIdentityPropertyEnhancer } from '../../src/enhancer/MergeCoveringFlattenedIdentityPropertyEnhancer';

import { enhance } from '../../src/enhancer/MergeDirectiveEqualityConstraintEnhancer';
import { metaEdPluginEnhancers } from '../integration/PluginHelper';

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
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
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
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
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

describe('when building domain entity extension with single merge directive', () => {
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
      .withMergeDirective('School', 'Session.School')
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
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(extensionNamespaceName)?.entity.domainEntityExtension.get('CourseOffering');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.schoolReference.schoolId",
          "targetJsonPath": "$._ext.${extensionNamespaceName.toLocaleLowerCase()}.sessionReference.schoolId",
        },
      ]
    `);
  });
});

describe('when building association extension with single merge directive', () => {
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
      .withMergeDirective('School', 'Session.School')
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
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should create the correct equality constraints', () => {
    const entity = metaEd.namespace.get(extensionNamespaceName)?.entity.associationExtension.get('StudentSchoolAssociation');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.schoolReference.schoolId",
          "targetJsonPath": "$._ext.${extensionNamespaceName.toLocaleLowerCase()}.sessionReference.schoolId",
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
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
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
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
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
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
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
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
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
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
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
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
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
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
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
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
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

describe('when a role named merge follows a role named merge with school year enumeration as one leaf target', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('ReportCard')
      .withDocumentation('doc')
      .withIntegerIdentity('ReportCardIdentity', 'doc')
      .withDomainEntityIdentity('GradingPeriod', 'doc', 'GradingPeriod')
      .withDomainEntityProperty('Grade', 'doc', false, true)
      .withMergeDirective('Grade.GradingPeriod', 'GradingPeriod')
      .withEndDomainEntity()

      .withStartDomainEntity('Grade')
      .withDocumentation('doc')
      .withDomainEntityIdentity('GradingPeriod', 'doc', 'GradingPeriod')
      .withMergeDirective('GradingPeriod.School', 'Session.School')
      .withMergeDirective('GradingPeriod.SchoolYear', 'Session.SchoolYear')
      .withDomainEntityIdentity('Session', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withIntegerIdentity('SessionIdentity', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('GradingPeriod')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withIntegerIdentity('GradingPeriodIdentity', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
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
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have any equality constraints', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('ReportCard');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.grades[*].gradeReference.gradingPeriodIdentity",
          "targetJsonPath": "$.gradingPeriodReference.gradingPeriodIdentity",
        },
        Object {
          "sourceJsonPath": "$.grades[*].gradeReference.schoolId",
          "targetJsonPath": "$.gradingPeriodReference.schoolId",
        },
        Object {
          "sourceJsonPath": "$.grades[*].gradeReference.gradingPeriodSchoolYear",
          "targetJsonPath": "$.gradingPeriodReference.schoolYear",
        },
      ]
    `);
  });
});

describe('when a merge directive routes through a common collection to a reference whose identity is merged-away', () => {
  // Regression for the case where the merge source path passes through a common (or choice / inline common)
  // before reaching a reference whose internal identity is merged-away. The covering JsonPath has to be located
  // by FlattenedIdentityProperty identity rather than by reconstructing a path from initialPropertyPath, since
  // initialPropertyPath only captures the top-level segment and would drop the intermediate common.
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('ReportCard')
      .withDocumentation('doc')
      .withIntegerIdentity('ReportCardIdentity', 'doc')
      .withDomainEntityIdentity('GradingPeriod', 'doc', 'GradingPeriod')
      .withCommonProperty('GradeItem', 'doc', false, true)
      .withMergeDirective('GradeItem.Grade.GradingPeriod', 'GradingPeriod')
      .withEndDomainEntity()

      .withStartCommon('GradeItem')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Grade', 'doc')
      .withEndCommon()

      .withStartDomainEntity('Grade')
      .withDocumentation('doc')
      .withDomainEntityIdentity('GradingPeriod', 'doc', 'GradingPeriod')
      .withMergeDirective('GradingPeriod.School', 'Session.School')
      .withDomainEntityIdentity('Session', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('GradingPeriod')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withIntegerIdentity('GradingPeriodIdentity', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withIntegerIdentity('SessionIdentity', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEndDomainEntity()
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
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should produce equality constraints using the covering canonical JsonPath under the common path', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('ReportCard');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.gradeItems[*].gradeReference.gradingPeriodIdentity",
          "targetJsonPath": "$.gradingPeriodReference.gradingPeriodIdentity",
        },
        Object {
          "sourceJsonPath": "$.gradeItems[*].gradeReference.schoolId",
          "targetJsonPath": "$.gradingPeriodReference.schoolId",
        },
      ]
    `);
  });
});

describe('when a merge directive is on one of two role-named references to the same entity that has its own internal merge', () => {
  // Regression for the case where the entity contains two role-named references to the same entity
  // (here Interim/Final both reference Grade), and only one of them hosts a merge directive that
  // descends into an identity property covered by Grade's own internal merge. The covering JsonPath
  // must come from the same role-named branch as the source merge directive: a global scan of the
  // entity's mergeJsonPathsMapping for any pair sharing the covering FlattenedIdentityProperty
  // can return the wrong branch, because the covering FIP is reused across both branches.
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('ReportCard')
      .withDocumentation('doc')
      .withIntegerIdentity('ReportCardIdentity', 'doc')
      .withDomainEntityIdentity('GradingPeriod', 'doc', 'GradingPeriod')
      .withDomainEntityProperty('Grade', 'doc', false, true, false, 'Interim')
      .withDomainEntityProperty('Grade', 'doc', false, true, false, 'Final')
      .withMergeDirective('FinalGrade.GradingPeriod', 'GradingPeriod')
      .withEndDomainEntity()

      .withStartDomainEntity('Grade')
      .withDocumentation('doc')
      .withDomainEntityIdentity('GradingPeriod', 'doc', 'GradingPeriod')
      .withMergeDirective('GradingPeriod.School', 'Session.School')
      .withDomainEntityIdentity('Session', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('GradingPeriod')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withIntegerIdentity('GradingPeriodIdentity', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withIntegerIdentity('SessionIdentity', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
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
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should produce equality constraints whose covering JSON path stays on the FinalGrade branch', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('ReportCard');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.finalGrades[*].finalGradeReference.gradingPeriodIdentity",
          "targetJsonPath": "$.gradingPeriodReference.gradingPeriodIdentity",
        },
        Object {
          "sourceJsonPath": "$.finalGrades[*].finalGradeReference.schoolId",
          "targetJsonPath": "$.gradingPeriodReference.schoolId",
        },
      ]
    `);
  });
});

describe('when a merge directive descends into a role-named reference whose internal identity is merged-away on the target side', () => {
  // Inverse of the previous test. The merge directive is hosted on the top-level GradingPeriod
  // identity and targets FinalGrade.GradingPeriod, whose internal SchoolId identity is merged-away
  // within Grade. Without target-side merge coverage adjustment, the targetJsonPath would point at
  // the role-name-prefixed gradingPeriodSchoolId field, which doesn't exist in the API document.
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('ReportCard')
      .withDocumentation('doc')
      .withIntegerIdentity('ReportCardIdentity', 'doc')
      .withDomainEntityIdentity('GradingPeriod', 'doc', 'GradingPeriod')
      .withDomainEntityProperty('Grade', 'doc', false, true, false, 'Interim')
      .withDomainEntityProperty('Grade', 'doc', false, true, false, 'Final')
      .withMergeDirective('GradingPeriod', 'FinalGrade.GradingPeriod')
      .withEndDomainEntity()

      .withStartDomainEntity('Grade')
      .withDocumentation('doc')
      .withDomainEntityIdentity('GradingPeriod', 'doc', 'GradingPeriod')
      .withMergeDirective('GradingPeriod.School', 'Session.School')
      .withDomainEntityIdentity('Session', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('GradingPeriod')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withIntegerIdentity('GradingPeriodIdentity', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withIntegerIdentity('SessionIdentity', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
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
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should produce equality constraints whose target covering JSON path stays on the FinalGrade branch', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('ReportCard');
    expect(entity?.data.edfiApiSchema.equalityConstraints).toMatchInlineSnapshot(`
      Array [
        Object {
          "sourceJsonPath": "$.gradingPeriodReference.gradingPeriodIdentity",
          "targetJsonPath": "$.finalGrades[*].finalGradeReference.gradingPeriodIdentity",
        },
        Object {
          "sourceJsonPath": "$.gradingPeriodReference.schoolId",
          "targetJsonPath": "$.finalGrades[*].finalGradeReference.schoolId",
        },
      ]
    `);
  });
});
