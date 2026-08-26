// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  newMetaEdEnvironment,
  Namespace,
  NamespaceBuilder,
  MetaEdTextBuilder,
  DomainEntityBuilder,
} from '@edfi/metaed-core';
import { enhance as namespaceSetupEnhancer } from '../../src/model/Namespace';
import { enhance } from '../../src/enhancer/OpenApiBaseDocumentEnhancer';
import { NamespaceEdfiApiSchema } from '../../src/model/Namespace';
import { OpenApiDocumentType } from '../../src/model/api-schema/OpenApiDocumentType';

describe('OpenApiBaseDocumentEnhancer', () => {
  describe('when enhancing a core namespace', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const namespaceName = 'EdFi';
    let namespace: Namespace | undefined;

    beforeAll(() => {
      // Create namespace with a dummy entity using MetaEdTextBuilder
      MetaEdTextBuilder.build()
        .withBeginNamespace(namespaceName)
        .withStartDomainEntity('DummyEntity')
        .withDocumentation('A dummy entity for testing')
        .withStringIdentity('DummyId', 'doc', '30', '20')
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      namespace = metaEd.namespace.get(namespaceName);
      expect(namespace).toBeDefined();

      namespaceSetupEnhancer(metaEd);
      enhance(metaEd);
    });

    it('should create openApiBaseDocuments', () => {
      const namespaceEdfiApiSchema = namespace?.data.edfiApiSchema as NamespaceEdfiApiSchema;
      expect(namespaceEdfiApiSchema.openApiBaseDocuments).toBeDefined();
    });

    it('should create base document for resources', () => {
      const namespaceEdfiApiSchema = namespace?.data.edfiApiSchema as NamespaceEdfiApiSchema;
      const resourcesDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.RESOURCES];

      expect(resourcesDoc).toBeDefined();
      expect(resourcesDoc?.openapi).toBe('3.0.0');
      expect(resourcesDoc?.info?.title).toBe('Ed-Fi Data Management Service API');
      expect(resourcesDoc?.info?.version).toBe('1');
      expect(resourcesDoc?.servers).toHaveLength(1);
      expect(resourcesDoc?.paths).toEqual({});
      expect(resourcesDoc?.components?.schemas).toBeDefined();
      expect(resourcesDoc?.components?.schemas?.EdFi_SchoolYearTypeReference).toBeDefined();
      expect(resourcesDoc?.components?.responses).toBeDefined();
      expect(resourcesDoc?.components?.parameters).toBeDefined();
      expect(resourcesDoc?.components?.schemas?.ProblemDetails).toBeDefined();
      expect(resourcesDoc?.components?.parameters?.['Use-Snapshot']).toBeDefined();
      expect(resourcesDoc?.components?.responses?.SnapshotNotFound).toBeDefined();
      expect(resourcesDoc?.components?.responses?.SnapshotMethodNotAllowed).toBeDefined();
      expect(resourcesDoc?.tags).toEqual([]);
    });

    it('should create base document for descriptors', () => {
      const namespaceEdfiApiSchema = namespace?.data.edfiApiSchema as NamespaceEdfiApiSchema;
      const descriptorsDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.DESCRIPTORS];

      expect(descriptorsDoc).toBeDefined();
      expect(descriptorsDoc?.openapi).toBe('3.0.0');
      expect(descriptorsDoc?.info?.title).toBe('Ed-Fi Data Management Service API');
      expect(descriptorsDoc?.info?.version).toBe('1');
      expect(descriptorsDoc?.servers).toHaveLength(1);
      expect(descriptorsDoc?.paths).toEqual({});
      expect(Object.keys(descriptorsDoc?.components?.schemas ?? {})).toEqual(['ProblemDetails']);
      expect(descriptorsDoc?.components?.responses).toBeDefined();
      expect(descriptorsDoc?.components?.parameters).toBeDefined();
      expect(descriptorsDoc?.components?.parameters?.['Use-Snapshot']).toBeDefined();
      expect(descriptorsDoc?.components?.responses?.SnapshotNotFound).toBeDefined();
      expect(descriptorsDoc?.components?.responses?.SnapshotMethodNotAllowed).toBeDefined();
      expect(descriptorsDoc?.components?.schemas?.EdFi_SchoolYearTypeReference).toBeUndefined();
      expect(descriptorsDoc?.tags).toEqual([]);
    });

    it('should create standalone Change Queries base document for availableChangeVersions', () => {
      const namespaceEdfiApiSchema = namespace?.data.edfiApiSchema as NamespaceEdfiApiSchema;
      const changeQueriesDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.CHANGE_QUERIES];
      const resourcesDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.RESOURCES];
      const descriptorsDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.DESCRIPTORS];

      expect(changeQueriesDoc).toBeDefined();
      expect(changeQueriesDoc?.openapi).toBe('3.0.0');
      expect(changeQueriesDoc?.info?.title).toBe('Ed-Fi Data Management Service API');
      expect(changeQueriesDoc?.info?.version).toBe('1');
      expect(changeQueriesDoc?.servers).toHaveLength(1);
      expect(changeQueriesDoc?.paths).toMatchInlineSnapshot(`
        Object {
          "/availableChangeVersions": Object {
            "get": Object {
              "operationId": "getAvailableChangeVersions",
              "parameters": Array [
                Object {
                  "$ref": "#/components/parameters/Use-Snapshot",
                },
              ],
              "responses": Object {
                "200": Object {
                  "content": Object {
                    "application/json": Object {
                      "schema": Object {
                        "properties": Object {
                          "newestChangeVersion": Object {
                            "format": "int64",
                            "type": "integer",
                          },
                          "oldestChangeVersion": Object {
                            "format": "int64",
                            "type": "integer",
                          },
                        },
                        "required": Array [
                          "oldestChangeVersion",
                          "newestChangeVersion",
                        ],
                        "type": "object",
                      },
                    },
                  },
                  "description": "The available change version range was successfully retrieved.",
                },
                "404": Object {
                  "$ref": "#/components/responses/SnapshotNotFound",
                },
              },
              "summary": "Retrieves the available change version range.",
            },
          },
        }
      `);
      expect(changeQueriesDoc?.paths['/availableChangeVersions']?.get?.parameters).toEqual([
        { $ref: '#/components/parameters/Use-Snapshot' },
      ]);
      expect(changeQueriesDoc?.paths['/availableChangeVersions']?.get?.responses['404']).toEqual({
        $ref: '#/components/responses/SnapshotNotFound',
      });
      expect(changeQueriesDoc?.paths['/changeQueries/v1/availableChangeVersions']).toBeUndefined();
      expect(resourcesDoc?.paths['/availableChangeVersions']).toBeUndefined();
      expect(descriptorsDoc?.paths['/availableChangeVersions']).toBeUndefined();

      // The standalone Change Queries document carries exactly the components its single operation
      // references. It has no mutating operation, so it deliberately omits SnapshotMethodNotAllowed.
      expect(Object.keys(changeQueriesDoc?.components?.schemas ?? {})).toEqual(['ProblemDetails']);
      expect(Object.keys(changeQueriesDoc?.components?.responses ?? {})).toEqual(['SnapshotNotFound']);
      expect(Object.keys(changeQueriesDoc?.components?.parameters ?? {})).toEqual(['Use-Snapshot']);
      expect(changeQueriesDoc?.components?.responses?.SnapshotMethodNotAllowed).toBeUndefined();
      expect(changeQueriesDoc?.components?.securitySchemes).toBeUndefined();
      expect(changeQueriesDoc?.security).toBeUndefined();
      expect(JSON.stringify(changeQueriesDoc)).not.toContain('oauth2');
      expect(JSON.stringify(changeQueriesDoc)).not.toContain('tokenUrl');
      expect(changeQueriesDoc?.tags).toEqual([]);
    });

    it('should include hardcoded component parameters', () => {
      const namespaceEdfiApiSchema = namespace?.data.edfiApiSchema as NamespaceEdfiApiSchema;
      const resourcesDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.RESOURCES];

      expect(resourcesDoc?.components?.parameters?.['If-None-Match']).toBeDefined();
      expect(resourcesDoc?.components?.parameters?.limit).toBeDefined();
      expect(resourcesDoc?.components?.parameters?.offset).toBeDefined();
      expect(resourcesDoc?.components?.parameters?.MinChangeVersion).toEqual({
        name: 'minChangeVersion',
        in: 'query',
        description: 'Used in synchronization to set sequence minimum ChangeVersion',
        schema: {
          minimum: 0,
          type: 'integer',
          format: 'int64',
        },
      });
      expect(resourcesDoc?.components?.parameters?.MaxChangeVersion).toEqual({
        name: 'maxChangeVersion',
        in: 'query',
        description: 'Used in synchronization to set sequence maximum ChangeVersion',
        schema: {
          minimum: 0,
          type: 'integer',
          format: 'int64',
        },
      });
    });

    it('should include hardcoded responses', () => {
      const namespaceEdfiApiSchema = namespace?.data.edfiApiSchema as NamespaceEdfiApiSchema;
      const resourcesDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.RESOURCES];

      expect(resourcesDoc?.components?.responses?.Created).toBeDefined();
      expect(resourcesDoc?.components?.responses?.Updated).toBeDefined();
      expect(resourcesDoc?.components?.responses?.NotFound).toBeDefined();
      expect(resourcesDoc?.components?.responses?.BadRequest).toBeDefined();
    });

    it('should include the reusable Use-Snapshot header parameter in resources and descriptors', () => {
      const namespaceEdfiApiSchema = namespace?.data.edfiApiSchema as NamespaceEdfiApiSchema;
      const resourcesDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.RESOURCES];
      const descriptorsDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.DESCRIPTORS];
      const changeQueriesDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.CHANGE_QUERIES];

      expect(resourcesDoc?.components?.parameters?.['Use-Snapshot']).toMatchInlineSnapshot(`
        Object {
          "description": "Indicates whether the request should be served from the configured Snapshot.",
          "in": "header",
          "name": "Use-Snapshot",
          "schema": Object {
            "default": false,
            "type": "boolean",
          },
        }
      `);
      expect(descriptorsDoc?.components?.parameters?.['Use-Snapshot']).toEqual(
        resourcesDoc?.components?.parameters?.['Use-Snapshot'],
      );
      expect(changeQueriesDoc?.components?.parameters?.['Use-Snapshot']).toEqual(
        resourcesDoc?.components?.parameters?.['Use-Snapshot'],
      );
    });

    it('should include the shared ProblemDetails schema in every independently served document', () => {
      const namespaceEdfiApiSchema = namespace?.data.edfiApiSchema as NamespaceEdfiApiSchema;
      const resourcesDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.RESOURCES];
      const descriptorsDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.DESCRIPTORS];
      const changeQueriesDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.CHANGE_QUERIES];

      expect(resourcesDoc?.components?.schemas?.ProblemDetails).toMatchInlineSnapshot(`
        Object {
          "description": "The shared Ed-Fi Data Management Service problem details envelope for failure responses.",
          "properties": Object {
            "correlationId": Object {
              "description": "The correlation identifier of the request that produced this problem.",
              "type": "string",
            },
            "detail": Object {
              "description": "A human-readable explanation specific to this occurrence of the problem.",
              "type": "string",
            },
            "errors": Object {
              "description": "Errors that are not attributable to a specific location in the request.",
              "items": Object {
                "type": "string",
              },
              "type": "array",
            },
            "status": Object {
              "description": "The HTTP status code produced for this occurrence of the problem.",
              "format": "int32",
              "type": "integer",
            },
            "title": Object {
              "description": "A short, human-readable summary of the problem type.",
              "type": "string",
            },
            "type": Object {
              "description": "A URI reference that identifies the problem type.",
              "type": "string",
            },
            "validationErrors": Object {
              "additionalProperties": Object {
                "items": Object {
                  "type": "string",
                },
                "type": "array",
              },
              "description": "Validation failures keyed by the location of the invalid value.",
              "type": "object",
            },
          },
          "required": Array [
            "detail",
            "type",
            "title",
            "status",
            "correlationId",
            "validationErrors",
            "errors",
          ],
          "type": "object",
        }
      `);
      expect(descriptorsDoc?.components?.schemas?.ProblemDetails).toEqual(resourcesDoc?.components?.schemas?.ProblemDetails);
      expect(changeQueriesDoc?.components?.schemas?.ProblemDetails).toEqual(
        resourcesDoc?.components?.schemas?.ProblemDetails,
      );
    });

    it('should include the Snapshot Not Found response with the exact problem details example', () => {
      const namespaceEdfiApiSchema = namespace?.data.edfiApiSchema as NamespaceEdfiApiSchema;
      const resourcesDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.RESOURCES];
      const descriptorsDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.DESCRIPTORS];
      const changeQueriesDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.CHANGE_QUERIES];

      expect(resourcesDoc?.components?.responses?.SnapshotNotFound).toMatchInlineSnapshot(`
        Object {
          "content": Object {
            "application/problem+json": Object {
              "example": Object {
                "correlationId": "d4f2b1c8-6a3e-4a2f-9c1d-7b5e8a0f3c21",
                "detail": "Snapshot not found.",
                "errors": Array [],
                "status": 404,
                "title": "Not Found",
                "type": "urn:ed-fi:api:not-found",
                "validationErrors": Object {},
              },
              "schema": Object {
                "$ref": "#/components/schemas/ProblemDetails",
              },
            },
          },
          "description": "The requested resource could not be found. When the Use-Snapshot header is true, this also indicates that the configured Snapshot could not be found, for example because it has been removed.",
        }
      `);
      expect(descriptorsDoc?.components?.responses?.SnapshotNotFound).toEqual(
        resourcesDoc?.components?.responses?.SnapshotNotFound,
      );
      expect(changeQueriesDoc?.components?.responses?.SnapshotNotFound).toEqual(
        resourcesDoc?.components?.responses?.SnapshotNotFound,
      );
    });

    it('should include the snapshot Method Not Allowed response with an Allow header', () => {
      const namespaceEdfiApiSchema = namespace?.data.edfiApiSchema as NamespaceEdfiApiSchema;
      const resourcesDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.RESOURCES];
      const descriptorsDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.DESCRIPTORS];

      expect(resourcesDoc?.components?.responses?.SnapshotMethodNotAllowed).toMatchInlineSnapshot(`
        Object {
          "content": Object {
            "application/problem+json": Object {
              "example": Object {
                "correlationId": "d4f2b1c8-6a3e-4a2f-9c1d-7b5e8a0f3c21",
                "detail": "An attempt was made to modify data in a Snapshot, but this data is read-only.",
                "errors": Array [],
                "status": 405,
                "title": "Method Not Allowed with Snapshots",
                "type": "urn:ed-fi:api:snapshots:method-not-allowed",
                "validationErrors": Object {},
              },
              "schema": Object {
                "$ref": "#/components/schemas/ProblemDetails",
              },
            },
          },
          "description": "Method Not Allowed. An attempt was made to modify data in a Snapshot, but Snapshot data is read-only.",
          "headers": Object {
            "Allow": Object {
              "description": "The methods the endpoint accepts for a Snapshot request.",
              "example": "GET",
              "schema": Object {
                "type": "string",
              },
            },
          },
        }
      `);
      expect(descriptorsDoc?.components?.responses?.SnapshotMethodNotAllowed).toEqual(
        resourcesDoc?.components?.responses?.SnapshotMethodNotAllowed,
      );
    });
  });

  describe('when enhancing an extension namespace', () => {
    const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
    const coreNamespaceName = 'EdFi';
    const extensionNamespaceName = 'SampleExtension';
    let extensionNamespace: Namespace | undefined;

    beforeAll(() => {
      // Create core namespace with dummy entity
      MetaEdTextBuilder.build()
        .withBeginNamespace(coreNamespaceName)
        .withStartDomainEntity('DummyEntity')
        .withDocumentation('A dummy entity')
        .withStringIdentity('DummyId', 'doc', '30', '20')
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      // Create extension namespace with dummy entity
      MetaEdTextBuilder.build()
        .withBeginNamespace(extensionNamespaceName)
        .withStartDomainEntity('ExtensionEntity')
        .withDocumentation('An extension entity')
        .withStringIdentity('ExtensionId', 'doc', '30', '20')
        .withEndDomainEntity()
        .withEndNamespace()
        .sendToListener(new NamespaceBuilder(metaEd, []))
        .sendToListener(new DomainEntityBuilder(metaEd, []));

      const coreNamespace = metaEd.namespace.get(coreNamespaceName);
      extensionNamespace = metaEd.namespace.get(extensionNamespaceName);

      if (!coreNamespace || !extensionNamespace) {
        throw new Error('Namespaces not found');
      }

      // Mark as extension by adding dependency and setting isExtension flag
      extensionNamespace.dependencies.push(coreNamespace);
      extensionNamespace.isExtension = true;

      namespaceSetupEnhancer(metaEd);
      enhance(metaEd);
    });

    it('should not create openApiBaseDocuments for extension namespace', () => {
      const namespaceEdfiApiSchema = extensionNamespace?.data.edfiApiSchema as NamespaceEdfiApiSchema;
      expect(namespaceEdfiApiSchema?.openApiBaseDocuments).toBeUndefined();
    });
  });
});
