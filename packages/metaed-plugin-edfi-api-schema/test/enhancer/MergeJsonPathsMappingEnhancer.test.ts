// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  newMetaEdEnvironment,
  MetaEdEnvironment,
  DomainEntityBuilder,
  ChoiceBuilder,
  CommonBuilder,
  MetaEdTextBuilder,
  NamespaceBuilder,
  DomainEntitySubclassBuilder,
  DescriptorBuilder,
  TopLevelEntity,
  EnumerationBuilder,
  MetaEdPropertyPath,
  AssociationBuilder,
  DomainEntityExtensionBuilder,
  newNamespace,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  choiceReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  commonReferenceEnhancer,
  descriptorReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  enumerationReferenceEnhancer,
  associationReferenceEnhancer,
  mergeDirectiveEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { EntityApiSchemaData, enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as mergeCoveringFlattenedIdentityPropertyEnhancer } from '../../src/enhancer/MergeCoveringFlattenedIdentityPropertyEnhancer';
import { enhance } from '../../src/enhancer/MergeJsonPathsMappingEnhancer';
import { JsonPath } from '../../src/model/api-schema/JsonPath';
import { JsonPathsMapping } from '../../src/model/JsonPathsMapping';

type SimpleJsonPathsInfo = { jsonPath: JsonPath; entityName: string; propertyName: string };

type Snapshotable = {
  jsonPaths: { [key: MetaEdPropertyPath]: SimpleJsonPathsInfo };
  isTopLevel: { [key: MetaEdPropertyPath]: boolean };
  terminalPropertyFullName: { [key: MetaEdPropertyPath]: string };
};

function snapshotify(mergeJsonPathsMapping: JsonPathsMapping): Snapshotable {
  const jsonPaths = {} as { [key: MetaEdPropertyPath]: SimpleJsonPathsInfo };
  const isTopLevel = {} as { [key: MetaEdPropertyPath]: boolean };
  const terminalPropertyFullName = {} as { [key: MetaEdPropertyPath]: string };

  Object.entries(mergeJsonPathsMapping).forEach(([key, value]) => {
    jsonPaths[key] = value.jsonPathPropertyPairs.map((jppp) => ({
      jsonPath: jppp.jsonPath,
      entityName: jppp.sourceProperty.parentEntityName,
      propertyName: jppp.sourceProperty.metaEdName,
    }));
    isTopLevel[key] = value.isTopLevel;
    if (value.isTopLevel) {
      terminalPropertyFullName[key] = value.terminalProperty.fullPropertyName;
    }
  });

  return {
    jsonPaths,
    isTopLevel,
    terminalPropertyFullName,
  };
}

function snapshotifyEntity(entity: TopLevelEntity): Snapshotable {
  const { mergeJsonPathsMapping } = entity?.data.edfiApiSchema as EntityApiSchemaData;
  return snapshotify(mergeJsonPathsMapping);
}

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

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.optionalBooleanProperty",
            "propertyName": "OptionalBooleanProperty",
          },
        ],
        "OptionalDecimalProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.optionalDecimalProperty",
            "propertyName": "OptionalDecimalProperty",
          },
        ],
        "OptionalPercentProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.optionalPercentProperty",
            "propertyName": "OptionalPercentProperty",
          },
        ],
        "OptionalShortProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.optionalShortProperty",
            "propertyName": "OptionalShortProperty",
          },
        ],
        "OptionalYear": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.optionalYear",
            "propertyName": "OptionalYear",
          },
        ],
        "RequiredCurrencyProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.requiredCurrencyProperty",
            "propertyName": "RequiredCurrencyProperty",
          },
        ],
        "RequiredDateProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.requiredDateProperty",
            "propertyName": "RequiredDateProperty",
          },
        ],
        "RequiredDatetimeProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.requiredDatetimeProperty",
            "propertyName": "RequiredDatetimeProperty",
          },
        ],
        "RequiredDurationProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.requiredDurationProperty",
            "propertyName": "RequiredDurationProperty",
          },
        ],
        "RequiredIntegerProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.requiredIntegerProperty",
            "propertyName": "RequiredIntegerProperty",
          },
        ],
        "RequiredTimeProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.requiredTimeProperty",
            "propertyName": "RequiredTimeProperty",
          },
        ],
        "SchoolYear": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.schoolYearTypeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "StringIdentity": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.stringIdentity",
            "propertyName": "StringIdentity",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": true,
        "OptionalDecimalProperty": true,
        "OptionalPercentProperty": true,
        "OptionalShortProperty": true,
        "OptionalYear": true,
        "RequiredCurrencyProperty": true,
        "RequiredDateProperty": true,
        "RequiredDatetimeProperty": true,
        "RequiredDurationProperty": true,
        "RequiredIntegerProperty": true,
        "RequiredTimeProperty": true,
        "SchoolYear": true,
        "StringIdentity": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": "OptionalBooleanProperty",
        "OptionalDecimalProperty": "OptionalDecimalProperty",
        "OptionalPercentProperty": "OptionalPercentProperty",
        "OptionalShortProperty": "OptionalShortProperty",
        "OptionalYear": "OptionalYear",
        "RequiredCurrencyProperty": "RequiredCurrencyProperty",
        "RequiredDateProperty": "RequiredDateProperty",
        "RequiredDatetimeProperty": "RequiredDatetimeProperty",
        "RequiredDurationProperty": "RequiredDurationProperty",
        "RequiredIntegerProperty": "RequiredIntegerProperty",
        "RequiredTimeProperty": "RequiredTimeProperty",
        "SchoolYear": "SchoolYear",
        "StringIdentity": "StringIdentity",
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

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.optionalBooleanProperties[*].optionalBooleanProperty",
            "propertyName": "OptionalBooleanProperty",
          },
        ],
        "OptionalDecimalProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.optionalDecimalProperties[*].optionalDecimalProperty",
            "propertyName": "OptionalDecimalProperty",
          },
        ],
        "OptionalPercentProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.optionalPercentProperties[*].optionalPercentProperty",
            "propertyName": "OptionalPercentProperty",
          },
        ],
        "OptionalShortProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.optionalShortProperties[*].optionalShortProperty",
            "propertyName": "OptionalShortProperty",
          },
        ],
        "OptionalYear": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.optionalYears[*].optionalYear",
            "propertyName": "OptionalYear",
          },
        ],
        "RequiredCurrencyProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.requiredCurrencyProperties[*].requiredCurrencyProperty",
            "propertyName": "RequiredCurrencyProperty",
          },
        ],
        "RequiredDateProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.requiredDateProperties[*].requiredDateProperty",
            "propertyName": "RequiredDateProperty",
          },
        ],
        "RequiredDatetimeProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.requiredDatetimeProperties[*].requiredDatetimeProperty",
            "propertyName": "RequiredDatetimeProperty",
          },
        ],
        "RequiredDurationProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.requiredDurationProperties[*].requiredDurationProperty",
            "propertyName": "RequiredDurationProperty",
          },
        ],
        "RequiredIntegerProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.requiredIntegerProperties[*].requiredIntegerProperty",
            "propertyName": "RequiredIntegerProperty",
          },
        ],
        "RequiredStringProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.requiredStringProperties[*].requiredStringProperty",
            "propertyName": "RequiredStringProperty",
          },
        ],
        "RequiredTimeProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.requiredTimeProperties[*].requiredTimeProperty",
            "propertyName": "RequiredTimeProperty",
          },
        ],
        "SchoolYear": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.schoolYearTypeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "StringIdentity": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.stringIdentity",
            "propertyName": "StringIdentity",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": true,
        "OptionalDecimalProperty": true,
        "OptionalPercentProperty": true,
        "OptionalShortProperty": true,
        "OptionalYear": true,
        "RequiredCurrencyProperty": true,
        "RequiredDateProperty": true,
        "RequiredDatetimeProperty": true,
        "RequiredDurationProperty": true,
        "RequiredIntegerProperty": true,
        "RequiredStringProperty": true,
        "RequiredTimeProperty": true,
        "SchoolYear": true,
        "StringIdentity": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": "OptionalBooleanProperty",
        "OptionalDecimalProperty": "OptionalDecimalProperty",
        "OptionalPercentProperty": "OptionalPercentProperty",
        "OptionalShortProperty": "OptionalShortProperty",
        "OptionalYear": "OptionalYear",
        "RequiredCurrencyProperty": "RequiredCurrencyProperty",
        "RequiredDateProperty": "RequiredDateProperty",
        "RequiredDatetimeProperty": "RequiredDatetimeProperty",
        "RequiredDurationProperty": "RequiredDurationProperty",
        "RequiredIntegerProperty": "RequiredIntegerProperty",
        "RequiredStringProperty": "RequiredStringProperty",
        "RequiredTimeProperty": "RequiredTimeProperty",
        "SchoolYear": "SchoolYear",
        "StringIdentity": "StringIdentity",
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

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "ClassPeriod": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.classPeriods[*].classPeriodReference.classPeriodName",
            "propertyName": "ClassPeriod",
          },
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.classPeriods[*].classPeriodReference.schoolId",
            "propertyName": "ClassPeriod",
          },
        ],
        "ClassPeriod.ClassPeriodName": Array [
          Object {
            "entityName": "ClassPeriod",
            "jsonPath": "$.classPeriods[*].classPeriodReference.classPeriodName",
            "propertyName": "ClassPeriodName",
          },
        ],
        "ClassPeriod.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.classPeriods[*].classPeriodReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "ClassPeriod.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.classPeriods[*].classPeriodReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "CourseOffering": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.courseOfferingReference.localCourseCode",
            "propertyName": "CourseOffering",
          },
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.courseOfferingReference.schoolId",
            "propertyName": "CourseOffering",
          },
        ],
        "CourseOffering.LocalCourseCode": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.courseOfferingReference.localCourseCode",
            "propertyName": "LocalCourseCode",
          },
        ],
        "CourseOffering.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.courseOfferingReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "CourseOffering.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.courseOfferingReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "SectionIdentifier": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.sectionIdentifier",
            "propertyName": "SectionIdentifier",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "ClassPeriod": true,
        "ClassPeriod.ClassPeriodName": false,
        "ClassPeriod.School": false,
        "ClassPeriod.School.SchoolId": false,
        "CourseOffering": true,
        "CourseOffering.LocalCourseCode": false,
        "CourseOffering.School": false,
        "CourseOffering.School.SchoolId": false,
        "SectionIdentifier": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "ClassPeriod": "ClassPeriod",
        "CourseOffering": "CourseOffering",
        "SectionIdentifier": "SectionIdentifier",
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

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping for DomainEntityName', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "CourseOffering": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.courseOfferingReference.localCourseCode",
            "propertyName": "CourseOffering",
          },
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.courseOfferingReference.schoolId",
            "propertyName": "CourseOffering",
          },
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.courseOfferingReference.schoolYear",
            "propertyName": "CourseOffering",
          },
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.courseOfferingReference.sessionName",
            "propertyName": "CourseOffering",
          },
        ],
        "CourseOffering.LocalCourseCode": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.courseOfferingReference.localCourseCode",
            "propertyName": "LocalCourseCode",
          },
        ],
        "CourseOffering.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.courseOfferingReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "CourseOffering.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.courseOfferingReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "CourseOffering.Session": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.courseOfferingReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.courseOfferingReference.schoolYear",
            "propertyName": "SchoolYear",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.courseOfferingReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "CourseOffering.Session.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.courseOfferingReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "CourseOffering.Session.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.courseOfferingReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "CourseOffering.Session.SchoolYear": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.courseOfferingReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "CourseOffering.Session.SessionName": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.courseOfferingReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
        "SectionIdentifier": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$.sectionIdentifier",
            "propertyName": "SectionIdentifier",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "CourseOffering": true,
        "CourseOffering.LocalCourseCode": false,
        "CourseOffering.School": false,
        "CourseOffering.School.SchoolId": false,
        "CourseOffering.Session": false,
        "CourseOffering.Session.School": false,
        "CourseOffering.Session.School.SchoolId": false,
        "CourseOffering.Session.SchoolYear": false,
        "CourseOffering.Session.SessionName": false,
        "SectionIdentifier": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "CourseOffering": "CourseOffering",
        "SectionIdentifier": "SectionIdentifier",
      }
    `);
  });

  it('should be correct mergeJsonPathsMapping for CourseOffering', () => {
    const entity = namespace.entity.domainEntity.get('CourseOffering');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "LocalCourseCode": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.localCourseCode",
            "propertyName": "LocalCourseCode",
          },
        ],
        "School": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.schoolReference.schoolId",
            "propertyName": "School",
          },
        ],
        "School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.schoolReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "Session": Array [
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.sessionReference.schoolId",
            "propertyName": "Session",
          },
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.sessionReference.schoolYear",
            "propertyName": "Session",
          },
          Object {
            "entityName": "CourseOffering",
            "jsonPath": "$.sessionReference.sessionName",
            "propertyName": "Session",
          },
        ],
        "Session.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.sessionReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "Session.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.sessionReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "Session.SchoolYear": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.sessionReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "Session.SessionName": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.sessionReference.sessionName",
            "propertyName": "SessionName",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "LocalCourseCode": true,
        "School": true,
        "School.SchoolId": false,
        "Session": true,
        "Session.School": false,
        "Session.School.SchoolId": false,
        "Session.SchoolYear": false,
        "Session.SessionName": false,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "LocalCourseCode": "LocalCourseCode",
        "School": "School",
        "Session": "Session",
      }
    `);
  });

  it('should be correct mergeJsonPathsMapping for Session', () => {
    const entity = namespace.entity.domainEntity.get('Session');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "School": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.schoolReference.schoolId",
            "propertyName": "School",
          },
        ],
        "School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.schoolReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "SchoolYear": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.schoolYearTypeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "SessionName": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.sessionName",
            "propertyName": "SessionName",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "School": true,
        "School.SchoolId": false,
        "SchoolYear": true,
        "SessionName": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "School": "School",
        "SchoolYear": "SchoolYear",
        "SessionName": "SessionName",
      }
    `);
  });

  it('should be correct mergeJsonPathsMapping for School', () => {
    const entity = namespace.entity.domainEntity.get('School');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.schoolId",
            "propertyName": "SchoolId",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "SchoolId": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "SchoolId": "SchoolId",
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

    domainEntityReferenceEnhancer(metaEd);
    choiceReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Array [
          Object {
            "entityName": "EducationContent",
            "jsonPath": "$.contentIdentifier",
            "propertyName": "ContentIdentifier",
          },
        ],
        "LearningResourceChoice.LearningResource.ContentClass": Array [
          Object {
            "entityName": "LearningResource",
            "jsonPath": "$.contentClassDescriptor",
            "propertyName": "ContentClass",
          },
        ],
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent": Array [
          Object {
            "entityName": "EducationContentSource",
            "jsonPath": "$.derivativeSourceEducationContents[*].derivativeSourceEducationContentReference.contentIdentifier",
            "propertyName": "EducationContent",
          },
        ],
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent.ContentIdentifier": Array [
          Object {
            "entityName": "EducationContent",
            "jsonPath": "$.derivativeSourceEducationContents[*].derivativeSourceEducationContentReference.contentIdentifier",
            "propertyName": "ContentIdentifier",
          },
        ],
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.URI": Array [
          Object {
            "entityName": "EducationContentSource",
            "jsonPath": "$.derivativeSourceURIs[*].derivativeSourceURI",
            "propertyName": "URI",
          },
        ],
        "LearningResourceChoice.LearningResource.Description": Array [
          Object {
            "entityName": "LearningResource",
            "jsonPath": "$.description",
            "propertyName": "Description",
          },
        ],
        "LearningResourceChoice.LearningResource.ShortDescription": Array [
          Object {
            "entityName": "LearningResource",
            "jsonPath": "$.shortDescription",
            "propertyName": "ShortDescription",
          },
        ],
        "LearningResourceChoice.LearningResourceMetadataURI": Array [
          Object {
            "entityName": "LearningResourceChoice",
            "jsonPath": "$.learningResourceMetadataURI",
            "propertyName": "LearningResourceMetadataURI",
          },
        ],
        "RequiredURI": Array [
          Object {
            "entityName": "EducationContent",
            "jsonPath": "$.requiredURIs[*].requiredURI",
            "propertyName": "RequiredURI",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": true,
        "LearningResourceChoice.LearningResource.ContentClass": true,
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent": true,
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent.ContentIdentifier": false,
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.URI": true,
        "LearningResourceChoice.LearningResource.Description": true,
        "LearningResourceChoice.LearningResource.ShortDescription": true,
        "LearningResourceChoice.LearningResourceMetadataURI": true,
        "RequiredURI": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": "ContentIdentifier",
        "LearningResourceChoice.LearningResource.ContentClass": "ContentClass",
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.EducationContent": "EducationContent",
        "LearningResourceChoice.LearningResource.DerivativeSourceEducationContentSource.URI": "URI",
        "LearningResourceChoice.LearningResource.Description": "Description",
        "LearningResourceChoice.LearningResource.ShortDescription": "ShortDescription",
        "LearningResourceChoice.LearningResourceMetadataURI": "LearningResourceMetadataURI",
        "RequiredURI": "RequiredURI",
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

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Array [
          Object {
            "entityName": "EducationContent",
            "jsonPath": "$.contentIdentifier",
            "propertyName": "ContentIdentifier",
          },
        ],
        "EducationContentSuffixName": Array [
          Object {
            "entityName": "EducationContent",
            "jsonPath": "$.suffixNames[*].suffixName",
            "propertyName": "EducationContentSuffixName",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": true,
        "EducationContentSuffixName": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": "ContentIdentifier",
        "EducationContentSuffixName": "EducationContentSuffixName",
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

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Array [
          Object {
            "entityName": "EducationContent",
            "jsonPath": "$.contentIdentifier",
            "propertyName": "ContentIdentifier",
          },
        ],
        "EducationContentSuffixName": Array [
          Object {
            "entityName": "EducationContent",
            "jsonPath": "$.educationContentSuffixNames[*].educationContentSuffixNameReference.stringIdentity",
            "propertyName": "EducationContentSuffixName",
          },
        ],
        "EducationContentSuffixName.StringIdentity": Array [
          Object {
            "entityName": "EducationContentSuffixName",
            "jsonPath": "$.educationContentSuffixNames[*].educationContentSuffixNameReference.stringIdentity",
            "propertyName": "StringIdentity",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": true,
        "EducationContentSuffixName": true,
        "EducationContentSuffixName.StringIdentity": false,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": "ContentIdentifier",
        "EducationContentSuffixName": "EducationContentSuffixName",
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

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Array [
          Object {
            "entityName": "StudentSpecialEducationProgramAssociation",
            "jsonPath": "$.contentIdentifier",
            "propertyName": "ContentIdentifier",
          },
        ],
        "IEPBeginDate": Array [
          Object {
            "entityName": "StudentSpecialEducationProgramAssociation",
            "jsonPath": "$.iepBeginDate",
            "propertyName": "IEPBeginDate",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": true,
        "IEPBeginDate": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": "ContentIdentifier",
        "IEPBeginDate": "IEPBeginDate",
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

    commonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentificationCode.AssessmentIdentificationSystem": Array [
          Object {
            "entityName": "AssessmentIdentificationCode",
            "jsonPath": "$.identificationCodes[*].assessmentIdentificationSystemDescriptor",
            "propertyName": "AssessmentIdentificationSystem",
          },
        ],
        "AssessmentIdentificationCode.IdentificationCode": Array [
          Object {
            "entityName": "AssessmentIdentificationCode",
            "jsonPath": "$.identificationCodes[*].identificationCode",
            "propertyName": "IdentificationCode",
          },
        ],
        "AssessmentIdentifier": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentificationCode.AssessmentIdentificationSystem": true,
        "AssessmentIdentificationCode.IdentificationCode": true,
        "AssessmentIdentifier": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentificationCode.AssessmentIdentificationSystem": "AssessmentIdentificationSystem",
        "AssessmentIdentificationCode.IdentificationCode": "IdentificationCode",
        "AssessmentIdentifier": "AssessmentIdentifier",
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

    domainEntitySubclassBaseClassEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);

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
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName);
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "CommunityOrganizationId": Array [
          Object {
            "entityName": "CommunityOrganization",
            "jsonPath": "$.communityOrganizationId",
            "propertyName": "CommunityOrganizationId",
          },
        ],
        "EducationOrganizationIdentificationCode.EducationOrganizationIdentificationSystem": Array [
          Object {
            "entityName": "EducationOrganizationIdentificationCode",
            "jsonPath": "$.identificationCodes[*].educationOrganizationIdentificationSystemDescriptor",
            "propertyName": "EducationOrganizationIdentificationSystem",
          },
        ],
        "EducationOrganizationIdentificationCode.IdentificationCode": Array [
          Object {
            "entityName": "EducationOrganizationIdentificationCode",
            "jsonPath": "$.identificationCodes[*].identificationCode",
            "propertyName": "IdentificationCode",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "CommunityOrganizationId": true,
        "EducationOrganizationIdentificationCode.EducationOrganizationIdentificationSystem": true,
        "EducationOrganizationIdentificationCode.IdentificationCode": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "CommunityOrganizationId": "CommunityOrganizationId",
        "EducationOrganizationIdentificationCode.EducationOrganizationIdentificationSystem": "EducationOrganizationIdentificationSystem",
        "EducationOrganizationIdentificationCode.IdentificationCode": "IdentificationCode",
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

    commonReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('StudentEducationOrganizationAssociation');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "Address.Period.BeginDate": Array [
          Object {
            "entityName": "Period",
            "jsonPath": "$.addresses[*].periods[*].beginDate",
            "propertyName": "BeginDate",
          },
        ],
        "Address.Period.EndDate": Array [
          Object {
            "entityName": "Period",
            "jsonPath": "$.addresses[*].periods[*].endDate",
            "propertyName": "EndDate",
          },
        ],
        "Address.StreetNumberName": Array [
          Object {
            "entityName": "Address",
            "jsonPath": "$.addresses[*].streetNumberName",
            "propertyName": "StreetNumberName",
          },
        ],
        "StudentId": Array [
          Object {
            "entityName": "StudentEducationOrganizationAssociation",
            "jsonPath": "$.studentId",
            "propertyName": "StudentId",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "Address.Period.BeginDate": true,
        "Address.Period.EndDate": true,
        "Address.StreetNumberName": true,
        "StudentId": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "Address.Period.BeginDate": "BeginDate",
        "Address.Period.EndDate": "EndDate",
        "Address.StreetNumberName": "StreetNumberName",
        "StudentId": "StudentId",
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

    descriptorReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevel": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.assessedGradeLevelDescriptor",
            "propertyName": "GradeLevel",
          },
        ],
        "AssessmentIdentifier": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevel": true,
        "AssessmentIdentifier": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevel": "AssessedGradeLevel",
        "AssessmentIdentifier": "AssessmentIdentifier",
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

    descriptorReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevel": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.assessedGradeLevels[*].gradeLevelDescriptor",
            "propertyName": "GradeLevel",
          },
        ],
        "AssessmentIdentifier": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevel": true,
        "AssessmentIdentifier": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevel": "AssessedGradeLevel",
        "AssessmentIdentifier": "AssessmentIdentifier",
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

    choiceReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
        ],
        "ContentStandard.PublicationDateChoice.PublicationDate": Array [
          Object {
            "entityName": "PublicationDateChoice",
            "jsonPath": "$.contentStandard.publicationDate",
            "propertyName": "PublicationDate",
          },
        ],
        "ContentStandard.PublicationDateChoice.PublicationYear": Array [
          Object {
            "entityName": "PublicationDateChoice",
            "jsonPath": "$.contentStandard.publicationYear",
            "propertyName": "PublicationYear",
          },
        ],
        "ContentStandard.Title": Array [
          Object {
            "entityName": "ContentStandard",
            "jsonPath": "$.contentStandard.title",
            "propertyName": "Title",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": true,
        "ContentStandard.PublicationDateChoice.PublicationDate": true,
        "ContentStandard.PublicationDateChoice.PublicationYear": true,
        "ContentStandard.Title": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": "AssessmentIdentifier",
        "ContentStandard.PublicationDateChoice.PublicationDate": "PublicationDate",
        "ContentStandard.PublicationDateChoice.PublicationYear": "PublicationYear",
        "ContentStandard.Title": "Title",
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

    commonReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
        ],
        "AssessmentPeriod.BeginDate": Array [
          Object {
            "entityName": "AssessmentPeriod",
            "jsonPath": "$.period.beginDate",
            "propertyName": "BeginDate",
          },
        ],
        "AssessmentScore.MinimumScore": Array [
          Object {
            "entityName": "AssessmentScore",
            "jsonPath": "$.scores[*].minimumScore",
            "propertyName": "MinimumScore",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": true,
        "AssessmentPeriod.BeginDate": true,
        "AssessmentScore.MinimumScore": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": "AssessmentIdentifier",
        "AssessmentPeriod.BeginDate": "BeginDate",
        "AssessmentScore.MinimumScore": "MinimumScore",
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

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
        ],
        "URI": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.uri",
            "propertyName": "URI",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": true,
        "URI": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": "AssessmentIdentifier",
        "URI": "URI",
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

    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Array [
          Object {
            "entityName": "Assessment",
            "jsonPath": "$.assessmentIdentifier",
            "propertyName": "AssessmentIdentifier",
          },
        ],
        "ContentStandard.MandatingEducationOrganization": Array [
          Object {
            "entityName": "ContentStandard",
            "jsonPath": "$.contentStandard.mandatingEducationOrganizationReference.educationOrganizationId",
            "propertyName": "EducationOrganization",
          },
        ],
        "ContentStandard.MandatingEducationOrganization.EducationOrganizationId": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.contentStandard.mandatingEducationOrganizationReference.educationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "ContentStandard.Title": Array [
          Object {
            "entityName": "ContentStandard",
            "jsonPath": "$.contentStandard.title",
            "propertyName": "Title",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": true,
        "ContentStandard.MandatingEducationOrganization": true,
        "ContentStandard.MandatingEducationOrganization.EducationOrganizationId": false,
        "ContentStandard.Title": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": "AssessmentIdentifier",
        "ContentStandard.MandatingEducationOrganization": "MandatingEducationOrganization",
        "ContentStandard.Title": "Title",
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

    enumerationReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('StudentSchoolAssociation');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "ClassOfSchoolYear": Array [
          Object {
            "entityName": "StudentSchoolAssociation",
            "jsonPath": "$.classOfSchoolYearTypeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "SchoolId": Array [
          Object {
            "entityName": "StudentSchoolAssociation",
            "jsonPath": "$.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "SchoolYear": Array [
          Object {
            "entityName": "StudentSchoolAssociation",
            "jsonPath": "$.schoolYearTypeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "ClassOfSchoolYear": true,
        "SchoolId": true,
        "SchoolYear": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "ClassOfSchoolYear": "ClassOfSchoolYear",
        "SchoolId": "SchoolId",
        "SchoolYear": "SchoolYear",
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

    domainEntityReferenceEnhancer(metaEd);
    enumerationReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('StudentSchoolAssociation');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "Calendar": Array [
          Object {
            "entityName": "StudentSchoolAssociation",
            "jsonPath": "$.calendarReference.schoolId",
            "propertyName": "Calendar",
          },
          Object {
            "entityName": "StudentSchoolAssociation",
            "jsonPath": "$.calendarReference.schoolYear",
            "propertyName": "Calendar",
          },
        ],
        "Calendar.SchoolId": Array [
          Object {
            "entityName": "Calendar",
            "jsonPath": "$.calendarReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "Calendar.SchoolYear": Array [
          Object {
            "entityName": "Calendar",
            "jsonPath": "$.calendarReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "SchoolId": Array [
          Object {
            "entityName": "StudentSchoolAssociation",
            "jsonPath": "$.schoolId",
            "propertyName": "SchoolId",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "Calendar": true,
        "Calendar.SchoolId": false,
        "Calendar.SchoolYear": false,
        "SchoolId": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "Calendar": "Calendar",
        "SchoolId": "SchoolId",
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

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.descriptor.get('GradeLevel');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`Object {}`);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`Object {}`);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`Object {}`);
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

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.schoolYearEnumeration.get('SchoolYear');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`Object {}`);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`Object {}`);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`Object {}`);
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

    domainEntityReferenceEnhancer(metaEd);
    enumerationReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('StudentCohort');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "CohortYear.SchoolYear": Array [
          Object {
            "entityName": "CohortYear",
            "jsonPath": "$.years[*].schoolYearTypeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "StudentUniqueId": Array [
          Object {
            "entityName": "StudentCohort",
            "jsonPath": "$.studentUniqueId",
            "propertyName": "StudentUniqueId",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "CohortYear.SchoolYear": true,
        "StudentUniqueId": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "CohortYear.SchoolYear": "SchoolYear",
        "StudentUniqueId": "StudentUniqueId",
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

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('Section');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AvailableCredits.CreditType": Array [
          Object {
            "entityName": "Credits",
            "jsonPath": "$.availableCreditTypeDescriptor",
            "propertyName": "CreditType",
          },
        ],
        "SectionIdentifier": Array [
          Object {
            "entityName": "Section",
            "jsonPath": "$.sectionIdentifier",
            "propertyName": "SectionIdentifier",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AvailableCredits.CreditType": true,
        "SectionIdentifier": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AvailableCredits.CreditType": "CreditType",
        "SectionIdentifier": "SectionIdentifier",
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

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get('StudentCompetencyObjective');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "CompetencyObjective": Array [
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.identity2",
            "propertyName": "CompetencyObjective",
          },
        ],
        "CompetencyObjective.Identity2": Array [
          Object {
            "entityName": "CompetencyObjective",
            "jsonPath": "$.objectiveCompetencyObjectiveReference.identity2",
            "propertyName": "Identity2",
          },
        ],
        "Identity1": Array [
          Object {
            "entityName": "StudentCompetencyObjective",
            "jsonPath": "$.identity1",
            "propertyName": "Identity1",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "CompetencyObjective": true,
        "CompetencyObjective.Identity2": false,
        "Identity1": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "CompetencyObjective": "CompetencyObjective",
        "Identity1": "Identity1",
      }
    `);
  });
});

describe('when building domain entity with role named and pluralized inline common', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'Section';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withStringIdentity('SectionIdentifier', 'doc', '30')
      .withInlineCommonProperty('Credits', 'doc', false, false, 'Available')
      .withEndDomainEntity()

      .withStartInlineCommon('Credits')
      .withDocumentation('doc')
      .withStringProperty('CreditConversion', 'doc', false, false, '30')
      .withEndInlineCommon()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    inlineCommonReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping with "availableCreditConversion" not pluralized', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AvailableCredits.CreditConversion": Array [
          Object {
            "entityName": "Credits",
            "jsonPath": "$.availableCreditConversion",
            "propertyName": "CreditConversion",
          },
        ],
        "SectionIdentifier": Array [
          Object {
            "entityName": "Section",
            "jsonPath": "$.sectionIdentifier",
            "propertyName": "SectionIdentifier",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "AvailableCredits.CreditConversion": true,
        "SectionIdentifier": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "AvailableCredits.CreditConversion": "CreditConversion",
        "SectionIdentifier": "SectionIdentifier",
      }
    `);
  });
});

describe('when a collection reference is to a role named resource that has a schoolid merged away', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'ReportCard';
  let namespace: any = null;

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

    namespace = metaEd.namespace.get(namespaceName);

    domainEntityReferenceEnhancer(metaEd);
    associationReferenceEnhancer(metaEd);
    enumerationReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "Grade": Array [
          Object {
            "entityName": "ReportCard",
            "jsonPath": "$.grades[*].gradeReference.gradingPeriodIdentity",
            "propertyName": "Grade",
          },
          Object {
            "entityName": "ReportCard",
            "jsonPath": "$.grades[*].gradeReference.gradingPeriodSchoolId",
            "propertyName": "Grade",
          },
          Object {
            "entityName": "ReportCard",
            "jsonPath": "$.grades[*].gradeReference.gradingPeriodSchoolYear",
            "propertyName": "Grade",
          },
          Object {
            "entityName": "ReportCard",
            "jsonPath": "$.grades[*].gradeReference.schoolId",
            "propertyName": "Grade",
          },
          Object {
            "entityName": "ReportCard",
            "jsonPath": "$.grades[*].gradeReference.schoolYear",
            "propertyName": "Grade",
          },
          Object {
            "entityName": "ReportCard",
            "jsonPath": "$.grades[*].gradeReference.studentId",
            "propertyName": "Grade",
          },
        ],
        "Grade.GradingPeriod": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.grades[*].gradeReference.gradingPeriodIdentity",
            "propertyName": "GradingPeriodIdentity",
          },
          Object {
            "entityName": "School",
            "jsonPath": "$.grades[*].gradeReference.gradingPeriodSchoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.grades[*].gradeReference.gradingPeriodSchoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "Grade.GradingPeriod.GradingPeriodIdentity": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.grades[*].gradeReference.gradingPeriodIdentity",
            "propertyName": "GradingPeriodIdentity",
          },
        ],
        "Grade.GradingPeriod.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.grades[*].gradeReference.gradingPeriodSchoolId",
            "propertyName": "SchoolId",
          },
        ],
        "Grade.GradingPeriod.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.grades[*].gradeReference.gradingPeriodSchoolId",
            "propertyName": "SchoolId",
          },
        ],
        "Grade.GradingPeriod.SchoolYear": Array [
          Object {
            "entityName": "GradingPeriod",
            "jsonPath": "$.grades[*].gradeReference.gradingPeriodSchoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "Grade.StudentSectionAssociation": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.grades[*].gradeReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.grades[*].gradeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
          Object {
            "entityName": "Student",
            "jsonPath": "$.grades[*].gradeReference.studentId",
            "propertyName": "StudentId",
          },
        ],
        "Grade.StudentSectionAssociation.Section": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.grades[*].gradeReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.grades[*].gradeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "Grade.StudentSectionAssociation.Section.CourseOffering": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.grades[*].gradeReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.grades[*].gradeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "Grade.StudentSectionAssociation.Section.CourseOffering.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.grades[*].gradeReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "Grade.StudentSectionAssociation.Section.CourseOffering.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.grades[*].gradeReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "Grade.StudentSectionAssociation.Section.CourseOffering.Session": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.grades[*].gradeReference.schoolId",
            "propertyName": "SchoolId",
          },
          Object {
            "entityName": "Session",
            "jsonPath": "$.grades[*].gradeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "Grade.StudentSectionAssociation.Section.CourseOffering.Session.School": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.grades[*].gradeReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "Grade.StudentSectionAssociation.Section.CourseOffering.Session.School.SchoolId": Array [
          Object {
            "entityName": "School",
            "jsonPath": "$.grades[*].gradeReference.schoolId",
            "propertyName": "SchoolId",
          },
        ],
        "Grade.StudentSectionAssociation.Section.CourseOffering.Session.SchoolYear": Array [
          Object {
            "entityName": "Session",
            "jsonPath": "$.grades[*].gradeReference.schoolYear",
            "propertyName": "SchoolYear",
          },
        ],
        "Grade.StudentSectionAssociation.Student": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.grades[*].gradeReference.studentId",
            "propertyName": "StudentId",
          },
        ],
        "Grade.StudentSectionAssociation.Student.StudentId": Array [
          Object {
            "entityName": "Student",
            "jsonPath": "$.grades[*].gradeReference.studentId",
            "propertyName": "StudentId",
          },
        ],
        "ReportCardIdentity": Array [
          Object {
            "entityName": "ReportCard",
            "jsonPath": "$.reportCardIdentity",
            "propertyName": "ReportCardIdentity",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "Grade": true,
        "Grade.GradingPeriod": false,
        "Grade.GradingPeriod.GradingPeriodIdentity": false,
        "Grade.GradingPeriod.School": false,
        "Grade.GradingPeriod.School.SchoolId": false,
        "Grade.GradingPeriod.SchoolYear": false,
        "Grade.StudentSectionAssociation": false,
        "Grade.StudentSectionAssociation.Section": false,
        "Grade.StudentSectionAssociation.Section.CourseOffering": false,
        "Grade.StudentSectionAssociation.Section.CourseOffering.School": false,
        "Grade.StudentSectionAssociation.Section.CourseOffering.School.SchoolId": false,
        "Grade.StudentSectionAssociation.Section.CourseOffering.Session": false,
        "Grade.StudentSectionAssociation.Section.CourseOffering.Session.School": false,
        "Grade.StudentSectionAssociation.Section.CourseOffering.Session.School.SchoolId": false,
        "Grade.StudentSectionAssociation.Section.CourseOffering.Session.SchoolYear": false,
        "Grade.StudentSectionAssociation.Student": false,
        "Grade.StudentSectionAssociation.Student.StudentId": false,
        "ReportCardIdentity": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "Grade": "Grade",
        "ReportCardIdentity": "ReportCardIdentity",
      }
    `);
  });

  it('should have correct merge coveredBy info', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mergeJsonPathsMapping: JsonPathsMapping = entity.data.edfiApiSchema.mergeJsonPathsMapping as JsonPathsMapping;

    /* eslint-disable dot-notation */
    expect(mergeJsonPathsMapping['Grade'].jsonPathPropertyPairs[1].flattenedIdentityProperty.propertyPaths)
      .toMatchInlineSnapshot(`
      Array [
        "GradingPeriod",
        "GradingPeriod.School",
        "GradingPeriod.School.SchoolId",
      ]
    `);
    expect(mergeJsonPathsMapping['Grade'].jsonPathPropertyPairs[1].flattenedIdentityProperty.mergeCoveredBy.propertyPaths)
      .toMatchInlineSnapshot(`
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

describe('when building simple domain entity extension', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Extension';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('IntegerIdentity', 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .withBeginNamespace(namespaceName)
      .withStartDomainEntityExtension(domainEntityName)
      .withStringProperty('StringProperty', 'doc', false, false, '30', '20')
      .withEndDomainEntityExtension()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);
    namespace.dependencies.push(metaEd.namespace.get('EdFi') ?? newNamespace());

    domainEntityReferenceEnhancer(metaEd);
    mergeDirectiveEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping', () => {
    const entity = namespace.entity.domainEntityExtension.get(domainEntityName);
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "StringProperty": Array [
          Object {
            "entityName": "DomainEntityName",
            "jsonPath": "$._ext.edfi.stringProperty",
            "propertyName": "StringProperty",
          },
        ],
      }
    `);
    expect(mappings.isTopLevel).toMatchInlineSnapshot(`
      Object {
        "StringProperty": true,
      }
    `);
    expect(mappings.terminalPropertyFullName).toMatchInlineSnapshot(`
      Object {
        "StringProperty": "StringProperty",
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

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    mergeCoveringFlattenedIdentityPropertyEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be correct mergeJsonPathsMapping for AssessmentAdministrationParticipation', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentAdministration": Array [
          Object {
            "entityName": "AssessmentAdministrationParticipation",
            "jsonPath": "$.assessmentAdministrationReference.assessmentAdministrationId",
            "propertyName": "AssessmentAdministration",
          },
          Object {
            "entityName": "AssessmentAdministrationParticipation",
            "jsonPath": "$.assessmentAdministrationReference.assigningEducationOrganizationId",
            "propertyName": "AssessmentAdministration",
          },
        ],
        "AssessmentAdministration.AssessmentAdministrationId": Array [
          Object {
            "entityName": "AssessmentAdministration",
            "jsonPath": "$.assessmentAdministrationReference.assessmentAdministrationId",
            "propertyName": "AssessmentAdministrationId",
          },
        ],
        "AssessmentAdministration.AssigningEducationOrganization": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.assessmentAdministrationReference.assigningEducationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "AssessmentAdministration.AssigningEducationOrganization.EducationOrganizationId": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.assessmentAdministrationReference.assigningEducationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
        "AssessmentAdministrationParticipationId": Array [
          Object {
            "entityName": "AssessmentAdministrationParticipation",
            "jsonPath": "$.assessmentAdministrationParticipationId",
            "propertyName": "AssessmentAdministrationParticipationId",
          },
        ],
      }
    `);
  });

  it('should be correct mergeJsonPathsMapping for AssessmentAdministration', () => {
    const entity = namespace.entity.domainEntity.get('AssessmentAdministration');
    const mappings: Snapshotable = snapshotifyEntity(entity);
    expect(mappings.jsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentAdministrationId": Array [
          Object {
            "entityName": "AssessmentAdministration",
            "jsonPath": "$.assessmentAdministrationId",
            "propertyName": "AssessmentAdministrationId",
          },
        ],
        "AssigningEducationOrganization": Array [
          Object {
            "entityName": "AssessmentAdministration",
            "jsonPath": "$.assigningEducationOrganizationReference.educationOrganizationId",
            "propertyName": "EducationOrganization",
          },
        ],
        "AssigningEducationOrganization.EducationOrganizationId": Array [
          Object {
            "entityName": "EducationOrganization",
            "jsonPath": "$.assigningEducationOrganizationReference.educationOrganizationId",
            "propertyName": "EducationOrganizationId",
          },
        ],
      }
    `);
  });
});
