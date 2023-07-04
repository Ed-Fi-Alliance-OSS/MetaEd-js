import Ajv from 'ajv/dist/2020';
import addFormatsTo from 'ajv-formats';
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
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  choiceReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  commonReferenceEnhancer,
  descriptorReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  enumerationReferenceEnhancer,
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
import { enhance } from '../../src/enhancer/JsonSchemaEnhancer';

const ajv = new Ajv({ allErrors: true });
addFormatsTo(ajv);

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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "optionalBooleanProperty": Object {
            "description": "doc1",
            "type": "boolean",
          },
          "optionalDecimalProperty": Object {
            "description": "doc3",
            "type": "number",
          },
          "optionalPercentProperty": Object {
            "description": "doc5",
            "type": "number",
          },
          "optionalShortProperty": Object {
            "description": "doc9",
            "type": "integer",
          },
          "optionalYear": Object {
            "description": "doc13",
            "type": "integer",
          },
          "requiredCurrencyProperty": Object {
            "description": "doc2",
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
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "additionalProperties": false,
            "description": "A school year enumeration",
            "properties": Object {
              "schoolYear": Object {
                "description": "A school year between 1900 and 2100",
                "maximum": 2100,
                "minimum": 1900,
                "type": "integer",
              },
            },
            "title": "EdFi.SchoolYearType",
            "type": "object",
          },
          "stringIdentity": Object {
            "description": "doc10",
            "maxLength": 30,
            "minLength": 20,
            "type": "string",
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
        "title": "EdFi.DomainEntityName",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": Array [
          "$.optionalBooleanProperty",
        ],
        "OptionalDecimalProperty": Array [
          "$.optionalDecimalProperty",
        ],
        "OptionalPercentProperty": Array [
          "$.optionalPercentProperty",
        ],
        "OptionalShortProperty": Array [
          "$.optionalShortProperty",
        ],
        "OptionalYear": Array [
          "$.optionalYear",
        ],
        "RequiredCurrencyProperty": Array [
          "$.requiredCurrencyProperty",
        ],
        "RequiredDateProperty": Array [
          "$.requiredDateProperty",
        ],
        "RequiredDatetimeProperty": Array [
          "$.requiredDatetimeProperty",
        ],
        "RequiredDurationProperty": Array [
          "$.requiredDurationProperty",
        ],
        "RequiredIntegerProperty": Array [
          "$.requiredIntegerProperty",
        ],
        "RequiredTimeProperty": Array [
          "$.requiredTimeProperty",
        ],
        "SchoolYear": Array [
          "$.schoolYearTypeReference.schoolYear",
        ],
        "StringIdentity": Array [
          "$.stringIdentity",
        ],
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "optionalBooleanProperties": Object {
            "items": Object {
              "additionalProperties": false,
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
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "optionalDecimalProperties": Object {
            "items": Object {
              "additionalProperties": false,
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
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "optionalPercentProperties": Object {
            "items": Object {
              "additionalProperties": false,
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
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "optionalShortProperties": Object {
            "items": Object {
              "additionalProperties": false,
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
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "optionalYears": Object {
            "items": Object {
              "additionalProperties": false,
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
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "requiredCurrencyProperties": Object {
            "items": Object {
              "additionalProperties": false,
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
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "requiredDateProperties": Object {
            "items": Object {
              "additionalProperties": false,
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
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "requiredDatetimeProperties": Object {
            "items": Object {
              "additionalProperties": false,
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
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "requiredDurationProperties": Object {
            "items": Object {
              "additionalProperties": false,
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
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "requiredIntegerProperties": Object {
            "items": Object {
              "additionalProperties": false,
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
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "requiredStringProperties": Object {
            "items": Object {
              "additionalProperties": false,
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
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "requiredTimeProperties": Object {
            "items": Object {
              "additionalProperties": false,
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
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "schoolYearTypeReference": Object {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "additionalProperties": false,
            "description": "A school year enumeration",
            "properties": Object {
              "schoolYear": Object {
                "description": "A school year between 1900 and 2100",
                "maximum": 2100,
                "minimum": 1900,
                "type": "integer",
              },
            },
            "title": "EdFi.SchoolYearType",
            "type": "object",
          },
          "stringIdentity": Object {
            "description": "doc10",
            "maxLength": 30,
            "minLength": 20,
            "type": "string",
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
        "title": "EdFi.DomainEntityName",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "OptionalBooleanProperty": Array [
          "$.optionalBooleanProperties[*].optionalBooleanProperty",
        ],
        "OptionalDecimalProperty": Array [
          "$.optionalDecimalProperties[*].optionalDecimalProperty",
        ],
        "OptionalPercentProperty": Array [
          "$.optionalPercentProperties[*].optionalPercentProperty",
        ],
        "OptionalShortProperty": Array [
          "$.optionalShortProperties[*].optionalShortProperty",
        ],
        "OptionalYear": Array [
          "$.optionalYears[*].optionalYear",
        ],
        "RequiredCurrencyProperty": Array [
          "$.requiredCurrencyProperties[*].requiredCurrencyProperty",
        ],
        "RequiredDateProperty": Array [
          "$.requiredDateProperties[*].requiredDateProperty",
        ],
        "RequiredDatetimeProperty": Array [
          "$.requiredDatetimeProperties[*].requiredDatetimeProperty",
        ],
        "RequiredDurationProperty": Array [
          "$.requiredDurationProperties[*].requiredDurationProperty",
        ],
        "RequiredIntegerProperty": Array [
          "$.requiredIntegerProperties[*].requiredIntegerProperty",
        ],
        "RequiredStringProperty": Array [
          "$.requiredStringProperties[*].requiredStringProperty",
        ],
        "RequiredTimeProperty": Array [
          "$.requiredTimeProperties[*].requiredTimeProperty",
        ],
        "SchoolYear": Array [
          "$.schoolYearTypeReference.schoolYear",
        ],
        "StringIdentity": Array [
          "$.stringIdentity",
        ],
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

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "classPeriods": Object {
            "items": Object {
              "additionalProperties": false,
              "properties": Object {
                "classPeriodReference": Object {
                  "additionalProperties": false,
                  "properties": Object {
                    "classPeriodName": Object {
                      "description": "doc",
                      "maxLength": 30,
                      "type": "string",
                    },
                    "schoolId": Object {
                      "description": "doc",
                      "maxLength": 30,
                      "type": "string",
                    },
                  },
                  "required": Array [
                    "classPeriodName",
                    "schoolId",
                  ],
                  "type": "object",
                },
              },
              "required": Array [
                "classPeriodReference",
              ],
              "type": "object",
            },
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
          "courseOfferingReference": Object {
            "additionalProperties": false,
            "properties": Object {
              "localCourseCode": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
              "schoolId": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "localCourseCode",
              "schoolId",
            ],
            "type": "object",
          },
          "sectionIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "sectionIdentifier",
          "courseOfferingReference",
          "classPeriods",
        ],
        "title": "EdFi.DomainEntityName",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "ClassPeriod": Array [
          "$.classPeriods[*].classPeriodReference.classPeriodName",
          "$.classPeriods[*].classPeriodReference.schoolId",
        ],
        "ClassPeriod.ClassPeriodName": Array [
          "$.classPeriods[*].classPeriodReference.classPeriodName",
        ],
        "ClassPeriod.School": Array [
          "$.classPeriods[*].classPeriodReference.schoolId",
        ],
        "ClassPeriod.School.SchoolId": Array [
          "$.classPeriods[*].classPeriodReference.schoolId",
        ],
        "CourseOffering": Array [
          "$.courseOfferingReference.localCourseCode",
          "$.courseOfferingReference.schoolId",
        ],
        "CourseOffering.LocalCourseCode": Array [
          "$.courseOfferingReference.localCourseCode",
        ],
        "CourseOffering.School": Array [
          "$.courseOfferingReference.schoolId",
        ],
        "CourseOffering.School.SchoolId": Array [
          "$.courseOfferingReference.schoolId",
        ],
        "SectionIdentifier": Array [
          "$.sectionIdentifier",
        ],
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

  it('should be a correct schema', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "courseOfferingReference": Object {
            "additionalProperties": false,
            "properties": Object {
              "localCourseCode": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
              "schoolId": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
              "schoolYear": Object {
                "description": "A school year between 1900 and 2100",
                "maximum": 2100,
                "minimum": 1900,
                "type": "integer",
              },
              "sessionName": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "localCourseCode",
              "schoolId",
              "schoolYear",
              "sessionName",
            ],
            "type": "object",
          },
          "sectionIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "sectionIdentifier",
          "courseOfferingReference",
        ],
        "title": "EdFi.DomainEntityName",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "CourseOffering": Array [
          "$.courseOfferingReference.localCourseCode",
          "$.courseOfferingReference.schoolId",
          "$.courseOfferingReference.schoolYear",
          "$.courseOfferingReference.sessionName",
        ],
        "CourseOffering.LocalCourseCode": Array [
          "$.courseOfferingReference.localCourseCode",
        ],
        "CourseOffering.School": Array [
          "$.courseOfferingReference.schoolId",
        ],
        "CourseOffering.School.SchoolId": Array [
          "$.courseOfferingReference.schoolId",
        ],
        "CourseOffering.Session": Array [
          "$.courseOfferingReference.schoolId",
          "$.courseOfferingReference.schoolYear",
          "$.courseOfferingReference.sessionName",
        ],
        "CourseOffering.Session.School": Array [
          "$.courseOfferingReference.schoolId",
        ],
        "CourseOffering.Session.School.SchoolId": Array [
          "$.courseOfferingReference.schoolId",
        ],
        "CourseOffering.Session.SchoolYear": Array [
          "$.courseOfferingReference.schoolYear",
        ],
        "CourseOffering.Session.SessionName": Array [
          "$.courseOfferingReference.sessionName",
        ],
        "SectionIdentifier": Array [
          "$.sectionIdentifier",
        ],
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

      .withStartInlineCommon('LearningResource')
      .withDocumentation('doc')
      .withStringProperty('Description', 'doc', false, false, '30')
      .withInlineCommonProperty('EducationContentSource', 'doc', false, false, 'DerivativeSource')
      .withEndInlineCommon()

      .withStartInlineCommon('EducationContentSource')
      .withDocumentation('doc')
      .withDomainEntityProperty('EducationContent', 'doc', false, true)
      .withStringProperty('URI', 'doc', false, true, '30')
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new ChoiceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    namespace = metaEd.namespace.get(namespaceName);

    domainEntityReferenceEnhancer(metaEd);
    choiceReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "contentIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
          "derivativeSourceEducationContents": Object {
            "items": Object {
              "additionalProperties": false,
              "properties": Object {
                "derivativeSourceEducationContentReference": Object {
                  "additionalProperties": false,
                  "properties": Object {
                    "contentIdentifier": Object {
                      "description": "doc",
                      "maxLength": 30,
                      "type": "string",
                    },
                  },
                  "type": "object",
                },
              },
              "required": Array [
                "derivativeSourceEducationContentReference",
              ],
              "type": "object",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "derivativeSourceURIs": Object {
            "items": Object {
              "additionalProperties": false,
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
              "additionalProperties": false,
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
            "minItems": 1,
            "type": "array",
            "uniqueItems": false,
          },
        },
        "required": Array [
          "contentIdentifier",
          "learningResourceMetadataURI",
          "requiredURIs",
        ],
        "title": "EdFi.EducationContent",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Array [
          "$.contentIdentifier",
        ],
        "Description": Array [
          "$.description",
        ],
        "EducationContent": Array [
          "$.derivativeSourceEducationContents[*].derivativeSourceEducationContentReference.contentIdentifier",
        ],
        "EducationContent.ContentIdentifier": Array [
          "$.derivativeSourceEducationContents[*].derivativeSourceEducationContentReference.contentIdentifier",
        ],
        "LearningResourceMetadataURI": Array [
          "$.learningResourceMetadataURI",
        ],
        "RequiredURI": Array [
          "$.requiredURIs[*].requiredURI",
        ],
        "URI": Array [
          "$.derivativeSourceURIs[*].derivativeSourceURI",
        ],
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "contentIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
          "suffixNames": Object {
            "items": Object {
              "additionalProperties": false,
              "properties": Object {
                "suffixName": Object {
                  "description": "doc",
                  "maxLength": 30,
                  "type": "string",
                },
              },
              "required": Array [
                "suffixName",
              ],
              "type": "object",
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
        "title": "EdFi.EducationContent",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Array [
          "$.contentIdentifier",
        ],
        "EducationContentSuffixName": Array [
          "$.suffixNames[*].suffixName",
        ],
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "contentIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
          "educationContentSuffixNames": Object {
            "items": Object {
              "additionalProperties": false,
              "properties": Object {
                "educationContentSuffixNameReference": Object {
                  "additionalProperties": false,
                  "properties": Object {
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
              "required": Array [
                "educationContentSuffixNameReference",
              ],
              "type": "object",
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
        "title": "EdFi.EducationContent",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Array [
          "$.contentIdentifier",
        ],
        "EducationContentSuffixName": Array [
          "$.educationContentSuffixNames[*].educationContentSuffixNameReference.stringIdentity",
        ],
        "EducationContentSuffixName.StringIdentity": Array [
          "$.educationContentSuffixNames[*].educationContentSuffixNameReference.stringIdentity",
        ],
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "contentIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
          "iepBeginDate": Object {
            "description": "doc",
            "format": "date-time",
            "type": "string",
          },
        },
        "required": Array [
          "contentIdentifier",
          "iepBeginDate",
        ],
        "title": "EdFi.StudentSpecialEducationProgramAssociation",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get(domainEntityName);
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "ContentIdentifier": Array [
          "$.contentIdentifier",
        ],
        "IEPBeginDate": Array [
          "$.iepBeginDate",
        ],
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "assessmentIdentifier": Object {
            "description": "doc",
            "type": "integer",
          },
          "identificationCodes": Object {
            "items": Object {
              "additionalProperties": false,
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
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
        },
        "required": Array [
          "assessmentIdentifier",
        ],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentificationCode.AssessmentIdentificationSystem": Array [
          "$.identificationCodes[*].assessmentIdentificationSystemDescriptor",
        ],
        "AssessmentIdentificationCode.IdentificationCode": Array [
          "$.identificationCodes[*].identificationCode",
        ],
        "AssessmentIdentifier": Array [
          "$.assessmentIdentifier",
        ],
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "communityOrganizationId": Object {
            "description": "doc",
            "type": "integer",
          },
          "identificationCodes": Object {
            "items": Object {
              "additionalProperties": false,
              "properties": Object {
                "educationOrganizationIdentificationSystemDescriptor": Object {
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
                "educationOrganizationIdentificationSystemDescriptor",
              ],
              "type": "object",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
        },
        "required": Array [
          "communityOrganizationId",
        ],
        "title": "EdFi.CommunityOrganization",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName);
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntitySubclass.get(domainEntitySubclassName);
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "CommunityOrganizationId": Array [
          "$.communityOrganizationId",
        ],
        "EducationOrganizationIdentificationCode.EducationOrganizationIdentificationSystem": Array [
          "$.identificationCodes[*].educationOrganizationIdentificationSystemDescriptor",
        ],
        "EducationOrganizationIdentificationCode.IdentificationCode": Array [
          "$.identificationCodes[*].identificationCode",
        ],
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "addresses": Object {
            "items": Object {
              "additionalProperties": false,
              "properties": Object {
                "periods": Object {
                  "items": Object {
                    "additionalProperties": false,
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
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "studentId": Object {
            "description": "doc",
            "type": "integer",
          },
        },
        "required": Array [
          "studentId",
        ],
        "title": "EdFi.StudentEducationOrganizationAssociation",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get('StudentEducationOrganizationAssociation');
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get('StudentEducationOrganizationAssociation');
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "Address.Period.BeginDate": Array [
          "$.addresses[*].periods[*].beginDate",
        ],
        "Address.Period.EndDate": Array [
          "$.addresses[*].periods[*].endDate",
        ],
        "Address.StreetNumberName": Array [
          "$.addresses[*].streetNumberName",
        ],
        "StudentId": Array [
          "$.studentId",
        ],
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "assessedGradeLevelDescriptor": Object {
            "description": "doc",
            "type": "string",
          },
          "assessmentIdentifier": Object {
            "description": "doc",
            "type": "integer",
          },
        },
        "required": Array [
          "assessmentIdentifier",
        ],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevel": Array [
          "$.assessedGradeLevelDescriptor",
        ],
        "AssessmentIdentifier": Array [
          "$.assessmentIdentifier",
        ],
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "assessedGradeLevels": Object {
            "items": Object {
              "additionalProperties": false,
              "properties": Object {
                "gradeLevelDescriptor": Object {
                  "description": "An Ed-Fi Descriptor",
                  "type": "string",
                },
              },
              "required": Array [
                "gradeLevelDescriptor",
              ],
              "type": "object",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
          "assessmentIdentifier": Object {
            "description": "doc",
            "type": "integer",
          },
        },
        "required": Array [
          "assessmentIdentifier",
        ],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessedGradeLevel": Array [
          "$.assessedGradeLevels[*].gradeLevelDescriptor",
        ],
        "AssessmentIdentifier": Array [
          "$.assessmentIdentifier",
        ],
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "assessmentIdentifier": Object {
            "description": "doc",
            "type": "integer",
          },
          "contentStandard": Object {
            "additionalProperties": false,
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
        "required": Array [
          "assessmentIdentifier",
        ],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Array [
          "$.assessmentIdentifier",
        ],
        "ContentStandard.PublicationDate": Array [
          "$.contentStandard.publicationDate",
        ],
        "ContentStandard.PublicationYear": Array [
          "$.contentStandard.publicationYear",
        ],
        "ContentStandard.Title": Array [
          "$.contentStandard.title",
        ],
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "assessmentIdentifier": Object {
            "description": "doc",
            "type": "integer",
          },
          "period": Object {
            "additionalProperties": false,
            "properties": Object {
              "beginDate": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "type": "object",
          },
          "scores": Object {
            "items": Object {
              "additionalProperties": false,
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
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
        },
        "required": Array [
          "assessmentIdentifier",
          "scores",
        ],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Array [
          "$.assessmentIdentifier",
        ],
        "AssessmentPeriod.BeginDate": Array [
          "$.period.beginDate",
        ],
        "AssessmentScore.MinimumScore": Array [
          "$.scores[*].minimumScore",
        ],
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "assessmentIdentifier": Object {
            "description": "doc",
            "type": "integer",
          },
          "uri": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "assessmentIdentifier",
        ],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Array [
          "$.assessmentIdentifier",
        ],
        "URI": Array [
          "$.uri",
        ],
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "assessmentIdentifier": Object {
            "description": "doc",
            "type": "integer",
          },
          "contentStandard": Object {
            "additionalProperties": false,
            "properties": Object {
              "mandatingEducationOrganizationReference": Object {
                "additionalProperties": false,
                "properties": Object {
                  "educationOrganizationId": Object {
                    "description": "doc",
                    "type": "integer",
                  },
                },
                "required": Array [
                  "educationOrganizationId",
                ],
                "type": "object",
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
        "required": Array [
          "assessmentIdentifier",
        ],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get('Assessment');
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "AssessmentIdentifier": Array [
          "$.assessmentIdentifier",
        ],
        "ContentStandard.MandatingEducationOrganization": Array [
          "$.contentStandard.mandatingEducationOrganizationReference.educationOrganizationId",
        ],
        "ContentStandard.MandatingEducationOrganization.EducationOrganizationId": Array [
          "$.contentStandard.mandatingEducationOrganizationReference.educationOrganizationId",
        ],
        "ContentStandard.Title": Array [
          "$.contentStandard.title",
        ],
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "classOfSchoolYearTypeReference": Object {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "additionalProperties": false,
            "description": "A school year enumeration",
            "properties": Object {
              "schoolYear": Object {
                "description": "A school year between 1900 and 2100",
                "maximum": 2100,
                "minimum": 1900,
                "type": "integer",
              },
            },
            "title": "EdFi.SchoolYearType",
            "type": "object",
          },
          "schoolId": Object {
            "description": "doc",
            "type": "integer",
          },
          "schoolYearTypeReference": Object {
            "$schema": "https://json-schema.org/draft/2020-12/schema",
            "additionalProperties": false,
            "description": "A school year enumeration",
            "properties": Object {
              "schoolYear": Object {
                "description": "A school year between 1900 and 2100",
                "maximum": 2100,
                "minimum": 1900,
                "type": "integer",
              },
            },
            "title": "EdFi.SchoolYearType",
            "type": "object",
          },
        },
        "required": Array [
          "schoolId",
        ],
        "title": "EdFi.StudentSchoolAssociation",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get('StudentSchoolAssociation');
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get('StudentSchoolAssociation');
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "ClassOfSchoolYear": Array [
          "$.classOfSchoolYearTypeReference.schoolYear",
        ],
        "SchoolId": Array [
          "$.schoolId",
        ],
        "SchoolYear": Array [
          "$.schoolYearTypeReference.schoolYear",
        ],
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "calendarReference": Object {
            "additionalProperties": false,
            "properties": Object {
              "schoolId": Object {
                "description": "doc",
                "type": "integer",
              },
              "schoolYear": Object {
                "description": "A school year between 1900 and 2100",
                "maximum": 2100,
                "minimum": 1900,
                "type": "integer",
              },
            },
            "required": Array [
              "schoolId",
              "schoolYear",
            ],
            "type": "object",
          },
          "schoolId": Object {
            "description": "doc",
            "type": "integer",
          },
        },
        "required": Array [
          "schoolId",
        ],
        "title": "EdFi.StudentSchoolAssociation",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get('StudentSchoolAssociation');
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get('StudentSchoolAssociation');
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "Calendar": Array [
          "$.calendarReference.schoolId",
          "$.calendarReference.schoolYear",
        ],
        "Calendar.SchoolId": Array [
          "$.calendarReference.schoolId",
        ],
        "Calendar.SchoolYear": Array [
          "$.calendarReference.schoolYear",
        ],
        "SchoolId": Array [
          "$.schoolId",
        ],
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "An Ed-Fi Descriptor",
        "properties": Object {
          "codeValue": Object {
            "description": "The descriptor code value",
            "type": "string",
          },
          "description": Object {
            "description": "The descriptor description",
            "type": "string",
          },
          "namespace": Object {
            "description": "The descriptor namespace as a URI",
            "type": "string",
          },
          "shortDescription": Object {
            "description": "The descriptor short description",
            "type": "string",
          },
        },
        "required": Array [
          "namespace",
          "codeValue",
          "shortDescription",
        ],
        "title": "EdFi.Descriptor",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.descriptor.get('GradeLevel');
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.descriptor.get('GradeLevel');
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`Object {}`);
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "A school year enumeration",
        "properties": Object {
          "schoolYear": Object {
            "description": "A school year between 1900 and 2100",
            "maximum": 2100,
            "minimum": 1900,
            "type": "integer",
          },
        },
        "title": "EdFi.SchoolYearType",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.schoolYearEnumeration.get('SchoolYear');
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.schoolYearEnumeration.get('SchoolYear');
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`Object {}`);
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
    expect(entity.data.edfiApiSchema.jsonSchema).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "doc",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "studentUniqueId": Object {
            "description": "",
            "maxLength": 100,
            "type": "string",
          },
          "years": Object {
            "items": Object {
              "additionalProperties": false,
              "properties": Object {
                "schoolYearTypeReference": Object {
                  "$schema": "https://json-schema.org/draft/2020-12/schema",
                  "additionalProperties": false,
                  "description": "A school year enumeration",
                  "properties": Object {
                    "schoolYear": Object {
                      "description": "A school year between 1900 and 2100",
                      "maximum": 2100,
                      "minimum": 1900,
                      "type": "integer",
                    },
                  },
                  "title": "EdFi.SchoolYearType",
                  "type": "object",
                },
              },
              "required": Array [
                "schoolYearTypeReference",
              ],
              "type": "object",
            },
            "minItems": 0,
            "type": "array",
            "uniqueItems": false,
          },
        },
        "required": Array [
          "studentUniqueId",
        ],
        "title": "EdFi.StudentCohort",
        "type": "object",
      }
    `);
  });

  it('should be well-formed according to ajv', () => {
    const entity = namespace.entity.domainEntity.get('StudentCohort');
    ajv.compile(entity.data.edfiApiSchema.jsonSchema);
  });

  it('should be correct entityJsonPaths', () => {
    const entity = namespace.entity.domainEntity.get('StudentCohort');
    expect(entity.data.edfiApiSchema.entityJsonPaths).toMatchInlineSnapshot(`
      Object {
        "CohortYear.SchoolYear": Array [
          "$.years[*].schoolYearTypeReference.schoolYear",
        ],
        "StudentUniqueId": Array [
          "$.studentUniqueId",
        ],
      }
    `);
  });
});
