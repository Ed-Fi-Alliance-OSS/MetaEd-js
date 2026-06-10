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
      expect(resourcesDoc?.components?.responses?.NotFoundUseSnapshot).toBeUndefined();
      expect(JSON.stringify(resourcesDoc)).not.toContain('Use-Snapshot');
      expect(JSON.stringify(resourcesDoc)).not.toContain('NotFoundUseSnapshot');
      expect(JSON.stringify(resourcesDoc)).not.toContain('snapshot');
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
      expect(descriptorsDoc?.components?.schemas).toEqual({});
      expect(descriptorsDoc?.components?.responses).toBeDefined();
      expect(descriptorsDoc?.components?.parameters).toBeDefined();
      expect(descriptorsDoc?.components?.responses?.NotFoundUseSnapshot).toBeUndefined();
      expect(JSON.stringify(descriptorsDoc)).not.toContain('Use-Snapshot');
      expect(JSON.stringify(descriptorsDoc)).not.toContain('NotFoundUseSnapshot');
      expect(JSON.stringify(descriptorsDoc)).not.toContain('snapshot');
      expect(descriptorsDoc?.tags).toEqual([]);
    });

    it('should create base document for change queries', () => {
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
              },
              "summary": "Retrieves the available change version range.",
            },
          },
        }
      `);
      expect(changeQueriesDoc?.paths['/availableChangeVersions']?.get?.parameters).toBeUndefined();
      expect(changeQueriesDoc?.paths['/changeQueries/v1/availableChangeVersions']).toBeUndefined();
      expect(resourcesDoc?.paths['/availableChangeVersions']).toBeUndefined();
      expect(descriptorsDoc?.paths['/availableChangeVersions']).toBeUndefined();
      expect(changeQueriesDoc?.components?.schemas).toEqual({});
      expect(changeQueriesDoc?.components?.responses).toEqual({});
      expect(changeQueriesDoc?.components?.parameters).toEqual({});
      expect(changeQueriesDoc?.components?.securitySchemes).toBeUndefined();
      expect(changeQueriesDoc?.security).toBeUndefined();
      expect(JSON.stringify(changeQueriesDoc)).not.toContain('Use-Snapshot');
      expect(JSON.stringify(changeQueriesDoc)).not.toContain('NotFoundUseSnapshot');
      expect(JSON.stringify(changeQueriesDoc)).not.toContain('snapshot');
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
    });

    it('should include hardcoded responses', () => {
      const namespaceEdfiApiSchema = namespace?.data.edfiApiSchema as NamespaceEdfiApiSchema;
      const resourcesDoc = namespaceEdfiApiSchema.openApiBaseDocuments?.[OpenApiDocumentType.RESOURCES];

      expect(resourcesDoc?.components?.responses?.Created).toBeDefined();
      expect(resourcesDoc?.components?.responses?.Updated).toBeDefined();
      expect(resourcesDoc?.components?.responses?.NotFound).toBeDefined();
      expect(resourcesDoc?.components?.responses?.NotFoundUseSnapshot).toBeUndefined();
      expect(resourcesDoc?.components?.responses?.BadRequest).toBeDefined();
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
