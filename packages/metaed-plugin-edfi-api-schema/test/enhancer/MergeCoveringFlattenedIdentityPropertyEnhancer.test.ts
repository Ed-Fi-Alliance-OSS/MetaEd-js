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
} from '@edfi/metaed-core';
import {
  associationReferenceEnhancer,
  domainEntityReferenceEnhancer,
  enumerationReferenceEnhancer,
  mergeDirectiveEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance } from '../../src/enhancer/MergeCoveringFlattenedIdentityPropertyEnhancer';

describe('when a role named resource has a schoolid merged away', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespace)
      .withStartDomainEntity('Grade')
      .withDocumentation('doc')
      .withDomainEntityIdentity('GradingPeriod', 'doc', 'GradingPeriod')
      .withMergeDirective('GradingPeriod.School', 'StudentSectionAssociation.Section.CourseOffering.Session.School')
      .withMergeDirective('GradingPeriod.SchoolYear', 'StudentSectionAssociation.Section.CourseOffering.Session.SchoolYear')
      .withAssociationIdentity('StudentSectionAssociation', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withIntegerIdentity('StudentId', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withMergeDirective('School', 'Session.School')
      .withEndDomainEntity()

      .withStartDomainEntity('Section')
      .withDocumentation('doc')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withEndDomainEntity()

      .withStartAssociation('StudentSectionAssociation')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Student', 'doc')
      .withDomainEntityIdentity('Section', 'doc')
      .withEndAssociation()

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
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    associationReferenceEnhancer(metaEd);
    enumerationReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should have GradingPeriod.School FIP pointing to merge covering FIP', () => {
    const entity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Grade');
    const apiMapping = entity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping?.flattenedIdentityProperties[1].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "GradingPeriod",
        "GradingPeriod.School",
        "GradingPeriod.School.SchoolId",
      ]
    `);

    expect(apiMapping?.flattenedIdentityProperties[1].mergeCoveredBy.propertyPaths).toMatchInlineSnapshot(`
      Array [
        "StudentSectionAssociation",
        "StudentSectionAssociation.Section",
        "StudentSectionAssociation.Section.CourseOffering",
        "StudentSectionAssociation.Section.CourseOffering.Session",
        "StudentSectionAssociation.Section.CourseOffering.Session.School",
        "StudentSectionAssociation.Section.CourseOffering.Session.School.SchoolId",
      ]
    `);
  });
});

describe('when a reference is to a resource that has a reference with two identity properties merged away', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'SurveySectionResponse';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('SSRIdentity', 'doc')
      .withDomainEntityIdentity('SurveySection', 'doc')
      .withDomainEntityIdentity('SurveyResponse', 'doc')
      .withMergeDirective('SurveyResponse.Survey', 'SurveySection.Survey')
      .withEndDomainEntity()

      .withStartDomainEntity('SurveySection')
      .withDocumentation('doc')
      .withIntegerIdentity('SurveySectionIdentity', 'doc')
      .withDomainEntityIdentity('Survey', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('SurveyResponse')
      .withDocumentation('doc')
      .withIntegerIdentity('SurveyResponseIdentity', 'doc')
      .withDomainEntityIdentity('Survey', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Survey')
      .withDocumentation('doc')
      .withIntegerIdentity('SurveyIdentifier', 'doc')
      .withIntegerIdentity('Namespace', 'doc')
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
    enhance(metaEd);
  });

  it('should have SurveySectionResponse.SurveyResponse FIP pointing to merge covering FIP', () => {
    const entity: any = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const { apiMapping } = entity.data.edfiApiSchema;

    expect(apiMapping?.flattenedIdentityProperties[1].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "SurveyResponse",
        "SurveyResponse.Survey",
        "SurveyResponse.Survey.Namespace",
      ]
    `);

    expect(apiMapping?.flattenedIdentityProperties[1].mergeCoveredBy.propertyPaths).toMatchInlineSnapshot(`
      Array [
        "SurveySection",
        "SurveySection.Survey",
        "SurveySection.Survey.Namespace",
      ]
    `);

    expect(apiMapping?.flattenedIdentityProperties[2].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "SurveyResponse",
        "SurveyResponse.Survey",
        "SurveyResponse.Survey.SurveyIdentifier",
      ]
    `);

    expect(apiMapping?.flattenedIdentityProperties[2].mergeCoveredBy.propertyPaths).toMatchInlineSnapshot(`
      Array [
        "SurveySection",
        "SurveySection.Survey",
        "SurveySection.Survey.SurveyIdentifier",
      ]
    `);
  });
});

describe('when a reference is to a resource that has two identity properties directly merged away', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'SurveySectionResponse';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('SSRIdentity', 'doc')
      .withDomainEntityIdentity('SurveySection', 'doc')
      .withDomainEntityIdentity('SurveyResponse', 'doc')
      .withMergeDirective('SurveyResponse.Survey.SurveyIdentifier', 'SurveySection.Survey.SurveyIdentifier')
      .withMergeDirective('SurveyResponse.Survey.Namespace', 'SurveySection.Survey.Namespace')
      .withEndDomainEntity()

      .withStartDomainEntity('SurveySection')
      .withDocumentation('doc')
      .withIntegerIdentity('SurveySectionIdentity', 'doc')
      .withDomainEntityIdentity('Survey', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('SurveyResponse')
      .withDocumentation('doc')
      .withIntegerIdentity('SurveyResponseIdentity', 'doc')
      .withDomainEntityIdentity('Survey', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Survey')
      .withDocumentation('doc')
      .withIntegerIdentity('SurveyIdentifier', 'doc')
      .withIntegerIdentity('Namespace', 'doc')
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
    enhance(metaEd);
  });

  it('should have SurveySectionResponse.SurveyResponse FIP pointing to merge covering FIP', () => {
    const entity: any = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const { apiMapping } = entity.data.edfiApiSchema;

    expect(apiMapping?.flattenedIdentityProperties[1].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "SurveyResponse",
        "SurveyResponse.Survey",
        "SurveyResponse.Survey.Namespace",
      ]
    `);

    expect(apiMapping?.flattenedIdentityProperties[1].mergeCoveredBy.propertyPaths).toMatchInlineSnapshot(`
      Array [
        "SurveySection",
        "SurveySection.Survey",
        "SurveySection.Survey.Namespace",
      ]
    `);

    expect(apiMapping?.flattenedIdentityProperties[2].propertyPaths).toMatchInlineSnapshot(`
      Array [
        "SurveyResponse",
        "SurveyResponse.Survey",
        "SurveyResponse.Survey.SurveyIdentifier",
      ]
    `);

    expect(apiMapping?.flattenedIdentityProperties[2].mergeCoveredBy.propertyPaths).toMatchInlineSnapshot(`
      Array [
        "SurveySection",
        "SurveySection.Survey",
        "SurveySection.Survey.SurveyIdentifier",
      ]
    `);
  });
});
