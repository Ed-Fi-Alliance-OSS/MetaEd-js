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
      .withStringIdentity('GradingPeriodIdentity', 'doc', '30')
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

  it('merges property has one element', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping.merges.length).toBe(1);
  });

  it('source element on merge property has a correct JsonPath expression', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping.merges[0].mergeSource.fullPropertyName).toBe('SchoolYear');
    expect(apiMapping.merges[0].mergeSource.parentEntityName).toBe('GradingPeriod');
    expect(apiMapping.merges[0].mergeSource.JsonPath).toBe(
      '$.gradingPeriods[?(@.gradingPeriodReference.schoolYear=%value%)]',
    );
  });

  it('target element on merge property has a correct JsonPath expression', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('Session');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping.merges[0].mergeTarget.fullPropertyName).toBe('GradingPeriod');
    expect(apiMapping.merges[0].mergeTarget.parentEntityName).toBe('Session');
    expect(apiMapping.merges[0].mergeTarget.JsonPath).toBe('$.session.schoolYear');
  });
});
