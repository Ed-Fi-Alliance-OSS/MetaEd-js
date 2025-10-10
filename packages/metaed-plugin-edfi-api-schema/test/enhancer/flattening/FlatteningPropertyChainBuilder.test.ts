// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntityBuilder,
  ChoiceBuilder,
  CommonBuilder,
  DomainEntitySubclassBuilder,
  DescriptorBuilder,
  EnumerationBuilder,
  newPluginEnvironment,
  AssociationBuilder,
  AssociationSubclassBuilder,
  DomainEntityExtensionBuilder,
  CommonExtensionBuilder,
  type TopLevelEntity,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  associationReferenceEnhancer,
  choiceReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  commonReferenceEnhancer,
  commonSubclassBaseClassEnhancer,
  descriptorReferenceEnhancer,
  enumerationReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  domainEntityExtensionBaseClassEnhancer,
  associationSubclassBaseClassEnhancer,
  mergeDirectiveEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { invariant } from 'ts-invariant';
import { buildFlatteningPropertyChains } from '../../../src/enhancer/flattening/FlatteningPropertyChainBuilder';
import { enhance as namespaceSetupEnhancer } from '../../../src/model/Namespace';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../../src/model/EntityApiSchemaData';
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
import { enhance as mergeCoveringFlattenedIdentityPropertyEnhancer } from '../../../src/enhancer/MergeCoveringFlattenedIdentityPropertyEnhancer';
import { enhance as jsonSchemaForInsertEnhancer } from '../../../src/enhancer/JsonSchemaForInsertEnhancer';
import { enhance as mergeDirectiveEqualityConstraintEnhancer } from '../../../src/enhancer/MergeDirectiveEqualityConstraintEnhancer';
import { enhance as resourceNameEnhancer } from '../../../src/enhancer/ResourceNameEnhancer';
import { enhance as identityFullnameEnhancer } from '../../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as identityJsonPathsEnhancer } from '../../../src/enhancer/IdentityJsonPathsEnhancer';
import { enhance as decimalPropertyValidationInfoEnhancer } from '../../../src/enhancer/DecimalPropertyValidationInfoEnhancer';
import { enhance as typeCoercionJsonPathsEnhancer } from '../../../src/enhancer/TypeCoercionJsonPathsEnhancer';
import { enhance as commonExtensionOverrideResolverEnhancer } from '../../../src/enhancer/CommonExtensionOverrideResolverEnhancer';

function runApiSchemaEnhancers(metaEd: MetaEdEnvironment): void {
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
  mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
  jsonSchemaForInsertEnhancer(metaEd);
  allJsonPathsMappingEnhancer(metaEd);
  mergeJsonPathsMappingEnhancer(metaEd);
  mergeDirectiveEqualityConstraintEnhancer(metaEd);
  resourceNameEnhancer(metaEd);
  documentPathsMappingEnhancer(metaEd);
  identityFullnameEnhancer(metaEd);
  identityJsonPathsEnhancer(metaEd);
  decimalPropertyValidationInfoEnhancer(metaEd);
  typeCoercionJsonPathsEnhancer(metaEd);
  commonExtensionOverrideResolverEnhancer(metaEd);
}

type FlatteningPropertyChainSummary = {
  property: string;
  fullPath: string;
  anchorsTo: string | null;
  anchorPath: string | null;
  relativePath: string;
  parentPrefixes: string[];
  collectionJsonPath: string | null;
};

type FlatteningScenarioSummary = {
  propertyChains: FlatteningPropertyChainSummary[];
  collectionContainers: { [key: string]: string };
};

function summarizeEntityChains(entity: TopLevelEntity | undefined): FlatteningScenarioSummary {
  invariant(entity != null, 'Expected top-level entity to exist');
  const flatteningChains = buildFlatteningPropertyChains(entity);
  const collectionContainers: { [key: string]: string } = {};
  const propertyChains: FlatteningPropertyChainSummary[] = flatteningChains.map((entry) => {
    const collectionJsonPath: string | null = entry.owningCollection?.collectionJsonPath ?? null;
    if (entry.owningCollection?.collectionJsonPath != null) {
      collectionContainers[entry.owningCollection.propertyPath] = entry.owningCollection.collectionJsonPath;
    }

    return {
      property: entry.property.fullPropertyName,
      fullPath: entry.fullPropertyPath,
      anchorsTo: entry.owningCollection?.property.fullPropertyName ?? null,
      anchorPath: entry.owningCollection?.propertyPath ?? null,
      relativePath: entry.relativePropertyPath,
      parentPrefixes: entry.propertyModifier.parentPrefixes.filter((prefix) => prefix !== ''),
      collectionJsonPath,
    };
  });

  return {
    propertyChains,
    collectionContainers,
  };
}

function summarizeChains(metaEd: MetaEdEnvironment, namespaceName: string, entityName: string) {
  const namespace = metaEd.namespace.get(namespaceName);
  invariant(namespace != null, `Namespace "${namespaceName}" was not created`);
  const entity = namespace.entity.domainEntity.get(entityName);
  invariant(entity != null, `Entity "${entityName}" was not created in namespace "${namespaceName}"`);
  return summarizeEntityChains(entity);
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
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const flatteningSummary = summarizeEntityChains(entity);
    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "OptionalBooleanProperty",
            "parentPrefixes": Array [],
            "property": "OptionalBooleanProperty",
            "relativePath": "OptionalBooleanProperty",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "RequiredCurrencyProperty",
            "parentPrefixes": Array [],
            "property": "RequiredCurrencyProperty",
            "relativePath": "RequiredCurrencyProperty",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "OptionalDecimalProperty",
            "parentPrefixes": Array [],
            "property": "OptionalDecimalProperty",
            "relativePath": "OptionalDecimalProperty",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "RequiredDurationProperty",
            "parentPrefixes": Array [],
            "property": "RequiredDurationProperty",
            "relativePath": "RequiredDurationProperty",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "OptionalPercentProperty",
            "parentPrefixes": Array [],
            "property": "OptionalPercentProperty",
            "relativePath": "OptionalPercentProperty",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "RequiredDateProperty",
            "parentPrefixes": Array [],
            "property": "RequiredDateProperty",
            "relativePath": "RequiredDateProperty",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "RequiredDatetimeProperty",
            "parentPrefixes": Array [],
            "property": "RequiredDatetimeProperty",
            "relativePath": "RequiredDatetimeProperty",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "RequiredIntegerProperty",
            "parentPrefixes": Array [],
            "property": "RequiredIntegerProperty",
            "relativePath": "RequiredIntegerProperty",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "OptionalShortProperty",
            "parentPrefixes": Array [],
            "property": "OptionalShortProperty",
            "relativePath": "OptionalShortProperty",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "StringIdentity",
            "parentPrefixes": Array [],
            "property": "StringIdentity",
            "relativePath": "StringIdentity",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "RequiredTimeProperty",
            "parentPrefixes": Array [],
            "property": "RequiredTimeProperty",
            "relativePath": "RequiredTimeProperty",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SchoolYear",
            "parentPrefixes": Array [],
            "property": "SchoolYear",
            "relativePath": "SchoolYear",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "OptionalYear",
            "parentPrefixes": Array [],
            "property": "OptionalYear",
            "relativePath": "OptionalYear",
          },
        ],
      }
    `);
  });
});

describe('when building simple domain entity with all the simple collections', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withBooleanProperty('OptionalBooleanProperty', 'doc1', false, true)
      .withCurrencyProperty('RequiredCurrencyProperty', 'doc2', true, true)
      .withDecimalProperty('OptionalDecimalProperty', 'doc3', false, true, '2', '1')
      .withDurationProperty('RequiredDurationProperty', 'doc4', true, true)
      .withPercentProperty('OptionalPercentProperty', 'doc5', false, true)
      .withDateProperty('RequiredDateProperty', 'doc6', true, true)
      .withDatetimeProperty('RequiredDatetimeProperty', 'doc7', true, true)
      .withIntegerProperty('RequiredIntegerProperty', 'doc8', true, true, '10', '5')
      .withShortProperty('OptionalShortProperty', 'doc9', false, true)
      .withStringIdentity('StringIdentity', 'doc10', '30', '20')
      .withStringProperty('RequiredStringProperty', 'doc11', true, true, '31', '21')
      .withTimeProperty('RequiredTimeProperty', 'doc12', true, true)
      .withEnumerationProperty('SchoolYear', 'doc13', false, true)
      .withYearProperty('OptionalYear', 'doc14', false, true)
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {
          "OptionalBooleanProperty": "$.optionalBooleanProperties[*]",
          "OptionalDecimalProperty": "$.optionalDecimalProperties[*]",
          "OptionalPercentProperty": "$.optionalPercentProperties[*]",
          "OptionalShortProperty": "$.optionalShortProperties[*]",
          "OptionalYear": "$.optionalYears[*]",
          "RequiredCurrencyProperty": "$.requiredCurrencyProperties[*]",
          "RequiredDateProperty": "$.requiredDateProperties[*]",
          "RequiredDatetimeProperty": "$.requiredDatetimeProperties[*]",
          "RequiredDurationProperty": "$.requiredDurationProperties[*]",
          "RequiredIntegerProperty": "$.requiredIntegerProperties[*]",
          "RequiredStringProperty": "$.requiredStringProperties[*]",
          "RequiredTimeProperty": "$.requiredTimeProperties[*]",
          "SchoolYear": "$.schoolYearTypeReference[*]",
        },
        "propertyChains": Array [
          Object {
            "anchorPath": "OptionalBooleanProperty",
            "anchorsTo": "OptionalBooleanProperty",
            "collectionJsonPath": "$.optionalBooleanProperties[*]",
            "fullPath": "OptionalBooleanProperty",
            "parentPrefixes": Array [],
            "property": "OptionalBooleanProperty",
            "relativePath": "",
          },
          Object {
            "anchorPath": "RequiredCurrencyProperty",
            "anchorsTo": "RequiredCurrencyProperty",
            "collectionJsonPath": "$.requiredCurrencyProperties[*]",
            "fullPath": "RequiredCurrencyProperty",
            "parentPrefixes": Array [],
            "property": "RequiredCurrencyProperty",
            "relativePath": "",
          },
          Object {
            "anchorPath": "OptionalDecimalProperty",
            "anchorsTo": "OptionalDecimalProperty",
            "collectionJsonPath": "$.optionalDecimalProperties[*]",
            "fullPath": "OptionalDecimalProperty",
            "parentPrefixes": Array [],
            "property": "OptionalDecimalProperty",
            "relativePath": "",
          },
          Object {
            "anchorPath": "RequiredDurationProperty",
            "anchorsTo": "RequiredDurationProperty",
            "collectionJsonPath": "$.requiredDurationProperties[*]",
            "fullPath": "RequiredDurationProperty",
            "parentPrefixes": Array [],
            "property": "RequiredDurationProperty",
            "relativePath": "",
          },
          Object {
            "anchorPath": "OptionalPercentProperty",
            "anchorsTo": "OptionalPercentProperty",
            "collectionJsonPath": "$.optionalPercentProperties[*]",
            "fullPath": "OptionalPercentProperty",
            "parentPrefixes": Array [],
            "property": "OptionalPercentProperty",
            "relativePath": "",
          },
          Object {
            "anchorPath": "RequiredDateProperty",
            "anchorsTo": "RequiredDateProperty",
            "collectionJsonPath": "$.requiredDateProperties[*]",
            "fullPath": "RequiredDateProperty",
            "parentPrefixes": Array [],
            "property": "RequiredDateProperty",
            "relativePath": "",
          },
          Object {
            "anchorPath": "RequiredDatetimeProperty",
            "anchorsTo": "RequiredDatetimeProperty",
            "collectionJsonPath": "$.requiredDatetimeProperties[*]",
            "fullPath": "RequiredDatetimeProperty",
            "parentPrefixes": Array [],
            "property": "RequiredDatetimeProperty",
            "relativePath": "",
          },
          Object {
            "anchorPath": "RequiredIntegerProperty",
            "anchorsTo": "RequiredIntegerProperty",
            "collectionJsonPath": "$.requiredIntegerProperties[*]",
            "fullPath": "RequiredIntegerProperty",
            "parentPrefixes": Array [],
            "property": "RequiredIntegerProperty",
            "relativePath": "",
          },
          Object {
            "anchorPath": "OptionalShortProperty",
            "anchorsTo": "OptionalShortProperty",
            "collectionJsonPath": "$.optionalShortProperties[*]",
            "fullPath": "OptionalShortProperty",
            "parentPrefixes": Array [],
            "property": "OptionalShortProperty",
            "relativePath": "",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "StringIdentity",
            "parentPrefixes": Array [],
            "property": "StringIdentity",
            "relativePath": "StringIdentity",
          },
          Object {
            "anchorPath": "RequiredStringProperty",
            "anchorsTo": "RequiredStringProperty",
            "collectionJsonPath": "$.requiredStringProperties[*]",
            "fullPath": "RequiredStringProperty",
            "parentPrefixes": Array [],
            "property": "RequiredStringProperty",
            "relativePath": "",
          },
          Object {
            "anchorPath": "RequiredTimeProperty",
            "anchorsTo": "RequiredTimeProperty",
            "collectionJsonPath": "$.requiredTimeProperties[*]",
            "fullPath": "RequiredTimeProperty",
            "parentPrefixes": Array [],
            "property": "RequiredTimeProperty",
            "relativePath": "",
          },
          Object {
            "anchorPath": "SchoolYear",
            "anchorsTo": "SchoolYear",
            "collectionJsonPath": "$.schoolYearTypeReference[*]",
            "fullPath": "SchoolYear",
            "parentPrefixes": Array [],
            "property": "SchoolYear",
            "relativePath": "",
          },
          Object {
            "anchorPath": "OptionalYear",
            "anchorsTo": "OptionalYear",
            "collectionJsonPath": "$.optionalYears[*]",
            "fullPath": "OptionalYear",
            "parentPrefixes": Array [],
            "property": "OptionalYear",
            "relativePath": "",
          },
        ],
      }
    `);
  });
});

describe('when building a domain entity referencing another referencing another with identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('SectionIdentifier', 'doc', '30')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withDomainEntityProperty('ClassPeriod', 'doc', true, true)
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withStringIdentity('LocalCourseCode', 'doc', '30')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('ClassPeriod')
      .withDocumentation('doc')
      .withStringIdentity('ClassPeriodName', 'doc', '30')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {
          "ClassPeriod": "$.classPeriods[*]",
        },
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SectionIdentifier",
            "parentPrefixes": Array [],
            "property": "SectionIdentifier",
            "relativePath": "SectionIdentifier",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "CourseOffering",
            "parentPrefixes": Array [],
            "property": "CourseOffering",
            "relativePath": "CourseOffering",
          },
          Object {
            "anchorPath": "ClassPeriod",
            "anchorsTo": "ClassPeriod",
            "collectionJsonPath": "$.classPeriods[*]",
            "fullPath": "ClassPeriod",
            "parentPrefixes": Array [],
            "property": "ClassPeriod",
            "relativePath": "",
          },
        ],
      }
    `);
  });
});

describe('when building a domain entity referencing CourseOffering with an implicit merge between School and Session.School', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('SectionIdentifier', 'doc', '30')
      .withDomainEntityIdentity('CourseOffering', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('CourseOffering')
      .withDocumentation('doc')
      .withStringIdentity('LocalCourseCode', 'doc', '30')
      .withDomainEntityIdentity('School', 'doc')
      .withDomainEntityIdentity('Session', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('Session')
      .withDocumentation('doc')
      .withStringIdentity('SessionName', 'doc', '30')
      .withEnumerationIdentity('SchoolYear', 'doc')
      .withDomainEntityIdentity('School', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SectionIdentifier",
            "parentPrefixes": Array [],
            "property": "SectionIdentifier",
            "relativePath": "SectionIdentifier",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "CourseOffering",
            "parentPrefixes": Array [],
            "property": "CourseOffering",
            "relativePath": "CourseOffering",
          },
        ],
      }
    `);
  });

  it('should produce flattening summary for CourseOffering', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('CourseOffering');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "LocalCourseCode",
            "parentPrefixes": Array [],
            "property": "LocalCourseCode",
            "relativePath": "LocalCourseCode",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "School",
            "parentPrefixes": Array [],
            "property": "School",
            "relativePath": "School",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "Session",
            "parentPrefixes": Array [],
            "property": "Session",
            "relativePath": "Session",
          },
        ],
      }
    `);
  });

  it('should produce flattening summary for Session', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Session');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SessionName",
            "parentPrefixes": Array [],
            "property": "SessionName",
            "relativePath": "SessionName",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SchoolYear",
            "parentPrefixes": Array [],
            "property": "SchoolYear",
            "relativePath": "SchoolYear",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "School",
            "parentPrefixes": Array [],
            "property": "School",
            "relativePath": "School",
          },
        ],
      }
    `);
  });

  it('should produce flattening summary for School', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('School');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SchoolId",
            "parentPrefixes": Array [],
            "property": "SchoolId",
            "relativePath": "SchoolId",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity with nested choice and inline commons', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'EducationContent';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('ContentIdentifier', 'doc', '30')
      .withChoiceProperty('LearningResourceChoice', 'doc', true, false)
      .withStringProperty('RequiredURI', 'doc', true, true, '30')
      .withEndDomainEntity()

      .withStartChoice('LearningResourceChoice')
      .withDocumentation('doc')
      .withStringProperty('LearningResourceMetadataURI', 'doc', true, false, '30')
      .withInlineCommonProperty('LearningResource', 'doc', true, false)
      .withEndChoice()

      .withStartDescriptor('ContentClass')
      .withDocumentation('doc')
      .withEndDescriptor()

      .withStartInlineCommon('LearningResource')
      .withDocumentation('doc')
      .withStringProperty('Description', 'doc', false, false, '30')
      .withStringProperty('ShortDescription', 'doc', true, false, '30')
      .withDescriptorProperty('ContentClass', 'doc', true, false)
      .withInlineCommonProperty('EducationContentSource', 'doc', false, false, 'DerivativeSource')
      .withEndInlineCommon()

      .withStartInlineCommon('EducationContentSource')
      .withDocumentation('doc')
      .withDomainEntityProperty('EducationContent', 'doc', false, true)
      .withStringProperty('URI', 'doc', false, true, '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    choiceReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {
          "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent": "$.derivativeSourceEducationContents[*]",
          "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.URI": "$.derivativeSourceURIs[*]",
          "RequiredURI": "$.requiredURIs[*]",
        },
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "ContentIdentifier",
            "parentPrefixes": Array [],
            "property": "ContentIdentifier",
            "relativePath": "ContentIdentifier",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "LearningResourceChoice.LearningResourceMetadataURI",
            "parentPrefixes": Array [],
            "property": "LearningResourceMetadataURI",
            "relativePath": "LearningResourceChoice.LearningResourceMetadataURI",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "LearningResourceChoice.LearningResource.Description",
            "parentPrefixes": Array [],
            "property": "Description",
            "relativePath": "LearningResourceChoice.LearningResource.Description",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "LearningResourceChoice.LearningResource.ShortDescription",
            "parentPrefixes": Array [],
            "property": "ShortDescription",
            "relativePath": "LearningResourceChoice.LearningResource.ShortDescription",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "LearningResourceChoice.LearningResource.ContentClass",
            "parentPrefixes": Array [],
            "property": "ContentClass",
            "relativePath": "LearningResourceChoice.LearningResource.ContentClass",
          },
          Object {
            "anchorPath": "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent",
            "anchorsTo": "EducationContent",
            "collectionJsonPath": "$.derivativeSourceEducationContents[*]",
            "fullPath": "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent",
            "parentPrefixes": Array [
              "DerivativeSource",
            ],
            "property": "EducationContent",
            "relativePath": "",
          },
          Object {
            "anchorPath": "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.URI",
            "anchorsTo": "URI",
            "collectionJsonPath": "$.derivativeSourceURIs[*]",
            "fullPath": "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.URI",
            "parentPrefixes": Array [
              "DerivativeSource",
            ],
            "property": "URI",
            "relativePath": "",
          },
          Object {
            "anchorPath": "RequiredURI",
            "anchorsTo": "RequiredURI",
            "collectionJsonPath": "$.requiredURIs[*]",
            "fullPath": "RequiredURI",
            "parentPrefixes": Array [],
            "property": "RequiredURI",
            "relativePath": "",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity with scalar collection named with prefix of parent entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'EducationContent';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('ContentIdentifier', 'doc', '30')
      .withStringProperty(`${domainEntityName}SuffixName`, 'doc', true, true, '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {
          "EducationContentSuffixName": "$.suffixNames[*]",
        },
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "ContentIdentifier",
            "parentPrefixes": Array [],
            "property": "ContentIdentifier",
            "relativePath": "ContentIdentifier",
          },
          Object {
            "anchorPath": "EducationContentSuffixName",
            "anchorsTo": "EducationContentSuffixName",
            "collectionJsonPath": "$.suffixNames[*]",
            "fullPath": "EducationContentSuffixName",
            "parentPrefixes": Array [],
            "property": "EducationContentSuffixName",
            "relativePath": "",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity with Association/DomainEntity collection named with prefix of parent entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'EducationContent';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('ContentIdentifier', 'doc', '30')
      .withDomainEntityProperty(`${domainEntityName}SuffixName`, 'doc', true, true)
      .withEndDomainEntity()

      .withStartDomainEntity(`${domainEntityName}SuffixName`)
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {
          "EducationContentSuffixName": "$.educationContentSuffixNames[*]",
        },
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "ContentIdentifier",
            "parentPrefixes": Array [],
            "property": "ContentIdentifier",
            "relativePath": "ContentIdentifier",
          },
          Object {
            "anchorPath": "EducationContentSuffixName",
            "anchorsTo": "EducationContentSuffixName",
            "collectionJsonPath": "$.educationContentSuffixNames[*]",
            "fullPath": "EducationContentSuffixName",
            "parentPrefixes": Array [],
            "property": "EducationContentSuffixName",
            "relativePath": "",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity with acronym property name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'StudentSpecialEducationProgramAssociation';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('ContentIdentifier', 'doc', '30')
      .withDatetimeIdentity('IEPBeginDate', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for DomainEntityName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "ContentIdentifier",
            "parentPrefixes": Array [],
            "property": "ContentIdentifier",
            "relativePath": "ContentIdentifier",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "IEPBeginDate",
            "parentPrefixes": Array [],
            "property": "IEPBeginDate",
            "relativePath": "IEPBeginDate",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity with a simple common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withCommonProperty('AssessmentIdentificationCode', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('AssessmentIdentificationCode')
      .withDocumentation('doc')
      .withStringProperty('IdentificationCode', 'doc', true, false, '30')
      .withDescriptorIdentity('AssessmentIdentificationSystem', 'doc')
      .withEndCommon()

      .withStartDescriptor('AssessmentIdentificationSystem')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    commonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for Assessment', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "AssessmentIdentifier",
            "parentPrefixes": Array [],
            "property": "AssessmentIdentifier",
            "relativePath": "AssessmentIdentifier",
          },
          Object {
            "anchorPath": "AssessmentIdentificationCode",
            "anchorsTo": "AssessmentIdentificationCode",
            "collectionJsonPath": null,
            "fullPath": "AssessmentIdentificationCode",
            "parentPrefixes": Array [],
            "property": "AssessmentIdentificationCode",
            "relativePath": "",
          },
          Object {
            "anchorPath": "AssessmentIdentificationCode",
            "anchorsTo": "AssessmentIdentificationCode",
            "collectionJsonPath": null,
            "fullPath": "AssessmentIdentificationCode.IdentificationCode",
            "parentPrefixes": Array [],
            "property": "IdentificationCode",
            "relativePath": "IdentificationCode",
          },
          Object {
            "anchorPath": "AssessmentIdentificationCode",
            "anchorsTo": "AssessmentIdentificationCode",
            "collectionJsonPath": null,
            "fullPath": "AssessmentIdentificationCode.AssessmentIdentificationSystem",
            "parentPrefixes": Array [],
            "property": "AssessmentIdentificationSystem",
            "relativePath": "AssessmentIdentificationSystem",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity subclass with common collection and descriptor identity in superclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntitySubclassName = 'CommunityOrganization';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withCommonProperty('EducationOrganizationIdentificationCode', 'doc', false, true)
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass(domainEntitySubclassName, 'EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentityRename('CommunityOrganizationId', 'EducationOrganizationId', 'doc')
      .withEndDomainEntitySubclass()

      .withStartCommon('EducationOrganizationIdentificationCode')
      .withDocumentation('doc')
      .withStringProperty('IdentificationCode', 'doc', true, false, '30')
      .withDescriptorIdentity('EducationOrganizationIdentificationSystem', 'doc')
      .withEndCommon()

      .withStartDescriptor('EducationOrganizationIdentificationSystem')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntitySubclassBaseClassEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for domainEntitySubclassName', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntitySubclass.get(domainEntitySubclassName);
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "CommunityOrganizationId",
            "parentPrefixes": Array [],
            "property": "CommunityOrganizationId",
            "relativePath": "CommunityOrganizationId",
          },
          Object {
            "anchorPath": "EducationOrganizationIdentificationCode",
            "anchorsTo": "EducationOrganizationIdentificationCode",
            "collectionJsonPath": null,
            "fullPath": "EducationOrganizationIdentificationCode",
            "parentPrefixes": Array [],
            "property": "EducationOrganizationIdentificationCode",
            "relativePath": "",
          },
          Object {
            "anchorPath": "EducationOrganizationIdentificationCode",
            "anchorsTo": "EducationOrganizationIdentificationCode",
            "collectionJsonPath": null,
            "fullPath": "EducationOrganizationIdentificationCode.IdentificationCode",
            "parentPrefixes": Array [],
            "property": "IdentificationCode",
            "relativePath": "IdentificationCode",
          },
          Object {
            "anchorPath": "EducationOrganizationIdentificationCode",
            "anchorsTo": "EducationOrganizationIdentificationCode",
            "collectionJsonPath": null,
            "fullPath": "EducationOrganizationIdentificationCode.EducationOrganizationIdentificationSystem",
            "parentPrefixes": Array [],
            "property": "EducationOrganizationIdentificationSystem",
            "relativePath": "EducationOrganizationIdentificationSystem",
          },
        ],
      }
    `);
  });
});

describe('when building association with a common collection in a common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentEducationOrganizationAssociation')
      .withDocumentation('doc')
      .withIntegerIdentity('StudentId', 'doc')
      .withCommonProperty('Address', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('Address')
      .withDocumentation('doc')
      .withStringProperty('StreetNumberName', 'doc', true, false, '30')
      .withCommonProperty('Period', 'doc', false, true)
      .withEndCommon()

      .withStartCommon('Period')
      .withDocumentation('doc')
      .withIntegerIdentity('BeginDate', 'doc')
      .withIntegerProperty('EndDate', 'doc', false, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    commonReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for StudentEducationOrganizationAssociation', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentEducationOrganizationAssociation');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "StudentId",
            "parentPrefixes": Array [],
            "property": "StudentId",
            "relativePath": "StudentId",
          },
          Object {
            "anchorPath": "Address",
            "anchorsTo": "Address",
            "collectionJsonPath": null,
            "fullPath": "Address",
            "parentPrefixes": Array [],
            "property": "Address",
            "relativePath": "",
          },
          Object {
            "anchorPath": "Address",
            "anchorsTo": "Address",
            "collectionJsonPath": null,
            "fullPath": "Address.StreetNumberName",
            "parentPrefixes": Array [],
            "property": "StreetNumberName",
            "relativePath": "StreetNumberName",
          },
          Object {
            "anchorPath": "Address.Period",
            "anchorsTo": "Period",
            "collectionJsonPath": null,
            "fullPath": "Address.Period",
            "parentPrefixes": Array [],
            "property": "Period",
            "relativePath": "",
          },
          Object {
            "anchorPath": "Address.Period",
            "anchorsTo": "Period",
            "collectionJsonPath": null,
            "fullPath": "Address.Period.BeginDate",
            "parentPrefixes": Array [],
            "property": "BeginDate",
            "relativePath": "BeginDate",
          },
          Object {
            "anchorPath": "Address.Period",
            "anchorsTo": "Period",
            "collectionJsonPath": null,
            "fullPath": "Address.Period.EndDate",
            "parentPrefixes": Array [],
            "property": "EndDate",
            "relativePath": "EndDate",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity with a descriptor with role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withDescriptorProperty('GradeLevel', 'doc', false, false, 'Assessed')
      .withEndDomainEntity()

      .withStartDescriptor('GradeLevel')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    descriptorReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for Assessment', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "AssessmentIdentifier",
            "parentPrefixes": Array [],
            "property": "AssessmentIdentifier",
            "relativePath": "AssessmentIdentifier",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "AssessedGradeLevel",
            "parentPrefixes": Array [],
            "property": "AssessedGradeLevel",
            "relativePath": "AssessedGradeLevel",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity with a descriptor collection with role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withDescriptorProperty('GradeLevel', 'doc', false, true, 'Assessed')
      .withEndDomainEntity()

      .withStartDescriptor('GradeLevel')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    descriptorReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for Assessment', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {
          "AssessedGradeLevel": "$.assessedGradeLevels[*]",
        },
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "AssessmentIdentifier",
            "parentPrefixes": Array [],
            "property": "AssessmentIdentifier",
            "relativePath": "AssessmentIdentifier",
          },
          Object {
            "anchorPath": "AssessedGradeLevel",
            "anchorsTo": "AssessedGradeLevel",
            "collectionJsonPath": "$.assessedGradeLevels[*]",
            "fullPath": "AssessedGradeLevel",
            "parentPrefixes": Array [],
            "property": "AssessedGradeLevel",
            "relativePath": "",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity with a common with a choice', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withCommonProperty('ContentStandard', 'doc', false, false)
      .withEndDomainEntity()

      .withStartCommon('ContentStandard')
      .withDocumentation('doc')
      .withStringProperty('Title', 'doc', false, false, '30')
      .withChoiceProperty('PublicationDateChoice', 'doc', false, false)
      .withEndCommon()

      .withStartChoice('PublicationDateChoice')
      .withDocumentation('doc')
      .withStringProperty('PublicationDate', 'doc', true, false, '30')
      .withStringProperty('PublicationYear', 'doc', true, false, '30')
      .withEndChoice()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    choiceReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for Assessment', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "AssessmentIdentifier",
            "parentPrefixes": Array [],
            "property": "AssessmentIdentifier",
            "relativePath": "AssessmentIdentifier",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "ContentStandard",
            "parentPrefixes": Array [],
            "property": "ContentStandard",
            "relativePath": "ContentStandard",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "ContentStandard.Title",
            "parentPrefixes": Array [],
            "property": "Title",
            "relativePath": "ContentStandard.Title",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "ContentStandard.PublicationDateChoice.PublicationDate",
            "parentPrefixes": Array [],
            "property": "PublicationDate",
            "relativePath": "ContentStandard.PublicationDateChoice.PublicationDate",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "ContentStandard.PublicationDateChoice.PublicationYear",
            "parentPrefixes": Array [],
            "property": "PublicationYear",
            "relativePath": "ContentStandard.PublicationDateChoice.PublicationYear",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity with a common and a common collection with parent entity prefix', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withCommonProperty('AssessmentScore', 'doc', true, true)
      .withCommonProperty('AssessmentPeriod', 'doc', false, false)
      .withEndDomainEntity()

      .withStartCommon('AssessmentScore')
      .withDocumentation('doc')
      .withStringProperty('MinimumScore', 'doc', true, false, '30')
      .withEndCommon()

      .withStartCommon('AssessmentPeriod')
      .withDocumentation('doc')
      .withStringProperty('BeginDate', 'doc', false, false, '30')
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    commonReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for Assessment', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "AssessmentIdentifier",
            "parentPrefixes": Array [],
            "property": "AssessmentIdentifier",
            "relativePath": "AssessmentIdentifier",
          },
          Object {
            "anchorPath": "AssessmentScore",
            "anchorsTo": "AssessmentScore",
            "collectionJsonPath": null,
            "fullPath": "AssessmentScore",
            "parentPrefixes": Array [],
            "property": "AssessmentScore",
            "relativePath": "",
          },
          Object {
            "anchorPath": "AssessmentScore",
            "anchorsTo": "AssessmentScore",
            "collectionJsonPath": null,
            "fullPath": "AssessmentScore.MinimumScore",
            "parentPrefixes": Array [],
            "property": "MinimumScore",
            "relativePath": "MinimumScore",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "AssessmentPeriod",
            "parentPrefixes": Array [],
            "property": "AssessmentPeriod",
            "relativePath": "AssessmentPeriod",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "AssessmentPeriod.BeginDate",
            "parentPrefixes": Array [],
            "property": "BeginDate",
            "relativePath": "AssessmentPeriod.BeginDate",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity with an all-caps property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withStringProperty('URI', 'doc', false, false, '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for Assessment', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "AssessmentIdentifier",
            "parentPrefixes": Array [],
            "property": "AssessmentIdentifier",
            "relativePath": "AssessmentIdentifier",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "URI",
            "parentPrefixes": Array [],
            "property": "URI",
            "relativePath": "URI",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity with a common with a domain entity reference with a role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Assessment')
      .withDocumentation('doc')
      .withIntegerIdentity('AssessmentIdentifier', 'doc')
      .withCommonProperty('ContentStandard', 'doc', false, false)
      .withEndDomainEntity()

      .withStartCommon('ContentStandard')
      .withDocumentation('doc')
      .withStringProperty('Title', 'doc', false, false, '30')
      .withDomainEntityProperty('EducationOrganization', 'doc', false, false, false, 'Mandating')
      .withEndCommon()

      .withStartDomainEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for Assessment', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Assessment');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "AssessmentIdentifier",
            "parentPrefixes": Array [],
            "property": "AssessmentIdentifier",
            "relativePath": "AssessmentIdentifier",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "ContentStandard",
            "parentPrefixes": Array [],
            "property": "ContentStandard",
            "relativePath": "ContentStandard",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "ContentStandard.Title",
            "parentPrefixes": Array [],
            "property": "Title",
            "relativePath": "ContentStandard.Title",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "ContentStandard.MandatingEducationOrganization",
            "parentPrefixes": Array [],
            "property": "MandatingEducationOrganization",
            "relativePath": "ContentStandard.MandatingEducationOrganization",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity with two school year enumerations, one role named', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentSchoolAssociation')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withEnumerationProperty('SchoolYear', 'doc', false, false)
      .withEnumerationProperty('SchoolYear', 'doc', false, false, 'ClassOf')
      .withEndDomainEntity()

      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEnumerationItem('2022')
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    enumerationReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for StudentSchoolAssociation', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentSchoolAssociation');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SchoolId",
            "parentPrefixes": Array [],
            "property": "SchoolId",
            "relativePath": "SchoolId",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SchoolYear",
            "parentPrefixes": Array [],
            "property": "SchoolYear",
            "relativePath": "SchoolYear",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "ClassOfSchoolYear",
            "parentPrefixes": Array [],
            "property": "ClassOfSchoolYear",
            "relativePath": "ClassOfSchoolYear",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity with reference to domain entity with school year enumeration as part of identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentSchoolAssociation')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withDomainEntityProperty('Calendar', 'doc', false, false)
      .withEndDomainEntity()

      .withStartDomainEntity('Calendar')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withIdentityProperty('enumeration', 'SchoolYear', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    enumerationReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for StudentSchoolAssociation', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentSchoolAssociation');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SchoolId",
            "parentPrefixes": Array [],
            "property": "SchoolId",
            "relativePath": "SchoolId",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "Calendar",
            "parentPrefixes": Array [],
            "property": "Calendar",
            "relativePath": "Calendar",
          },
        ],
      }
    `);
  });
});

describe('when building a schema for StudentCohort', () => {
  // The core problem addressed by this test is in RND-456: The CohortYears schoolYearTypeReference was being interpreted as
  // an integer, rather than as a SchoolYearTypeEnumeration. This test builds the minimum components of
  // studentEducationOrganizationAssociation required to duplicate the issue.

  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('StudentCohort')
      .withDocumentation('doc')
      .withCommonProperty('CohortYear', '', false, true)
      .withStringIdentity('StudentUniqueId', '', '100')
      .withEndDomainEntity()

      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEnumerationItem('2022')
      .withEndEnumeration()

      .withStartCommon('CohortYear')
      .withDocumentation('doc')
      .withEnumerationIdentity('SchoolYear', '')
      .withEndCommon()

      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    enumerationReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for StudentCohort', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentCohort');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": "CohortYear",
            "anchorsTo": "CohortYear",
            "collectionJsonPath": null,
            "fullPath": "CohortYear",
            "parentPrefixes": Array [],
            "property": "CohortYear",
            "relativePath": "",
          },
          Object {
            "anchorPath": "CohortYear",
            "anchorsTo": "CohortYear",
            "collectionJsonPath": null,
            "fullPath": "CohortYear.SchoolYear",
            "parentPrefixes": Array [],
            "property": "SchoolYear",
            "relativePath": "SchoolYear",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "StudentUniqueId",
            "parentPrefixes": Array [],
            "property": "StudentUniqueId",
            "relativePath": "StudentUniqueId",
          },
        ],
      }
    `);
  });
});

describe('when building a domain entity with an inline common property with a descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Section')
      .withDocumentation('Documentation')
      .withIntegerIdentity('SectionIdentifier', 'Documentation')
      .withInlineCommonProperty('Credits', 'Documentation', false, false, 'Available')
      .withEndDomainEntity()

      .withStartInlineCommon('Credits')
      .withDocumentation('Documentation')
      .withDescriptorProperty('CreditType', 'Documentation', false, false)
      .withEndInlineCommon()

      .withStartDescriptor('CreditType')
      .withDocumentation('Documentation')
      .withEndDescriptor()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for Section', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('Section');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SectionIdentifier",
            "parentPrefixes": Array [],
            "property": "SectionIdentifier",
            "relativePath": "SectionIdentifier",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "AvailableCredits.CreditType",
            "parentPrefixes": Array [
              "Available",
            ],
            "property": "CreditType",
            "relativePath": "AvailableCredits.CreditType",
          },
        ],
      }
    `);
  });
});

describe('when building a Domain Entity subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAbstractEntity('EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentity('EducationOrganizationId', 'doc')
      .withIntegerProperty('SuperclassProperty', 'doc', true, false)
      .withEndAbstractEntity()

      .withStartDomainEntitySubclass('School', 'EducationOrganization')
      .withDocumentation('doc')
      .withIntegerIdentityRename('SchoolId', 'EducationOrganizationId', 'doc')
      .withIntegerProperty('SubclassProperty', 'doc', true, false)
      .withEndDomainEntitySubclass()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []));

    domainEntitySubclassBaseClassEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for School', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntitySubclass.get('School');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SchoolId",
            "parentPrefixes": Array [],
            "property": "SchoolId",
            "relativePath": "SchoolId",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SubclassProperty",
            "parentPrefixes": Array [],
            "property": "SubclassProperty",
            "relativePath": "SubclassProperty",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SuperclassProperty",
            "parentPrefixes": Array [],
            "property": "SuperclassProperty",
            "relativePath": "SuperclassProperty",
          },
        ],
      }
    `);
  });
});

describe('when building an Association subclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartAssociation('GeneralStudentProgramAssociation')
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty('School', 'doc')
      .withAssociationDomainEntityProperty('Program', 'doc')
      .withIntegerProperty('SuperclassProperty', 'doc', true, false)
      .withEndAssociation()

      .withStartAssociationSubclass('StudentProgramAssociation', 'GeneralStudentProgramAssociation')
      .withDocumentation('doc')
      .withIntegerProperty('SubclassProperty', 'doc', true, false)
      .withEndAssociationSubclass()

      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withIntegerIdentity('SchoolId', 'doc')
      .withStringIdentity('SchoolName', 'doc', '30')
      .withEndDomainEntity()

      .withStartDomainEntity('Program')
      .withDocumentation('doc')
      .withIntegerIdentity('ProgramId', 'doc')
      .withStringIdentity('ProgramName', 'doc', '30')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationSubclassBuilder(metaEd, []));

    associationSubclassBaseClassEnhancer(metaEd);
    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for StudentProgramAssociation', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.associationSubclass.get('StudentProgramAssociation');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SubclassProperty",
            "parentPrefixes": Array [],
            "property": "SubclassProperty",
            "relativePath": "SubclassProperty",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "School",
            "parentPrefixes": Array [],
            "property": "School",
            "relativePath": "School",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "Program",
            "parentPrefixes": Array [],
            "property": "Program",
            "relativePath": "Program",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SuperclassProperty",
            "parentPrefixes": Array [],
            "property": "SuperclassProperty",
            "relativePath": "SuperclassProperty",
          },
        ],
      }
    `);
  });
});

describe('when a collection reference is to a role named resource that has a schoolid merged away', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'ReportCard';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('ReportCardIdentity', 'doc')
      .withDomainEntityProperty('Grade', 'doc', true, true)
      .withEndDomainEntity()

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
    mergeDirectiveEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for ReportCard', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {
          "Grade": "$.grades[*]",
        },
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "ReportCardIdentity",
            "parentPrefixes": Array [],
            "property": "ReportCardIdentity",
            "relativePath": "ReportCardIdentity",
          },
          Object {
            "anchorPath": "Grade",
            "anchorsTo": "Grade",
            "collectionJsonPath": "$.grades[*]",
            "fullPath": "Grade",
            "parentPrefixes": Array [],
            "property": "Grade",
            "relativePath": "",
          },
        ],
      }
    `);
  });
});

describe('when a reference is to a resource that has a reference with two identity properties merged away', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'SurveySectionResponseEducationOrganizationTargetAssociation';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('SSREOTAIdentity', 'doc')
      .withDomainEntityProperty('SurveySectionResponse', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('SurveySectionResponse')
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
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for SurveySectionResponseEducationOrganizationTargetAssociation', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SSREOTAIdentity",
            "parentPrefixes": Array [],
            "property": "SSREOTAIdentity",
            "relativePath": "SSREOTAIdentity",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SurveySectionResponse",
            "parentPrefixes": Array [],
            "property": "SurveySectionResponse",
            "relativePath": "SurveySectionResponse",
          },
        ],
      }
    `);
  });
});

describe('when a reference is to a resource that has two identity properties directly merged away', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'SurveySectionResponseEducationOrganizationTargetAssociation';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('SSREOTAIdentity', 'doc')
      .withDomainEntityProperty('SurveySectionResponse', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('SurveySectionResponse')
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
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for SurveySectionResponseEducationOrganizationTargetAssociation', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SSREOTAIdentity",
            "parentPrefixes": Array [],
            "property": "SSREOTAIdentity",
            "relativePath": "SSREOTAIdentity",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "SurveySectionResponse",
            "parentPrefixes": Array [],
            "property": "SurveySectionResponse",
            "relativePath": "SurveySectionResponse",
          },
        ],
      }
    `);
  });
});

describe('when a reference is to a resource that merges on a descriptor (TPDM example)', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const namespaceName = 'EdFi';
  const domainEntityName = 'EvaluationObjectiveRating';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('EvaluationObjectiveRatingIdentity', 'doc')
      .withDomainEntityProperty('EvaluationRating', 'doc', true, false)
      .withMergeDirective('EvaluationRating.Evaluation.EvaluationTitle', 'EvaluationObjective.Evaluation.EvaluationTitle')
      .withDomainEntityProperty('EvaluationObjective', 'doc', true, false)
      .withEndDomainEntity()

      .withStartDomainEntity('EvaluationRating')
      .withDocumentation('doc')
      .withIntegerIdentity('EvaluationRatingIdentity', 'doc')
      .withDomainEntityIdentity('Evaluation', 'doc')
      .withDomainEntityIdentity('PerformanceEvaluationRating', 'doc')
      .withMergeDirective(
        'PerformanceEvaluationRating.PerformanceEvaluation.PerformanceEvaluationType',
        'Evaluation.PerformanceEvaluation.PerformanceEvaluationType',
      )
      .withEndDomainEntity()

      .withStartDomainEntity('Evaluation')
      .withDocumentation('doc')
      .withIntegerIdentity('EvaluationTitle', 'doc')
      .withDomainEntityIdentity('PerformanceEvaluation', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('PerformanceEvaluationRating')
      .withDocumentation('doc')
      .withIntegerIdentity('PerformanceEvaluationRatingIdentity', 'doc')
      .withDomainEntityIdentity('PerformanceEvaluation', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('PerformanceEvaluation')
      .withDocumentation('doc')
      .withDescriptorIdentity('PerformanceEvaluationType', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('EvaluationObjective')
      .withDocumentation('doc')
      .withIntegerIdentity('EvaluationObjectiveIdentity', 'doc')
      .withDomainEntityIdentity('Evaluation', 'doc')
      .withEndDomainEntity()

      .withStartDescriptor('PerformanceEvaluationType')
      .withDocumentation('Documentation')
      .withEndDescriptor()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for EvaluationObjectiveRating', () => {
    const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get(domainEntityName);
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "EvaluationObjectiveRatingIdentity",
            "parentPrefixes": Array [],
            "property": "EvaluationObjectiveRatingIdentity",
            "relativePath": "EvaluationObjectiveRatingIdentity",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "EvaluationRating",
            "parentPrefixes": Array [],
            "property": "EvaluationRating",
            "relativePath": "EvaluationRating",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "EvaluationObjective",
            "parentPrefixes": Array [],
            "property": "EvaluationObjective",
            "relativePath": "EvaluationObjective",
          },
        ],
      }
    `);
  });
});

describe(
  'when building association with domain entity with two entities, one with role named educationOrganization and' +
    ' one with non role named educationOrganization ',
  () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'EdFi';

    beforeAll(() => {
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartAssociation('StudentAssessmentRegistrationBatteryPartAssociation')
        .withDocumentation('doc')
        .withAssociationDomainEntityProperty('StudentAssessmentRegistration', 'doc')
        .withAssociationDomainEntityProperty('UnusedEntity', 'doc')
        .withEndAssociation()

        .withStartDomainEntity('StudentAssessmentRegistration')
        .withDocumentation('doc')
        .withDomainEntityIdentity('AssessmentAdministration', 'doc')
        .withAssociationIdentity('StudentEducationOrganizationAssociation', 'doc')
        .withEndDomainEntity()

        .withStartDomainEntity('AssessmentAdministration')
        .withDocumentation('doc')
        .withDomainEntityIdentity('EducationOrganization', 'doc', 'Assigning')
        .withEndDomainEntity()

        .withStartAssociation('StudentEducationOrganizationAssociation')
        .withDocumentation('doc')
        .withAssociationDomainEntityProperty('EducationOrganization', 'doc')
        .withAssociationDomainEntityProperty('UnusedEntity', 'doc')
        .withEndAssociation()

        .withStartDomainEntity('EducationOrganization')
        .withDocumentation('doc')
        .withIntegerIdentity('EducationOrganizationId', 'doc')
        .withEndDomainEntity()

        .withStartDomainEntity('UnusedEntity')
        .withDocumentation('doc')
        .withStringIdentity('UnusedProperty', 'doc', '30')
        .withEndDomainEntity()

        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new AssociationBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      domainEntityReferenceEnhancer(metaEd);
      associationReferenceEnhancer(metaEd);
      runApiSchemaEnhancers(metaEd);
    });

    it('should produce flattening summary for StudentAssessmentRegistrationBatteryPartAssociation', () => {
      const entity = metaEd.namespace
        .get(namespaceName)
        ?.entity.association.get('StudentAssessmentRegistrationBatteryPartAssociation');
      const flatteningSummary = summarizeEntityChains(entity);

      expect(flatteningSummary).toMatchInlineSnapshot(`
        Object {
          "collectionContainers": Object {},
          "propertyChains": Array [
            Object {
              "anchorPath": null,
              "anchorsTo": null,
              "collectionJsonPath": null,
              "fullPath": "StudentAssessmentRegistration",
              "parentPrefixes": Array [],
              "property": "StudentAssessmentRegistration",
              "relativePath": "StudentAssessmentRegistration",
            },
            Object {
              "anchorPath": null,
              "anchorsTo": null,
              "collectionJsonPath": null,
              "fullPath": "UnusedEntity",
              "parentPrefixes": Array [],
              "property": "UnusedEntity",
              "relativePath": "UnusedEntity",
            },
          ],
        }
      `);
    });
  },
);

describe('when building domain entity referencing another which has inline common with identity property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)

      .withStartDomainEntity('StaffEducationOrganizationAssignmentAssociation')
      .withDocumentation('doc')
      .withIntegerIdentity('AssignmentId', 'doc')
      .withDomainEntityProperty('StaffEducationOrganizationEmploymentAssociation', 'doc', false, false)
      .withEndDomainEntity()

      .withStartDomainEntity('StaffEducationOrganizationEmploymentAssociation')
      .withDocumentation('doc')
      .withIntegerIdentity('EmploymentId', 'doc')
      .withInlineCommonProperty('EmploymentPeriod', 'doc', true, false)
      .withEndDomainEntity()

      .withStartInlineCommon('EmploymentPeriod')
      .withDocumentation('doc')
      .withDateIdentity('HireDate', 'doc')
      .withIntegerProperty('PeriodId', 'doc', false, false)
      .withEndInlineCommon()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should produce flattening summary for StaffEducationOrganizationAssignmentAssociation', () => {
    const entity = metaEd.namespace
      .get(namespaceName)
      ?.entity.domainEntity.get('StaffEducationOrganizationAssignmentAssociation');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "AssignmentId",
            "parentPrefixes": Array [],
            "property": "AssignmentId",
            "relativePath": "AssignmentId",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "StaffEducationOrganizationEmploymentAssociation",
            "parentPrefixes": Array [],
            "property": "StaffEducationOrganizationEmploymentAssociation",
            "relativePath": "StaffEducationOrganizationEmploymentAssociation",
          },
        ],
      }
    `);
  });

  it('should produce flattening summary for StaffEducationOrganizationEmploymentAssociation', () => {
    const entity = metaEd.namespace
      .get(namespaceName)
      ?.entity.domainEntity.get('StaffEducationOrganizationEmploymentAssociation');
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "EmploymentId",
            "parentPrefixes": Array [],
            "property": "EmploymentId",
            "relativePath": "EmploymentId",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "EmploymentPeriod.HireDate",
            "parentPrefixes": Array [],
            "property": "HireDate",
            "relativePath": "EmploymentPeriod.HireDate",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "EmploymentPeriod.PeriodId",
            "parentPrefixes": Array [],
            "property": "PeriodId",
            "relativePath": "EmploymentPeriod.PeriodId",
          },
        ],
      }
    `);
  });
});

describe('when building domain entity extension with common extension override', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const coreNamespaceName = 'EdFi';
  const extensionNamespaceName = 'Sample';
  const commonName = 'Address';
  const domainEntityName = 'Student';

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespaceName)
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withStringProperty('StreetNumberName', 'doc', true, false, '150')
      .withStringProperty('City', 'doc', false, false, '30')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('StudentUniqueId', 'doc', '32')
      .withCommonProperty(commonName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extensionNamespaceName)
      .withStartDomainEntityExtension(`${coreNamespaceName}.${domainEntityName}`)
      .withCommonExtensionOverrideProperty(`${coreNamespaceName}.${commonName}`, 'doc', true, false)
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${coreNamespaceName}.${commonName}`)
      .withStringProperty('ExtensionProperty', 'doc', false, false, '50')
      .withBooleanProperty('IsVerified', 'doc', true, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    const coreNamespace = metaEd.namespace.get(coreNamespaceName);
    const extensionNamespace = metaEd.namespace.get(extensionNamespaceName);
    if (coreNamespace && extensionNamespace) {
      extensionNamespace.dependencies.push(coreNamespace);
    }

    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    commonExtensionOverrideResolverEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    allJsonPathsMappingEnhancer(metaEd);
    mergeJsonPathsMappingEnhancer(metaEd);
    mergeDirectiveEqualityConstraintEnhancer(metaEd);
    resourceNameEnhancer(metaEd);
    documentPathsMappingEnhancer(metaEd);
    identityFullnameEnhancer(metaEd);
    identityJsonPathsEnhancer(metaEd);
    decimalPropertyValidationInfoEnhancer(metaEd);
    typeCoercionJsonPathsEnhancer(metaEd);
  });

  it('should produce flattening summary for base Student entity with common properties', () => {
    const entity = metaEd.namespace.get(coreNamespaceName)?.entity.domainEntity.get(domainEntityName);
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "StudentUniqueId",
            "parentPrefixes": Array [],
            "property": "StudentUniqueId",
            "relativePath": "StudentUniqueId",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "Address",
            "parentPrefixes": Array [],
            "property": "Address",
            "relativePath": "Address",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "Address.StreetNumberName",
            "parentPrefixes": Array [],
            "property": "StreetNumberName",
            "relativePath": "Address.StreetNumberName",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "Address.City",
            "parentPrefixes": Array [],
            "property": "City",
            "relativePath": "Address.City",
          },
        ],
      }
    `);
  });

  it('should produce flattening summary for DomainEntityExtension with common extension override', () => {
    const entity = metaEd.namespace.get(extensionNamespaceName)?.entity.domainEntityExtension.get(domainEntityName);
    const flatteningSummary = summarizeEntityChains(entity);

    expect(flatteningSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "Address",
            "parentPrefixes": Array [],
            "property": "Address",
            "relativePath": "Address",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "Address.StreetNumberName",
            "parentPrefixes": Array [],
            "property": "StreetNumberName",
            "relativePath": "Address.StreetNumberName",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "Address.City",
            "parentPrefixes": Array [],
            "property": "City",
            "relativePath": "Address.City",
          },
        ],
      }
    `);
  });
});

describe('flattening property chains', () => {
  it('captures inline commons and choices for flattening traversal', () => {
    const metaEd = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const namespaceName = 'EdFi';
    const domainEntityName = 'EducationContent';

    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('ContentIdentifier', 'doc', '30')
      .withChoiceProperty('LearningResourceChoice', 'doc', true, false)
      .withStringProperty('RequiredURI', 'doc', true, true, '30')
      .withEndDomainEntity()
      .withStartChoice('LearningResourceChoice')
      .withDocumentation('doc')
      .withStringProperty('LearningResourceMetadataURI', 'doc', true, false, '30')
      .withInlineCommonProperty('LearningResource', 'doc', true, false)
      .withEndChoice()
      .withStartDescriptor('ContentClass')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withStartInlineCommon('LearningResource')
      .withDocumentation('doc')
      .withStringProperty('Description', 'doc', false, false, '30')
      .withStringProperty('ShortDescription', 'doc', true, false, '30')
      .withDescriptorProperty('ContentClass', 'doc', true, false)
      .withInlineCommonProperty('EducationContentSource', 'doc', false, false, 'DerivativeSource')
      .withEndInlineCommon()
      .withStartInlineCommon('EducationContentSource')
      .withDocumentation('doc')
      .withDomainEntityProperty('EducationContent', 'doc', false, true)
      .withStringProperty('URI', 'doc', false, true, '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    choiceReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);

    expect(summarizeChains(metaEd, namespaceName, domainEntityName)).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {
          "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent": "$.derivativeSourceEducationContents[*]",
          "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.URI": "$.derivativeSourceURIs[*]",
          "RequiredURI": "$.requiredURIs[*]",
        },
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "ContentIdentifier",
            "parentPrefixes": Array [],
            "property": "ContentIdentifier",
            "relativePath": "ContentIdentifier",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "LearningResourceChoice.LearningResourceMetadataURI",
            "parentPrefixes": Array [],
            "property": "LearningResourceMetadataURI",
            "relativePath": "LearningResourceChoice.LearningResourceMetadataURI",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "LearningResourceChoice.LearningResource.Description",
            "parentPrefixes": Array [],
            "property": "Description",
            "relativePath": "LearningResourceChoice.LearningResource.Description",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "LearningResourceChoice.LearningResource.ShortDescription",
            "parentPrefixes": Array [],
            "property": "ShortDescription",
            "relativePath": "LearningResourceChoice.LearningResource.ShortDescription",
          },
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "LearningResourceChoice.LearningResource.ContentClass",
            "parentPrefixes": Array [],
            "property": "ContentClass",
            "relativePath": "LearningResourceChoice.LearningResource.ContentClass",
          },
          Object {
            "anchorPath": "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent",
            "anchorsTo": "EducationContent",
            "collectionJsonPath": "$.derivativeSourceEducationContents[*]",
            "fullPath": "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent",
            "parentPrefixes": Array [
              "DerivativeSource",
            ],
            "property": "EducationContent",
            "relativePath": "",
          },
          Object {
            "anchorPath": "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.URI",
            "anchorsTo": "URI",
            "collectionJsonPath": "$.derivativeSourceURIs[*]",
            "fullPath": "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.URI",
            "parentPrefixes": Array [
              "DerivativeSource",
            ],
            "property": "URI",
            "relativePath": "",
          },
          Object {
            "anchorPath": "RequiredURI",
            "anchorsTo": "RequiredURI",
            "collectionJsonPath": "$.requiredURIs[*]",
            "fullPath": "RequiredURI",
            "parentPrefixes": Array [],
            "property": "RequiredURI",
            "relativePath": "",
          },
        ],
      }
    `);
  });

  it('tracks extension collections as table anchors', () => {
    const metaEd = newMetaEdEnvironment();
    metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
    const coreNamespace = 'EdFi';
    const extensionNamespace = 'Extension';
    const domainEntityName = 'CollectionEntity';
    const commonName = 'CollectionCommon';

    MetaEdTextBuilder.build()
      .withBeginNamespace(coreNamespace)
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withIntegerIdentity('CollectionId', 'doc')
      .withEndCommon()
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('EntityId', 'doc')
      .withCommonProperty(commonName, 'doc', true, true)
      .withEndDomainEntity()
      .withEndNamespace()
      .withBeginNamespace(extensionNamespace)
      .withStartDomainEntityExtension(`${coreNamespace}.${domainEntityName}`)
      .withCommonExtensionOverrideProperty(`${coreNamespace}.${commonName}`, 'doc', true, true)
      .withEndDomainEntityExtension()
      .withStartCommonExtension(`${coreNamespace}.${commonName}`)
      .withDecimalProperty('ExtensionAmount', 'doc', false, false, '10', '2')
      .withIntegerProperty('ExtensionCount', 'doc', true, true)
      .withEndCommonExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    const core = metaEd.namespace.get(coreNamespace);
    const extension = metaEd.namespace.get(extensionNamespace);
    invariant(core != null, 'Core namespace should exist');
    invariant(extension != null, 'Extension namespace should exist');
    extension.dependencies.push(core);

    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    commonSubclassBaseClassEnhancer(metaEd);
    domainEntityExtensionBaseClassEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);

    const coreSummary = summarizeChains(metaEd, coreNamespace, domainEntityName);
    const extensionEntity = extension.entity.domainEntityExtension.get(domainEntityName);
    invariant(extensionEntity != null, 'Extension entity should exist');
    const extensionSummary = buildFlatteningPropertyChains(extensionEntity).map((entry) => ({
      property: entry.property.fullPropertyName,
      anchor: entry.owningCollection?.property.fullPropertyName ?? null,
      anchorPath: entry.owningCollection?.propertyPath ?? null,
      relativePath: entry.relativePropertyPath,
    }));

    expect(coreSummary).toMatchInlineSnapshot(`
      Object {
        "collectionContainers": Object {},
        "propertyChains": Array [
          Object {
            "anchorPath": null,
            "anchorsTo": null,
            "collectionJsonPath": null,
            "fullPath": "EntityId",
            "parentPrefixes": Array [],
            "property": "EntityId",
            "relativePath": "EntityId",
          },
          Object {
            "anchorPath": "CollectionCommon",
            "anchorsTo": "CollectionCommon",
            "collectionJsonPath": null,
            "fullPath": "CollectionCommon",
            "parentPrefixes": Array [],
            "property": "CollectionCommon",
            "relativePath": "",
          },
          Object {
            "anchorPath": "CollectionCommon",
            "anchorsTo": "CollectionCommon",
            "collectionJsonPath": null,
            "fullPath": "CollectionCommon.CollectionId",
            "parentPrefixes": Array [],
            "property": "CollectionId",
            "relativePath": "CollectionId",
          },
        ],
      }
    `);

    expect(extensionSummary).toMatchInlineSnapshot(`
      Array [
        Object {
          "anchor": "CollectionCommon",
          "anchorPath": "CollectionCommon",
          "property": "CollectionCommon",
          "relativePath": "",
        },
        Object {
          "anchor": "CollectionCommon",
          "anchorPath": "CollectionCommon",
          "property": "CollectionId",
          "relativePath": "CollectionId",
        },
      ]
    `);
  });
});
