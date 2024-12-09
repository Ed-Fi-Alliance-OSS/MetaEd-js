import {
  DomainEntityBuilder,
  MetaEdEnvironment,
  MetaEdTextBuilder,
  NamespaceBuilder,
  newMetaEdEnvironment,
} from '@edfi/metaed-core';
import { domainEntityReferenceEnhancer } from '@edfi/metaed-plugin-edfi-unified';
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
import { enhance as jsonSchemaEnhancerForInsert } from '../../src/enhancer/JsonSchemaForInsertEnhancer';
import { enhance as allJsonPathsMappingEnhancer } from '../../src/enhancer/AllJsonPathsMappingEnhancer';
import { enhance as mergeDirectiveEqualityConstraintEnhancer } from '../../src/enhancer/MergeDirectiveEqualityConstraintEnhancer';
import { enhance as resourceNameEnhancer } from '../../src/enhancer/ResourceNameEnhancer';
import { enhance as identityFullnameEnhancer } from '../../src/enhancer/IdentityFullnameEnhancer';
import { enhance as subclassIdentityFullnameEnhancer } from '../../src/enhancer/SubclassIdentityFullnameEnhancer';
import { enhance as identityJsonPathsEnhancer } from '../../src/enhancer/IdentityJsonPathsEnhancer';
import { enhance as documentPathsMappingEnhancer } from '../../src/enhancer/DocumentPathsMappingEnhancer';
import { enhance as typeCoercionJsonPathsEnhancer } from '../../src/enhancer/TypeCoercionJsonPathsEnhancer';
import { enhance as apiSchemaBuildingEnhancer } from '../../src/enhancer/ApiSchemaBuildingEnhancer';
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
  jsonSchemaEnhancerForInsert(metaEd);
  allJsonPathsMappingEnhancer(metaEd);
  mergeDirectiveEqualityConstraintEnhancer(metaEd);
  resourceNameEnhancer(metaEd);
  identityFullnameEnhancer(metaEd);
  subclassIdentityFullnameEnhancer(metaEd);
  identityJsonPathsEnhancer(metaEd);
  documentPathsMappingEnhancer(metaEd);
  typeCoercionJsonPathsEnhancer(metaEd);
  apiSchemaBuildingEnhancer(metaEd);
  enhance(metaEd);
}

describe('when building open api specification', () => {
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

    namespace = metaEd.namespace.get(namespaceName);
  });

  it('should be correct OpenApiSpecification', () => {
    const openApiSpec = namespace.data.openApiSpecification;

    expect(openApiSpec).toMatchInlineSnapshot(`
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
          "schemas": Object {},
        },
        "info": Object {
          "description": "Ed-Fi Alliance Data Management Service",
          "title": "Ed-Fi Alliance Data Management Service",
          "version": "0",
        },
        "openapi": "3.0.0",
        "paths": Object {
          "/edfi/domainentitynames": Object {
            "post": Object {
              "description": "The POST operation can be used to create or update resources. In database terms, this is often referred to as an \\"upsert\\" operation (insert + update). Clients should NOT include the resource \\"id\\" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.",
              "operationId": "post-domainentitynames",
              "requestBody": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "$ref": "#/components/schemas/edFi_domainentitynames",
                    },
                  },
                },
                "description": "The JSON representation of the domainentitynames resource to be created or updated.",
                "required": true,
                "x-bodyName": "domainentitynames",
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
                "domainentitynames",
              ],
            },
          },
          "/edfi/schoolyeartypes": Object {
            "post": Object {
              "description": "The POST operation can be used to create or update resources. In database terms, this is often referred to as an \\"upsert\\" operation (insert + update). Clients should NOT include the resource \\"id\\" in the JSON body because it will result in an error. The web service will identify whether the resource already exists based on the natural key values provided, and update or create the resource appropriately. It is recommended to use POST for both create and update except while updating natural key of a resource in which case PUT operation must be used.",
              "operationId": "post-schoolyeartypes",
              "requestBody": Object {
                "content": Object {
                  "application/json": Object {
                    "schema": Object {
                      "$ref": "#/components/schemas/edFi_schoolyeartypes",
                    },
                  },
                },
                "description": "The JSON representation of the schoolyeartypes resource to be created or updated.",
                "required": true,
                "x-bodyName": "schoolyeartypes",
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
                "schoolyeartypes",
              ],
            },
          },
        },
        "servers": Array [
          Object {
            "url": "http://localhost:5198/",
          },
        ],
      }
    `);
  });
});
