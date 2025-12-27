/* eslint-disable no-underscore-dangle */
// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  DomainEntityBuilder,
  MetaEdEnvironment,
  MetaEdTextBuilder,
  Namespace,
  NamespaceBuilder,
  TopLevelEntity,
  newMetaEdEnvironment,
} from '@edfi/metaed-core';
import {
  associationExtensionBaseClassEnhancer,
  associationReferenceEnhancer,
  choiceReferenceEnhancer,
  commonReferenceEnhancer,
  commonSubclassBaseClassEnhancer,
  descriptorReferenceEnhancer,
  domainEntityExtensionBaseClassEnhancer,
  domainEntityReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  enumerationReferenceEnhancer,
  inlineCommonReferenceEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { EntityApiSchemaData, enhance as entityApiSchemaDataSetupEnhancer } from '../../../src/model/EntityApiSchemaData';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../../src/model/EntityPropertyApiSchemaData';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as mergeJsonPathsMappingEnhancer } from '../../../src/enhancer/MergeJsonPathsMappingEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as identityFullnameEnhancer } from '../../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as identityJsonPathsEnhancer } from '../../../src/enhancer/IdentityJsonPathsEnhancer';
import { enhance as decimalPropertyValidationInfoEnhancer } from '../../../src/enhancer/DecimalPropertyValidationInfoEnhancer';
import { enhance as typeCoercionJsonPathsEnhancer } from '../../../src/enhancer/TypeCoercionJsonPathsEnhancer';
import { enhance as commonExtensionOverrideResolverEnhancer } from '../../../src/enhancer/CommonExtensionOverrideResolverEnhancer';
import { enhance as relationalTableNodeEnhancer } from '../../../src/enhancer/relational/RelationalTableNodeEnhancer';
import { enhance as relationalJsonPathNamingPlanEnhancer } from '../../../src/enhancer/relational/RelationalJsonPathNamingPlanEnhancer';
import { enhance as relationalNamingPlanEnhancer } from '../../../src/enhancer/relational/RelationalNamingPlanEnhancer';
import { enhance as relationalNameOverrideBuilderEnhancer } from '../../../src/enhancer/relational/RelationalNameOverrideBuilderEnhancer';
import { enhance as relationalMetadataAssemblerEnhancer } from '../../../src/enhancer/relational/RelationalMetadataAssemblerEnhancer';
import type { RelationalMetadata } from '../../../src/model/api-schema/RelationalMetadata';

/**
 * Runs the shared enhancer prerequisites for relational metadata assembly tests.
 */
function runApiSchemaPrerequisites(metaEd: MetaEdEnvironment): void {
  // Core reference wiring
  domainEntityReferenceEnhancer(metaEd);
  associationReferenceEnhancer(metaEd);
  choiceReferenceEnhancer(metaEd);
  inlineCommonReferenceEnhancer(metaEd);
  commonReferenceEnhancer(metaEd);
  commonSubclassBaseClassEnhancer(metaEd);
  descriptorReferenceEnhancer(metaEd);
  enumerationReferenceEnhancer(metaEd);
  domainEntitySubclassBaseClassEnhancer(metaEd);
  domainEntityExtensionBaseClassEnhancer(metaEd);
  associationExtensionBaseClassEnhancer(metaEd);

  // Data initialization
  entityPropertyApiSchemaDataSetupEnhancer(metaEd);
  entityApiSchemaDataSetupEnhancer(metaEd);

  // Naming collisions
  subclassPropertyNamingCollisionEnhancer(metaEd);

  // Property collection and mapping
  referenceComponentEnhancer(metaEd);
  propertyCollectingEnhancer(metaEd);
  subclassPropertyCollectingEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);
  subclassPropertyCollectingEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);
  apiEntityMappingEnhancer(metaEd);
  subclassApiEntityMappingEnhancer(metaEd);

  // JsonPath and validation metadata
  allJsonPathsMappingEnhancer(metaEd);
  mergeJsonPathsMappingEnhancer(metaEd);
  documentPathsMappingEnhancer(metaEd);
  identityFullnameEnhancer(metaEd);
  identityJsonPathsEnhancer(metaEd);
  decimalPropertyValidationInfoEnhancer(metaEd);
  typeCoercionJsonPathsEnhancer(metaEd);

  // Extension overrides
  commonExtensionOverrideResolverEnhancer(metaEd);

  // Relational naming pipeline
  relationalTableNodeEnhancer(metaEd);
  relationalJsonPathNamingPlanEnhancer(metaEd);
  relationalNamingPlanEnhancer(metaEd);
  relationalNameOverrideBuilderEnhancer(metaEd);
  relationalMetadataAssemblerEnhancer(metaEd);
}

/**
 * Returns assembled relational metadata for the supplied entity.
 */
function relationalMetadataFor(entity: TopLevelEntity | undefined): RelationalMetadata | undefined {
  if (entity == null) return undefined;
  const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  return apiSchemaData.relational;
}

describe('when assembling relational metadata with name overrides', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'Assessment';
  let namespace: Namespace | undefined;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('AssessmentIdentifier', 'doc', '30', '20')
      .withStringProperty('AssessmentIdentificationCode', 'doc', false, true, '30', '20')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should include nameOverrides in relational metadata', () => {
    const entity = namespace?.entity.domainEntity.get(domainEntityName);
    expect(relationalMetadataFor(entity)).toMatchInlineSnapshot(`
      Object {
        "nameOverrides": Object {
          "$.identificationCodes[*]": "AssessmentIdentificationCode",
        },
      }
    `);
  });
});

describe('when assembling relational metadata without overrides', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: Namespace | undefined;

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
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should omit relational metadata when no overrides exist', () => {
    const entity = namespace?.entity.domainEntity.get(domainEntityName);
    expect(relationalMetadataFor(entity)).toMatchInlineSnapshot(`undefined`);
  });
});
