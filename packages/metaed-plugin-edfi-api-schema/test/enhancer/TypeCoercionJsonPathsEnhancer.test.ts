// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import Ajv from 'ajv';
import addFormatsTo from 'ajv-formats';
import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newPluginEnvironment,
  newNamespace,
  DomainEntityExtensionBuilder,
} from '@edfi/metaed-core';
import { domainEntityReferenceEnhancer } from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as namespaceSetupEnhancer } from '../../src/model/Namespace';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as jsonSchemaForInsertEnhancer } from '../../src/enhancer/JsonSchemaForInsertEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as mergeDirectiveEqualityConstraintEnhancer } from '../../src/enhancer/MergeDirectiveEqualityConstraintEnhancer';
import { enhance as resourceNameEnhancer } from '../../src/enhancer/ResourceNameEnhancer';
import { enhance as identityFullnameEnhancer } from '../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as subclassIdentityFullnameEnhancer } from '../../src/enhancer/SubclassIdentityFullnameEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as typeCoercionJsonPathsEnhancer } from '../../src/enhancer/TypeCoercionJsonPathsEnhancer';
import { enhance } from '../../src/enhancer/IdentityJsonPathsEnhancer';

const ajv = new Ajv({ allErrors: true });
addFormatsTo(ajv);

function runApiSchemaEnhancers(metaEd: MetaEdEnvironment) {
  namespaceSetupEnhancer(metaEd);
  entityPropertyApiSchemaDataSetupEnhancer(metaEd);
  entityApiSchemaDataSetupEnhancer(metaEd);
  subclassPropertyNamingCollisionEnhancer(metaEd);
  referenceComponentEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);
  propertyCollectingEnhancer(metaEd);
  subclassPropertyCollectingEnhancer(metaEd);
  apiEntityMappingEnhancer(metaEd);
  subclassApiEntityMappingEnhancer(metaEd);
  jsonSchemaForInsertEnhancer(metaEd);
  allJsonPathsMappingEnhancer(metaEd);
  mergeDirectiveEqualityConstraintEnhancer(metaEd);
  resourceNameEnhancer(metaEd);
  documentPathsMappingEnhancer(metaEd);
  identityFullnameEnhancer(metaEd);
  subclassIdentityFullnameEnhancer(metaEd);
  typeCoercionJsonPathsEnhancer(metaEd);
  enhance(metaEd);
}

describe('when building simple domain entity with all the simple non-collections', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('OptionalBooleanProperty', 'doc1', false, false)
      .withCurrencyProperty('RequiredCurrencyProperty', 'doc2', true, false)
      .withDecimalProperty('OptionalDecimalProperty', 'doc3', false, false, '2', '1')
      .withDurationProperty('RequiredDurationProperty', 'doc4', true, false)
      .withPercentProperty('OptionalPercentProperty', 'doc5', false, false)
      .withDateProperty('RequiredDateProperty', 'doc6', true, false)
      .withDatetimeProperty('RequiredDatetimeProperty', 'doc7', true, false)
      .withIntegerProperty('RequiredIntegerProperty', 'doc8', true, false, '10', '5')
      .withShortProperty('OptionalShortProperty', 'doc9', false, false)
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withTimeProperty('RequiredTimeProperty', 'doc11', true, false)
      .withEnumerationProperty('SchoolYear', 'doc12', false, false)
      .withYearProperty('OptionalYear', 'doc13', false, false)
      .withSharedDecimalProperty('OptionalSharedDecimalProperty', null, 'doc14', false, false)
      .withSharedIntegerProperty('OptionalSharedIntegerProperty', null, 'doc15', false, false)
      .withSharedShortProperty('OptionalSharedShortProperty', null, 'doc16', false, false)
      .withSharedStringProperty('RequiredSharedStringProperty', null, 'doc17', true, false)
      .withDatetimeProperty('OptionalDateTimeProperty', '', false, false)
      .withDatetimeIdentity('DateTimeIdentity', '')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct booleanJsonPaths for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const booleanJsonPaths = entity?.data.edfiApiSchema.booleanJsonPaths;
    expect(booleanJsonPaths).toMatchInlineSnapshot(`
        Array [
          "$.optionalBooleanProperty",
        ]
      `);
  });

  it('should be correct numericJsonPaths for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const numericJsonPaths = entity?.data.edfiApiSchema.numericJsonPaths;
    expect(numericJsonPaths).toMatchInlineSnapshot(`
        Array [
          "$.optionalDecimalProperty",
          "$.optionalPercentProperty",
          "$.optionalSharedDecimalProperty",
          "$.optionalSharedIntegerProperty",
          "$.optionalSharedShortProperty",
          "$.optionalShortProperty",
          "$.optionalYear",
          "$.requiredCurrencyProperty",
          "$.requiredDurationProperty",
          "$.requiredIntegerProperty",
          "$.schoolYearTypeReference.schoolYear",
        ]
      `);
  });

  it('should be correct dateTimeJsonPaths for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const dateTimeJsonPaths = entity?.data.edfiApiSchema.dateTimeJsonPaths;
    expect(dateTimeJsonPaths).toMatchInlineSnapshot(`
      Array [
        "$.dateTimeIdentity",
        "$.optionalDateTimeProperty",
        "$.requiredDatetimeProperty",
      ]
    `);
  });
});

describe('when building domain entity with collections', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('AssessmentScoreRangeLearningStandard')
      .withDocumentation('doc')
      .withIntegerIdentity('ScoreRangeId', 'doc')
      .withDomainEntityProperty('LearningStandard', 'doc', true, true)
      .withEndDomainEntity()

      .withStartDomainEntity('LearningStandard')
      .withDocumentation('doc')
      .withIntegerIdentity('LearningStandardId', 'doc')
      .withDatetimeIdentity('SomeDateTime', 'doc')
      .withEndDomainEntity()

      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct booleanJsonPaths and numericJsonPaths for AssessmentScoreRangeLearningStandard', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('AssessmentScoreRangeLearningStandard');
    const booleanJsonPaths = entity?.data.edfiApiSchema.booleanJsonPaths;
    const dateTimeJsonPaths = entity?.data.edfiApiSchema.dateTimeJsonPaths;
    const numericJsonPaths = entity?.data.edfiApiSchema.numericJsonPaths;

    expect(booleanJsonPaths).toMatchInlineSnapshot(`Array []`);

    expect(dateTimeJsonPaths).toMatchInlineSnapshot(`
      Array [
        "$.learningStandards[*].learningStandardReference.someDateTime",
      ]
    `);

    expect(numericJsonPaths).toMatchInlineSnapshot(`
        Array [
          "$.learningStandards[*].learningStandardReference.learningStandardId",
          "$.scoreRangeId",
        ]
      `);
  });
});

describe('when building domain entity extension with all the simple non-collections', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'Extension';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withStringIdentity('StringIdentity', 'doc', '30', '20')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(namespaceName)
      .withStartDomainEntityExtension(domainEntityName)
      .withBooleanProperty('OptionalBooleanProperty', 'doc', false, false)
      .withCurrencyProperty('RequiredCurrencyProperty', 'doc', true, false)
      .withDecimalProperty('OptionalDecimalProperty', 'doc', false, false, '2', '1')
      .withDurationProperty('RequiredDurationProperty', 'doc', true, false)
      .withPercentProperty('OptionalPercentProperty', 'doc', false, false)
      .withDateProperty('RequiredDateProperty', 'doc', true, false)
      .withDatetimeProperty('RequiredDatetimeProperty', 'doc', true, false)
      .withIntegerProperty('RequiredIntegerProperty', 'doc', true, false, '10', '5')
      .withShortProperty('OptionalShortProperty', 'doc', false, false)
      .withStringProperty('StringIdentity', 'doc', false, false, '30')
      .withTimeProperty('RequiredTimeProperty', 'doc', true, false)
      .withEnumerationProperty('SchoolYear', 'doc', false, false)
      .withYearProperty('OptionalYear', 'doc', false, false)
      .withSharedDecimalProperty('OptionalSharedDecimalProperty', null, 'doc', false, false)
      .withSharedIntegerProperty('OptionalSharedIntegerProperty', null, 'doc', false, false)
      .withSharedShortProperty('OptionalSharedShortProperty', null, 'doc', false, false)
      .withSharedStringProperty('RequiredSharedStringProperty', null, 'doc', true, false)
      .withDatetimeProperty('OptionalDateTimeProperty', '', false, false)
      .withDatetimeIdentity('DateTimeIdentity', '')
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    metaEd.namespace.get(namespaceName)?.dependencies.push(metaEd.namespace.get('EdFi') ?? newNamespace());

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct booleanJsonPaths for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntityExtension.get(domainEntityName);
    const booleanJsonPaths = entity?.data.edfiApiSchema.booleanJsonPaths;
    expect(booleanJsonPaths).toMatchInlineSnapshot(`
      Array [
        "$._ext.edfi.optionalBooleanProperty",
      ]
    `);
  });

  it('should be correct dateTimeJsonPaths for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntityExtension.get(domainEntityName);
    const dateTimeJsonPaths = entity?.data.edfiApiSchema.dateTimeJsonPaths;
    expect(dateTimeJsonPaths).toMatchInlineSnapshot(`
      Array [
        "$._ext.edfi.dateTimeIdentity",
        "$._ext.edfi.optionalDateTimeProperty",
        "$._ext.edfi.requiredDatetimeProperty",
      ]
    `);
  });

  it('should be correct numericJsonPaths for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntityExtension.get(domainEntityName);
    const numericJsonPaths = entity?.data.edfiApiSchema.numericJsonPaths;
    expect(numericJsonPaths).toMatchInlineSnapshot(`
      Array [
        "$._ext.edfi.optionalDecimalProperty",
        "$._ext.edfi.optionalPercentProperty",
        "$._ext.edfi.optionalSharedDecimalProperty",
        "$._ext.edfi.optionalSharedIntegerProperty",
        "$._ext.edfi.optionalSharedShortProperty",
        "$._ext.edfi.optionalShortProperty",
        "$._ext.edfi.optionalYear",
        "$._ext.edfi.requiredCurrencyProperty",
        "$._ext.edfi.requiredDurationProperty",
        "$._ext.edfi.requiredIntegerProperty",
        "$._ext.edfi.schoolYearTypeReference.schoolYear",
      ]
    `);
  });
});
