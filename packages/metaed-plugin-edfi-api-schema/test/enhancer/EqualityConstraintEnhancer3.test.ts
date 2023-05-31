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
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance } from '../../src/enhancer/EqualityConstraintEnhancer';

describe('when a domain entity with integer identity is merged', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity('BalanceSheetDimension')
      .withDocumentation('doc')
      .withIntegerIdentity('LocalFiscalYear', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('ChartOfAccount')
      .withDocumentation('doc')
      .withIntegerIdentity('LocalFiscalYear', 'doc')
      .withDomainEntityProperty('BalanceSheetDimension', 'doc', false, false)
      .withMergeDirective('BalanceSheetDimension.LocalFiscalYear', 'LocalFiscalYear')
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

  it('should have created one equality constraint', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('ChartOfAccount');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping.equalityConstraints.length).toBe(1);
  });

  it('recognizes the equality constraint', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('ChartOfAccount');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping.equalityConstraints[0].sourceJsonPath).toBe('$.balanceSheetDimensionReference.localFiscalYear');
    expect(apiMapping.equalityConstraints[0].targetJsonPath).toBe('$.localFiscalYear');
  });
});

describe('when building domain entity with DomainEntity and single merge directive', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespace = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')

      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withStringIdentity('AssessmentIdentifier', 'doc', '30')
      .withEndDomainEntity()

      .withStartDomainEntity('ObjectiveAssessment')
      .withDocumentation('doc')
      .withDomainEntityIdentity('Assessment', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('AssessmentScoreRangeLearningStandard')
      .withDocumentation('doc')
      .withDomainEntityProperty('ObjectiveAssessment', 'doc', false, false)
      .withMergeDirective('ObjectiveAssessment.Assessment', 'Assessment')
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

  it('should have created one equality constraint', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('AssessmentScoreRangeLearningStandard');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping.equalityConstraints.length).toBe(1);
  });

  it('recognizes the equality constraint', () => {
    const sessionEntity = metaEd.namespace.get(namespace)?.entity.domainEntity.get('AssessmentScoreRangeLearningStandard');
    const apiMapping = sessionEntity?.data.edfiApiSchema.apiMapping;
    expect(apiMapping.equalityConstraints[0].sourceJsonPath).toBe('$.objectiveAssessmentReference.assessmentIdentifier');
    expect(apiMapping.equalityConstraints[0].targetJsonPath).toBe('$.assessmentReference.assessmentIdentifier');
  });
});
