import {
  ChoiceBuilder,
  CommonBuilder,
  DescriptorBuilder,
  DomainEntityBuilder,
  MetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
} from '@edfi/metaed-core';
import {
  domainEntityReferenceEnhancer,
  choiceReferenceEnhancer,
  inlineCommonReferenceEnhancer,
  descriptorReferenceEnhancer,
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
import { enhance as identityFullnameEnhancer } from '../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as subclassIdentityFullnameEnhancer } from '../../src/enhancer/SubclassIdentityFullnameEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as queryFieldMappingEnhancer } from '../../src/enhancer/QueryFieldMappingEnhancer';
import { enhance } from '../../src/enhancer/OpenApiSpecificationEnhancer';

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

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be correct OpenApiSpecification', () => {
    const { coreOpenApiSpecification } = namespace.data.edfiApiSchema;

    expect(coreOpenApiSpecification).toMatchInlineSnapshot(`
      Object {
        "components": Object {
          "responses": Object {
            "BadRequest": Object {
              "content": Object {
                "application/json": Object {},
              },
              "description": "Bad Request. The request was invalid and cannot be completed. See the response body for specific validation errors. This will typically be an issue with the query parameters or their values.",
            },
            "Conflict": Object {
              "content": Object {
                "application/json": Object {},
              },
              "description": "Conflict.  The request cannot be completed because it would result in an invalid state.  See the response body for details.",
            },
            "Created": Object {
              "description": "The resource was created.  An ETag value is available in the ETag header, and the location of the resource is available in the Location header of the response.",
            },
            "Deleted": Object {
              "description": "The resource was successfully deleted.",
            },
            "Error": Object {
              "content": Object {
                "application/json": Object {},
              },
              "description": "An unhandled error occurred on the server. See the response body for details.",
            },
            "Forbidden": Object {
              "description": "Forbidden. The request cannot be completed in the current authorization context. Contact your administrator if you believe this operation should be allowed.",
            },
            "NotFound": Object {
              "description": "The resource could not be found.",
            },
            "NotFoundUseSnapshot": Object {
              "description": "The resource could not be found. If Use-Snapshot header is set to true, this response can indicate the snapshot may have been removed.",
            },
            "NotModified": Object {
              "description": "The resource's current server-side ETag value matched the If-None-Match header value supplied with the request indicating the resource has not been modified.",
            },
            "PreconditionFailed": Object {
              "description": "The resource's current server-side ETag value does not match the supplied If-Match header value in the request. This indicates the resource has been modified by another consumer.",
            },
            "Unauthorized": Object {
              "description": "Unauthorized. The request requires authentication. The OAuth bearer token was either not provided or is invalid. The operation may succeed once authentication has been successfully completed.",
            },
            "Updated": Object {
              "description": "The resource was updated.  An updated ETag value is available in the ETag header of the response.",
            },
          },
          "schemas": Object {
            "EdFi_DomainEntityName": Object {
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
            "EdFi_DomainEntityName_Reference": Object {
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
          },
        },
        "info": Object {
          "description": "",
          "title": "",
          "version": "",
        },
        "openapi": "3.0.0",
        "paths": Object {
          "/edfi/domainEntityNames": Object {
            "get": Object {
              "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
              "operationId": "getDomainEntityName",
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
                          "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
              "operationId": "postDomainEntityName",
              "requestBody": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
          "/edfi/domainEntityNames/{id}": Object {
            "delete": Object {
              "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
              "operationId": "deleteDomainEntityName",
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
              "operationId": "getDomainEntityName",
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
                        "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
              "operationId": "putDomainEntityName",
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
                      "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
        },
        "servers": Array [
          Object {
            "url": "",
          },
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

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be correct OpenApiSpecification', () => {
    const { coreOpenApiSpecification } = namespace.data.edfiApiSchema;
    expect(coreOpenApiSpecification.paths).toMatchInlineSnapshot(`
      Object {
        "/edfi/domainEntityNames": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getDomainEntityName",
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
                        "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
            "operationId": "postDomainEntityName",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
        "/edfi/domainEntityNames/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteDomainEntityName",
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
            "operationId": "getDomainEntityName",
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
                      "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
            "operationId": "putDomainEntityName",
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
                    "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
    expect(coreOpenApiSpecification.components.schemas).toMatchInlineSnapshot(`
      Object {
        "EdFi_DomainEntityName": Object {
          "description": "doc",
          "properties": Object {
            "optionalBooleanProperties": Object {
              "items": Object {
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
        "EdFi_DomainEntityName_Reference": Object {
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

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be correct OpenApiSpecification', () => {
    const { coreOpenApiSpecification } = namespace.data.edfiApiSchema;
    expect(coreOpenApiSpecification.paths).toMatchInlineSnapshot(`
      Object {
        "/edfi/classPeriods": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getClassPeriod",
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
                        "$ref": "#/components/schemas/EdFi_ClassPeriod",
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
            "operationId": "postClassPeriod",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/EdFi_ClassPeriod",
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
        "/edfi/classPeriods/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteClassPeriod",
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
            "operationId": "getClassPeriod",
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
                      "$ref": "#/components/schemas/EdFi_ClassPeriod",
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
            "operationId": "putClassPeriod",
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
                    "$ref": "#/components/schemas/EdFi_ClassPeriod",
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
        "/edfi/courseOfferings": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getCourseOffering",
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
                        "$ref": "#/components/schemas/EdFi_CourseOffering",
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
            "operationId": "postCourseOffering",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/EdFi_CourseOffering",
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
        "/edfi/courseOfferings/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteCourseOffering",
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
            "operationId": "getCourseOffering",
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
                      "$ref": "#/components/schemas/EdFi_CourseOffering",
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
            "operationId": "putCourseOffering",
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
                    "$ref": "#/components/schemas/EdFi_CourseOffering",
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
        "/edfi/domainEntityNames": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getDomainEntityName",
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
                        "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
            "operationId": "postDomainEntityName",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
        "/edfi/domainEntityNames/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteDomainEntityName",
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
            "operationId": "getDomainEntityName",
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
                      "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
            "operationId": "putDomainEntityName",
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
                    "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
        "/edfi/schools": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getSchool",
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
                        "$ref": "#/components/schemas/EdFi_School",
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
            "operationId": "postSchool",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/EdFi_School",
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
        "/edfi/schools/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteSchool",
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
            "operationId": "getSchool",
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
                      "$ref": "#/components/schemas/EdFi_School",
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
            "operationId": "putSchool",
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
                    "$ref": "#/components/schemas/EdFi_School",
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
    expect(coreOpenApiSpecification.components.schemas).toMatchInlineSnapshot(`
      Object {
        "EdFi_ClassPeriod": Object {
          "description": "doc",
          "properties": Object {
            "classPeriodName": Object {
              "description": "doc",
              "maxLength": 30,
              "type": "string",
            },
            "schoolReference": Object {
              "$ref": "#/components/schemas/EdFi_School_Reference",
            },
          },
          "required": Array [
            "classPeriodName",
            "schoolReference",
          ],
          "type": "object",
        },
        "EdFi_ClassPeriod_Reference": Object {
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
        "EdFi_CourseOffering": Object {
          "description": "doc",
          "properties": Object {
            "localCourseCode": Object {
              "description": "doc",
              "maxLength": 30,
              "type": "string",
            },
            "schoolReference": Object {
              "$ref": "#/components/schemas/EdFi_School_Reference",
            },
          },
          "required": Array [
            "localCourseCode",
            "schoolReference",
          ],
          "type": "object",
        },
        "EdFi_CourseOffering_Reference": Object {
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
        "EdFi_DomainEntityName": Object {
          "description": "doc",
          "properties": Object {
            "classPeriods": Object {
              "items": Object {
                "properties": Object {
                  "classPeriodReference": Object {
                    "$ref": "#/components/schemas/EdFi_ClassPeriod_Reference",
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
              "$ref": "#/components/schemas/EdFi_CourseOffering_Reference",
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
        "EdFi_DomainEntityName_Reference": Object {
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
        "EdFi_School": Object {
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
        "EdFi_School_Reference": Object {
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

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be correct OpenApiSpecification', () => {
    const { coreOpenApiSpecification } = namespace.data.edfiApiSchema;
    expect(coreOpenApiSpecification.paths).toMatchInlineSnapshot(`
      Object {
        "/edfi/courseOfferings": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getCourseOffering",
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
                        "$ref": "#/components/schemas/EdFi_CourseOffering",
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
            "operationId": "postCourseOffering",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/EdFi_CourseOffering",
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
        "/edfi/courseOfferings/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteCourseOffering",
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
            "operationId": "getCourseOffering",
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
                      "$ref": "#/components/schemas/EdFi_CourseOffering",
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
            "operationId": "putCourseOffering",
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
                    "$ref": "#/components/schemas/EdFi_CourseOffering",
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
        "/edfi/domainEntityNames": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getDomainEntityName",
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
                        "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
            "operationId": "postDomainEntityName",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
        "/edfi/domainEntityNames/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteDomainEntityName",
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
            "operationId": "getDomainEntityName",
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
                      "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
            "operationId": "putDomainEntityName",
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
                    "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
        "/edfi/schools": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getSchool",
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
                        "$ref": "#/components/schemas/EdFi_School",
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
            "operationId": "postSchool",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/EdFi_School",
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
        "/edfi/schools/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteSchool",
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
            "operationId": "getSchool",
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
                      "$ref": "#/components/schemas/EdFi_School",
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
            "operationId": "putSchool",
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
                    "$ref": "#/components/schemas/EdFi_School",
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
        "/edfi/sessions": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getSession",
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
                        "$ref": "#/components/schemas/EdFi_Session",
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
            "operationId": "postSession",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/EdFi_Session",
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
        "/edfi/sessions/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteSession",
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
            "operationId": "getSession",
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
                      "$ref": "#/components/schemas/EdFi_Session",
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
            "operationId": "putSession",
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
                    "$ref": "#/components/schemas/EdFi_Session",
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
    expect(coreOpenApiSpecification.components.schemas).toMatchInlineSnapshot(`
      Object {
        "EdFi_CourseOffering": Object {
          "description": "doc",
          "properties": Object {
            "localCourseCode": Object {
              "description": "doc",
              "maxLength": 30,
              "type": "string",
            },
            "schoolReference": Object {
              "$ref": "#/components/schemas/EdFi_School_Reference",
            },
            "sessionReference": Object {
              "$ref": "#/components/schemas/EdFi_Session_Reference",
            },
          },
          "required": Array [
            "localCourseCode",
            "schoolReference",
            "sessionReference",
          ],
          "type": "object",
        },
        "EdFi_CourseOffering_Reference": Object {
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
        "EdFi_DomainEntityName": Object {
          "description": "doc",
          "properties": Object {
            "courseOfferingReference": Object {
              "$ref": "#/components/schemas/EdFi_CourseOffering_Reference",
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
        "EdFi_DomainEntityName_Reference": Object {
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
        "EdFi_School": Object {
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
        "EdFi_School_Reference": Object {
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
        "EdFi_Session": Object {
          "description": "doc",
          "properties": Object {
            "schoolReference": Object {
              "$ref": "#/components/schemas/EdFi_School_Reference",
            },
            "schoolYearTypeReference": Object {
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
        "EdFi_Session_Reference": Object {
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

    domainEntityReferenceEnhancer(metaEd);
    choiceReferenceEnhancer(metaEd);
    inlineCommonReferenceEnhancer(metaEd);
    descriptorReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be correct OpenApiSpecification', () => {
    const { coreOpenApiSpecification } = namespace.data.edfiApiSchema;
    expect(coreOpenApiSpecification.paths).toMatchInlineSnapshot(`
      Object {
        "/edfi/educationContents": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getEducationContent",
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
                        "$ref": "#/components/schemas/EdFi_EducationContent",
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
            "operationId": "postEducationContent",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/EdFi_EducationContent",
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
        "/edfi/educationContents/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteEducationContent",
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
            "operationId": "getEducationContent",
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
                      "$ref": "#/components/schemas/EdFi_EducationContent",
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
            "operationId": "putEducationContent",
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
                    "$ref": "#/components/schemas/EdFi_EducationContent",
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
    expect(coreOpenApiSpecification.components.schemas).toMatchInlineSnapshot(`
      Object {
        "EdFi_EducationContent": Object {
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
              "minItems": 0,
              "type": "array",
              "uniqueItems": false,
            },
            "derivativeSourceURIs": Object {
              "items": Object {
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
          "type": "object",
        },
        "EdFi_EducationContent_Reference": Object {
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
  });
});

describe('when building domain entity with scalar collection named with prefix of parent entity', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const namespaceName = 'EdFi';
  const domainEntityName = 'DomainEntityName';
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

    domainEntityReferenceEnhancer(metaEd);
    runApiSchemaEnhancers(metaEd);
    enhance(metaEd);

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be correct OpenApiSpecification', () => {
    const { coreOpenApiSpecification } = namespace.data.edfiApiSchema;
    expect(coreOpenApiSpecification.paths).toMatchInlineSnapshot(`
      Object {
        "/edfi/domainEntityNames": Object {
          "get": Object {
            "description": "This GET operation provides access to resources using the \\"Get\\" search pattern.  The values of any properties of the resource that are specified will be used to return all matching results (if it exists).",
            "operationId": "getDomainEntityName",
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
                        "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
            "operationId": "postDomainEntityName",
            "requestBody": Object {
              "content": Object {
                "application/json": Object {
                  "schema": Object {
                    "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
        "/edfi/domainEntityNames/{id}": Object {
          "delete": Object {
            "description": "The DELETE operation is used to delete an existing resource by identifier. If the resource doesn't exist, an error will result (the resource will not be found).",
            "operationId": "deleteDomainEntityName",
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
            "operationId": "getDomainEntityName",
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
                      "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
            "operationId": "putDomainEntityName",
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
                    "$ref": "#/components/schemas/EdFi_DomainEntityName",
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
    expect(coreOpenApiSpecification.components.schemas).toMatchInlineSnapshot(`
      Object {
        "EdFi_DomainEntityName": Object {
          "description": "doc",
          "properties": Object {
            "contentIdentifier": Object {
              "description": "doc",
              "maxLength": 30,
              "type": "string",
            },
            "suffixNames": Object {
              "items": Object {
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
          "type": "object",
        },
        "EdFi_DomainEntityName_Reference": Object {
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
  });
});
