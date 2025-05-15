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
  DescriptorBuilder,
  newPluginEnvironment,
  DomainEntityExtensionBuilder,
  EnumerationBuilder,
  newNamespace,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  choiceReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  commonReferenceEnhancer,
  descriptorReferenceEnhancer,
  enumerationReferenceEnhancer,
  domainEntityExtensionBaseClassEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as openApiRequestBodyComponentEnhancer } from '../../src/enhancer/OpenApiRequestBodyComponentEnhancer';
import { enhance } from '../../src/enhancer/OpenApiRequestBodyCollectionComponentEnhancer';

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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`Array []`);
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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_DomainEntityName_OptionalBooleanProperty",
          "schema": Object {
            "properties": Object {
              "optionalBooleanProperty": Object {
                "description": "doc1",
                "type": "boolean",
              },
            },
            "required": Array [
              "optionalBooleanProperty",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_RequiredCurrencyProperty",
          "schema": Object {
            "properties": Object {
              "requiredCurrencyProperty": Object {
                "description": "doc2",
                "type": "number",
              },
            },
            "required": Array [
              "requiredCurrencyProperty",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_OptionalDecimalProperty",
          "schema": Object {
            "properties": Object {
              "optionalDecimalProperty": Object {
                "description": "doc3",
                "type": "number",
              },
            },
            "required": Array [
              "optionalDecimalProperty",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_RequiredDurationProperty",
          "schema": Object {
            "properties": Object {
              "requiredDurationProperty": Object {
                "description": "doc4",
                "type": "number",
              },
            },
            "required": Array [
              "requiredDurationProperty",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_OptionalPercentProperty",
          "schema": Object {
            "properties": Object {
              "optionalPercentProperty": Object {
                "description": "doc5",
                "type": "number",
              },
            },
            "required": Array [
              "optionalPercentProperty",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_RequiredDateProperty",
          "schema": Object {
            "properties": Object {
              "requiredDateProperty": Object {
                "description": "doc6",
                "format": "date",
                "type": "string",
              },
            },
            "required": Array [
              "requiredDateProperty",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_RequiredDatetimeProperty",
          "schema": Object {
            "properties": Object {
              "requiredDatetimeProperty": Object {
                "description": "doc7",
                "format": "date-time",
                "type": "string",
              },
            },
            "required": Array [
              "requiredDatetimeProperty",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_RequiredIntegerProperty",
          "schema": Object {
            "properties": Object {
              "requiredIntegerProperty": Object {
                "description": "doc8",
                "maximum": 10,
                "minimum": 5,
                "type": "integer",
              },
            },
            "required": Array [
              "requiredIntegerProperty",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_OptionalShortProperty",
          "schema": Object {
            "properties": Object {
              "optionalShortProperty": Object {
                "description": "doc9",
                "type": "integer",
              },
            },
            "required": Array [
              "optionalShortProperty",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_RequiredStringProperty",
          "schema": Object {
            "properties": Object {
              "requiredStringProperty": Object {
                "description": "doc11",
                "maxLength": 31,
                "minLength": 21,
                "type": "string",
              },
            },
            "required": Array [
              "requiredStringProperty",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_RequiredTimeProperty",
          "schema": Object {
            "properties": Object {
              "requiredTimeProperty": Object {
                "description": "doc12",
                "format": "time",
                "type": "string",
              },
            },
            "required": Array [
              "requiredTimeProperty",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_SchoolYear",
          "schema": Object {
            "properties": Object {
              "schoolYear": Object {
                "description": "A school year between 1900 and 2100",
                "maximum": 2100,
                "minimum": 1900,
                "type": "integer",
              },
            },
            "required": Array [
              "schoolYear",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_OptionalYear",
          "schema": Object {
            "properties": Object {
              "optionalYear": Object {
                "description": "doc14",
                "type": "integer",
              },
            },
            "required": Array [
              "optionalYear",
            ],
            "type": "object",
          },
        },
      ]
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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "contentClassDescriptor": Object {
            "description": "doc",
            "type": "string",
          },
          "contentIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
          "derivativeSourceEducationContents": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_EducationContent_LearningResourceChoice_LearningResource_EducationContentSource_DerivativeSourceEducationContent",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "derivativeSourceURIs": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_EducationContent_LearningResourceChoice_LearningResource_EducationContentSource_DerivativeSourceURI",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "description": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
          "learningResourceMetadataURI": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
          "requiredURIs": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_EducationContent_RequiredURI",
            },
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "shortDescription": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "contentIdentifier",
          "requiredURIs",
        ],
        "type": "object",
      }
    `);
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_EducationContent_LearningResourceChoice_LearningResource_EducationContentSource_DerivativeSourceEducationContent",
          "schema": Object {
            "properties": Object {
              "derivativeSourceEducationContentReference": Object {
                "$ref": "#/components/schemas/EdFi_EducationContent_Reference",
              },
            },
            "required": Array [
              "derivativeSourceEducationContentReference",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_EducationContent_LearningResourceChoice_LearningResource_EducationContentSource_DerivativeSourceURI",
          "schema": Object {
            "properties": Object {
              "derivativeSourceURI": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "derivativeSourceURI",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_EducationContent_RequiredURI",
          "schema": Object {
            "properties": Object {
              "requiredURI": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "requiredURI",
            ],
            "type": "object",
          },
        },
      ]
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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema - parent name prefix not removed', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_EducationContent_EducationContentSuffixName",
          "schema": Object {
            "properties": Object {
              "educationContentSuffixName": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "educationContentSuffixName",
            ],
            "type": "object",
          },
        },
      ]
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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');

    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_Assessment_AssessmentIdentificationCode",
          "schema": Object {
            "properties": Object {
              "assessmentIdentificationSystemDescriptor": Object {
                "description": "doc",
                "type": "string",
              },
              "identificationCode": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "identificationCode",
              "assessmentIdentificationSystemDescriptor",
            ],
            "type": "object",
          },
        },
      ]
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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentEducationOrganizationAssociation');

    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_StudentEducationOrganizationAssociation_Address",
          "schema": Object {
            "properties": Object {
              "periods": Object {
                "items": Object {
                  "$ref": "#/components/schemas/EdFi_StudentEducationOrganizationAssociation_Period",
                },
                "minItems": 0,
                "type": "array",
                "uniqueItems": false,
              },
              "streetNumberName": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "streetNumberName",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_StudentEducationOrganizationAssociation_Period",
          "schema": Object {
            "properties": Object {
              "beginDate": Object {
                "description": "doc",
                "type": "integer",
              },
              "endDate": Object {
                "description": "doc",
                "type": "integer",
              },
            },
            "required": Array [
              "beginDate",
            ],
            "type": "object",
          },
        },
      ]
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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_Assessment_AssessedGradeLevel",
          "schema": Object {
            "properties": Object {
              "gradeLevelDescriptor": Object {
                "description": "doc",
                "maxLength": 306,
                "type": "string",
              },
            },
            "required": Array [
              "gradeLevelDescriptor",
            ],
            "type": "object",
          },
        },
      ]
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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_Assessment_AssessedGradeLevel",
          "schema": Object {
            "properties": Object {
              "gradeLevelDescriptor": Object {
                "description": "doc",
                "maxLength": 306,
                "type": "string",
              },
            },
            "required": Array [
              "gradeLevelDescriptor",
            ],
            "type": "object",
          },
        },
      ]
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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_Assessment_ContentStandard",
          "schema": Object {
            "properties": Object {
              "publicationDate": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
              "publicationYear": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
              "title": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "type": "object",
          },
        },
      ]
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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_Assessment_AssessmentScore",
          "schema": Object {
            "properties": Object {
              "minimumScore": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "minimumScore",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_Assessment_AssessmentPeriod",
          "schema": Object {
            "properties": Object {
              "beginDate": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "type": "object",
          },
        },
      ]
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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`Array []`);
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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_Assessment_ContentStandard",
          "schema": Object {
            "properties": Object {
              "mandatingEducationOrganizationReference": Object {
                "$ref": "#/components/schemas/EdFi_EducationOrganization_Reference",
              },
              "title": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "type": "object",
          },
        },
      ]
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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentSchoolAssociation');
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building a schema for studentEducationOrganizationAssociation', () => {
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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentCohort');

    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_StudentCohort_CohortYear",
          "schema": Object {
            "properties": Object {
              "schoolYearTypeReference": Object {
                "$ref": "#/components/schemas/EdFi_SchoolYearTypeReference",
              },
            },
            "required": Array [
              "schoolYearTypeReference",
            ],
            "type": "object",
          },
        },
      ]
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

    domainEntityReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('common descriptor decollisioned top level name should be correct', () => {
    const common = namespace.entity.common.get('Credits');
    expect(common.properties[0].data.edfiApiSchema.apiMapping.decollisionedTopLevelName).toBe('CreditTypeDescriptor');
  });

  it('should be a correct schema for section', () => {
    const entity = namespace.entity.domainEntity.get('Section');
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building a domain entity with an inline common property with a descriptor collection', () => {
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
      .withDescriptorProperty('CreditType', 'Documentation', false, true)
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

    domainEntityReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Section');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "Documentation",
        "properties": Object {
          "availableCreditTypes": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_Section_Credits_AvailableCreditType",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "sectionIdentifier": Object {
            "description": "Documentation",
            "type": "integer",
          },
        },
        "required": Array [
          "sectionIdentifier",
        ],
        "type": "object",
      }
    `);
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_Section_Credits_AvailableCreditType",
          "schema": Object {
            "properties": Object {
              "availableCreditTypeDescriptor": Object {
                "description": "Documentation",
                "maxLength": 306,
                "type": "string",
              },
            },
            "required": Array [
              "availableCreditTypeDescriptor",
            ],
            "type": "object",
          },
        },
      ]
    `);
  });
});

describe('when building a domain entity with a common property with a descriptor collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDescriptor('CreditType')
      .withDocumentation('Documentation')
      .withEndDescriptor()

      .withStartCommon('Credits')
      .withDocumentation('Documentation')
      .withStringProperty('IdentificationCode', 'doc', true, false, '30')
      .withDescriptorProperty('CreditType', 'Documentation', false, true)
      .withEndCommon()

      .withStartDomainEntity('Section')
      .withDocumentation('Documentation')
      .withIntegerIdentity('SectionIdentifier', 'Documentation')
      .withCommonProperty('Credits', 'Documentation', false, false, 'Available')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DescriptorBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Section');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "Documentation",
        "properties": Object {
          "availableCredits": Object {
            "$ref": "#/components/schemas/EdFi_Section_AvailableCredit",
          },
          "sectionIdentifier": Object {
            "description": "Documentation",
            "type": "integer",
          },
        },
        "required": Array [
          "sectionIdentifier",
        ],
        "type": "object",
      }
    `);
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_Section_AvailableCredit",
          "schema": Object {
            "properties": Object {
              "creditTypes": Object {
                "items": Object {
                  "$ref": "#/components/schemas/EdFi_Section_CreditType",
                },
                "minItems": 0,
                "type": "array",
                "uniqueItems": false,
              },
              "identificationCode": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "identificationCode",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_Section_CreditType",
          "schema": Object {
            "properties": Object {
              "creditTypeDescriptor": Object {
                "description": "Documentation",
                "maxLength": 306,
                "type": "string",
              },
            },
            "required": Array [
              "creditTypeDescriptor",
            ],
            "type": "object",
          },
        },
      ]
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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentCompetencyObjective');
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`Array []`);
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

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);

    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentCompetencyObjective');
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`Array []`);
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

      .withBeginNamespace('Extension')
      .withStartDomainEntityExtension(entityName)
      .withDomainEntityProperty(`EdFi.${referencedEntityName}`, 'doc', false, false)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    extensionNamespace = metaEd.namespace.get('Extension') ?? newNamespace();
    extensionNamespace?.dependencies.push(metaEd.namespace.get('EdFi') ?? newNamespace());

    domainEntityReferenceEnhancer(metaEd);
    domainEntityExtensionBaseClassEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = extensionNamespace.entity.domainEntityExtension.get(entityName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when domain entity extension references domain entity collection in different namespace', () => {
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

      .withBeginNamespace('Extension')
      .withStartDomainEntityExtension(`EdFi.${entityName}`)
      .withDomainEntityProperty(`EdFi.${referencedEntityName}`, 'doc', true, true)
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    extensionNamespace = metaEd.namespace.get('Extension') ?? newNamespace();
    extensionNamespace?.dependencies.push(metaEd.namespace.get('EdFi') ?? newNamespace());

    domainEntityReferenceEnhancer(metaEd);
    domainEntityExtensionBaseClassEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = extensionNamespace.entity.domainEntityExtension.get(entityName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "",
        "properties": Object {
          "referencedEntityNames": Object {
            "items": Object {
              "$ref": "#/components/schemas/Extension_EntityName_ReferencedEntityName",
            },
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
        },
        "required": Array [
          "referencedEntityNames",
        ],
        "type": "object",
      }
    `);
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "Extension_EntityName_ReferencedEntityName",
          "schema": Object {
            "properties": Object {
              "referencedEntityNameReference": Object {
                "$ref": "#/components/schemas/EdFi_ReferencedEntityName_Reference",
              },
            },
            "required": Array [
              "referencedEntityNameReference",
            ],
            "type": "object",
          },
        },
      ]
    `);
  });
});

describe('when building domain entity with a scalar collection in a common collection in a common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('IntegerIdentity', 'doc')
      .withCommonProperty('CommonCollection', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('CommonCollection')
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', '30')
      .withCommonProperty('CommonSubCollection', 'doc', false, true)
      .withEndCommon()

      .withStartCommon('CommonSubCollection')
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', '30')
      .withIntegerProperty('IntegerCollection', 'doc', false, true)
      .withEndCommon()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_DomainEntityName_CommonCollection",
          "schema": Object {
            "properties": Object {
              "commonSubCollections": Object {
                "items": Object {
                  "$ref": "#/components/schemas/EdFi_DomainEntityName_CommonSubCollection",
                },
                "minItems": 0,
                "type": "array",
                "uniqueItems": false,
              },
              "stringIdentity": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "stringIdentity",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_CommonSubCollection",
          "schema": Object {
            "properties": Object {
              "integerCollections": Object {
                "items": Object {
                  "$ref": "#/components/schemas/EdFi_DomainEntityName_IntegerCollection",
                },
                "minItems": 0,
                "type": "array",
                "uniqueItems": false,
              },
              "stringIdentity": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "stringIdentity",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_IntegerCollection",
          "schema": Object {
            "properties": Object {
              "integerCollection": Object {
                "description": "doc",
                "type": "integer",
              },
            },
            "required": Array [
              "integerCollection",
            ],
            "type": "object",
          },
        },
      ]
    `);
  });
});

describe('when building domain entity with a scalar collection in a common collection in a common collection with some rolenaming', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName)
      .withStartDomainEntity(domainEntityName)
      .withDocumentation('doc')
      .withIntegerIdentity('IntegerIdentity', 'doc')
      .withCommonProperty('CommonCollection', 'doc', false, true)
      .withEndDomainEntity()

      .withStartCommon('CommonCollection')
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', '30')
      .withCommonProperty('CommonSubCollection', 'doc', false, true)
      .withCommonProperty('CommonSubCollection', 'doc', false, true, 'RoleName')
      .withEndCommon()

      .withStartCommon('CommonSubCollection')
      .withDocumentation('doc')
      .withStringIdentity('StringIdentity', 'doc', '30')
      .withIntegerProperty('IntegerCollection', 'doc', false, true)
      .withEndCommon()

      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
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
    openApiRequestBodyComponentEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "commonCollections": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_DomainEntityName_CommonCollection",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "integerIdentity": Object {
            "description": "doc",
            "type": "integer",
          },
        },
        "required": Array [
          "integerIdentity",
        ],
        "type": "object",
      }
    `);
    expect(entity.data.edfiApiSchema.openApiRequestBodyCollectionComponents).toMatchInlineSnapshot(`
      Array [
        Object {
          "propertyName": "EdFi_DomainEntityName_CommonCollection",
          "schema": Object {
            "properties": Object {
              "commonSubCollections": Object {
                "items": Object {
                  "$ref": "#/components/schemas/EdFi_DomainEntityName_CommonSubCollection",
                },
                "minItems": 0,
                "type": "array",
                "uniqueItems": false,
              },
              "roleNameCommonSubCollections": Object {
                "items": Object {
                  "$ref": "#/components/schemas/EdFi_DomainEntityName_RoleNameCommonSubCollection",
                },
                "minItems": 0,
                "type": "array",
                "uniqueItems": false,
              },
              "stringIdentity": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "stringIdentity",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_CommonSubCollection",
          "schema": Object {
            "properties": Object {
              "integerCollections": Object {
                "items": Object {
                  "$ref": "#/components/schemas/EdFi_DomainEntityName_IntegerCollection",
                },
                "minItems": 0,
                "type": "array",
                "uniqueItems": false,
              },
              "stringIdentity": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "stringIdentity",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_IntegerCollection",
          "schema": Object {
            "properties": Object {
              "integerCollection": Object {
                "description": "doc",
                "type": "integer",
              },
            },
            "required": Array [
              "integerCollection",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_RoleNameCommonSubCollection",
          "schema": Object {
            "properties": Object {
              "integerCollections": Object {
                "items": Object {
                  "$ref": "#/components/schemas/EdFi_DomainEntityName_IntegerCollection",
                },
                "minItems": 0,
                "type": "array",
                "uniqueItems": false,
              },
              "stringIdentity": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "stringIdentity",
            ],
            "type": "object",
          },
        },
        Object {
          "propertyName": "EdFi_DomainEntityName_IntegerCollection",
          "schema": Object {
            "properties": Object {
              "integerCollection": Object {
                "description": "doc",
                "type": "integer",
              },
            },
            "required": Array [
              "integerCollection",
            ],
            "type": "object",
          },
        },
      ]
    `);
  });
});
