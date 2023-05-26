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
import { enhance as apiMergeDirectiveEnhancer } from '../../src/enhancer/EqualityConstraintEnhancer';
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

  it('equalityConstraints property has one element', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping.equalityConstraints.length).toBe(1);
  });

  it('recognizes the SchoolYear merge', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping.equalityConstraints[0].sourceJsonPath).toBe('$.gradingPeriods[*].gradingPeriodReference.schoolYear');
    expect(apiMapping.equalityConstraints[0].targetJsonPath).toBe('$.schoolYearTypeReference.schoolYear');
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

  it('equalityConstraints property has one element', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('CourseOffering');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping.equalityConstraints.length).toBe(1);
  });

  it('recognizes the School merge', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('CourseOffering');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping.equalityConstraints[0].sourceJsonPath).toBe('$.schoolReference.schoolId');
    expect(apiMapping.equalityConstraints[0].targetJsonPath).toBe('$.sessionReference.schoolId');
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

  it('equalityConstraints property has one element', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping.equalityConstraints.length).toBe(2);
  });

  it('recognizes the SchoolYear merge', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping.equalityConstraints[0].sourceJsonPath).toBe('$.gradingPeriods[*].gradingPeriodReference.schoolYear');
    expect(apiMapping.equalityConstraints[0].targetJsonPath).toBe('$.schoolYearTypeReference.schoolYear');
  });

  it('recognizes the School merge', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping.equalityConstraints[1].sourceJsonPath).toBe('$.gradingPeriods[*].gradingPeriodReference.schoolId');
    expect(apiMapping.equalityConstraints[1].targetJsonPath).toBe('$.schoolReference.schoolId');
  });
});

describe('when building domain entity with DomainEntity collection and single merge directive - 4 elements on target chain', () => {
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
    apiMergeDirectiveEnhancer(metaEd);
  });

  it('equalityConstraints property has one element', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('StudentSectionAttendanceEvent');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping.equalityConstraints.length).toBe(1);
  });

  it('recognizes the SchoolId merge', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('StudentSectionAttendanceEvent');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;

    expect(apiMapping.equalityConstraints[0].sourceJsonPath).toBe('$.classPeriods[*].classPeriodReference.schoolId');
    expect(apiMapping.equalityConstraints[0].targetJsonPath).toBe('$.sectionReference.schoolId');
  });
});
