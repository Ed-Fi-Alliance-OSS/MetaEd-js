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
  newPluginEnvironment,
  AssociationBuilder,
  AssociationSubclassBuilder,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  choiceReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  commonReferenceEnhancer,
  descriptorReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
  enumerationReferenceEnhancer,
  associationSubclassBaseClassEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../../src/model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../../src/model/EntityApiSchemaData';
import { enhance as pluginEnvironmentSetupEnhancer } from '../../src/model/PluginEnvironment';
import { enhance as subclassPropertyNamingCollisionEnhancer } from '../../src/enhancer/SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from '../../src/enhancer/ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from '../../src/enhancer/ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from '../../src/enhancer/ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from '../../src/enhancer/SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from '../../src/enhancer/PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from '../../src/enhancer/SubclassPropertyCollectingEnhancer';
import { enhance as jsonSchemaEnhancerForInsert } from '../../src/enhancer/JsonSchemaEnhancerForInsert';
import { enhance as jsonSchemaEnhancerForUpdate } from '../../src/enhancer/JsonSchemaEnhancerForUpdate';
import { enhance as jsonSchemaEnhancerForQuery } from '../../src/enhancer/JsonSchemaEnhancerForQuery';
import { enhance as allJsonPathsMappingEnhancer } from '../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as equalityConstraintEnhancer } from '../../src/enhancer/EqualityConstraintEnhancer';
import { enhance as resourceNameEnhancer } from '../../src/enhancer/ResourceNameEnhancer';
import { enhance as identityFullnameEnhancer } from '../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as subclassIdentityFullnameEnhancer } from '../../src/enhancer/SubclassIdentityFullnameEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance } from '../../src/enhancer/ApiSchemaBuildingEnhancer';

const ajv = new Ajv({ allErrors: true });
addFormatsTo(ajv);

function runApiSchemaEnhancers(metaEd: MetaEdEnvironment) {
  entityPropertyApiSchemaDataSetupEnhancer(metaEd);
  entityApiSchemaDataSetupEnhancer(metaEd);
  pluginEnvironmentSetupEnhancer(metaEd);
  subclassPropertyNamingCollisionEnhancer(metaEd);
  referenceComponentEnhancer(metaEd);
  apiPropertyMappingEnhancer(metaEd);
  propertyCollectingEnhancer(metaEd);
  subclassPropertyCollectingEnhancer(metaEd);
  apiEntityMappingEnhancer(metaEd);
  subclassApiEntityMappingEnhancer(metaEd);
  jsonSchemaEnhancerForInsert(metaEd);
  jsonSchemaEnhancerForUpdate(metaEd);
  jsonSchemaEnhancerForQuery(metaEd);
  allJsonPathsMappingEnhancer(metaEd);
  equalityConstraintEnhancer(metaEd);
  resourceNameEnhancer(metaEd);
  identityFullnameEnhancer(metaEd);
  subclassIdentityFullnameEnhancer(metaEd);
  documentPathsMappingEnhancer(metaEd);
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
      .withEndDomainEntity()
      .withEndNamespace()
      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct equalityConstraints for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "StringIdentity",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.DomainEntityName",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
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
          "id",
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

  it('should be correct resourceName for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames.resourceName,
    ).toMatchInlineSnapshot(`"DomainEntityName"`);
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

  it('should be correct equalityConstraints for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "StringIdentity",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.DomainEntityName",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
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
          "id",
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

  it('should be correct resourceName for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames.resourceName,
    ).toMatchInlineSnapshot(`"DomainEntityName"`);
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

  it('should be correct equalityConstraint for DomainEntityNames', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "SectionIdentifier",
        "CourseOffering",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.DomainEntityName",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
          "sectionIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "id",
          "sectionIdentifier",
          "courseOfferingReference",
          "classPeriods",
        ],
        "title": "EdFi.DomainEntityName",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames.resourceName,
    ).toMatchInlineSnapshot(`"DomainEntityName"`);
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

  it('should be correct equalityConstraints for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "SectionIdentifier",
        "CourseOffering",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.DomainEntityName",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames
        .jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
          "sectionIdentifier": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "id",
          "sectionIdentifier",
          "courseOfferingReference",
        ],
        "title": "EdFi.DomainEntityName",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for DomainEntityName', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.domainEntityNames.resourceName,
    ).toMatchInlineSnapshot(`"DomainEntityName"`);
  });

  it('should be correct equalityConstraints for CourseOffering', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.courseOfferings
        .equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for CourseOffering', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.courseOfferings
        .identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "LocalCourseCode",
        "School",
        "Session",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for CourseOffering', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.courseOfferings
        .jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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
          "localCourseCode": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
          "schoolReference": Object {
            "additionalProperties": false,
            "properties": Object {
              "schoolId": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "schoolId",
            ],
            "type": "object",
          },
          "sessionReference": Object {
            "additionalProperties": false,
            "properties": Object {
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
              "schoolId",
              "schoolYear",
              "sessionName",
            ],
            "type": "object",
          },
        },
        "required": Array [
          "localCourseCode",
          "schoolReference",
          "sessionReference",
        ],
        "title": "EdFi.CourseOffering",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForQuery for CourseOffering', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.courseOfferings
        .jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
          "localCourseCode": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
          "schoolReference": Object {
            "additionalProperties": false,
            "properties": Object {
              "schoolId": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "schoolId",
            ],
            "type": "object",
          },
          "sessionReference": Object {
            "additionalProperties": false,
            "properties": Object {
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
              "schoolId",
              "schoolYear",
              "sessionName",
            ],
            "type": "object",
          },
        },
        "required": Array [],
        "title": "EdFi.CourseOffering",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for CourseOffering', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.courseOfferings
        .jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
          "localCourseCode": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
          "schoolReference": Object {
            "additionalProperties": false,
            "properties": Object {
              "schoolId": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "schoolId",
            ],
            "type": "object",
          },
          "sessionReference": Object {
            "additionalProperties": false,
            "properties": Object {
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
              "schoolId",
              "schoolYear",
              "sessionName",
            ],
            "type": "object",
          },
        },
        "required": Array [
          "id",
          "localCourseCode",
          "schoolReference",
          "sessionReference",
        ],
        "title": "EdFi.CourseOffering",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for CourseOffering', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.courseOfferings.resourceName,
    ).toMatchInlineSnapshot(`"CourseOffering"`);
  });

  it('should be correct equalityConstraints for Session', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.sessions.equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for Session', () => {
    expect(metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.sessions.identityFullnames)
      .toMatchInlineSnapshot(`
      Array [
        "SessionName",
        "SchoolYear",
        "School",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for Session', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.sessions.jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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
          "schoolReference": Object {
            "additionalProperties": false,
            "properties": Object {
              "schoolId": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "schoolId",
            ],
            "type": "object",
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
          "sessionName": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "sessionName",
          "schoolYearTypeReference",
          "schoolReference",
        ],
        "title": "EdFi.Session",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForQuery for Session', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.sessions.jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
          "schoolReference": Object {
            "additionalProperties": false,
            "properties": Object {
              "schoolId": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "schoolId",
            ],
            "type": "object",
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
          "sessionName": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [],
        "title": "EdFi.Session",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for Session', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.sessions.jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
          "schoolReference": Object {
            "additionalProperties": false,
            "properties": Object {
              "schoolId": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "schoolId",
            ],
            "type": "object",
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
          "sessionName": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "id",
          "sessionName",
          "schoolYearTypeReference",
          "schoolReference",
        ],
        "title": "EdFi.Session",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for Session', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.sessions.resourceName,
    ).toMatchInlineSnapshot(`"Session"`);
  });

  it('should be correct equalityConstraints for School', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for School', () => {
    expect(metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.identityFullnames)
      .toMatchInlineSnapshot(`
      Array [
        "SchoolId",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for School', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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
          "schoolId": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "schoolId",
        ],
        "title": "EdFi.School",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForQuery for School', () => {
    expect(metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.jsonSchemaForQuery)
      .toMatchInlineSnapshot(`
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
          "schoolId": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [],
        "title": "EdFi.School",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for School', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
          "schoolId": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "id",
          "schoolId",
        ],
        "title": "EdFi.School",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for School', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.resourceName,
    ).toMatchInlineSnapshot(`"School"`);
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

  it('should be correct equalityConstraints for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents
        .equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents
        .identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "ContentIdentifier",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents
        .jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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
        "title": "EdFi.EducationContent",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForQuery for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents
        .jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
          "shortDescription": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [],
        "title": "EdFi.EducationContent",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents
        .jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
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
          "shortDescription": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "id",
          "contentIdentifier",
          "requiredURIs",
        ],
        "title": "EdFi.EducationContent",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents.resourceName,
    ).toMatchInlineSnapshot(`"EducationContent"`);
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

  it('should be correct equalityConstraints for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents
        .equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents
        .identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "ContentIdentifier",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents
        .jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents
        .jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.EducationContent",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents
        .jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
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
          "id",
          "contentIdentifier",
          "suffixNames",
        ],
        "title": "EdFi.EducationContent",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents.resourceName,
    ).toMatchInlineSnapshot(`"EducationContent"`);
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

  it('should be correct equalityConstraints for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents
        .equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents
        .identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "ContentIdentifier",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents
        .jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents
        .jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.EducationContent",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents
        .jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
        },
        "required": Array [
          "id",
          "contentIdentifier",
          "educationContentSuffixNames",
        ],
        "title": "EdFi.EducationContent",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for EducationContent', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.educationContents.resourceName,
    ).toMatchInlineSnapshot(`"EducationContent"`);
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
      .withDatetimeIdentity(`IEPBeginDate`, 'doc')
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
  });

  it('should be correct equalityConstraints for StudentSpecialEducationProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas
        .studentSpecialEducationProgramAssociations.equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for StudentSpecialEducationProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas
        .studentSpecialEducationProgramAssociations.identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "ContentIdentifier",
        "IEPBeginDate",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for StudentSpecialEducationProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas
        .studentSpecialEducationProgramAssociations.jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for StudentSpecialEducationProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas
        .studentSpecialEducationProgramAssociations.jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.StudentSpecialEducationProgramAssociation",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for StudentSpecialEducationProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas
        .studentSpecialEducationProgramAssociations.jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
          "iepBeginDate": Object {
            "description": "doc",
            "format": "date-time",
            "type": "string",
          },
        },
        "required": Array [
          "id",
          "contentIdentifier",
          "iepBeginDate",
        ],
        "title": "EdFi.StudentSpecialEducationProgramAssociation",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for StudentSpecialEducationProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas
        .studentSpecialEducationProgramAssociations.resourceName,
    ).toMatchInlineSnapshot(`"StudentSpecialEducationProgramAssociation"`);
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

  it('should be correct equalityConstraints for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "AssessmentIdentifier",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
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
          "id",
          "assessmentIdentifier",
        ],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.resourceName,
    ).toMatchInlineSnapshot(`"Assessment"`);
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

  it('should be correct equalityConstraints for CommunityOrganization', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.communityOrganizations
        .equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for CommunityOrganization', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.communityOrganizations
        .identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "CommunityOrganizationId",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for CommunityOrganization', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.communityOrganizations
        .jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for CommunityOrganization', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.communityOrganizations
        .jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.CommunityOrganization",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for CommunityOrganization', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.communityOrganizations
        .jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
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
          "id",
          "communityOrganizationId",
        ],
        "title": "EdFi.CommunityOrganization",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for CommunityOrganization', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.communityOrganizations
        .resourceName,
    ).toMatchInlineSnapshot(`"CommunityOrganization"`);
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

  it('should be correct equalityConstraints for StudentEducationOrganizationAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas
        .studentEducationOrganizationAssociations.equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for StudentEducationOrganizationAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas
        .studentEducationOrganizationAssociations.identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "StudentId",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for StudentEducationOrganizationAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas
        .studentEducationOrganizationAssociations.jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for StudentEducationOrganizationAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas
        .studentEducationOrganizationAssociations.jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.StudentEducationOrganizationAssociation",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for StudentEducationOrganizationAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas
        .studentEducationOrganizationAssociations.jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
          "studentId": Object {
            "description": "doc",
            "type": "integer",
          },
        },
        "required": Array [
          "id",
          "studentId",
        ],
        "title": "EdFi.StudentEducationOrganizationAssociation",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for StudentEducationOrganizationAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas
        .studentEducationOrganizationAssociations.resourceName,
    ).toMatchInlineSnapshot(`"StudentEducationOrganizationAssociation"`);
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

  it('should be correct equalityConstraints for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "AssessmentIdentifier",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
        },
        "required": Array [
          "id",
          "assessmentIdentifier",
        ],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.resourceName,
    ).toMatchInlineSnapshot(`"Assessment"`);
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

  it('should be correct equalityConstraints for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "AssessmentIdentifier",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
        },
        "required": Array [
          "id",
          "assessmentIdentifier",
        ],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.resourceName,
    ).toMatchInlineSnapshot(`"Assessment"`);
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

  it('should be correct equalityConstraints for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "AssessmentIdentifier",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
        },
        "required": Array [
          "id",
          "assessmentIdentifier",
        ],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.resourceName,
    ).toMatchInlineSnapshot(`"Assessment"`);
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

  it('should be correct equalityConstraints for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "AssessmentIdentifier",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
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
          "id",
          "assessmentIdentifier",
          "scores",
        ],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.resourceName,
    ).toMatchInlineSnapshot(`"Assessment"`);
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

  it('should be correct equalityConstraints for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "AssessmentIdentifier",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
          "uri": Object {
            "description": "doc",
            "maxLength": 30,
            "type": "string",
          },
        },
        "required": Array [
          "id",
          "assessmentIdentifier",
        ],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.resourceName,
    ).toMatchInlineSnapshot(`"Assessment"`);
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

  it('should be correct equalityConstraints for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "AssessmentIdentifier",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
        },
        "required": Array [
          "id",
          "assessmentIdentifier",
        ],
        "title": "EdFi.Assessment",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for Assessment', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.assessments.resourceName,
    ).toMatchInlineSnapshot(`"Assessment"`);
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

  it('should be correct equalityConstraints for StudentSchoolAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentSchoolAssociations
        .equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for StudentSchoolAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentSchoolAssociations
        .identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "SchoolId",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for StudentSchoolAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentSchoolAssociations
        .jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for StudentSchoolAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentSchoolAssociations
        .jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.StudentSchoolAssociation",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for StudentSchoolAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentSchoolAssociations
        .jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
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
          "id",
          "schoolId",
        ],
        "title": "EdFi.StudentSchoolAssociation",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for StudentSchoolAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentSchoolAssociations
        .resourceName,
    ).toMatchInlineSnapshot(`"StudentSchoolAssociation"`);
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

  it('should be correct equalityConstraints for StudentSchoolAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentSchoolAssociations
        .equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for StudentSchoolAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentSchoolAssociations
        .identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "SchoolId",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for StudentSchoolAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentSchoolAssociations
        .jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for StudentSchoolAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentSchoolAssociations
        .jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.StudentSchoolAssociation",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for StudentSchoolAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentSchoolAssociations
        .jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
          "schoolId": Object {
            "description": "doc",
            "type": "integer",
          },
        },
        "required": Array [
          "id",
          "schoolId",
        ],
        "title": "EdFi.StudentSchoolAssociation",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for StudentSchoolAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentSchoolAssociations
        .resourceName,
    ).toMatchInlineSnapshot(`"StudentSchoolAssociation"`);
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

  it('should be correct equalityConstraints for StudentCohort', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentCohorts
        .equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for StudentCohort', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentCohorts
        .identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "StudentUniqueId",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for StudentCohort', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentCohorts
        .jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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

  it('should be correct jsonSchemaForQuery for StudentCohort', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentCohorts
        .jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
        "required": Array [],
        "title": "EdFi.StudentCohort",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for StudentCohort', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentCohorts
        .jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
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
          "id",
          "studentUniqueId",
        ],
        "title": "EdFi.StudentCohort",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for StudentCohort', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentCohorts.resourceName,
    ).toMatchInlineSnapshot(`"StudentCohort"`);
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

  it('should be correct equalityConstraints for Section', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.sections.equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for Section', () => {
    expect(metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.sections.identityFullnames)
      .toMatchInlineSnapshot(`
      Array [
        "SectionIdentifier",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for Section', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.sections.jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "Documentation",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "availableCreditTypeDescriptor": Object {
            "description": "Documentation",
            "type": "string",
          },
          "sectionIdentifier": Object {
            "description": "Documentation",
            "type": "integer",
          },
        },
        "required": Array [
          "sectionIdentifier",
        ],
        "title": "EdFi.Section",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForQuery for Section', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.sections.jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "Documentation",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "availableCreditTypeDescriptor": Object {
            "description": "Documentation",
            "type": "string",
          },
          "sectionIdentifier": Object {
            "description": "Documentation",
            "type": "integer",
          },
        },
        "required": Array [],
        "title": "EdFi.Section",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for Section', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.sections.jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
      Object {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "additionalProperties": false,
        "description": "Documentation",
        "properties": Object {
          "_ext": Object {
            "additionalProperties": true,
            "description": "optional extension collection",
            "properties": Object {},
            "type": "object",
          },
          "availableCreditTypeDescriptor": Object {
            "description": "Documentation",
            "type": "string",
          },
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
          "sectionIdentifier": Object {
            "description": "Documentation",
            "type": "integer",
          },
        },
        "required": Array [
          "id",
          "sectionIdentifier",
        ],
        "title": "EdFi.Section",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for Section', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.sections.resourceName,
    ).toMatchInlineSnapshot(`"Section"`);
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

  it('should be correct equalityConstraints for School', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for School', () => {
    expect(metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.identityFullnames)
      .toMatchInlineSnapshot(`
      Array [
        "SchoolId",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for School', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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
          "schoolId": Object {
            "description": "doc",
            "type": "integer",
          },
          "subclassProperty": Object {
            "description": "doc",
            "type": "integer",
          },
          "superclassProperty": Object {
            "description": "doc",
            "type": "integer",
          },
        },
        "required": Array [
          "schoolId",
          "subclassProperty",
          "superclassProperty",
        ],
        "title": "EdFi.School",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForQuery for School', () => {
    expect(metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.jsonSchemaForQuery)
      .toMatchInlineSnapshot(`
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
          "schoolId": Object {
            "description": "doc",
            "type": "integer",
          },
          "subclassProperty": Object {
            "description": "doc",
            "type": "integer",
          },
          "superclassProperty": Object {
            "description": "doc",
            "type": "integer",
          },
        },
        "required": Array [],
        "title": "EdFi.School",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for School', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
          "schoolId": Object {
            "description": "doc",
            "type": "integer",
          },
          "subclassProperty": Object {
            "description": "doc",
            "type": "integer",
          },
          "superclassProperty": Object {
            "description": "doc",
            "type": "integer",
          },
        },
        "required": Array [
          "id",
          "schoolId",
          "subclassProperty",
          "superclassProperty",
        ],
        "title": "EdFi.School",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for School', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.resourceName,
    ).toMatchInlineSnapshot(`"School"`);
  });

  it('should have isSubclass flag for School', () => {
    expect(metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.isSubclass).toBe(
      true,
    );
  });

  it('should have correct subclassType', () => {
    expect(metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.subclassType).toBe(
      'domainEntity',
    );
  });

  it('should have correct superclassProjectName for School', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.superclassProjectName,
    ).toMatchInlineSnapshot(`"EdFi"`);
  });

  it('should have correct superclassResourceName for School', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.superclassResourceName,
    ).toMatchInlineSnapshot(`"EducationOrganization"`);
  });

  it('should have correct superclassIdentityFullname for School', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools
        .superclassIdentityDocumentKey,
    ).toMatchInlineSnapshot(`"educationOrganizationId"`);
  });

  it('should have correct subclassIdentityFullname for School', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools
        .subclassIdentityDocumentKey,
    ).toMatchInlineSnapshot(`"schoolId"`);
  });

  it('should have correct documentPathsMapping for School', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.schools.documentPathsMapping,
    ).toMatchInlineSnapshot(`
      Object {
        "SchoolId": Object {
          "isReference": false,
          "pathOrder": Array [
            "schoolId",
          ],
          "paths": Object {
            "schoolId": "$.schoolId",
          },
        },
        "SubclassProperty": Object {
          "isReference": false,
          "pathOrder": Array [
            "subclassProperty",
          ],
          "paths": Object {
            "subclassProperty": "$.subclassProperty",
          },
        },
        "SuperclassProperty": Object {
          "isReference": false,
          "pathOrder": Array [
            "superclassProperty",
          ],
          "paths": Object {
            "superclassProperty": "$.superclassProperty",
          },
        },
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

  it('should not have GeneralStudentProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas
        .generalStudentProgramAssociations,
    ).toBeUndefined();
  });

  it('should be correct equalityConstraints for StudentProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentProgramAssociations
        .equalityConstraints,
    ).toMatchInlineSnapshot(`Array []`);
  });

  it('should be correct identityFullnames for StudentProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentProgramAssociations
        .identityFullnames,
    ).toMatchInlineSnapshot(`
      Array [
        "Program",
        "School",
      ]
    `);
  });

  it('should be correct jsonSchemaForInsert for StudentProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentProgramAssociations
        .jsonSchemaForInsert,
    ).toMatchInlineSnapshot(`
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
          "programReference": Object {
            "additionalProperties": false,
            "properties": Object {
              "programId": Object {
                "description": "doc",
                "type": "integer",
              },
              "programName": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "programId",
              "programName",
            ],
            "type": "object",
          },
          "schoolReference": Object {
            "additionalProperties": false,
            "properties": Object {
              "schoolId": Object {
                "description": "doc",
                "type": "integer",
              },
              "schoolName": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "schoolId",
              "schoolName",
            ],
            "type": "object",
          },
          "subclassProperty": Object {
            "description": "doc",
            "type": "integer",
          },
          "superclassProperty": Object {
            "description": "doc",
            "type": "integer",
          },
        },
        "required": Array [
          "subclassProperty",
          "schoolReference",
          "programReference",
          "superclassProperty",
        ],
        "title": "EdFi.StudentProgramAssociation",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForQuery for StudentProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentProgramAssociations
        .jsonSchemaForQuery,
    ).toMatchInlineSnapshot(`
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
          "programReference": Object {
            "additionalProperties": false,
            "properties": Object {
              "programId": Object {
                "description": "doc",
                "type": "integer",
              },
              "programName": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "programId",
              "programName",
            ],
            "type": "object",
          },
          "schoolReference": Object {
            "additionalProperties": false,
            "properties": Object {
              "schoolId": Object {
                "description": "doc",
                "type": "integer",
              },
              "schoolName": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "schoolId",
              "schoolName",
            ],
            "type": "object",
          },
          "subclassProperty": Object {
            "description": "doc",
            "type": "integer",
          },
          "superclassProperty": Object {
            "description": "doc",
            "type": "integer",
          },
        },
        "required": Array [],
        "title": "EdFi.StudentProgramAssociation",
        "type": "object",
      }
    `);
  });

  it('should be correct jsonSchemaForUpdate for StudentProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentProgramAssociations
        .jsonSchemaForUpdate,
    ).toMatchInlineSnapshot(`
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
          "id": Object {
            "description": "The item id",
            "type": "string",
          },
          "programReference": Object {
            "additionalProperties": false,
            "properties": Object {
              "programId": Object {
                "description": "doc",
                "type": "integer",
              },
              "programName": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "programId",
              "programName",
            ],
            "type": "object",
          },
          "schoolReference": Object {
            "additionalProperties": false,
            "properties": Object {
              "schoolId": Object {
                "description": "doc",
                "type": "integer",
              },
              "schoolName": Object {
                "description": "doc",
                "maxLength": 30,
                "type": "string",
              },
            },
            "required": Array [
              "schoolId",
              "schoolName",
            ],
            "type": "object",
          },
          "subclassProperty": Object {
            "description": "doc",
            "type": "integer",
          },
          "superclassProperty": Object {
            "description": "doc",
            "type": "integer",
          },
        },
        "required": Array [
          "id",
          "subclassProperty",
          "schoolReference",
          "programReference",
          "superclassProperty",
        ],
        "title": "EdFi.StudentProgramAssociation",
        "type": "object",
      }
    `);
  });

  it('should be correct resourceName for StudentProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentProgramAssociations
        .resourceName,
    ).toMatchInlineSnapshot(`"StudentProgramAssociation"`);
  });

  it('should have isSubclass flag for StudentProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentProgramAssociations
        .isSubclass,
    ).toBe(true);
  });

  it('should have correct subclassType', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentProgramAssociations
        .subclassType,
    ).toBe('association');
  });

  it('should have correct superclassProjectName for StudentProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentProgramAssociations
        .superclassProjectName,
    ).toMatchInlineSnapshot(`"EdFi"`);
  });

  it('should have correct superclassResourceName for StudentProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentProgramAssociations
        .superclassResourceName,
    ).toMatchInlineSnapshot(`"GeneralStudentProgramAssociation"`);
  });

  it('should have correct documentPathsMapping for StudentProgramAssociation', () => {
    expect(
      metaEd.plugin.get('edfiApiSchema')?.data.apiSchema.projectSchemas.edfi.resourceSchemas.studentProgramAssociations
        .documentPathsMapping,
    ).toMatchInlineSnapshot(`
      Object {
        "Program": Object {
          "isDescriptor": false,
          "isReference": true,
          "pathOrder": Array [
            "programId",
            "programName",
          ],
          "paths": Object {
            "programId": "$.programReference.programId",
            "programName": "$.programReference.programName",
          },
          "projectName": "EdFi",
          "resourceName": "Program",
        },
        "School": Object {
          "isDescriptor": false,
          "isReference": true,
          "pathOrder": Array [
            "schoolId",
            "schoolName",
          ],
          "paths": Object {
            "schoolId": "$.schoolReference.schoolId",
            "schoolName": "$.schoolReference.schoolName",
          },
          "projectName": "EdFi",
          "resourceName": "School",
        },
        "SubclassProperty": Object {
          "isReference": false,
          "pathOrder": Array [
            "subclassProperty",
          ],
          "paths": Object {
            "subclassProperty": "$.subclassProperty",
          },
        },
        "SuperclassProperty": Object {
          "isReference": false,
          "pathOrder": Array [
            "superclassProperty",
          ],
          "paths": Object {
            "superclassProperty": "$.superclassProperty",
          },
        },
      }
    `);
  });
});
