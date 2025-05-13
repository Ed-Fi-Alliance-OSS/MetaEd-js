// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  ChoiceBuilder,
  CommonBuilder,
  DescriptorBuilder,
  DomainEntityBuilder,
  DomainEntityExtensionBuilder,
  DomainEntitySubclassBuilder,
  MetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
  newNamespace,
  newPluginEnvironment,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  choiceReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  descriptorReferenceEnhancer,
  domainEntityExtensionBaseClassEnhancer,
  commonReferenceEnhancer,
  domainEntitySubclassBaseClassEnhancer,
} from '@edfi/metaed-plugin-edfi-unified';
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
import { enhance as resourceNameEnhancer } from '../../src/enhancer/ResourceNameEnhancer';
import { enhance as jsonSchemaEnhancerForInsert } from '../../src/enhancer/JsonSchemaForInsertEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as mergeDirectiveEqualityConstraintEnhancer } from '../../src/enhancer/MergeDirectiveEqualityConstraintEnhancer';
import { enhance as openApiRequestBodyComponentEnhancer } from '../../src/enhancer/OpenApiRequestBodyComponentEnhancer';
import { enhance as openApiReferenceComponentEnhancer } from '../../src/enhancer/OpenApiReferenceComponentEnhancer';
import { enhance as openApiRequestBodyCollectionComponentEnhancer } from '../../src/enhancer/OpenApiRequestBodyCollectionComponentEnhancer';
import { enhance as openApiRequestBodyCollectionComponentSubclassEnhancer } from '../../src/enhancer/OpenApiRequestBodyCollectionComponentSubclassEnhancer';
import { enhance as identityFullnameEnhancer } from '../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as subclassIdentityFullnameEnhancer } from '../../src/enhancer/SubclassIdentityFullnameEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as queryFieldMappingEnhancer } from '../../src/enhancer/QueryFieldMappingEnhancer';
import { enhance as openApiCoreSpecificationEnhancer } from '../../src/enhancer/OpenApiCoreSpecificationEnhancer';
import { enhance } from '../../src/enhancer/OpenApiExtensionFragmentEnhancer';

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
  resourceNameEnhancer(metaEd);
  jsonSchemaEnhancerForInsert(metaEd);
  allJsonPathsMappingEnhancer(metaEd);
  mergeDirectiveEqualityConstraintEnhancer(metaEd);
  resourceNameEnhancer(metaEd);
  identityFullnameEnhancer(metaEd);
  subclassIdentityFullnameEnhancer(metaEd);
  documentPathsMappingEnhancer(metaEd);
  queryFieldMappingEnhancer(metaEd);
  openApiRequestBodyComponentEnhancer(metaEd);
  openApiReferenceComponentEnhancer(metaEd);
  openApiRequestBodyCollectionComponentEnhancer(metaEd);
  openApiRequestBodyCollectionComponentSubclassEnhancer(metaEd);
}

describe('when building simple domain entity with all the simple non-collections', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Extension';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, namespaceName)
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
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be correct openApiExtensionResourceFragments', () => {
    const { openApiExtensionResourceFragments } = namespace.data.edfiApiSchema;
    expect(openApiExtensionResourceFragments.newPaths).toMatchInlineSnapshot(`
      Object {
        "/extension/domainEntityNames": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getExtensionDomainEntityName",
            "parameters": Array [
              Object {
                "$ref": "#/components/parameters/offset",
              },
              Object {
                "$ref": "#/components/parameters/limit",
              },
              Object {
                "$ref": "#/components/parameters/MinChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/MaxChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/totalCount",
              },
              Object {
                "description": "",
                "in": "query",
                "name": "id",
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "description": "doc1",
                "in": "query",
                "name": "optionalBooleanProperty",
                "schema": Object {
                  "type": "boolean",
                },
              },
              Object {
                "description": "doc2",
                "in": "query",
                "name": "requiredCurrencyProperty",
                "schema": Object {
                  "format": "double",
                  "type": "number",
                },
              },
              Object {
                "description": "doc3",
                "in": "query",
                "name": "optionalDecimalProperty",
                "schema": Object {
                  "format": "double",
                  "type": "number",
                },
              },
              Object {
                "description": "doc4",
                "in": "query",
                "name": "requiredDurationProperty",
                "schema": Object {
                  "maxLength": 30,
                  "type": "string",
                },
              },
              Object {
                "description": "doc5",
                "in": "query",
                "name": "optionalPercentProperty",
                "schema": Object {
                  "format": "double",
                  "type": "number",
                },
              },
              Object {
                "description": "doc6",
                "in": "query",
                "name": "requiredDateProperty",
                "schema": Object {
                  "format": "date",
                  "type": "string",
                },
              },
              Object {
                "description": "doc7",
                "in": "query",
                "name": "requiredDatetimeProperty",
                "schema": Object {
                  "format": "date-time",
                  "type": "string",
                },
              },
              Object {
                "description": "doc8",
                "in": "query",
                "name": "requiredIntegerProperty",
                "schema": Object {
                  "format": "int32",
                  "type": "integer",
                },
              },
              Object {
                "description": "doc9",
                "in": "query",
                "name": "optionalShortProperty",
                "schema": Object {
                  "format": "int32",
                  "type": "integer",
                },
              },
              Object {
                "description": "doc10",
                "in": "query",
                "name": "stringIdentity",
                "schema": Object {
                  "maxLength": 30,
                  "minLength": 20,
                  "type": "string",
                },
                "x-Ed-Fi-isIdentity": true,
              },
              Object {
                "description": "doc11",
                "in": "query",
                "name": "requiredTimeProperty",
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "description": "doc12",
                "in": "query",
                "name": "schoolYear",
                "schema": Object {
                  "format": "int32",
                  "type": "integer",
                },
              },
              Object {
                "description": "doc13",
                "in": "query",
                "name": "optionalYear",
                "schema": Object {
                  "format": "int32",
                  "type": "integer",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "items": Object {
                        "$ref": "#/components/schemas/Extension_DomainEntityName",
                      },
                      "type": "array",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves specific resources using the resource's property values (using the \\"Get\\" pattern).",
            "tags": Array [
              "domainEntityNames",
            ],
          },
          "post": Object {
            "description": "The POST operation can be used to create or update resources. In database terms, this is often referred to as an \\"upsert\\" operation (insert + update). Clients should NOT include the resource \\"id\\" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.",
            "operationId": "postExtensionDomainEntityName",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_DomainEntityName",
                  },
                },
              },
              "description": "The JSON representation of the DomainEntityName resource to be created or updated.",
              "required": true,
              "x-bodyName": "DomainEntityName",
            },
            "responses": Object {
              "200": Object {
                "$ref": "#/components/responses/Updated",
              },
              "201": Object {
                "$ref": "#/components/responses/Created",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Creates or updates resources based on the natural key values of the supplied resource.",
            "tags": Array [
              "domainEntityNames",
            ],
          },
        },
        "/extension/domainEntityNames/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteExtensionDomainEntityNamesById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
            ],
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Deletes an existing resource using the resource identifier.",
            "tags": Array [
              "domainEntityNames",
            ],
          },
          "get": Object {
            "description": "This GET operation retrieves a resource by the specified resource identifier.",
            "operationId": "getExtensionDomainEntityNamesById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "$ref": "#/components/schemas/Extension_DomainEntityName",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves a specific resource using the resource's identifier (using the \\"Get By Id\\" pattern).",
            "tags": Array [
              "domainEntityNames",
            ],
          },
          "put": Object {
            "description": "The PUT operation is used to update a resource by identifier. If the resource identifier (\\"id\\") is provided in the JSON body, it will be ignored. Additionally, this API resource is not configured for cascading natural key updates. Natural key values for this resource cannot be changed using PUT operation, so the recommendation is to use POST as that supports upsert behavior.",
            "operationId": "putExtensionDomainEntityName",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_DomainEntityName",
                  },
                },
              },
              "description": "The JSON representation of the DomainEntityName resource to be created or updated.",
            },
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Updates a resource based on the resource identifier.",
            "tags": Array [
              "domainEntityNames",
            ],
          },
        },
      }
    `);
    expect(openApiExtensionResourceFragments.newSchemas).toMatchInlineSnapshot(`
      Object {
        "Extension_DomainEntityName": Object {
          "description": "doc",
          "properties": Object {
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
              "$ref": "#/components/schemas/EdFi_SchoolYearTypeReference",
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
          "type": "object",
        },
        "Extension_DomainEntityName_Reference": Object {
          "properties": Object {
            "stringIdentity": Object {
              "description": "doc10",
              "maxLength": 30,
              "minLength": 20,
              "type": "string",
            },
          },
          "required": Array [
            "stringIdentity",
          ],
          "type": "object",
        },
      }
    `);
    expect(openApiExtensionResourceFragments.exts).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionResourceFragments.newTags).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "doc",
          "name": "domainEntityNames",
        },
      ]
    `);
  });

  it('should be correct openApiExtensionDescriptorFragments', () => {
    const { openApiExtensionDescriptorFragments } = namespace.data.edfiApiSchema;
    expect(openApiExtensionDescriptorFragments.newPaths).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionDescriptorFragments.newSchemas).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionDescriptorFragments.exts).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionDescriptorFragments.newTags).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building simple domain entity with all the simple collections', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Extension';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, namespaceName)
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
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be correct openApiExtensionResourceFragments', () => {
    const { openApiExtensionResourceFragments } = namespace.data.edfiApiSchema;
    expect(openApiExtensionResourceFragments.newPaths).toMatchInlineSnapshot(`
      Object {
        "/extension/domainEntityNames": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getExtensionDomainEntityName",
            "parameters": Array [
              Object {
                "$ref": "#/components/parameters/offset",
              },
              Object {
                "$ref": "#/components/parameters/limit",
              },
              Object {
                "$ref": "#/components/parameters/MinChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/MaxChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/totalCount",
              },
              Object {
                "description": "",
                "in": "query",
                "name": "id",
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "description": "doc10",
                "in": "query",
                "name": "stringIdentity",
                "schema": Object {
                  "maxLength": 30,
                  "minLength": 20,
                  "type": "string",
                },
                "x-Ed-Fi-isIdentity": true,
              },
              Object {
                "description": "doc13",
                "in": "query",
                "name": "schoolYear",
                "schema": Object {
                  "format": "int32",
                  "type": "integer",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "items": Object {
                        "$ref": "#/components/schemas/Extension_DomainEntityName",
                      },
                      "type": "array",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves specific resources using the resource's property values (using the \\"Get\\" pattern).",
            "tags": Array [
              "domainEntityNames",
            ],
          },
          "post": Object {
            "description": "The POST operation can be used to create or update resources. In database terms, this is often referred to as an \\"upsert\\" operation (insert + update). Clients should NOT include the resource \\"id\\" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.",
            "operationId": "postExtensionDomainEntityName",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_DomainEntityName",
                  },
                },
              },
              "description": "The JSON representation of the DomainEntityName resource to be created or updated.",
              "required": true,
              "x-bodyName": "DomainEntityName",
            },
            "responses": Object {
              "200": Object {
                "$ref": "#/components/responses/Updated",
              },
              "201": Object {
                "$ref": "#/components/responses/Created",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Creates or updates resources based on the natural key values of the supplied resource.",
            "tags": Array [
              "domainEntityNames",
            ],
          },
        },
        "/extension/domainEntityNames/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteExtensionDomainEntityNamesById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
            ],
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Deletes an existing resource using the resource identifier.",
            "tags": Array [
              "domainEntityNames",
            ],
          },
          "get": Object {
            "description": "This GET operation retrieves a resource by the specified resource identifier.",
            "operationId": "getExtensionDomainEntityNamesById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "$ref": "#/components/schemas/Extension_DomainEntityName",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves a specific resource using the resource's identifier (using the \\"Get By Id\\" pattern).",
            "tags": Array [
              "domainEntityNames",
            ],
          },
          "put": Object {
            "description": "The PUT operation is used to update a resource by identifier. If the resource identifier (\\"id\\") is provided in the JSON body, it will be ignored. Additionally, this API resource is not configured for cascading natural key updates. Natural key values for this resource cannot be changed using PUT operation, so the recommendation is to use POST as that supports upsert behavior.",
            "operationId": "putExtensionDomainEntityName",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_DomainEntityName",
                  },
                },
              },
              "description": "The JSON representation of the DomainEntityName resource to be created or updated.",
            },
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Updates a resource based on the resource identifier.",
            "tags": Array [
              "domainEntityNames",
            ],
          },
        },
      }
    `);
    expect(openApiExtensionResourceFragments.newSchemas).toMatchInlineSnapshot(`
      Object {
        "Extension_DomainEntityName": Object {
          "description": "doc",
          "properties": Object {
            "optionalBooleanProperties": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_DomainEntityName_OptionalBooleanProperty",
              },
              "minItems": 0,
              "type": "array",
              "uniqueItems": false,
            },
            "optionalDecimalProperties": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_DomainEntityName_OptionalDecimalProperty",
              },
              "minItems": 0,
              "type": "array",
              "uniqueItems": false,
            },
            "optionalPercentProperties": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_DomainEntityName_OptionalPercentProperty",
              },
              "minItems": 0,
              "type": "array",
              "uniqueItems": false,
            },
            "optionalShortProperties": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_DomainEntityName_OptionalShortProperty",
              },
              "minItems": 0,
              "type": "array",
              "uniqueItems": false,
            },
            "optionalYears": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_DomainEntityName_OptionalYear",
              },
              "minItems": 0,
              "type": "array",
              "uniqueItems": false,
            },
            "requiredCurrencyProperties": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_DomainEntityName_RequiredCurrencyProperty",
              },
              "minItems": 1,
              "type": "array",
              "uniqueItems": false,
            },
            "requiredDateProperties": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_DomainEntityName_RequiredDateProperty",
              },
              "minItems": 1,
              "type": "array",
              "uniqueItems": false,
            },
            "requiredDatetimeProperties": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_DomainEntityName_RequiredDatetimeProperty",
              },
              "minItems": 1,
              "type": "array",
              "uniqueItems": false,
            },
            "requiredDurationProperties": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_DomainEntityName_RequiredDurationProperty",
              },
              "minItems": 1,
              "type": "array",
              "uniqueItems": false,
            },
            "requiredIntegerProperties": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_DomainEntityName_RequiredIntegerProperty",
              },
              "minItems": 1,
              "type": "array",
              "uniqueItems": false,
            },
            "requiredStringProperties": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_DomainEntityName_RequiredStringProperty",
              },
              "minItems": 1,
              "type": "array",
              "uniqueItems": false,
            },
            "requiredTimeProperties": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_DomainEntityName_RequiredTimeProperty",
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
        },
        "Extension_DomainEntityName_OptionalBooleanProperty": Object {
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
        "Extension_DomainEntityName_OptionalDecimalProperty": Object {
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
        "Extension_DomainEntityName_OptionalPercentProperty": Object {
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
        "Extension_DomainEntityName_OptionalShortProperty": Object {
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
        "Extension_DomainEntityName_OptionalYear": Object {
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
        "Extension_DomainEntityName_Reference": Object {
          "properties": Object {
            "stringIdentity": Object {
              "description": "doc10",
              "maxLength": 30,
              "minLength": 20,
              "type": "string",
            },
          },
          "required": Array [
            "stringIdentity",
          ],
          "type": "object",
        },
        "Extension_DomainEntityName_RequiredCurrencyProperty": Object {
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
        "Extension_DomainEntityName_RequiredDateProperty": Object {
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
        "Extension_DomainEntityName_RequiredDatetimeProperty": Object {
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
        "Extension_DomainEntityName_RequiredDurationProperty": Object {
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
        "Extension_DomainEntityName_RequiredIntegerProperty": Object {
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
        "Extension_DomainEntityName_RequiredStringProperty": Object {
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
        "Extension_DomainEntityName_RequiredTimeProperty": Object {
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
        "Extension_DomainEntityName_SchoolYear": Object {
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
      }
    `);
    expect(openApiExtensionResourceFragments.exts).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionResourceFragments.newTags).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "doc",
          "name": "domainEntityNames",
        },
      ]
    `);
  });

  it('should be correct openApiExtensionDescriptorFragments', () => {
    const { openApiExtensionDescriptorFragments } = namespace.data.edfiApiSchema;
    expect(openApiExtensionDescriptorFragments.newPaths).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionDescriptorFragments.newSchemas).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionDescriptorFragments.exts).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionDescriptorFragments.newTags).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building a domain entity referencing another referencing another with identity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Extension';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, namespaceName)
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
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be correct openApiExtensionResourceFragments', () => {
    const { openApiExtensionResourceFragments } = namespace.data.edfiApiSchema;
    expect(openApiExtensionResourceFragments.newPaths).toMatchInlineSnapshot(`
      Object {
        "/extension/classPeriods": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getExtensionClassPeriod",
            "parameters": Array [
              Object {
                "$ref": "#/components/parameters/offset",
              },
              Object {
                "$ref": "#/components/parameters/limit",
              },
              Object {
                "$ref": "#/components/parameters/MinChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/MaxChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/totalCount",
              },
              Object {
                "description": "",
                "in": "query",
                "name": "id",
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "description": "doc",
                "in": "query",
                "name": "classPeriodName",
                "schema": Object {
                  "maxLength": 30,
                  "type": "string",
                },
                "x-Ed-Fi-isIdentity": true,
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "items": Object {
                        "$ref": "#/components/schemas/Extension_ClassPeriod",
                      },
                      "type": "array",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves specific resources using the resource's property values (using the \\"Get\\" pattern).",
            "tags": Array [
              "classPeriods",
            ],
          },
          "post": Object {
            "description": "The POST operation can be used to create or update resources. In database terms, this is often referred to as an \\"upsert\\" operation (insert + update). Clients should NOT include the resource \\"id\\" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.",
            "operationId": "postExtensionClassPeriod",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_ClassPeriod",
                  },
                },
              },
              "description": "The JSON representation of the ClassPeriod resource to be created or updated.",
              "required": true,
              "x-bodyName": "ClassPeriod",
            },
            "responses": Object {
              "200": Object {
                "$ref": "#/components/responses/Updated",
              },
              "201": Object {
                "$ref": "#/components/responses/Created",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Creates or updates resources based on the natural key values of the supplied resource.",
            "tags": Array [
              "classPeriods",
            ],
          },
        },
        "/extension/classPeriods/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteExtensionClassPeriodsById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
            ],
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Deletes an existing resource using the resource identifier.",
            "tags": Array [
              "classPeriods",
            ],
          },
          "get": Object {
            "description": "This GET operation retrieves a resource by the specified resource identifier.",
            "operationId": "getExtensionClassPeriodsById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "$ref": "#/components/schemas/Extension_ClassPeriod",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves a specific resource using the resource's identifier (using the \\"Get By Id\\" pattern).",
            "tags": Array [
              "classPeriods",
            ],
          },
          "put": Object {
            "description": "The PUT operation is used to update a resource by identifier. If the resource identifier (\\"id\\") is provided in the JSON body, it will be ignored. Additionally, this API resource is not configured for cascading natural key updates. Natural key values for this resource cannot be changed using PUT operation, so the recommendation is to use POST as that supports upsert behavior.",
            "operationId": "putExtensionClassPeriod",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_ClassPeriod",
                  },
                },
              },
              "description": "The JSON representation of the ClassPeriod resource to be created or updated.",
            },
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Updates a resource based on the resource identifier.",
            "tags": Array [
              "classPeriods",
            ],
          },
        },
        "/extension/courseOfferings": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getExtensionCourseOffering",
            "parameters": Array [
              Object {
                "$ref": "#/components/parameters/offset",
              },
              Object {
                "$ref": "#/components/parameters/limit",
              },
              Object {
                "$ref": "#/components/parameters/MinChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/MaxChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/totalCount",
              },
              Object {
                "description": "",
                "in": "query",
                "name": "id",
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "description": "doc",
                "in": "query",
                "name": "localCourseCode",
                "schema": Object {
                  "maxLength": 30,
                  "type": "string",
                },
                "x-Ed-Fi-isIdentity": true,
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "items": Object {
                        "$ref": "#/components/schemas/Extension_CourseOffering",
                      },
                      "type": "array",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves specific resources using the resource's property values (using the \\"Get\\" pattern).",
            "tags": Array [
              "courseOfferings",
            ],
          },
          "post": Object {
            "description": "The POST operation can be used to create or update resources. In database terms, this is often referred to as an \\"upsert\\" operation (insert + update). Clients should NOT include the resource \\"id\\" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.",
            "operationId": "postExtensionCourseOffering",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_CourseOffering",
                  },
                },
              },
              "description": "The JSON representation of the CourseOffering resource to be created or updated.",
              "required": true,
              "x-bodyName": "CourseOffering",
            },
            "responses": Object {
              "200": Object {
                "$ref": "#/components/responses/Updated",
              },
              "201": Object {
                "$ref": "#/components/responses/Created",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Creates or updates resources based on the natural key values of the supplied resource.",
            "tags": Array [
              "courseOfferings",
            ],
          },
        },
        "/extension/courseOfferings/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteExtensionCourseOfferingsById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
            ],
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Deletes an existing resource using the resource identifier.",
            "tags": Array [
              "courseOfferings",
            ],
          },
          "get": Object {
            "description": "This GET operation retrieves a resource by the specified resource identifier.",
            "operationId": "getExtensionCourseOfferingsById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "$ref": "#/components/schemas/Extension_CourseOffering",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves a specific resource using the resource's identifier (using the \\"Get By Id\\" pattern).",
            "tags": Array [
              "courseOfferings",
            ],
          },
          "put": Object {
            "description": "The PUT operation is used to update a resource by identifier. If the resource identifier (\\"id\\") is provided in the JSON body, it will be ignored. Additionally, this API resource is not configured for cascading natural key updates. Natural key values for this resource cannot be changed using PUT operation, so the recommendation is to use POST as that supports upsert behavior.",
            "operationId": "putExtensionCourseOffering",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_CourseOffering",
                  },
                },
              },
              "description": "The JSON representation of the CourseOffering resource to be created or updated.",
            },
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Updates a resource based on the resource identifier.",
            "tags": Array [
              "courseOfferings",
            ],
          },
        },
        "/extension/domainEntityNames": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getExtensionDomainEntityName",
            "parameters": Array [
              Object {
                "$ref": "#/components/parameters/offset",
              },
              Object {
                "$ref": "#/components/parameters/limit",
              },
              Object {
                "$ref": "#/components/parameters/MinChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/MaxChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/totalCount",
              },
              Object {
                "description": "",
                "in": "query",
                "name": "id",
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "description": "doc",
                "in": "query",
                "name": "sectionIdentifier",
                "schema": Object {
                  "maxLength": 30,
                  "type": "string",
                },
                "x-Ed-Fi-isIdentity": true,
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "items": Object {
                        "$ref": "#/components/schemas/Extension_DomainEntityName",
                      },
                      "type": "array",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves specific resources using the resource's property values (using the \\"Get\\" pattern).",
            "tags": Array [
              "domainEntityNames",
            ],
          },
          "post": Object {
            "description": "The POST operation can be used to create or update resources. In database terms, this is often referred to as an \\"upsert\\" operation (insert + update). Clients should NOT include the resource \\"id\\" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.",
            "operationId": "postExtensionDomainEntityName",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_DomainEntityName",
                  },
                },
              },
              "description": "The JSON representation of the DomainEntityName resource to be created or updated.",
              "required": true,
              "x-bodyName": "DomainEntityName",
            },
            "responses": Object {
              "200": Object {
                "$ref": "#/components/responses/Updated",
              },
              "201": Object {
                "$ref": "#/components/responses/Created",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Creates or updates resources based on the natural key values of the supplied resource.",
            "tags": Array [
              "domainEntityNames",
            ],
          },
        },
        "/extension/domainEntityNames/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteExtensionDomainEntityNamesById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
            ],
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Deletes an existing resource using the resource identifier.",
            "tags": Array [
              "domainEntityNames",
            ],
          },
          "get": Object {
            "description": "This GET operation retrieves a resource by the specified resource identifier.",
            "operationId": "getExtensionDomainEntityNamesById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "$ref": "#/components/schemas/Extension_DomainEntityName",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves a specific resource using the resource's identifier (using the \\"Get By Id\\" pattern).",
            "tags": Array [
              "domainEntityNames",
            ],
          },
          "put": Object {
            "description": "The PUT operation is used to update a resource by identifier. If the resource identifier (\\"id\\") is provided in the JSON body, it will be ignored. Additionally, this API resource is not configured for cascading natural key updates. Natural key values for this resource cannot be changed using PUT operation, so the recommendation is to use POST as that supports upsert behavior.",
            "operationId": "putExtensionDomainEntityName",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_DomainEntityName",
                  },
                },
              },
              "description": "The JSON representation of the DomainEntityName resource to be created or updated.",
            },
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Updates a resource based on the resource identifier.",
            "tags": Array [
              "domainEntityNames",
            ],
          },
        },
        "/extension/schools": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getExtensionSchool",
            "parameters": Array [
              Object {
                "$ref": "#/components/parameters/offset",
              },
              Object {
                "$ref": "#/components/parameters/limit",
              },
              Object {
                "$ref": "#/components/parameters/MinChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/MaxChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/totalCount",
              },
              Object {
                "description": "",
                "in": "query",
                "name": "id",
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "description": "doc",
                "in": "query",
                "name": "schoolId",
                "schema": Object {
                  "maxLength": 30,
                  "type": "string",
                },
                "x-Ed-Fi-isIdentity": true,
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "items": Object {
                        "$ref": "#/components/schemas/Extension_School",
                      },
                      "type": "array",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves specific resources using the resource's property values (using the \\"Get\\" pattern).",
            "tags": Array [
              "schools",
            ],
          },
          "post": Object {
            "description": "The POST operation can be used to create or update resources. In database terms, this is often referred to as an \\"upsert\\" operation (insert + update). Clients should NOT include the resource \\"id\\" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.",
            "operationId": "postExtensionSchool",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_School",
                  },
                },
              },
              "description": "The JSON representation of the School resource to be created or updated.",
              "required": true,
              "x-bodyName": "School",
            },
            "responses": Object {
              "200": Object {
                "$ref": "#/components/responses/Updated",
              },
              "201": Object {
                "$ref": "#/components/responses/Created",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Creates or updates resources based on the natural key values of the supplied resource.",
            "tags": Array [
              "schools",
            ],
          },
        },
        "/extension/schools/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteExtensionSchoolsById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
            ],
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Deletes an existing resource using the resource identifier.",
            "tags": Array [
              "schools",
            ],
          },
          "get": Object {
            "description": "This GET operation retrieves a resource by the specified resource identifier.",
            "operationId": "getExtensionSchoolsById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "$ref": "#/components/schemas/Extension_School",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves a specific resource using the resource's identifier (using the \\"Get By Id\\" pattern).",
            "tags": Array [
              "schools",
            ],
          },
          "put": Object {
            "description": "The PUT operation is used to update a resource by identifier. If the resource identifier (\\"id\\") is provided in the JSON body, it will be ignored. Additionally, this API resource is not configured for cascading natural key updates. Natural key values for this resource cannot be changed using PUT operation, so the recommendation is to use POST as that supports upsert behavior.",
            "operationId": "putExtensionSchool",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_School",
                  },
                },
              },
              "description": "The JSON representation of the School resource to be created or updated.",
            },
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Updates a resource based on the resource identifier.",
            "tags": Array [
              "schools",
            ],
          },
        },
      }
    `);
    expect(openApiExtensionResourceFragments.newSchemas).toMatchInlineSnapshot(`
      Object {
        "Extension_ClassPeriod": Object {
          "description": "doc",
          "properties": Object {
            "classPeriodName": Object {
              "description": "doc",
              "maxLength": 30,
              "type": "string",
            },
            "schoolReference": Object {
              "$ref": "#/components/schemas/Extension_School_Reference",
            },
          },
          "required": Array [
            "classPeriodName",
            "schoolReference",
          ],
          "type": "object",
        },
        "Extension_ClassPeriod_Reference": Object {
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
        "Extension_CourseOffering": Object {
          "description": "doc",
          "properties": Object {
            "localCourseCode": Object {
              "description": "doc",
              "maxLength": 30,
              "type": "string",
            },
            "schoolReference": Object {
              "$ref": "#/components/schemas/Extension_School_Reference",
            },
          },
          "required": Array [
            "localCourseCode",
            "schoolReference",
          ],
          "type": "object",
        },
        "Extension_CourseOffering_Reference": Object {
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
        "Extension_DomainEntityName": Object {
          "description": "doc",
          "properties": Object {
            "classPeriods": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_DomainEntityName_ClassPeriod",
              },
              "minItems": 1,
              "type": "array",
              "uniqueItems": false,
            },
            "courseOfferingReference": Object {
              "$ref": "#/components/schemas/Extension_CourseOffering_Reference",
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
          "type": "object",
        },
        "Extension_DomainEntityName_ClassPeriod": Object {
          "properties": Object {
            "classPeriodReference": Object {
              "$ref": "#/components/schemas/Extension_ClassPeriod_Reference",
            },
          },
          "required": Array [
            "classPeriodReference",
          ],
          "type": "object",
        },
        "Extension_DomainEntityName_Reference": Object {
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
            "sectionIdentifier": Object {
              "description": "doc",
              "maxLength": 30,
              "type": "string",
            },
          },
          "required": Array [
            "localCourseCode",
            "schoolId",
            "sectionIdentifier",
          ],
          "type": "object",
        },
        "Extension_School": Object {
          "description": "doc",
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
        "Extension_School_Reference": Object {
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
      }
    `);
    expect(openApiExtensionResourceFragments.exts).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionResourceFragments.newTags).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "doc",
          "name": "classPeriods",
        },
        Object {
          "description": "doc",
          "name": "courseOfferings",
        },
        Object {
          "description": "doc",
          "name": "domainEntityNames",
        },
        Object {
          "description": "doc",
          "name": "schools",
        },
      ]
    `);
  });

  it('should be correct openApiExtensionDescriptorFragments', () => {
    const { openApiExtensionDescriptorFragments } = namespace.data.edfiApiSchema;
    expect(openApiExtensionDescriptorFragments.newPaths).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionDescriptorFragments.newSchemas).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionDescriptorFragments.exts).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionDescriptorFragments.newTags).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building a domain entity referencing CourseOffering with an implicit merge between School and Session.School', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Extension';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, namespaceName)
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
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be correct openApiExtensionResourceFragments', () => {
    const { openApiExtensionResourceFragments } = namespace.data.edfiApiSchema;
    expect(openApiExtensionResourceFragments.newPaths).toMatchInlineSnapshot(`
      Object {
        "/extension/courseOfferings": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getExtensionCourseOffering",
            "parameters": Array [
              Object {
                "$ref": "#/components/parameters/offset",
              },
              Object {
                "$ref": "#/components/parameters/limit",
              },
              Object {
                "$ref": "#/components/parameters/MinChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/MaxChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/totalCount",
              },
              Object {
                "description": "",
                "in": "query",
                "name": "id",
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "description": "doc",
                "in": "query",
                "name": "localCourseCode",
                "schema": Object {
                  "maxLength": 30,
                  "type": "string",
                },
                "x-Ed-Fi-isIdentity": true,
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "items": Object {
                        "$ref": "#/components/schemas/Extension_CourseOffering",
                      },
                      "type": "array",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves specific resources using the resource's property values (using the \\"Get\\" pattern).",
            "tags": Array [
              "courseOfferings",
            ],
          },
          "post": Object {
            "description": "The POST operation can be used to create or update resources. In database terms, this is often referred to as an \\"upsert\\" operation (insert + update). Clients should NOT include the resource \\"id\\" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.",
            "operationId": "postExtensionCourseOffering",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_CourseOffering",
                  },
                },
              },
              "description": "The JSON representation of the CourseOffering resource to be created or updated.",
              "required": true,
              "x-bodyName": "CourseOffering",
            },
            "responses": Object {
              "200": Object {
                "$ref": "#/components/responses/Updated",
              },
              "201": Object {
                "$ref": "#/components/responses/Created",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Creates or updates resources based on the natural key values of the supplied resource.",
            "tags": Array [
              "courseOfferings",
            ],
          },
        },
        "/extension/courseOfferings/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteExtensionCourseOfferingsById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
            ],
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Deletes an existing resource using the resource identifier.",
            "tags": Array [
              "courseOfferings",
            ],
          },
          "get": Object {
            "description": "This GET operation retrieves a resource by the specified resource identifier.",
            "operationId": "getExtensionCourseOfferingsById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "$ref": "#/components/schemas/Extension_CourseOffering",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves a specific resource using the resource's identifier (using the \\"Get By Id\\" pattern).",
            "tags": Array [
              "courseOfferings",
            ],
          },
          "put": Object {
            "description": "The PUT operation is used to update a resource by identifier. If the resource identifier (\\"id\\") is provided in the JSON body, it will be ignored. Additionally, this API resource is not configured for cascading natural key updates. Natural key values for this resource cannot be changed using PUT operation, so the recommendation is to use POST as that supports upsert behavior.",
            "operationId": "putExtensionCourseOffering",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_CourseOffering",
                  },
                },
              },
              "description": "The JSON representation of the CourseOffering resource to be created or updated.",
            },
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Updates a resource based on the resource identifier.",
            "tags": Array [
              "courseOfferings",
            ],
          },
        },
        "/extension/domainEntityNames": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getExtensionDomainEntityName",
            "parameters": Array [
              Object {
                "$ref": "#/components/parameters/offset",
              },
              Object {
                "$ref": "#/components/parameters/limit",
              },
              Object {
                "$ref": "#/components/parameters/MinChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/MaxChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/totalCount",
              },
              Object {
                "description": "",
                "in": "query",
                "name": "id",
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "description": "doc",
                "in": "query",
                "name": "sectionIdentifier",
                "schema": Object {
                  "maxLength": 30,
                  "type": "string",
                },
                "x-Ed-Fi-isIdentity": true,
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "items": Object {
                        "$ref": "#/components/schemas/Extension_DomainEntityName",
                      },
                      "type": "array",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves specific resources using the resource's property values (using the \\"Get\\" pattern).",
            "tags": Array [
              "domainEntityNames",
            ],
          },
          "post": Object {
            "description": "The POST operation can be used to create or update resources. In database terms, this is often referred to as an \\"upsert\\" operation (insert + update). Clients should NOT include the resource \\"id\\" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.",
            "operationId": "postExtensionDomainEntityName",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_DomainEntityName",
                  },
                },
              },
              "description": "The JSON representation of the DomainEntityName resource to be created or updated.",
              "required": true,
              "x-bodyName": "DomainEntityName",
            },
            "responses": Object {
              "200": Object {
                "$ref": "#/components/responses/Updated",
              },
              "201": Object {
                "$ref": "#/components/responses/Created",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Creates or updates resources based on the natural key values of the supplied resource.",
            "tags": Array [
              "domainEntityNames",
            ],
          },
        },
        "/extension/domainEntityNames/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteExtensionDomainEntityNamesById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
            ],
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Deletes an existing resource using the resource identifier.",
            "tags": Array [
              "domainEntityNames",
            ],
          },
          "get": Object {
            "description": "This GET operation retrieves a resource by the specified resource identifier.",
            "operationId": "getExtensionDomainEntityNamesById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "$ref": "#/components/schemas/Extension_DomainEntityName",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves a specific resource using the resource's identifier (using the \\"Get By Id\\" pattern).",
            "tags": Array [
              "domainEntityNames",
            ],
          },
          "put": Object {
            "description": "The PUT operation is used to update a resource by identifier. If the resource identifier (\\"id\\") is provided in the JSON body, it will be ignored. Additionally, this API resource is not configured for cascading natural key updates. Natural key values for this resource cannot be changed using PUT operation, so the recommendation is to use POST as that supports upsert behavior.",
            "operationId": "putExtensionDomainEntityName",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_DomainEntityName",
                  },
                },
              },
              "description": "The JSON representation of the DomainEntityName resource to be created or updated.",
            },
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Updates a resource based on the resource identifier.",
            "tags": Array [
              "domainEntityNames",
            ],
          },
        },
        "/extension/schools": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getExtensionSchool",
            "parameters": Array [
              Object {
                "$ref": "#/components/parameters/offset",
              },
              Object {
                "$ref": "#/components/parameters/limit",
              },
              Object {
                "$ref": "#/components/parameters/MinChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/MaxChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/totalCount",
              },
              Object {
                "description": "",
                "in": "query",
                "name": "id",
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "description": "doc",
                "in": "query",
                "name": "schoolId",
                "schema": Object {
                  "maxLength": 30,
                  "type": "string",
                },
                "x-Ed-Fi-isIdentity": true,
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "items": Object {
                        "$ref": "#/components/schemas/Extension_School",
                      },
                      "type": "array",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves specific resources using the resource's property values (using the \\"Get\\" pattern).",
            "tags": Array [
              "schools",
            ],
          },
          "post": Object {
            "description": "The POST operation can be used to create or update resources. In database terms, this is often referred to as an \\"upsert\\" operation (insert + update). Clients should NOT include the resource \\"id\\" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.",
            "operationId": "postExtensionSchool",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_School",
                  },
                },
              },
              "description": "The JSON representation of the School resource to be created or updated.",
              "required": true,
              "x-bodyName": "School",
            },
            "responses": Object {
              "200": Object {
                "$ref": "#/components/responses/Updated",
              },
              "201": Object {
                "$ref": "#/components/responses/Created",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Creates or updates resources based on the natural key values of the supplied resource.",
            "tags": Array [
              "schools",
            ],
          },
        },
        "/extension/schools/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteExtensionSchoolsById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
            ],
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Deletes an existing resource using the resource identifier.",
            "tags": Array [
              "schools",
            ],
          },
          "get": Object {
            "description": "This GET operation retrieves a resource by the specified resource identifier.",
            "operationId": "getExtensionSchoolsById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "$ref": "#/components/schemas/Extension_School",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves a specific resource using the resource's identifier (using the \\"Get By Id\\" pattern).",
            "tags": Array [
              "schools",
            ],
          },
          "put": Object {
            "description": "The PUT operation is used to update a resource by identifier. If the resource identifier (\\"id\\") is provided in the JSON body, it will be ignored. Additionally, this API resource is not configured for cascading natural key updates. Natural key values for this resource cannot be changed using PUT operation, so the recommendation is to use POST as that supports upsert behavior.",
            "operationId": "putExtensionSchool",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_School",
                  },
                },
              },
              "description": "The JSON representation of the School resource to be created or updated.",
            },
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Updates a resource based on the resource identifier.",
            "tags": Array [
              "schools",
            ],
          },
        },
        "/extension/sessions": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getExtensionSession",
            "parameters": Array [
              Object {
                "$ref": "#/components/parameters/offset",
              },
              Object {
                "$ref": "#/components/parameters/limit",
              },
              Object {
                "$ref": "#/components/parameters/MinChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/MaxChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/totalCount",
              },
              Object {
                "description": "",
                "in": "query",
                "name": "id",
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "description": "doc",
                "in": "query",
                "name": "sessionName",
                "schema": Object {
                  "maxLength": 30,
                  "type": "string",
                },
                "x-Ed-Fi-isIdentity": true,
              },
              Object {
                "description": "doc",
                "in": "query",
                "name": "schoolYear",
                "schema": Object {
                  "format": "int32",
                  "type": "integer",
                },
                "x-Ed-Fi-isIdentity": true,
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "items": Object {
                        "$ref": "#/components/schemas/Extension_Session",
                      },
                      "type": "array",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves specific resources using the resource's property values (using the \\"Get\\" pattern).",
            "tags": Array [
              "sessions",
            ],
          },
          "post": Object {
            "description": "The POST operation can be used to create or update resources. In database terms, this is often referred to as an \\"upsert\\" operation (insert + update). Clients should NOT include the resource \\"id\\" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.",
            "operationId": "postExtensionSession",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_Session",
                  },
                },
              },
              "description": "The JSON representation of the Session resource to be created or updated.",
              "required": true,
              "x-bodyName": "Session",
            },
            "responses": Object {
              "200": Object {
                "$ref": "#/components/responses/Updated",
              },
              "201": Object {
                "$ref": "#/components/responses/Created",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Creates or updates resources based on the natural key values of the supplied resource.",
            "tags": Array [
              "sessions",
            ],
          },
        },
        "/extension/sessions/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteExtensionSessionsById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
            ],
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Deletes an existing resource using the resource identifier.",
            "tags": Array [
              "sessions",
            ],
          },
          "get": Object {
            "description": "This GET operation retrieves a resource by the specified resource identifier.",
            "operationId": "getExtensionSessionsById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "$ref": "#/components/schemas/Extension_Session",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves a specific resource using the resource's identifier (using the \\"Get By Id\\" pattern).",
            "tags": Array [
              "sessions",
            ],
          },
          "put": Object {
            "description": "The PUT operation is used to update a resource by identifier. If the resource identifier (\\"id\\") is provided in the JSON body, it will be ignored. Additionally, this API resource is not configured for cascading natural key updates. Natural key values for this resource cannot be changed using PUT operation, so the recommendation is to use POST as that supports upsert behavior.",
            "operationId": "putExtensionSession",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_Session",
                  },
                },
              },
              "description": "The JSON representation of the Session resource to be created or updated.",
            },
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Updates a resource based on the resource identifier.",
            "tags": Array [
              "sessions",
            ],
          },
        },
      }
    `);
    expect(openApiExtensionResourceFragments.newSchemas).toMatchInlineSnapshot(`
      Object {
        "Extension_CourseOffering": Object {
          "description": "doc",
          "properties": Object {
            "localCourseCode": Object {
              "description": "doc",
              "maxLength": 30,
              "type": "string",
            },
            "schoolReference": Object {
              "$ref": "#/components/schemas/Extension_School_Reference",
            },
            "sessionReference": Object {
              "$ref": "#/components/schemas/Extension_Session_Reference",
            },
          },
          "required": Array [
            "localCourseCode",
            "schoolReference",
            "sessionReference",
          ],
          "type": "object",
        },
        "Extension_CourseOffering_Reference": Object {
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
        "Extension_DomainEntityName": Object {
          "description": "doc",
          "properties": Object {
            "courseOfferingReference": Object {
              "$ref": "#/components/schemas/Extension_CourseOffering_Reference",
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
          "type": "object",
        },
        "Extension_DomainEntityName_Reference": Object {
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
            "sectionIdentifier": Object {
              "description": "doc",
              "maxLength": 30,
              "type": "string",
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
            "sectionIdentifier",
          ],
          "type": "object",
        },
        "Extension_School": Object {
          "description": "doc",
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
        "Extension_School_Reference": Object {
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
        "Extension_Session": Object {
          "description": "doc",
          "properties": Object {
            "schoolReference": Object {
              "$ref": "#/components/schemas/Extension_School_Reference",
            },
            "schoolYearTypeReference": Object {
              "$ref": "#/components/schemas/EdFi_SchoolYearTypeReference",
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
          "type": "object",
        },
        "Extension_Session_Reference": Object {
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
      }
    `);
    expect(openApiExtensionResourceFragments.exts).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionResourceFragments.newTags).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "doc",
          "name": "courseOfferings",
        },
        Object {
          "description": "doc",
          "name": "domainEntityNames",
        },
        Object {
          "description": "doc",
          "name": "schools",
        },
        Object {
          "description": "doc",
          "name": "sessions",
        },
      ]
    `);
  });

  it('should be correct openApiExtensionDescriptorFragments', () => {
    const { openApiExtensionDescriptorFragments } = namespace.data.edfiApiSchema;
    expect(openApiExtensionDescriptorFragments.newPaths).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionDescriptorFragments.newSchemas).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionDescriptorFragments.exts).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionDescriptorFragments.newTags).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when building domain entity with nested choice and inline commons', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Extension';
  const domainEntityName = 'EducationContent';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, namespaceName)
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
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be correct openApiExtensionResourceFragments', () => {
    const { openApiExtensionResourceFragments } = namespace.data.edfiApiSchema;
    expect(openApiExtensionResourceFragments.newPaths).toMatchInlineSnapshot(`
      Object {
        "/extension/educationContents": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getExtensionEducationContent",
            "parameters": Array [
              Object {
                "$ref": "#/components/parameters/offset",
              },
              Object {
                "$ref": "#/components/parameters/limit",
              },
              Object {
                "$ref": "#/components/parameters/MinChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/MaxChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/totalCount",
              },
              Object {
                "description": "",
                "in": "query",
                "name": "id",
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "description": "doc",
                "in": "query",
                "name": "contentIdentifier",
                "schema": Object {
                  "maxLength": 30,
                  "type": "string",
                },
                "x-Ed-Fi-isIdentity": true,
              },
              Object {
                "description": "doc",
                "in": "query",
                "name": "learningResourceMetadataURI",
                "schema": Object {
                  "maxLength": 30,
                  "type": "string",
                },
              },
              Object {
                "description": "doc",
                "in": "query",
                "name": "description",
                "schema": Object {
                  "maxLength": 30,
                  "type": "string",
                },
              },
              Object {
                "description": "doc",
                "in": "query",
                "name": "shortDescription",
                "schema": Object {
                  "maxLength": 30,
                  "type": "string",
                },
              },
              Object {
                "description": "doc",
                "in": "query",
                "name": "contentClassDescriptor",
                "schema": Object {
                  "maxLength": 306,
                  "type": "string",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "items": Object {
                        "$ref": "#/components/schemas/Extension_EducationContent",
                      },
                      "type": "array",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves specific resources using the resource's property values (using the \\"Get\\" pattern).",
            "tags": Array [
              "educationContents",
            ],
          },
          "post": Object {
            "description": "The POST operation can be used to create or update resources. In database terms, this is often referred to as an \\"upsert\\" operation (insert + update). Clients should NOT include the resource \\"id\\" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.",
            "operationId": "postExtensionEducationContent",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_EducationContent",
                  },
                },
              },
              "description": "The JSON representation of the EducationContent resource to be created or updated.",
              "required": true,
              "x-bodyName": "EducationContent",
            },
            "responses": Object {
              "200": Object {
                "$ref": "#/components/responses/Updated",
              },
              "201": Object {
                "$ref": "#/components/responses/Created",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Creates or updates resources based on the natural key values of the supplied resource.",
            "tags": Array [
              "educationContents",
            ],
          },
        },
        "/extension/educationContents/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteExtensionEducationContentsById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
            ],
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Deletes an existing resource using the resource identifier.",
            "tags": Array [
              "educationContents",
            ],
          },
          "get": Object {
            "description": "This GET operation retrieves a resource by the specified resource identifier.",
            "operationId": "getExtensionEducationContentsById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "$ref": "#/components/schemas/Extension_EducationContent",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves a specific resource using the resource's identifier (using the \\"Get By Id\\" pattern).",
            "tags": Array [
              "educationContents",
            ],
          },
          "put": Object {
            "description": "The PUT operation is used to update a resource by identifier. If the resource identifier (\\"id\\") is provided in the JSON body, it will be ignored. Additionally, this API resource is not configured for cascading natural key updates. Natural key values for this resource cannot be changed using PUT operation, so the recommendation is to use POST as that supports upsert behavior.",
            "operationId": "putExtensionEducationContent",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_EducationContent",
                  },
                },
              },
              "description": "The JSON representation of the EducationContent resource to be created or updated.",
            },
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Updates a resource based on the resource identifier.",
            "tags": Array [
              "educationContents",
            ],
          },
        },
      }
    `);
    expect(openApiExtensionResourceFragments.newSchemas).toMatchInlineSnapshot(`
      Object {
        "Extension_EducationContent": Object {
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
                "$ref": "#/components/schemas/Extension_EducationContent_LearningResourceChoice_LearningResource_EducationContentSource_DerivativeSourceEducationContent",
              },
              "minItems": 0,
              "type": "array",
              "uniqueItems": false,
            },
            "derivativeSourceURIs": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_EducationContent_LearningResourceChoice_LearningResource_EducationContentSource_DerivativeSourceURI",
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
                "$ref": "#/components/schemas/Extension_EducationContent_RequiredURI",
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
        },
        "Extension_EducationContent_LearningResourceChoice_LearningResource_EducationContentSource_DerivativeSourceEducationContent": Object {
          "properties": Object {
            "derivativeSourceEducationContentReference": Object {
              "$ref": "#/components/schemas/Extension_EducationContent_Reference",
            },
          },
          "required": Array [
            "derivativeSourceEducationContentReference",
          ],
          "type": "object",
        },
        "Extension_EducationContent_LearningResourceChoice_LearningResource_EducationContentSource_DerivativeSourceURI": Object {
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
        "Extension_EducationContent_Reference": Object {
          "properties": Object {
            "contentIdentifier": Object {
              "description": "doc",
              "maxLength": 30,
              "type": "string",
            },
          },
          "required": Array [
            "contentIdentifier",
          ],
          "type": "object",
        },
        "Extension_EducationContent_RequiredURI": Object {
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
      }
    `);
    expect(openApiExtensionResourceFragments.exts).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionResourceFragments.newTags).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "doc",
          "name": "educationContents",
        },
      ]
    `);
  });

  it('should be correct openApiExtensionDescriptorFragments', () => {
    const { openApiExtensionDescriptorFragments } = namespace.data.edfiApiSchema;
    expect(openApiExtensionDescriptorFragments.newPaths).toMatchInlineSnapshot(`
      Object {
        "/extension/contentClassDescriptors": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getExtensionContentClass",
            "parameters": Array [
              Object {
                "$ref": "#/components/parameters/offset",
              },
              Object {
                "$ref": "#/components/parameters/limit",
              },
              Object {
                "$ref": "#/components/parameters/MinChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/MaxChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/totalCount",
              },
              Object {
                "description": "",
                "in": "query",
                "name": "id",
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "description": "A code or abbreviation that is used to refer to the descriptor.",
                "in": "query",
                "name": "codeValue",
                "schema": Object {
                  "maxLength": 50,
                  "type": "string",
                },
                "x-Ed-Fi-isIdentity": true,
              },
              Object {
                "description": "The description of the descriptor.",
                "in": "query",
                "name": "description",
                "schema": Object {
                  "maxLength": 1024,
                  "type": "string",
                },
              },
              Object {
                "description": "The beginning date of the period when the descriptor is in effect. If omitted, the default is immediate effectiveness.",
                "in": "query",
                "name": "effectiveBeginDate",
                "schema": Object {
                  "format": "date",
                  "type": "string",
                },
              },
              Object {
                "description": "The end date of the period when the descriptor is in effect.",
                "in": "query",
                "name": "effectiveEndDate",
                "schema": Object {
                  "format": "date",
                  "type": "string",
                },
              },
              Object {
                "description": "A globally unique namespace that identifies this descriptor set. Author is strongly encouraged to use the Universal Resource Identifier (http, ftp, file, etc.) for the source of the descriptor definition. Best practice is for this source to be the descriptor file itself, so that it can be machine-readable and be fetched in real-time, if necessary.",
                "in": "query",
                "name": "namespace",
                "schema": Object {
                  "maxLength": 255,
                  "type": "string",
                },
                "x-Ed-Fi-isIdentity": true,
              },
              Object {
                "description": "A shortened description for the descriptor.",
                "in": "query",
                "name": "shortDescription",
                "schema": Object {
                  "maxLength": 75,
                  "type": "string",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "items": Object {
                        "$ref": "#/components/schemas/Extension_ContentClassDescriptor",
                      },
                      "type": "array",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves specific resources using the resource's property values (using the \\"Get\\" pattern).",
            "tags": Array [
              "contentClassDescriptors",
            ],
          },
          "post": Object {
            "description": "The POST operation can be used to create or update resources. In database terms, this is often referred to as an \\"upsert\\" operation (insert + update). Clients should NOT include the resource \\"id\\" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.",
            "operationId": "postExtensionContentClass",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_ContentClass",
                  },
                },
              },
              "description": "The JSON representation of the ContentClass resource to be created or updated.",
              "required": true,
              "x-bodyName": "ContentClass",
            },
            "responses": Object {
              "200": Object {
                "$ref": "#/components/responses/Updated",
              },
              "201": Object {
                "$ref": "#/components/responses/Created",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Creates or updates resources based on the natural key values of the supplied resource.",
            "tags": Array [
              "contentClassDescriptors",
            ],
          },
        },
        "/extension/contentClassDescriptors/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteExtensionContentClassesById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
            ],
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Deletes an existing resource using the resource identifier.",
            "tags": Array [
              "contentClassDescriptors",
            ],
          },
          "get": Object {
            "description": "This GET operation retrieves a resource by the specified resource identifier.",
            "operationId": "getExtensionContentClassesById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "$ref": "#/components/schemas/Extension_ContentClass",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves a specific resource using the resource's identifier (using the \\"Get By Id\\" pattern).",
            "tags": Array [
              "contentClassDescriptors",
            ],
          },
          "put": Object {
            "description": "The PUT operation is used to update a resource by identifier. If the resource identifier (\\"id\\") is provided in the JSON body, it will be ignored. Additionally, this API resource is not configured for cascading natural key updates. Natural key values for this resource cannot be changed using PUT operation, so the recommendation is to use POST as that supports upsert behavior.",
            "operationId": "putExtensionContentClass",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_ContentClass",
                  },
                },
              },
              "description": "The JSON representation of the ContentClass resource to be created or updated.",
            },
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Updates a resource based on the resource identifier.",
            "tags": Array [
              "contentClassDescriptors",
            ],
          },
        },
      }
    `);
    expect(openApiExtensionDescriptorFragments.newSchemas).toMatchInlineSnapshot(`
      Object {
        "Extension_ContentClassDescriptor": Object {
          "description": "An Ed-Fi Descriptor",
          "properties": Object {
            "codeValue": Object {
              "description": "The descriptor code value",
              "maxLength": 50,
              "minLength": 1,
              "pattern": "^(?!\\\\s).*(?<!\\\\s)$",
              "type": "string",
            },
            "description": Object {
              "description": "The descriptor description",
              "maxLength": 1024,
              "type": "string",
            },
            "effectiveBeginDate": Object {
              "description": "The descriptor effective begin date",
              "format": "date",
              "type": "string",
            },
            "effectiveEndDate": Object {
              "description": "The descriptor effective end date",
              "format": "date",
              "type": "string",
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
        },
      }
    `);
    expect(openApiExtensionDescriptorFragments.exts).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionDescriptorFragments.newTags).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "doc",
          "name": "contentClassDescriptors",
        },
      ]
    `);
  });
});

describe('when building domain entity with scalar collection named with prefix of parent entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'Extension';
  const domainEntityName = 'DomainEntityName';
  let namespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace(namespaceName, namespaceName)
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
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be correct openApiExtensionResourceFragments', () => {
    const { openApiExtensionResourceFragments } = namespace.data.edfiApiSchema;
    expect(openApiExtensionResourceFragments.newPaths).toMatchInlineSnapshot(`
      Object {
        "/extension/domainEntityNames": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getExtensionDomainEntityName",
            "parameters": Array [
              Object {
                "$ref": "#/components/parameters/offset",
              },
              Object {
                "$ref": "#/components/parameters/limit",
              },
              Object {
                "$ref": "#/components/parameters/MinChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/MaxChangeVersion",
              },
              Object {
                "$ref": "#/components/parameters/totalCount",
              },
              Object {
                "description": "",
                "in": "query",
                "name": "id",
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "description": "doc",
                "in": "query",
                "name": "contentIdentifier",
                "schema": Object {
                  "maxLength": 30,
                  "type": "string",
                },
                "x-Ed-Fi-isIdentity": true,
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "items": Object {
                        "$ref": "#/components/schemas/Extension_DomainEntityName",
                      },
                      "type": "array",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves specific resources using the resource's property values (using the \\"Get\\" pattern).",
            "tags": Array [
              "domainEntityNames",
            ],
          },
          "post": Object {
            "description": "The POST operation can be used to create or update resources. In database terms, this is often referred to as an \\"upsert\\" operation (insert + update). Clients should NOT include the resource \\"id\\" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.",
            "operationId": "postExtensionDomainEntityName",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_DomainEntityName",
                  },
                },
              },
              "description": "The JSON representation of the DomainEntityName resource to be created or updated.",
              "required": true,
              "x-bodyName": "DomainEntityName",
            },
            "responses": Object {
              "200": Object {
                "$ref": "#/components/responses/Updated",
              },
              "201": Object {
                "$ref": "#/components/responses/Created",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Creates or updates resources based on the natural key values of the supplied resource.",
            "tags": Array [
              "domainEntityNames",
            ],
          },
        },
        "/extension/domainEntityNames/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteExtensionDomainEntityNamesById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
            ],
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Deletes an existing resource using the resource identifier.",
            "tags": Array [
              "domainEntityNames",
            ],
          },
          "get": Object {
            "description": "This GET operation retrieves a resource by the specified resource identifier.",
            "operationId": "getExtensionDomainEntityNamesById",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "responses": Object {
              "200": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "$ref": "#/components/schemas/Extension_DomainEntityName",
                    },
                  },
                },
                "description": "The requested resource was successfully retrieved.",
              },
              "304": Object {
                "$ref": "#/components/responses/NotModified",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFoundUseSnapshot",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Retrieves a specific resource using the resource's identifier (using the \\"Get By Id\\" pattern).",
            "tags": Array [
              "domainEntityNames",
            ],
          },
          "put": Object {
            "description": "The PUT operation is used to update a resource by identifier. If the resource identifier (\\"id\\") is provided in the JSON body, it will be ignored. Additionally, this API resource is not configured for cascading natural key updates. Natural key values for this resource cannot be changed using PUT operation, so the recommendation is to use POST as that supports upsert behavior.",
            "operationId": "putExtensionDomainEntityName",
            "parameters": Array [
              Object {
                "description": "A resource identifier that uniquely identifies the resource.",
                "in": "path",
                "name": "id",
                "required": true,
                "schema": Object {
                  "type": "string",
                },
              },
              Object {
                "$ref": "#/components/parameters/If-None-Match",
              },
              Object {
                "description": "Indicates if the configured Snapshot should be used.",
                "in": "header",
                "name": "Use-Snapshot",
                "schema": Object {
                  "default": false,
                  "type": "boolean",
                },
              },
            ],
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/Extension_DomainEntityName",
                  },
                },
              },
              "description": "The JSON representation of the DomainEntityName resource to be created or updated.",
            },
            "responses": Object {
              "204": Object {
                "$ref": "#/components/responses/Updated",
              },
              "400": Object {
                "$ref": "#/components/responses/BadRequest",
              },
              "401": Object {
                "$ref": "#/components/responses/Unauthorized",
              },
              "403": Object {
                "$ref": "#/components/responses/Forbidden",
              },
              "404": Object {
                "$ref": "#/components/responses/NotFound",
              },
              "405": Object {
                "description": "Method Is Not Allowed. When the Use-Snapshot header is set to true, the method is not allowed.",
              },
              "409": Object {
                "$ref": "#/components/responses/Conflict",
              },
              "412": Object {
                "$ref": "#/components/responses/PreconditionFailed",
              },
              "500": Object {
                "$ref": "#/components/responses/Error",
              },
            },
            "summary": "Updates a resource based on the resource identifier.",
            "tags": Array [
              "domainEntityNames",
            ],
          },
        },
      }
    `);
    expect(openApiExtensionResourceFragments.newSchemas).toMatchInlineSnapshot(`
      Object {
        "Extension_DomainEntityName": Object {
          "description": "doc",
          "properties": Object {
            "contentIdentifier": Object {
              "description": "doc",
              "maxLength": 30,
              "type": "string",
            },
            "suffixNames": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_DomainEntityName_DomainEntityNameSuffixName",
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
        },
        "Extension_DomainEntityName_DomainEntityNameSuffixName": Object {
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
        "Extension_DomainEntityName_Reference": Object {
          "properties": Object {
            "contentIdentifier": Object {
              "description": "doc",
              "maxLength": 30,
              "type": "string",
            },
          },
          "required": Array [
            "contentIdentifier",
          ],
          "type": "object",
        },
      }
    `);
    expect(openApiExtensionResourceFragments.exts).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionResourceFragments.newTags).toMatchInlineSnapshot(`
      Array [
        Object {
          "description": "doc",
          "name": "domainEntityNames",
        },
      ]
    `);
  });

  it('should be correct openApiExtensionDescriptorFragments', () => {
    const { openApiExtensionDescriptorFragments } = namespace.data.edfiApiSchema;
    expect(openApiExtensionDescriptorFragments.newPaths).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionDescriptorFragments.newSchemas).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionDescriptorFragments.exts).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionDescriptorFragments.newTags).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when domain entity extension references domain entity in different namespace', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  const entityName = 'EntityName';
  const referencedEntityName = 'ReferencedEntityName';
  let coreNamespace: any = null;
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

    coreNamespace = metaEd.namespace.get('EdFi') ?? newNamespace();
    extensionNamespace = metaEd.namespace.get('Extension') ?? newNamespace();
    extensionNamespace?.dependencies.push(coreNamespace);

    domainEntityReferenceEnhancer(metaEd);
    domainEntityExtensionBaseClassEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
    openApiCoreSpecificationEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct schema for core namespace', () => {
    expect(coreNamespace.data.edfiApiSchema.openApiCoreResources.components.schemas).toMatchInlineSnapshot(`
        Object {
          "EdFi_EntityName": Object {
            "description": "doc",
            "properties": Object {
              "entityIdentity": Object {
                "description": "doc",
                "type": "integer",
              },
            },
            "required": Array [
              "entityIdentity",
            ],
            "type": "object",
          },
          "EdFi_EntityName_Reference": Object {
            "properties": Object {
              "entityIdentity": Object {
                "description": "doc",
                "type": "integer",
              },
            },
            "required": Array [
              "entityIdentity",
            ],
            "type": "object",
          },
          "EdFi_ReferencedEntityName": Object {
            "description": "doc",
            "properties": Object {
              "referencedIdentity": Object {
                "description": "doc",
                "type": "integer",
              },
            },
            "required": Array [
              "referencedIdentity",
            ],
            "type": "object",
          },
          "EdFi_ReferencedEntityName_Reference": Object {
            "properties": Object {
              "referencedIdentity": Object {
                "description": "doc",
                "type": "integer",
              },
            },
            "required": Array [
              "referencedIdentity",
            ],
            "type": "object",
          },
          "EdFi_SchoolYearTypeReference": Object {
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
          },
        }
      `);
  });

  it('should be a correct ext for extension namespace that references core schema', () => {
    const { openApiExtensionResourceFragments } = extensionNamespace.data.edfiApiSchema;
    expect(openApiExtensionResourceFragments.newPaths).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionResourceFragments.newSchemas).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionResourceFragments.exts).toMatchInlineSnapshot(`
        Object {
          "EdFi_EntityName": Object {
            "description": "",
            "properties": Object {
              "referencedEntityNameReference": Object {
                "$ref": "#/components/schemas/EdFi_ReferencedEntityName_Reference",
              },
            },
            "type": "object",
          },
        }
      `);
    expect(openApiExtensionResourceFragments.newTags).toMatchInlineSnapshot(`Array []`);
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

      .withBeginNamespace('Extension', 'Extension')
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
    runApiSchemaEnhancers(metaEd);
    openApiCoreSpecificationEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct ext for extension namespace that references core schema', () => {
    const { openApiExtensionResourceFragments } = extensionNamespace.data.edfiApiSchema;
    expect(openApiExtensionResourceFragments.newPaths).toMatchInlineSnapshot(`Object {}`);
    expect(openApiExtensionResourceFragments.newSchemas).toMatchInlineSnapshot(`
      Object {
        "Extension_EntityName_ReferencedEntityName": Object {
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
      }
    `);
    expect(openApiExtensionResourceFragments.exts).toMatchInlineSnapshot(`
      Object {
        "EdFi_EntityName": Object {
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
        },
      }
    `);
    expect(openApiExtensionResourceFragments.newTags).toMatchInlineSnapshot(`Array []`);
  });
});

describe('when domain entity extension has a simple string collection', () => {
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
      .withStringProperty('StringCollection', 'doc', true, true, '30')
      .withEndDomainEntityExtension()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new DomainEntityExtensionBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    extensionNamespace = metaEd.namespace.get('Extension') ?? newNamespace();
    extensionNamespace?.dependencies.push(metaEd.namespace.get('EdFi') ?? newNamespace());

    domainEntityReferenceEnhancer(metaEd);
    domainEntityExtensionBaseClassEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
    openApiCoreSpecificationEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct ext for extension with simple collection', () => {
    const { openApiExtensionResourceFragments } = extensionNamespace.data.edfiApiSchema;
    expect(openApiExtensionResourceFragments.newSchemas).toMatchInlineSnapshot(`
      Object {
        "Extension_EntityName_StringCollection": Object {
          "properties": Object {
            "stringCollection": Object {
              "description": "doc",
              "maxLength": 30,
              "type": "string",
            },
          },
          "required": Array [
            "stringCollection",
          ],
          "type": "object",
        },
      }
    `);
    expect(openApiExtensionResourceFragments.exts).toMatchInlineSnapshot(`
      Object {
        "EdFi_EntityName": Object {
          "description": "",
          "properties": Object {
            "stringCollections": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_EntityName_StringCollection",
              },
              "minItems": 1,
              "type": "array",
              "uniqueItems": false,
            },
          },
          "required": Array [
            "stringCollections",
          ],
          "type": "object",
        },
      }
    `);
  });
});

describe('when domain entity in extension has a DS common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartCommon('Service')
      .withDocumentation('doc')
      .withIntegerIdentity('ServiceIdentity', 'doc')
      .withDateProperty('BeginDate', 'doc', false, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntity('StudentArtProgram')
      .withDocumentation('doc')
      .withIntegerIdentity('EntityIdentity', 'doc')
      .withCommonProperty('EdFi.Service', 'doc', true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    extensionNamespace = metaEd.namespace.get('Extension') ?? newNamespace();
    extensionNamespace?.dependencies.push(metaEd.namespace.get('EdFi') ?? newNamespace());

    domainEntityReferenceEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
    openApiCoreSpecificationEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct ext for extension with DS common collection', () => {
    const { openApiExtensionResourceFragments } = extensionNamespace.data.edfiApiSchema;
    expect(openApiExtensionResourceFragments.newSchemas).toMatchInlineSnapshot(`
      Object {
        "Extension_StudentArtProgram": Object {
          "description": "doc",
          "properties": Object {
            "entityIdentity": Object {
              "description": "doc",
              "type": "integer",
            },
            "services": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_StudentArtProgram_Service",
              },
              "minItems": 1,
              "type": "array",
              "uniqueItems": false,
            },
          },
          "required": Array [
            "entityIdentity",
            "services",
          ],
          "type": "object",
        },
        "Extension_StudentArtProgram_Reference": Object {
          "properties": Object {
            "entityIdentity": Object {
              "description": "doc",
              "type": "integer",
            },
          },
          "required": Array [
            "entityIdentity",
          ],
          "type": "object",
        },
        "Extension_StudentArtProgram_Service": Object {
          "properties": Object {
            "beginDate": Object {
              "description": "doc",
              "format": "date",
              "type": "string",
            },
            "serviceIdentity": Object {
              "description": "doc",
              "type": "integer",
            },
          },
          "required": Array [
            "serviceIdentity",
          ],
          "type": "object",
        },
      }
    `);
    expect(openApiExtensionResourceFragments.exts).toMatchInlineSnapshot(`Object {}`);
  });
});

describe('when domain entity subclass in extension has a DS common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAbstractEntity('GeneralStudentProgram')
      .withDocumentation('doc')
      .withIntegerIdentity('SuperclassIdentity', 'doc')
      .withEndAbstractEntity()

      .withStartCommon('Service')
      .withDocumentation('doc')
      .withIntegerIdentity('ServiceIdentity', 'doc')
      .withDateProperty('BeginDate', 'doc', false, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntitySubclass('StudentArtProgram', 'EdFi.GeneralStudentProgram')
      .withDocumentation('doc')
      .withCommonProperty('EdFi.Service', 'doc', true, true)
      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    extensionNamespace = metaEd.namespace.get('Extension') ?? newNamespace();
    extensionNamespace?.dependencies.push(metaEd.namespace.get('EdFi') ?? newNamespace());

    domainEntityReferenceEnhancer(metaEd);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
    openApiCoreSpecificationEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct ext for extension with DS common collection', () => {
    const { openApiExtensionResourceFragments } = extensionNamespace.data.edfiApiSchema;
    expect(openApiExtensionResourceFragments.newSchemas).toMatchInlineSnapshot(`
      Object {
        "Extension_StudentArtProgram": Object {
          "description": "doc",
          "properties": Object {
            "services": Object {
              "items": Object {
                "$ref": "#/components/schemas/Extension_StudentArtProgram_Service",
              },
              "minItems": 1,
              "type": "array",
              "uniqueItems": false,
            },
            "superclassIdentity": Object {
              "description": "doc",
              "type": "integer",
            },
          },
          "required": Array [
            "services",
            "superclassIdentity",
          ],
          "type": "object",
        },
        "Extension_StudentArtProgram_Reference": Object {
          "properties": Object {
            "superclassIdentity": Object {
              "description": "doc",
              "type": "integer",
            },
          },
          "required": Array [
            "superclassIdentity",
          ],
          "type": "object",
        },
        "Extension_StudentArtProgram_Service": Object {
          "properties": Object {
            "beginDate": Object {
              "description": "doc",
              "format": "date",
              "type": "string",
            },
            "serviceIdentity": Object {
              "description": "doc",
              "type": "integer",
            },
          },
          "required": Array [
            "serviceIdentity",
          ],
          "type": "object",
        },
      }
    `);
    expect(openApiExtensionResourceFragments.exts).toMatchInlineSnapshot(`Object {}`);
  });
});

describe('when domain entity superclass in DS has a common collection', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.plugin.set('edfiApiSchema', newPluginEnvironment());
  let extensionNamespace: any = null;

  beforeAll(() => {
    MetaEdTextBuilder.build()
      .withBeginNamespace('EdFi')
      .withStartAbstractEntity('GeneralStudentProgram')
      .withDocumentation('doc')
      .withIntegerIdentity('SuperclassIdentity', 'doc')
      .withCommonProperty('Service', 'doc', true, true)
      .withEndAbstractEntity()

      .withStartCommon('Service')
      .withDocumentation('doc')
      .withIntegerIdentity('ServiceIdentity', 'doc')
      .withDateProperty('BeginDate', 'doc', false, false)
      .withEndCommon()
      .withEndNamespace()

      .withBeginNamespace('Extension', 'Extension')
      .withStartDomainEntitySubclass('StudentArtProgram', 'EdFi.GeneralStudentProgram')
      .withIntegerIdentity('SubclassIdentity', 'doc')
      .withDocumentation('doc')

      .withEndDomainEntity()
      .withEndNamespace()

      .sendToListener(new NamespaceBuilder(metaEd, []))
      .sendToListener(new CommonBuilder(metaEd, []))
      .sendToListener(new DomainEntitySubclassBuilder(metaEd, []))
      .sendToListener(new DomainEntityBuilder(metaEd, []));

    extensionNamespace = metaEd.namespace.get('Extension') ?? newNamespace();
    extensionNamespace?.dependencies.push(metaEd.namespace.get('EdFi') ?? newNamespace());

    domainEntityReferenceEnhancer(metaEd);
    domainEntitySubclassBaseClassEnhancer(metaEd);
    commonReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
    openApiCoreSpecificationEnhancer(metaEd);
    enhance(metaEd);
  });

  it('should be a correct ext for extension with DS common collection', () => {
    const { openApiExtensionResourceFragments } = extensionNamespace.data.edfiApiSchema;
    expect(openApiExtensionResourceFragments.newSchemas).toMatchInlineSnapshot(`
      Object {
        "Extension_StudentArtProgram": Object {
          "description": "",
          "properties": Object {
            "services": Object {
              "items": Object {
                "$ref": "#/components/schemas/EdFi_GeneralStudentProgram_Service",
              },
              "minItems": 1,
              "type": "array",
              "uniqueItems": false,
            },
            "superclassIdentity": Object {
              "description": "doc",
              "type": "integer",
            },
          },
          "required": Array [
            "superclassIdentity",
            "services",
          ],
          "type": "object",
        },
        "Extension_StudentArtProgram_Reference": Object {
          "properties": Object {
            "superclassIdentity": Object {
              "description": "doc",
              "type": "integer",
            },
          },
          "required": Array [
            "superclassIdentity",
          ],
          "type": "object",
        },
      }
    `);
    expect(openApiExtensionResourceFragments.exts).toMatchInlineSnapshot(`Object {}`);
  });
});
