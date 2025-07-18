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
  EnumerationBuilder,
  newPluginEnvironment,
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
  domainEntityExtensionBaseClassEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance } from '../../src/enhancer/OpenApiRequestBodyComponentEnhancer';

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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponentPropertyName).toMatchInlineSnapshot(
      `"EdFi_DomainEntityName"`,
    );
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "optionalBooleanProperty": Object {
            "description": "doc1",
            "type": "boolean",
            "x-nullable": true,
          },
          "optionalDecimalProperty": Object {
            "description": "doc3",
            "format": "double",
            "type": "number",
            "x-nullable": true,
          },
          "optionalPercentProperty": Object {
            "description": "doc5",
            "format": "double",
            "type": "number",
            "x-nullable": true,
          },
          "optionalShortProperty": Object {
            "description": "doc9",
            "type": "integer",
            "x-nullable": true,
          },
          "optionalYear": Object {
            "description": "doc13",
            "type": "integer",
            "x-nullable": true,
          },
          "requiredCurrencyProperty": Object {
            "description": "doc2",
            "format": "double",
            "type": "number",
          },
          "requiredDateProperty": Object {
            "description": "doc6",
            "format": "date",
            "type": "string",
          },
          "requiredDatetimeProperty": Object {
            "description": "doc7",
            "format": "date-time",
            "type": "string",
          },
          "requiredDurationProperty": Object {
            "description": "doc4",
            "format": "double",
            "type": "number",
          },
          "requiredIntegerProperty": Object {
            "description": "doc8",
            "maximum": 10,
            "minimum": 5,
            "type": "integer",
          },
          "requiredTimeProperty": Object {
            "description": "doc11",
            "format": "time",
            "type": "string",
          },
          "schoolYearTypeReference": Object {
            "$ref": "#/components/schemas/EdFi_SchoolYearTypeReference",
            "x-nullable": true,
          },
          "stringIdentity": Object {
            "description": "doc10",
            "maxLength": 30,
            "minLength": 20,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
        },
        "required": Array [
          "requiredCurrencyProperty",
          "requiredDurationProperty",
          "requiredDateProperty",
          "requiredDatetimeProperty",
          "requiredIntegerProperty",
          "stringIdentity",
          "requiredTimeProperty",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponentPropertyName).toMatchInlineSnapshot(
      `"EdFi_DomainEntityName"`,
    );
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "optionalBooleanProperties": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_DomainEntityName_OptionalBooleanProperty",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "optionalDecimalProperties": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_DomainEntityName_OptionalDecimalProperty",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "optionalPercentProperties": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_DomainEntityName_OptionalPercentProperty",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "optionalShortProperties": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_DomainEntityName_OptionalShortProperty",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "optionalYears": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_DomainEntityName_OptionalYear",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "requiredCurrencyProperties": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_DomainEntityName_RequiredCurrencyProperty",
            },
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "requiredDateProperties": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_DomainEntityName_RequiredDateProperty",
            },
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "requiredDatetimeProperties": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_DomainEntityName_RequiredDatetimeProperty",
            },
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "requiredDurationProperties": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_DomainEntityName_RequiredDurationProperty",
            },
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "requiredIntegerProperties": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_DomainEntityName_RequiredIntegerProperty",
            },
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "requiredStringProperties": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_DomainEntityName_RequiredStringProperty",
            },
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "requiredTimeProperties": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_DomainEntityName_RequiredTimeProperty",
            },
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "schoolYearTypeReference": Object {
            "$ref": "#/components/schemas/EdFi_SchoolYearTypeReference",
          },
          "stringIdentity": Object {
            "description": "doc10",
            "maxLength": 30,
            "minLength": 20,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
        },
        "required": Array [
          "requiredCurrencyProperties",
          "requiredDurationProperties",
          "requiredDateProperties",
          "requiredDatetimeProperties",
          "requiredIntegerProperties",
          "stringIdentity",
          "requiredStringProperties",
          "requiredTimeProperties",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema for top entity', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponentPropertyName).toMatchInlineSnapshot(
      `"EdFi_DomainEntityName"`,
    );
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "classPeriods": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_DomainEntityName_ClassPeriod",
            },
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "courseOfferingReference": Object {
            "$ref": "#/components/schemas/EdFi_CourseOffering_Reference",
            "x-Ed-Fi-isIdentity": true,
          },
          "sectionIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
        },
        "required": Array [
          "sectionIdentifier",
          "courseOfferingReference",
          "classPeriods",
        ],
        "type": "object",
      }
    `);
  });

  it('should be a correct schema for CourseOffering', () => {
    const entity = namespace.entity.domainEntity.get('CourseOffering');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponentPropertyName).toMatchInlineSnapshot(`"EdFi_CourseOffering"`);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "localCourseCode": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
          "schoolReference": Object {
            "$ref": "#/components/schemas/EdFi_School_Reference",
            "x-Ed-Fi-isIdentity": true,
          },
        },
        "required": Array [
          "localCourseCode",
          "schoolReference",
        ],
        "type": "object",
      }
    `);
  });

  it('should be a correct schema for ClassPeriod', () => {
    const entity = namespace.entity.domainEntity.get('ClassPeriod');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponentPropertyName).toMatchInlineSnapshot(`"EdFi_ClassPeriod"`);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "classPeriodName": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
          "schoolReference": Object {
            "$ref": "#/components/schemas/EdFi_School_Reference",
            "x-Ed-Fi-isIdentity": true,
          },
        },
        "required": Array [
          "classPeriodName",
          "schoolReference",
        ],
        "type": "object",
      }
    `);
  });

  it('should be a correct schema for School', () => {
    const entity = namespace.entity.domainEntity.get('School');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponentPropertyName).toMatchInlineSnapshot(`"EdFi_School"`);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "schoolId": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
        },
        "required": Array [
          "schoolId",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema for top entity', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponentPropertyName).toMatchInlineSnapshot(
      `"EdFi_DomainEntityName"`,
    );
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "courseOfferingReference": Object {
            "$ref": "#/components/schemas/EdFi_CourseOffering_Reference",
            "x-Ed-Fi-isIdentity": true,
          },
          "sectionIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
        },
        "required": Array [
          "sectionIdentifier",
          "courseOfferingReference",
        ],
        "type": "object",
      }
    `);
  });

  it('should be a correct schema for CourseOffering', () => {
    const entity = namespace.entity.domainEntity.get('CourseOffering');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponentPropertyName).toMatchInlineSnapshot(`"EdFi_CourseOffering"`);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "localCourseCode": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
          "schoolReference": Object {
            "$ref": "#/components/schemas/EdFi_School_Reference",
            "x-Ed-Fi-isIdentity": true,
          },
          "sessionReference": Object {
            "$ref": "#/components/schemas/EdFi_Session_Reference",
            "x-Ed-Fi-isIdentity": true,
          },
        },
        "required": Array [
          "localCourseCode",
          "schoolReference",
          "sessionReference",
        ],
        "type": "object",
      }
    `);
  });

  it('should be a correct schema for Session', () => {
    const entity = namespace.entity.domainEntity.get('Session');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponentPropertyName).toMatchInlineSnapshot(`"EdFi_Session"`);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "schoolReference": Object {
            "$ref": "#/components/schemas/EdFi_School_Reference",
            "x-Ed-Fi-isIdentity": true,
          },
          "schoolYearTypeReference": Object {
            "$ref": "#/components/schemas/EdFi_SchoolYearTypeReference",
            "x-Ed-Fi-isIdentity": true,
          },
          "sessionName": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
        },
        "required": Array [
          "sessionName",
          "schoolYearTypeReference",
          "schoolReference",
        ],
        "type": "object",
      }
    `);
  });

  it('should be a correct schema for School', () => {
    const entity = namespace.entity.domainEntity.get('School');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponentPropertyName).toMatchInlineSnapshot(`"EdFi_School"`);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "schoolId": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
        },
        "required": Array [
          "schoolId",
        ],
        "type": "object",
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
            "maxLength": 306,
            "type": "string",
          },
          "contentIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
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
            "x-nullable": true,
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
    enhance(metaEd);
  });

  it('should be a correct schema - parent name prefix removed', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "contentIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
          "suffixNames": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_EducationContent_EducationContentSuffixName",
            },
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
        },
        "required": Array [
          "contentIdentifier",
          "suffixNames",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema - parent name prefix retained', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "contentIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
          "educationContentSuffixNames": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_EducationContent_EducationContentSuffixName",
            },
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
        },
        "required": Array [
          "contentIdentifier",
          "educationContentSuffixNames",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema - acronym with correct casing', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "contentIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
          "iepBeginDate": Object {
            "description": "doc",
            "format": "date-time",
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
        },
        "required": Array [
          "contentIdentifier",
          "iepBeginDate",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "assessmentIdentifier": Object {
            "description": "doc",
            "type": "integer",
            "x-Ed-Fi-isIdentity": true,
          },
          "identificationCodes": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_Assessment_AssessmentIdentificationCode",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
        },
        "required": Array [
          "assessmentIdentifier",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "communityOrganizationId": Object {
            "description": "doc",
            "type": "integer",
            "x-Ed-Fi-isIdentity": true,
          },
          "identificationCodes": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_EducationOrganization_EducationOrganizationIdentificationCode",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
        },
        "required": Array [
          "communityOrganizationId",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentEducationOrganizationAssociation');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "addresses": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_StudentEducationOrganizationAssociation_Address",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "studentId": Object {
            "description": "doc",
            "type": "integer",
            "x-Ed-Fi-isIdentity": true,
          },
        },
        "required": Array [
          "studentId",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "assessedGradeLevelDescriptor": Object {
            "description": "doc",
            "maxLength": 306,
            "type": "string",
            "x-nullable": true,
          },
          "assessmentIdentifier": Object {
            "description": "doc",
            "type": "integer",
            "x-Ed-Fi-isIdentity": true,
          },
        },
        "required": Array [
          "assessmentIdentifier",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "assessedGradeLevels": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_Assessment_AssessedGradeLevel",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "assessmentIdentifier": Object {
            "description": "doc",
            "type": "integer",
            "x-Ed-Fi-isIdentity": true,
          },
        },
        "required": Array [
          "assessmentIdentifier",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "assessmentIdentifier": Object {
            "description": "doc",
            "type": "integer",
            "x-Ed-Fi-isIdentity": true,
          },
          "contentStandard": Object {
            "$ref": "#/components/schemas/EdFi_Assessment_ContentStandard",
            "x-nullable": true,
          },
        },
        "required": Array [
          "assessmentIdentifier",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "assessmentIdentifier": Object {
            "description": "doc",
            "type": "integer",
            "x-Ed-Fi-isIdentity": true,
          },
          "period": Object {
            "$ref": "#/components/schemas/EdFi_Assessment_AssessmentPeriod",
            "x-nullable": true,
          },
          "scores": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_Assessment_AssessmentScore",
            },
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
        },
        "required": Array [
          "assessmentIdentifier",
          "scores",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "assessmentIdentifier": Object {
            "description": "doc",
            "type": "integer",
            "x-Ed-Fi-isIdentity": true,
          },
          "uri": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
            "x-nullable": true,
          },
        },
        "required": Array [
          "assessmentIdentifier",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "assessmentIdentifier": Object {
            "description": "doc",
            "type": "integer",
            "x-Ed-Fi-isIdentity": true,
          },
          "contentStandard": Object {
            "$ref": "#/components/schemas/EdFi_Assessment_ContentStandard",
            "x-nullable": true,
          },
        },
        "required": Array [
          "assessmentIdentifier",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentSchoolAssociation');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "classOfSchoolYearTypeReference": Object {
            "$ref": "#/components/schemas/EdFi_SchoolYearTypeReference",
            "x-nullable": true,
          },
          "schoolId": Object {
            "description": "doc",
            "type": "integer",
            "x-Ed-Fi-isIdentity": true,
          },
          "schoolYearTypeReference": Object {
            "$ref": "#/components/schemas/EdFi_SchoolYearTypeReference",
            "x-nullable": true,
          },
        },
        "required": Array [
          "schoolId",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentSchoolAssociation');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "calendarReference": Object {
            "$ref": "#/components/schemas/EdFi_Calendar_Reference",
            "x-nullable": true,
          },
          "schoolId": Object {
            "description": "doc",
            "type": "integer",
            "x-Ed-Fi-isIdentity": true,
          },
        },
        "required": Array [
          "schoolId",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.descriptor.get('GradeLevel');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "An Ed-Fi Descriptor",
        "properties": Object {
          "codeValue": Object {
            "description": "The descriptor code value",
            "maxLength": 50,
            "minLength": 1,
            "pattern": "^(?!\\\\s).*(?<!\\\\s)$",
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
          "description": Object {
            "description": "The descriptor description",
            "maxLength": 1024,
            "type": "string",
            "x-nullable": true,
          },
          "effectiveBeginDate": Object {
            "description": "The descriptor effective begin date",
            "format": "date",
            "type": "string",
            "x-nullable": true,
          },
          "effectiveEndDate": Object {
            "description": "The descriptor effective end date",
            "format": "date",
            "type": "string",
            "x-nullable": true,
          },
          "id": Object {
            "description": "",
            "type": "string",
          },
          "namespace": Object {
            "description": "The descriptor namespace as a URI",
            "maxLength": 255,
            "minLength": 1,
            "pattern": "^(?!\\\\s).*(?<!\\\\s)$",
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
          "shortDescription": Object {
            "description": "The descriptor short description",
            "maxLength": 75,
            "minLength": 1,
            "pattern": "^(?!\\\\s).*(?<!\\\\s)$",
            "type": "string",
          },
        },
        "required": Array [
          "namespace",
          "codeValue",
          "shortDescription",
        ],
        "type": "object",
      }
    `);
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.schoolYearEnumeration.get('SchoolYear');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "A school year enumeration",
        "properties": Object {
          "schoolYear": Object {
            "description": "A school year between 1900 and 2100",
            "maximum": 2100,
            "minimum": 1900,
            "type": "integer",
          },
        },
        "type": "object",
      }
    `);
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentCohort');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "studentUniqueId": Object {
            "description": "",
            "maxLength": 100,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
          "years": Object {
            "items": Object {
              "$ref": "#/components/schemas/EdFi_StudentCohort_CohortYear",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
        },
        "required": Array [
          "studentUniqueId",
        ],
        "type": "object",
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

    domainEntityReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);

    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);
    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('common descriptor decollisioned top level name should be correct', () => {
    const common = namespace.entity.common.get('Credits');
    expect(common.properties[0].data.edfiApiSchema.apiMapping.decollisionedTopLevelName).toBe('CreditTypeDescriptor');
  });

  it('should be a correct schema for section', () => {
    const entity = namespace.entity.domainEntity.get('Section');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "Documentation",
        "properties": Object {
          "availableCreditTypeDescriptor": Object {
            "description": "Documentation",
            "maxLength": 306,
            "type": "string",
            "x-nullable": true,
          },
          "sectionIdentifier": Object {
            "description": "Documentation",
            "type": "integer",
            "x-Ed-Fi-isIdentity": true,
          },
        },
        "required": Array [
          "sectionIdentifier",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentCompetencyObjective');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "identity1": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
          "objectiveCompetencyObjectiveReference": Object {
            "$ref": "#/components/schemas/EdFi_CompetencyObjective_Reference",
          },
        },
        "required": Array [
          "identity1",
          "objectiveCompetencyObjectiveReference",
        ],
        "type": "object",
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

    domainEntityReferenceEnhancer(metaEd);
    entityPropertyApiSchemaDataSetupEnhancer(metaEd);
    entityApiSchemaDataSetupEnhancer(metaEd);

    referenceComponentEnhancer(metaEd);
    apiPropertyMappingEnhancer(metaEd);
    propertyCollectingEnhancer(metaEd);
    apiEntityMappingEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get('StudentCompetencyObjective');
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "doc",
        "properties": Object {
          "stringIdentity": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
            "x-Ed-Fi-isIdentity": true,
          },
          "stringOptional": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
            "x-nullable": true,
          },
          "stringRequired": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "stringIdentity",
          "stringRequired",
        ],
        "type": "object",
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
    enhance(metaEd);
  });

  it('should be a correct schema', () => {
    const entity = extensionNamespace.entity.domainEntityExtension.get(entityName);
    expect(entity.data.edfiApiSchema.openApiRequestBodyComponent).toMatchInlineSnapshot(`
      Object {
        "description": "",
        "properties": Object {
          "referencedEntityNameReference": Object {
            "$ref": "#/components/schemas/EdFi_ReferencedEntityName_Reference",
            "x-nullable": true,
          },
        },
        "type": "object",
      }
    `);
  });
});
