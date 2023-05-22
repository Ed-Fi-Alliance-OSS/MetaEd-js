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
} from '@edfi/metaed-core';
import { domainEntityReferenceEnhancer, mergeDirectiveEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as apiMergeDirectiveEnhancer } from '../../src/enhancer/ApiMergeDirectiveEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';

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
    apiMergeDirectiveEnhancer(metaEd);
  });

  it('qualityConstraints property has one element', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping.qualityConstraints.length).toBe(1);
  });

  it('recognizes the SchoolYear merge', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping.qualityConstraints[0].mergeSource.fullPropertyName).toBe('SchoolYear');
    expect(apiMapping.qualityConstraints[0].mergeSource.parentEntityName).toBe('GradingPeriod');
    expect(apiMapping.qualityConstraints[0].mergeSource.jsonPath).toBe(
      '$.gradingPeriods[?(@.gradingPeriodReference.schoolYear=%value%)]',
    );

    expect(apiMapping.qualityConstraints[0].mergeTarget.fullPropertyName).toBe('SchoolYear');
    expect(apiMapping.qualityConstraints[0].mergeTarget.parentEntityName).toBe('Session');
    expect(apiMapping.qualityConstraints[0].mergeTarget.jsonPath).toBe('$.schoolYearTypeReference.schoolYear');
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
    apiMergeDirectiveEnhancer(metaEd);
  });

  it('qualityConstraints property has one element', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping.qualityConstraints.length).toBe(2);
  });

  it('recognizes the SchoolYear merge', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping.qualityConstraints[0].mergeSource.fullPropertyName).toBe('SchoolYear');
    expect(apiMapping.qualityConstraints[0].mergeSource.parentEntityName).toBe('GradingPeriod');
    expect(apiMapping.qualityConstraints[0].mergeSource.jsonPath).toBe(
      '$.gradingPeriods[?(@.gradingPeriodReference.schoolYear=%value%)]',
    );

    expect(apiMapping.qualityConstraints[0].mergeTarget.fullPropertyName).toBe('SchoolYear');
    expect(apiMapping.qualityConstraints[0].mergeTarget.parentEntityName).toBe('Session');
    expect(apiMapping.qualityConstraints[0].mergeTarget.jsonPath).toBe('$.schoolYearTypeReference.schoolYear');
  });

  it('recognizes the School merge', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping.qualityConstraints[1].mergeSource.fullPropertyName).toBe('School');
    expect(apiMapping.qualityConstraints[1].mergeSource.parentEntityName).toBe('GradingPeriod');
    expect(apiMapping.qualityConstraints[1].mergeSource.jsonPath).toBe(
      '$.gradingPeriods[?(@.gradingPeriodReference.schoolId=%value%)]',
    );

    expect(apiMapping.qualityConstraints[1].mergeTarget.fullPropertyName).toBe('School');
    expect(apiMapping.qualityConstraints[1].mergeTarget.parentEntityName).toBe('Session');
    expect(apiMapping.qualityConstraints[1].mergeTarget.jsonPath).toBe('$.schoolReference.schoolId');
  });
});

describe('when building domain entity with DomainEntity and single merge directive', () => {
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
    apiMergeDirectiveEnhancer(metaEd);
  });

  it('qualityConstraints property has one element', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('CourseOffering');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping.qualityConstraints.length).toBe(1);
  });

  it('recognizes the School merge', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('CourseOffering');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping.qualityConstraints[0].mergeSource.fullPropertyName).toBe('School');
    expect(apiMapping.qualityConstraints[0].mergeSource.parentEntityName).toBe('CourseOffering');
    expect(apiMapping.qualityConstraints[0].mergeSource.jsonPath).toBe('$.schoolReference.schoolId');

    expect(apiMapping.qualityConstraints[0].mergeTarget.fullPropertyName).toBe('School');
    expect(apiMapping.qualityConstraints[0].mergeTarget.parentEntityName).toBe('Session');
    expect(apiMapping.qualityConstraints[0].mergeTarget.jsonPath).toBe('$.sessionReference.schoolId');
  });
});
