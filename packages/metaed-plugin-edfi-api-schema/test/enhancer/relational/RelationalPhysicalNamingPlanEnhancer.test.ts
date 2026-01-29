/* eslint-disable no-underscore-dangle */
// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  TopLevelEntity,
  DomainEntityBuilder,
  ChoiceBuilder,
  CommonBuilder,
  CommonSubclassBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntitySubclassBuilder,
  DescriptorBuilder,
  EnumerationBuilder,
  newPluginEnvironment,
  DomainEntityExtensionBuilder,
  newNamespace,
  AssociationBuilder,
  CommonExtensionBuilder,
  AssociationExtensionBuilder,
  Namespace,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  choiceReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  commonReferenceEnhancer,
  commonSubclassBaseClassEnhancer,
  descriptorReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  enumerationReferenceEnhancer,
  domainEntityExtensionBaseClassEnhancer,
  associationReferenceEnhancer,
  associationExtensionBaseClassEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../../src/model/EntityPropertyApiSchemaData';
import { EntityApiSchemaData, enhance as entityApiSchemaDataSetupEnhancer } from '../../../src/model/EntityApiSchemaData';
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
import { enhance as relationalNamingPlanEnhancer } from '../../../src/enhancer/relational/RelationalNamingPlanEnhancer';

/**
 * Runs the shared enhancer prerequisites for relational naming tests.
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

  relationalTableNodeEnhancer(metaEd);
  relationalNamingPlanEnhancer(metaEd);
}

/**
 * Summary view of relational base names for snapshot tests.
 */
type RelationalBaseNameSummary = { [key: string]: string };

/**
 * Summarizes relational base names for the supplied entity, optionally filtering by JsonPath.
 */
function summarizeRelationalBaseNames(
  entity: TopLevelEntity | undefined,
  filter: (jsonPath: string) => boolean,
): RelationalBaseNameSummary {
  if (entity == null) return {};

  const apiSchemaData = entity.data.edfiApiSchema as EntityApiSchemaData;
  const relationalBaseNames = apiSchemaData.relationalNamingPlan?.relationalBaseNames ?? {};

  const entries: [string, string][] = Object.entries(relationalBaseNames)
    .filter(([jsonPath]) => filter(jsonPath))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([jsonPath, baseName]) => [jsonPath, baseName as string]);

  return Object.fromEntries(entries);
}

function summarizeRelationalBaseNamesForPaths(
  entity: TopLevelEntity | undefined,
  ...jsonPaths: string[]
): RelationalBaseNameSummary {
  const jsonPathSet: Set<string> = new Set(jsonPaths);
  return summarizeRelationalBaseNames(entity, (jsonPath: string) => jsonPathSet.has(jsonPath));
}

function summarizeRelationalBaseNamesForEntity(entity: TopLevelEntity | undefined): RelationalBaseNameSummary {
  return summarizeRelationalBaseNames(entity, () => true);
}

describe('when deriving relational naming for a shortened collection', () => {
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

  it('should capture the relational base name for the full collection table suffix', () => {
    const entity = namespace?.entity.domainEntity.get(domainEntityName);
    expect(summarizeRelationalBaseNamesForPaths(entity, '$.identificationCodes[*]')).toMatchInlineSnapshot(`
      Object {
        "$.identificationCodes[*]": "AssessmentIdentificationCode",
      }
    `);
  });
});

describe('when deriving relational naming for role-prefixed references', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const referencedEntityName = 'BalanceSheetDimension';
  const domainEntityName = 'ChartOfAccount';
  let namespace: Namespace | undefined;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(referencedEntityName)
      .withDocumentation('doc')
      .withStringIdentity('BalanceSheetDimensionCode', 'doc', '30', '20')
      .withEndDomainEntity()
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('ChartOfAccountIdentifier', 'doc', '30', '20')
      .withDomainEntityProperty(referencedEntityName, 'doc', false, false, false, 'BalanceSheet')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should capture the relational base name with role prefixes preserved', () => {
    const entity = namespace?.entity.domainEntity.get(domainEntityName);
    expect(summarizeRelationalBaseNamesForPaths(entity, '$.balanceSheetDimensionReference')).toMatchInlineSnapshot(`
      Object {
        "$.balanceSheetDimensionReference": "BalanceSheet_BalanceSheetDimension",
      }
    `);
  });
});

describe('when deriving relational naming for role-prefixed scalars in collection tables', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'ProgramEvaluationElement';
  let namespace: Namespace | undefined;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('ProgramEvaluationElementIdentifier', 'doc', '30', '20')
      .withCommonProperty('ProgramEvaluationLevel', 'doc', false, true, 'Element')
      .withEndDomainEntity()

      .withStartCommon('ProgramEvaluationLevel')
      .withDocumentation('doc')
      .withIntegerProperty('MaxNumericRating', 'doc', false, false)
      .withEndCommon()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should capture the role-prefixed scalar base name for the collection path', () => {
    const entity = namespace?.entity.domainEntity.get(domainEntityName);
    expect(
      summarizeRelationalBaseNamesForPaths(
        entity,
        '$.programEvaluationLevels[*]',
        '$.programEvaluationLevels[*].maxNumericRating',
      ),
    ).toMatchInlineSnapshot(`
      Object {
        "$.programEvaluationLevels[*]": "ElementProgramEvaluationLevel",
        "$.programEvaluationLevels[*].maxNumericRating": "ElementMaxNumericRating",
      }
    `);
  });
});
describe('when building simple domain entity with all the simple non-collections', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

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

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.optionalBooleanProperty": "OptionalBooleanProperty",
        "$.optionalDecimalProperty": "OptionalDecimalProperty",
        "$.optionalPercentProperty": "OptionalPercentProperty",
        "$.optionalShortProperty": "OptionalShortProperty",
        "$.optionalYear": "OptionalYear",
        "$.requiredCurrencyProperty": "RequiredCurrencyProperty",
        "$.requiredDateProperty": "RequiredDateProperty",
        "$.requiredDatetimeProperty": "RequiredDatetimeProperty",
        "$.requiredDurationProperty": "RequiredDurationProperty",
        "$.requiredIntegerProperty": "RequiredIntegerProperty",
        "$.requiredTimeProperty": "RequiredTimeProperty",
        "$.schoolYearTypeReference.schoolYear": "SchoolYear",
        "$.stringIdentity": "StringIdentity",
      }
    `);
  });
});

describe('when building simple domain entity with all the simple collections', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.optionalBooleanProperties[*]": "OptionalBooleanProperty",
        "$.optionalBooleanProperties[*].optionalBooleanProperty": "OptionalBooleanProperty",
        "$.optionalDecimalProperties[*]": "OptionalDecimalProperty",
        "$.optionalDecimalProperties[*].optionalDecimalProperty": "OptionalDecimalProperty",
        "$.optionalPercentProperties[*]": "OptionalPercentProperty",
        "$.optionalPercentProperties[*].optionalPercentProperty": "OptionalPercentProperty",
        "$.optionalShortProperties[*]": "OptionalShortProperty",
        "$.optionalShortProperties[*].optionalShortProperty": "OptionalShortProperty",
        "$.optionalYears[*]": "OptionalYear",
        "$.optionalYears[*].optionalYear": "OptionalYear",
        "$.requiredCurrencyProperties[*]": "RequiredCurrencyProperty",
        "$.requiredCurrencyProperties[*].requiredCurrencyProperty": "RequiredCurrencyProperty",
        "$.requiredDateProperties[*]": "RequiredDateProperty",
        "$.requiredDateProperties[*].requiredDateProperty": "RequiredDateProperty",
        "$.requiredDatetimeProperties[*]": "RequiredDatetimeProperty",
        "$.requiredDatetimeProperties[*].requiredDatetimeProperty": "RequiredDatetimeProperty",
        "$.requiredDurationProperties[*]": "RequiredDurationProperty",
        "$.requiredDurationProperties[*].requiredDurationProperty": "RequiredDurationProperty",
        "$.requiredIntegerProperties[*]": "RequiredIntegerProperty",
        "$.requiredIntegerProperties[*].requiredIntegerProperty": "RequiredIntegerProperty",
        "$.requiredStringProperties[*]": "RequiredStringProperty",
        "$.requiredStringProperties[*].requiredStringProperty": "RequiredStringProperty",
        "$.requiredTimeProperties[*]": "RequiredTimeProperty",
        "$.requiredTimeProperties[*].requiredTimeProperty": "RequiredTimeProperty",
        "$.schoolYearTypeReference.schoolYear": "SchoolYear",
        "$.schoolYearTypeReference[*]": "SchoolYear",
        "$.stringIdentity": "StringIdentity",
      }
    `);
  });
});

describe('when building a domain entity referencing another referencing another with identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.classPeriods[*]": "ClassPeriod",
        "$.classPeriods[*].classPeriodReference": "ClassPeriod",
        "$.courseOfferingReference": "CourseOffering",
        "$.sectionIdentifier": "SectionIdentifier",
      }
    `);
  });

  it('should be a correct schema for CourseOffering', () => {
    const entity = namespace.entity.domainEntity.get('CourseOffering');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.localCourseCode": "LocalCourseCode",
        "$.schoolReference": "School",
      }
    `);
  });

  it('should be a correct schema for ClassPeriod', () => {
    const entity = namespace.entity.domainEntity.get('ClassPeriod');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.classPeriodName": "ClassPeriodName",
        "$.schoolReference": "School",
      }
    `);
  });

  it('should be a correct schema for School', () => {
    const entity = namespace.entity.domainEntity.get('School');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.schoolId": "SchoolId",
      }
    `);
  });
});

describe('when building a domain entity referencing CourseOffering with an implicit merge between School and Session.School', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.courseOfferingReference": "CourseOffering",
        "$.sectionIdentifier": "SectionIdentifier",
      }
    `);
  });

  it('should be a correct schema for CourseOffering', () => {
    const entity = namespace.entity.domainEntity.get('CourseOffering');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.localCourseCode": "LocalCourseCode",
        "$.schoolReference": "School",
        "$.sessionReference": "Session",
      }
    `);
  });

  it('should be a correct schema for Session', () => {
    const entity = namespace.entity.domainEntity.get('Session');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.schoolReference": "School",
        "$.schoolYearTypeReference.schoolYear": "SchoolYear",
        "$.sessionName": "SessionName",
      }
    `);
  });

  it('should be a correct schema for School', () => {
    const entity = namespace.entity.domainEntity.get('School');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.schoolId": "SchoolId",
      }
    `);
  });
});

describe('when building domain entity with nested choice and inline commons', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'EducationContent';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.contentIdentifier": "ContentIdentifier",
        "$.derivativeSourceEducationContents[*]": "DerivativeSourceEducationContent",
        "$.derivativeSourceEducationContents[*].derivativeSourceEducationContentReference": "DerivativeSource_EducationContent",
        "$.derivativeSourceURIs[*]": "DerivativeSourceURI",
        "$.derivativeSourceURIs[*].derivativeSourceURI": "DerivativeSourceURI",
        "$.description": "Description",
        "$.learningResourceMetadataURI": "LearningResourceMetadataURI",
        "$.requiredURIs[*]": "RequiredURI",
        "$.requiredURIs[*].requiredURI": "RequiredURI",
        "$.shortDescription": "ShortDescription",
      }
    `);
  });
});

describe('when building domain entity with scalar collection named with prefix of parent entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'EducationContent';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema - parent name prefix removed on array only', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.contentIdentifier": "ContentIdentifier",
        "$.suffixNames[*]": "EducationContentSuffixName",
        "$.suffixNames[*].educationContentSuffixName": "EducationContentSuffixName",
      }
    `);
  });
});

describe('when building domain entity with Association/DomainEntity collection named with prefix of parent entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'EducationContent';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema - parent name prefix retained', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.contentIdentifier": "ContentIdentifier",
        "$.educationContentSuffixNames[*]": "EducationContentSuffixName",
        "$.educationContentSuffixNames[*].educationContentSuffixNameReference": "EducationContentSuffixName",
      }
    `);
  });

  it('should be a correct schema for EducationContentSuffixName', () => {
    const entity = namespace.entity.domainEntity.get(`${domainEntityName}SuffixName`);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.stringIdentity": "StringIdentity",
      }
    `);
  });
});

describe('when building domain entity with acronym property name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'StudentSpecialEducationProgramAssociation';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('ContentIdentifier', 'doc', '30')
      .withDatetimeIdentity(`IEPBeginDate`, 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema - acronym with correct casing', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.contentIdentifier": "ContentIdentifier",
        "$.iepBeginDate": "IEPBeginDate",
      }
    `);
  });
});

describe('when building domain entity with a simple common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.assessmentIdentifier": "AssessmentIdentifier",
        "$.identificationCodes[*]": "AssessmentIdentificationCode",
        "$.identificationCodes[*].identificationCode": "IdentificationCode",
      }
    `);
  });
});

describe('when building domain entity subclass with common collection and descriptor identity in superclass', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntitySubclassName = 'CommunityOrganization';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.communityOrganizationId": "CommunityOrganizationId",
        "$.identificationCodes[*]": "EducationOrganizationIdentificationCode",
        "$.identificationCodes[*].identificationCode": "IdentificationCode",
      }
    `);
  });
});

describe('when building association with a common collection in a common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentEducationOrganizationAssociation');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.addresses[*]": "Address",
        "$.addresses[*].periods[*]": "Period",
        "$.addresses[*].periods[*].beginDate": "BeginDate",
        "$.addresses[*].periods[*].endDate": "EndDate",
        "$.addresses[*].streetNumberName": "StreetNumberName",
        "$.studentId": "StudentId",
      }
    `);
  });
});

describe('when building domain entity with a descriptor with role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.assessmentIdentifier": "AssessmentIdentifier",
      }
    `);
  });
});

describe('when building domain entity with a descriptor collection with role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.assessedGradeLevels[*]": "AssessedGradeLevel",
        "$.assessmentIdentifier": "AssessmentIdentifier",
      }
    `);
  });
});

describe('when building domain entity with a common with a choice', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.assessmentIdentifier": "AssessmentIdentifier",
        "$.contentStandard.publicationDate": "PublicationDate",
        "$.contentStandard.publicationYear": "PublicationYear",
        "$.contentStandard.title": "Title",
      }
    `);
  });
});

describe('when building domain entity with a common and a common collection with parent entity prefix', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.assessmentIdentifier": "AssessmentIdentifier",
        "$.period.beginDate": "BeginDate",
        "$.scores[*]": "AssessmentScore",
        "$.scores[*].minimumScore": "MinimumScore",
      }
    `);
  });
});

describe('when building domain entity with an all-caps property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.assessmentIdentifier": "AssessmentIdentifier",
        "$.uri": "URI",
      }
    `);
  });
});

describe('when building domain entity with a common with a domain entity reference with a role name', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.assessmentIdentifier": "AssessmentIdentifier",
        "$.contentStandard.mandatingEducationOrganizationReference": "Mandating_EducationOrganization",
        "$.contentStandard.title": "Title",
      }
    `);
  });

  it('should be a correct schema for EducationOrganization', () => {
    const entity = namespace.entity.domainEntity.get('EducationOrganization');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.educationOrganizationId": "EducationOrganizationId",
      }
    `);
  });
});

describe('when building domain entity with two school year enumerations, one role named', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentSchoolAssociation');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.classOfSchoolYearTypeReference.schoolYear": "ClassOfSchoolYear",
        "$.schoolId": "SchoolId",
        "$.schoolYearTypeReference.schoolYear": "SchoolYear",
      }
    `);
  });
});

describe('when building domain entity with reference to domain entity with school year enumeration as part of identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentSchoolAssociation');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.calendarReference": "Calendar",
        "$.schoolId": "SchoolId",
      }
    `);
  });

  it('should be a correct schema for Calendar', () => {
    const entity = namespace.entity.domainEntity.get('Calendar');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.schoolId": "SchoolId",
        "$.schoolYearTypeReference.schoolYear": "SchoolYear",
      }
    `);
  });
});

describe('when building a descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor('GradeLevel')
      .withDocumentation('doc')
      .withEndDescriptor()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));
    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.descriptor.get('GradeLevel');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`Object {}`);
  });
});

describe('when building a school year enumeration', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartEnumeration('SchoolYear')
      .withDocumentation('doc')
      .withEnumerationItem('2022')
      .withEndEnumeration()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new EnumerationBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.schoolYearEnumeration.get('SchoolYear');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`Object {}`);
  });
});

describe('when building a schema for studentEducationOrganizationAssociation', () => {
  // The core problem addressed by this test is in RND-456: The CohortYears schoolYearTypeReference was being interpreted as
  // an integer, rather than as a SchoolYearTypeEnumeration. This test builds the minimum components of
  // studentEducationOrganizationAssociation required to duplicate the issue.

  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentCohort');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.studentUniqueId": "StudentUniqueId",
        "$.years[*]": "CohortYear",
        "$.years[*].schoolYearTypeReference.schoolYear": "SchoolYear",
      }
    `);
  });
});

describe('when building a domain entity with an inline common property with a descriptor', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor('CreditType')
      .withDocumentation('Documentation')
      .withEndDescriptor()
      .withStartInlineCommon('Credits')
      .withDocumentation('Documentation')
      .withDescriptorProperty('CreditType', 'Documentation', false, false)
      .withEndInlineCommon()

      .withStartDomainEntity('Section')
      .withDocumentation('Documentation')
      .withIntegerIdentity('SectionIdentifier', 'Documentation')
      .withInlineCommonProperty('Credits', 'Documentation', false, false, 'Available')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    runApiSchemaPrerequisites(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('common descriptor decollisioned top level name should be correct', () => {
    const common = namespace.entity.common.get('Credits');
    expect(common.properties[0].data.edfiApiSchema.apiMapping.decollisionedTopLevelName).toBe('CreditTypeDescriptor');
  });

  it('should be a correct schema for section', () => {
    const entity = namespace.entity.domainEntity.get('Section');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.sectionIdentifier": "SectionIdentifier",
      }
    `);
  });
});

describe('when building a domain entity referencing another using a shortenTo directive', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentCompetencyObjective')
      .withDocumentation('doc')
      .withStringIdentity('Identity1', 'doc', '30')
      .withDomainEntityPropertyWithShortenTo(
        'CompetencyObjective',
        'doc',
        true,
        false,
        false,
        'CompetencyObjective',
        'Objective',
      )
      .withEndDomainEntity()

      .withStartDomainEntity('CompetencyObjective')
      .withDocumentation('doc')
      .withStringIdentity('Identity2', 'doc', '30')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentCompetencyObjective');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.identity1": "Identity1",
        "$.objectiveCompetencyObjectiveReference": "Objective_CompetencyObjective",
      }
    `);
  });

  it('should be a correct schema for CompetencyObjective', () => {
    const entity = namespace.entity.domainEntity.get('CompetencyObjective');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.identity2": "Identity2",
      }
    `);
  });
});

describe('when building a domain entity with different string properties', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('StudentCompetencyObjective')
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', '30')
      .withStringProperty('StringRequired', 'doc', true, false, '30')
      .withStringProperty('StringOptional', 'doc', false, false, '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentCompetencyObjective');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.stringIdentity": "StringIdentity",
        "$.stringOptional": "StringOptional",
        "$.stringRequired": "StringRequired",
      }
    `);
  });
});

describe('when domain entity extension references domain entity in different namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const entityName = 'EntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(referencedEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('ReferencedIdentity', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(entityName)
      .withDocumentation('doc')
      .withIntegerIdentity('EntityIdentity', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntityExtension(`EdFi.${entityName}`)
      .withDomainEntityProperty(`EdFi.${referencedEntityName}`, 'doc', false, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    extensionNamespace = metaEd.namespace.get('Extension') ?? newNamespace();
    extensionNamespace?.dependencies.push(metaEd.namespace.get('EdFi') ?? newNamespace());

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = extensionNamespace.entity.domainEntityExtension.get(entityName);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$._ext.extension.referencedEntityNameReference": "ReferencedEntityName",
      }
    `);
  });

  it('should be a correct schema for referenced entity', () => {
    const coreNamespace = metaEd.namespace.get('EdFi');
    const entity = coreNamespace?.entity.domainEntity.get(referencedEntityName);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.referencedIdentity": "ReferencedIdentity",
      }
    `);
  });

  it('should be a correct schema for core entity', () => {
    const coreNamespace = metaEd.namespace.get('EdFi');
    const entity = coreNamespace?.entity.domainEntity.get(entityName);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.entityIdentity": "EntityIdentity",
      }
    `);
  });
});

describe('when building a domain entity referencing another referencing another with rolenamed identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'AssessmentAdministrationParticipation';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('AssessmentAdministrationParticipationId', 'doc', '30')
      .withDomainEntityIdentity('AssessmentAdministration', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity('AssessmentAdministration')
      .withDocumentation('doc')
      .withStringIdentity('AssessmentAdministrationId', 'doc', '30')
      .withDomainEntityIdentity('EducationOrganization', 'doc', 'Assigning')
      .withEndDomainEntity()

      .withStartDomainEntity('EducationOrganization')
      .withDocumentation('doc')
      .withStringIdentity('EducationOrganizationId', 'doc', '30')
      .withEndDomainEntity()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should be correct relational base names for AssessmentAdministrationParticipation', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.assessmentAdministrationParticipationId": "AssessmentAdministrationParticipationId",
        "$.assessmentAdministrationReference": "AssessmentAdministration",
      }
    `);
  });

  it('should be correct relational base names for AssessmentAdministration', () => {
    const entity = namespace.entity.domainEntity.get('AssessmentAdministration');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.assessmentAdministrationId": "AssessmentAdministrationId",
        "$.assigningEducationOrganizationReference": "Assigning_EducationOrganization",
      }
    `);
  });

  it('should be correct relational base names for EducationOrganization', () => {
    const entity = namespace.entity.domainEntity.get('EducationOrganization');
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.educationOrganizationId": "EducationOrganizationId",
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

      runApiSchemaPrerequisites(metaEd);
    });

    it('should be correct schema for StudentAssessmentRegistrationBatteryPartAssociation', () => {
      const entity = metaEd.namespace
        .get(namespaceName)
        ?.entity.association.get('StudentAssessmentRegistrationBatteryPartAssociation');
      const relationalBaseNames = summarizeRelationalBaseNamesForEntity(entity);
      expect(relationalBaseNames).toMatchInlineSnapshot(`
        Object {
          "$.studentAssessmentRegistrationReference": "StudentAssessmentRegistration",
          "$.unusedEntityReference": "UnusedEntity",
        }
      `);
    });

    it('should be correct relational base names for StudentAssessmentRegistration', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('StudentAssessmentRegistration');
      expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
        Object {
          "$.assessmentAdministrationReference": "AssessmentAdministration",
          "$.studentEducationOrganizationAssociationReference": "StudentEducationOrganizationAssociation",
        }
      `);
    });

    it('should be correct relational base names for AssessmentAdministration', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('AssessmentAdministration');
      expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
        Object {
          "$.assigningEducationOrganizationReference": "Assigning_EducationOrganization",
        }
      `);
    });

    it('should be correct relational base names for StudentEducationOrganizationAssociation', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.association.get('StudentEducationOrganizationAssociation');
      expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
        Object {
          "$.educationOrganizationReference": "EducationOrganization",
          "$.unusedEntityReference": "UnusedEntity",
        }
      `);
    });

    it('should be correct relational base names for EducationOrganization', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('EducationOrganization');
      expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
        Object {
          "$.educationOrganizationId": "EducationOrganizationId",
        }
      `);
    });

    it('should be correct relational base names for UnusedEntity', () => {
      const entity = metaEd.namespace.get(namespaceName)?.entity.domainEntity.get('UnusedEntity');
      expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
        Object {
          "$.unusedProperty": "UnusedProperty",
        }
      `);
    });
  },
);

describe('when building domain entity with CommonSubclass property that inherits from Common', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('Student')
      .withDocumentation('doc')
      .withStringIdentity('StudentUniqueId', 'doc', '32')
      .withCommonProperty('Pet', 'doc', false, true)
      .withCommonProperty('AquaticPet', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('Pet')
      .withDocumentation('doc')
      .withStringProperty('PetName', 'doc', true, false, '20', '3')
      .withBooleanProperty('IsFixed', 'doc', false, false)
      .withEndCommon()

      .withStartCommonSubclass('AquaticPet', 'Pet')
      .withDocumentation('doc')
      .withIntegerProperty('MimimumTankVolume', 'doc', true, false)
      .withEndCommonSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should generate correct schema for domain entity with CommonSubclass property', () => {
    const entity = namespace.entity.domainEntity.get('Student');
    const schema = summarizeRelationalBaseNamesForEntity(entity);
    expect(schema).toMatchInlineSnapshot(`
      Object {
        "$.aquaticPets[*]": "AquaticPet",
        "$.aquaticPets[*].isFixed": "IsFixed",
        "$.aquaticPets[*].mimimumTankVolume": "MimimumTankVolume",
        "$.aquaticPets[*].petName": "PetName",
        "$.pets[*]": "Pet",
        "$.pets[*].isFixed": "IsFixed",
        "$.pets[*].petName": "PetName",
        "$.studentUniqueId": "StudentUniqueId",
      }
    `);
  });
});

describe('when building domain entity with CommonSubclass with complex inheritance chain', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity('School')
      .withDocumentation('doc')
      .withStringIdentity('SchoolId', 'doc', '32')
      .withCommonProperty('Vehicle', 'doc', false, true)
      .withCommonProperty('ElectricVehicle', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('Vehicle')
      .withDocumentation('doc')
      .withStringProperty('Make', 'doc', true, false, '50')
      .withStringProperty('Model', 'doc', true, false, '50')
      .withIntegerProperty('Year', 'doc', false, false)
      .withBooleanProperty('IsOperational', 'doc', false, false)
      .withEndCommon()

      .withStartCommonSubclass('ElectricVehicle', 'Vehicle')
      .withDocumentation('doc')
      .withDecimalProperty('BatteryCapacity', 'doc', true, false, '5', '2')
      .withIntegerProperty('Range', 'doc', false, false)
      .withBooleanProperty('FastChargeCapable', 'doc', true, false)
      .withEndCommonSubclass()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonSubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should generate correct schema with all inherited properties and correct types', () => {
    const entity = namespace.entity.domainEntity.get('School');
    const schema = summarizeRelationalBaseNamesForEntity(entity);
    expect(schema).toMatchInlineSnapshot(`
      Object {
        "$.electricVehicles[*]": "ElectricVehicle",
        "$.electricVehicles[*].batteryCapacity": "BatteryCapacity",
        "$.electricVehicles[*].fastChargeCapable": "FastChargeCapable",
        "$.electricVehicles[*].isOperational": "IsOperational",
        "$.electricVehicles[*].make": "Make",
        "$.electricVehicles[*].model": "Model",
        "$.electricVehicles[*].range": "Range",
        "$.electricVehicles[*].year": "Year",
        "$.schoolId": "SchoolId",
        "$.vehicles[*]": "Vehicle",
        "$.vehicles[*].isOperational": "IsOperational",
        "$.vehicles[*].make": "Make",
        "$.vehicles[*].model": "Model",
        "$.vehicles[*].year": "Year",
      }
    `);
  });
});

describe('when domain entity extension has common extension override property with matching common extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const commonName = 'TestCommon';
  const domainEntityName = 'TestEntity';
  const extensionProperty = 'ExtensionProperty';
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withIntegerIdentity('CommonId', 'doc')
      .withEndCommon()

      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('EntityId', 'doc')
      .withCommonProperty(commonName, 'doc', true, false)
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(extension, extension)
      .withStartDomainEntityExtension(`${core}.${domainEntityName}`)
      .withCommonExtensionOverrideProperty(`${core}.${commonName}`, 'doc', true, false)
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${core}.${commonName}`)
      .withStringProperty(extensionProperty, 'doc', false, false, '50')
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get(core);
    extensionNamespace = metaEd.namespace.get(extension);
    extensionNamespace.dependencies.push(coreNamespace);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should include common extension schema in domain entity with extension override', () => {
    const entity = extensionNamespace.entity.domainEntityExtension.get(domainEntityName);
    const schema = summarizeRelationalBaseNamesForEntity(entity);
    expect(schema).toMatchInlineSnapshot(`
      Object {
        "$._ext.extension.testCommon.commonId": "CommonId",
      }
    `);
  });

  it('should be a correct schema for core TestEntity', () => {
    const entity = coreNamespace.entity.domainEntity.get(domainEntityName);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.entityId": "EntityId",
        "$.testCommon.commonId": "CommonId",
      }
    `);
  });
});

describe('when association extension has common extension override property', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const commonName = 'AssociationCommon';
  const associationName = 'TestAssociation';
  const domainEntity1 = 'Entity1';
  const domainEntity2 = 'Entity2';
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
      .withStartCommon(commonName)
      .withDocumentation('doc')
      .withIntegerIdentity('CommonId', 'doc')
      .withEndCommon()

      .withStartDomainEntity(domainEntity1)
      .withDocumentation('doc')
      .withIntegerIdentity('Entity1Id', 'doc')
      .withEndDomainEntity()

      .withStartDomainEntity(domainEntity2)
      .withDocumentation('doc')
      .withIntegerIdentity('Entity2Id', 'doc')
      .withEndDomainEntity()

      .withStartAssociation(associationName)
      .withDocumentation('doc')
      .withAssociationDomainEntityProperty(domainEntity1, 'doc')
      .withAssociationDomainEntityProperty(domainEntity2, 'doc')
      .withCommonProperty(commonName, 'doc', true, false)
      .withEndAssociation()
      .withEndNamespace()

      .withBeginNamespace(extension, extension)
      .withStartAssociationExtension(`${core}.${associationName}`)
      .withCommonExtensionOverrideProperty(`${core}.${commonName}`, 'doc', true, false)
      .withEndAssociationExtension()

      .withStartCommonExtension(`${core}.${commonName}`)
      .withBooleanProperty('ExtensionFlag', 'doc', false, false)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new AssociationBuilder(metaEd, []))
      .sendToListener(new AssociationExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get(core);
    extensionNamespace = metaEd.namespace.get(extension);

    extensionNamespace.dependencies.push(coreNamespace);

    runApiSchemaPrerequisites(metaEd);
  });

  it('should include common extension schema in association with extension override', () => {
    const entity = extensionNamespace.entity.associationExtension.get(associationName);
    const schema = summarizeRelationalBaseNamesForEntity(entity);
    expect(schema).toMatchInlineSnapshot(`
      Object {
        "$._ext.extension.common.commonId": "CommonId",
      }
    `);
  });

  it('should be a correct schema for core association', () => {
    const entity = coreNamespace.entity.association.get(associationName);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.common.commonId": "CommonId",
        "$.entity1Reference": "Entity1",
        "$.entity2Reference": "Entity2",
      }
    `);
  });

  it('should be a correct schema for Entity1', () => {
    const entity = coreNamespace.entity.domainEntity.get(domainEntity1);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.entity1Id": "Entity1Id",
      }
    `);
  });

  it('should be a correct schema for Entity2', () => {
    const entity = coreNamespace.entity.domainEntity.get(domainEntity2);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.entity2Id": "Entity2Id",
      }
    `);
  });
});

describe('when extension override property has collection modifier', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const core = 'EdFi';
  const extension = 'Extension';
  const commonName = 'CollectionCommon';
  const domainEntityName = 'CollectionEntity';
  let coreNamespace: any = null;
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(core)
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

      .withBeginNamespace(extension, extension)
      .withStartDomainEntityExtension(`${core}.${domainEntityName}`)
      .withCommonExtensionOverrideProperty(`${core}.${commonName}`, 'doc', true, true)
      .withEndDomainEntityExtension()

      .withStartCommonExtension(`${core}.${commonName}`)
      .withDecimalProperty('ExtensionAmount', 'doc', false, false, '10', '2')
      .withIntegerProperty('ExtensionCount', 'doc', true, true)
      .withEndCommonExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new CommonExtensionBuilder(metaEd, []));

    coreNamespace = metaEd.namespace.get(core);
    extensionNamespace = metaEd.namespace.get(extension);

    extensionNamespace.dependencies.push(coreNamespace);

    runApiSchemaPrerequisites(metaEd);
  });
  it('should include common extension schema in domain entity with extension override', () => {
    const entity = extensionNamespace.entity.domainEntityExtension.get(domainEntityName);
    const schema = summarizeRelationalBaseNamesForEntity(entity);
    expect(schema).toMatchInlineSnapshot(`
      Object {
        "$._ext.extension.collectionCommons[*]": "CollectionCommon",
        "$._ext.extension.collectionCommons[*].collectionId": "CollectionId",
      }
    `);
  });

  it('should be a correct schema for core CollectionEntity', () => {
    const entity = coreNamespace.entity.domainEntity.get(domainEntityName);
    expect(summarizeRelationalBaseNamesForEntity(entity)).toMatchInlineSnapshot(`
      Object {
        "$.collectionCommons[*]": "CollectionCommon",
        "$.collectionCommons[*].collectionId": "CollectionId",
        "$.entityId": "EntityId",
      }
    `);
  });
});
