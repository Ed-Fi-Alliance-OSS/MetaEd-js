// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { readFileSync } from 'fs';
import path from 'path';
import { Namespace, newNamespace } from '@edfi/metaed-core';
import SwaggerParser from '@apidevtools/swagger-parser';
import { reconstructOpenApiDocument } from './OpenApiDocumentReconstructor';
import { OpenApiDocumentType } from '../../src/model/api-schema/OpenApiDocumentType';
import { NamespaceEdfiApiSchema } from '../../src/model/Namespace';

/**
 * Deep sort object keys recursively to normalize ordering for comparison
 */
function deepSortKeys(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(deepSortKeys);
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj)
      .sort()
      .reduce((result: any, key: string) => {
        result[key] = deepSortKeys(obj[key]);
        return result;
      }, {});
  }
  return obj;
}

/**
 * Normalize an OpenAPI document for comparison by:
 * - Sorting all object keys recursively
 * - Sorting arrays of objects by their 'name' property if present
 * - Removing any undefined or null values
 */
function normalizeOpenApiDocument(doc: any): any {
  const normalized = deepSortKeys(doc);

  // Sort tags array by name if present
  if (normalized.tags && Array.isArray(normalized.tags)) {
    normalized.tags = normalized.tags.sort((a: any, b: any) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }

  // Remove null/undefined values
  return JSON.parse(JSON.stringify(normalized));
}

/**
 * Reconstruct extension resource fragments from the new distributed format
 * to match the old monolithic format for comparison
 */
function reconstructExtensionResourceFragments(newApiSchema: any): any {
  const result: any = {
    exts: {},
    newPaths: {},
    newSchemas: {},
    newTags: [],
  };

  // Collect from all extension resources
  Object.values(newApiSchema.projectSchema.resourceSchemas).forEach((resourceSchema: any) => {
    if (resourceSchema.isResourceExtension) {
      const fragment = resourceSchema.openApiFragments?.resources;
      if (fragment) {
        // Merge exts
        if (fragment.exts) {
          Object.assign(result.exts, fragment.exts);
        }
        // Merge paths as newPaths
        if (fragment.paths) {
          Object.assign(result.newPaths, fragment.paths);
        }
        // Merge schemas as newSchemas
        if (fragment.components?.schemas) {
          Object.assign(result.newSchemas, fragment.components.schemas);
        }
        // Collect tags
        if (fragment.tags) {
          result.newTags.push(...fragment.tags);
        }
      }
    }
  });

  // Also collect from regular resources that are new to the extension
  Object.values(newApiSchema.projectSchema.resourceSchemas).forEach((resourceSchema: any) => {
    if (!resourceSchema.isResourceExtension && !resourceSchema.isDescriptor) {
      const fragment = resourceSchema.openApiFragments?.resources;
      if (fragment?.paths) {
        Object.assign(result.newPaths, fragment.paths);
      }
      if (fragment?.components?.schemas) {
        Object.assign(result.newSchemas, fragment.components.schemas);
      }
      if (fragment?.tags) {
        result.newTags.push(...fragment.tags);
      }
    }
  });

  // Sort tags by name for consistency
  result.newTags = result.newTags.sort((a: any, b: any) => a.name.localeCompare(b.name));

  return result;
}

/**
 * Reconstruct extension descriptor fragments from the new distributed format
 * to match the old monolithic format for comparison
 */
function reconstructExtensionDescriptorFragments(newApiSchema: any): any {
  const result: any = {
    exts: {},
    newPaths: {},
    newSchemas: {},
    newTags: [],
  };

  // For extension projects, all descriptors are new
  if (newApiSchema.projectSchema.isExtensionProject) {
    Object.values(newApiSchema.projectSchema.resourceSchemas).forEach((resourceSchema: any) => {
      if (resourceSchema.isDescriptor) {
        const fragment = resourceSchema.openApiFragments?.descriptors;
        if (fragment) {
          // Merge paths as newPaths
          if (fragment.paths) {
            Object.assign(result.newPaths, fragment.paths);
          }
          // Merge schemas as newSchemas
          if (fragment.components?.schemas) {
            Object.assign(result.newSchemas, fragment.components.schemas);
          }
          // Collect tags
          if (fragment.tags) {
            result.newTags.push(...fragment.tags);
          }
        }
      }
    });
  }

  // Sort tags by name for consistency
  result.newTags = result.newTags.sort((a: any, b: any) => a.name.localeCompare(b.name));

  return result;
}

/**
 * Extract OpenAPI fragments from the old monolithic document for a specific resource
 */
function extractResourceFragment(fullDocument: any, resourceName: string): any {
  const fragment: any = {
    paths: {},
    components: { schemas: {} },
    tags: [],
  };

  // Extract paths for this resource
  Object.entries(fullDocument.paths || {}).forEach(([apiPath, pathItem]) => {
    // Check if this path belongs to the resource
    if (apiPath.includes(`/${resourceName}`) || apiPath.includes(`/${resourceName}/`)) {
      fragment.paths[apiPath] = pathItem;
    }
  });

  // Extract tags for this resource
  (fullDocument.tags || []).forEach((tag: any) => {
    if (tag.name === resourceName) {
      fragment.tags.push(tag);
    }
  });

  // For schemas, we need to identify which schemas belong to this resource
  // This is approximate - in reality, the enhancers know exactly which schemas belong to which resource
  // Handle both singular and plural forms
  const resourceNameSingular = resourceName.endsWith('s') ? resourceName.slice(0, -1) : resourceName;
  const resourceNameCapitalized = resourceNameSingular.charAt(0).toUpperCase() + resourceNameSingular.slice(1);
  const schemaPrefix = `edFi_${resourceNameSingular}`;
  const schemaPrefixCapitalized = `EdFi_${resourceNameCapitalized}`;

  Object.entries(fullDocument.components?.schemas || {}).forEach(([schemaName, schema]) => {
    // Check both camelCase and PascalCase versions
    if (
      schemaName.startsWith(schemaPrefix) ||
      schemaName.startsWith(schemaPrefixCapitalized) ||
      schemaName.toLowerCase().includes(resourceNameSingular.toLowerCase())
    ) {
      fragment.components.schemas[schemaName] = schema;
    }
  });

  return fragment;
}

describe('OpenAPI Document Reconstruction Round Trip', () => {
  let oldApiSchema: any;
  let newApiSchema: any;

  beforeAll(() => {
    // Load the old DS 5.2 API schema
    const oldSchemaPath = path.resolve(__dirname, './artifact/round-trip/old-ds-5.2-api-schema.json');
    oldApiSchema = JSON.parse(readFileSync(oldSchemaPath, 'utf8'));

    // Load the new DS 5.2 API schema
    const newSchemaPath = path.resolve(__dirname, './artifact/v7_3/ds-5.2-api-schema-authoritative.json');
    newApiSchema = JSON.parse(readFileSync(newSchemaPath, 'utf8'));
  });

  describe('Current Schema Structure Validation', () => {
    it('should have the new schema structure with openApiBaseDocuments and resourceSchemas', () => {
      expect(newApiSchema.projectSchema.openApiBaseDocuments).toBeDefined();
      expect(newApiSchema.projectSchema.resourceSchemas).toBeDefined();

      // Should have base documents for resources and descriptors
      expect(newApiSchema.projectSchema.openApiBaseDocuments.resources).toBeDefined();
      expect(newApiSchema.projectSchema.openApiBaseDocuments.descriptors).toBeDefined();

      // Should have resource schemas
      expect(Object.keys(newApiSchema.projectSchema.resourceSchemas).length).toBeGreaterThan(0);
    });

    it('should have the old schema structure with monolithic OpenAPI documents', () => {
      expect(oldApiSchema.projectSchema.openApiCoreResources).toBeDefined();
      expect(oldApiSchema.projectSchema.openApiCoreDescriptors).toBeDefined();
    });
  });

  describe('OpenAPI Document Comparison', () => {
    it('should have identical OpenAPI Core Resources documents after normalization', () => {
      // Reconstruct the new resources document from fragments
      const mockNamespace: Namespace = newNamespace();
      mockNamespace.namespaceName = 'EdFi';
      mockNamespace.data.edfiApiSchema = {
        apiSchema: newApiSchema,
        openApiBaseDocuments: newApiSchema.projectSchema.openApiBaseDocuments,
      } as NamespaceEdfiApiSchema;

      const oldCoreResources = oldApiSchema.projectSchema.openApiCoreResources;
      const newCoreResources = reconstructOpenApiDocument(mockNamespace, OpenApiDocumentType.RESOURCES);

      // Normalize both documents for comparison
      const normalizedOld = normalizeOpenApiDocument(oldCoreResources);
      const normalizedNew = normalizeOpenApiDocument(newCoreResources);

      // Compare normalized documents
      expect(normalizedNew).toEqual(normalizedOld);
    });

    it('should have identical OpenAPI Core Descriptors documents after normalization', () => {
      // Reconstruct the new descriptors document from fragments
      const mockNamespace: Namespace = newNamespace();
      mockNamespace.namespaceName = 'EdFi';
      mockNamespace.data.edfiApiSchema = {
        apiSchema: newApiSchema,
        openApiBaseDocuments: newApiSchema.projectSchema.openApiBaseDocuments,
      } as NamespaceEdfiApiSchema;

      const oldCoreDescriptors = oldApiSchema.projectSchema.openApiCoreDescriptors;
      const newCoreDescriptors = reconstructOpenApiDocument(mockNamespace, OpenApiDocumentType.DESCRIPTORS);

      // Normalize both documents for comparison
      const normalizedOld = normalizeOpenApiDocument(oldCoreDescriptors);
      const normalizedNew = normalizeOpenApiDocument(newCoreDescriptors);

      // Compare normalized documents
      expect(normalizedNew).toEqual(normalizedOld);
    });
  });

  describe('OpenAPI Fragment Reconstruction Verification', () => {
    it('should successfully reconstruct documents from fragments', () => {
      // Verify that fragments have been distributed to resourceSchemas
      const hasFragments = Object.values(newApiSchema.projectSchema.resourceSchemas).some(
        (rs: any) => rs.openApiFragments !== undefined,
      );

      expect(hasFragments).toBe(true);

      // Create a mock namespace for reconstruction
      const mockNamespace: Namespace = newNamespace();
      mockNamespace.namespaceName = 'EdFi';
      mockNamespace.data.edfiApiSchema = {
        apiSchema: newApiSchema,
        openApiBaseDocuments: newApiSchema.projectSchema.openApiBaseDocuments,
      } as NamespaceEdfiApiSchema;

      // Reconstruct resources document and verify it matches the original
      const reconstructedResources = reconstructOpenApiDocument(mockNamespace, OpenApiDocumentType.RESOURCES);
      const originalResources = oldApiSchema.projectSchema.openApiCoreResources;

      expect(normalizeOpenApiDocument(reconstructedResources)).toEqual(normalizeOpenApiDocument(originalResources));

      // Reconstruct descriptors document and verify it matches the original
      const reconstructedDescriptors = reconstructOpenApiDocument(mockNamespace, OpenApiDocumentType.DESCRIPTORS);
      const originalDescriptors = oldApiSchema.projectSchema.openApiCoreDescriptors;

      expect(normalizeOpenApiDocument(reconstructedDescriptors)).toEqual(normalizeOpenApiDocument(originalDescriptors));
    });
  });

  describe('Descriptor Fragment Validation', () => {
    it('should have descriptor fragments that match the original monolithic document', () => {
      // Pick a few descriptor resources to validate
      const descriptorsToCheck = ['academicSubjectDescriptors', 'gradeLevelDescriptors', 'stateAbbreviationDescriptors'];

      const oldDescriptorDoc = oldApiSchema.projectSchema.openApiCoreDescriptors;

      descriptorsToCheck.forEach((descriptorName) => {
        // Get the descriptor resource schema
        const descriptorSchema = newApiSchema.projectSchema.resourceSchemas[descriptorName];
        expect(descriptorSchema).toBeDefined();
        expect(descriptorSchema.isDescriptor).toBe(true);

        // Get the descriptor fragment
        const fragment = descriptorSchema.openApiFragments?.[OpenApiDocumentType.DESCRIPTORS];
        expect(fragment).toBeDefined();

        // Validate paths
        if (fragment?.paths) {
          Object.entries(fragment.paths).forEach(([fragmentPath, pathItem]) => {
            // The path should exist in the old document
            expect(oldDescriptorDoc.paths[fragmentPath]).toBeDefined();

            // Normalize and compare the path items
            expect(normalizeOpenApiDocument(pathItem)).toEqual(
              normalizeOpenApiDocument(oldDescriptorDoc.paths[fragmentPath]),
            );
          });
        }

        // Validate schemas
        if (fragment?.components?.schemas) {
          Object.entries(fragment.components.schemas).forEach(([schemaName, schema]) => {
            // The schema should exist in the old document
            expect(oldDescriptorDoc.components.schemas[schemaName]).toBeDefined();

            // Compare the schemas
            expect(schema).toEqual(oldDescriptorDoc.components.schemas[schemaName]);
          });
        }

        // Validate tags
        if (fragment?.tags) {
          fragment.tags.forEach((tag) => {
            // Find the tag in the old document
            const oldTag = oldDescriptorDoc.tags.find((t: any) => t.name === tag.name);
            expect(oldTag).toBeDefined();
            expect(tag).toEqual(oldTag);
          });
        }
      });
    });

    it('should reconstruct descriptor document from individual fragments', () => {
      // Manually reconstruct descriptors document from fragments
      const reconstructed: any = {
        ...newApiSchema.projectSchema.openApiBaseDocuments.descriptors,
        paths: {},
        tags: [],
      };

      // Collect all descriptor fragments
      Object.entries(newApiSchema.projectSchema.resourceSchemas).forEach(([, schema]: [string, any]) => {
        if (schema.isDescriptor && schema.openApiFragments?.[OpenApiDocumentType.DESCRIPTORS]) {
          const fragment = schema.openApiFragments[OpenApiDocumentType.DESCRIPTORS];

          // Merge paths
          if (fragment.paths) {
            Object.assign(reconstructed.paths, fragment.paths);
          }

          // Merge schemas
          if (fragment.components?.schemas) {
            Object.assign(reconstructed.components.schemas, fragment.components.schemas);
          }

          // Merge tags
          if (fragment.tags) {
            reconstructed.tags.push(...fragment.tags);
          }
        }
      });

      // Sort tags for comparison
      reconstructed.tags = reconstructed.tags.sort((a: any, b: any) => a.name.localeCompare(b.name));

      // Compare with original
      const oldDescriptorDoc = oldApiSchema.projectSchema.openApiCoreDescriptors;
      expect(normalizeOpenApiDocument(reconstructed)).toEqual(normalizeOpenApiDocument(oldDescriptorDoc));
    });

    it('should correctly identify descriptor resources', () => {
      // Count descriptor resources
      const descriptorCount = Object.values(newApiSchema.projectSchema.resourceSchemas).filter(
        (schema: any) => schema.isDescriptor === true,
      ).length;

      expect(descriptorCount).toBeGreaterThan(0);

      // All descriptor resources should have descriptor fragments
      Object.entries(newApiSchema.projectSchema.resourceSchemas).forEach(([, schema]: [string, any]) => {
        if (schema.isDescriptor) {
          expect(schema.openApiFragments).toBeDefined();
          expect(schema.openApiFragments[OpenApiDocumentType.DESCRIPTORS]).toBeDefined();

          // Descriptors should NOT have resource fragments
          expect(schema.openApiFragments[OpenApiDocumentType.RESOURCES]).toBeUndefined();
        }
      });
    });
  });

  describe('Fragment Extraction Examples', () => {
    it('should be able to extract fragments for individual resources', () => {
      // This demonstrates how fragments should look when extracted from the monolithic document
      const studentsFragment = extractResourceFragment(oldApiSchema.projectSchema.openApiCoreResources, 'students');

      // Should have paths for students
      expect(Object.keys(studentsFragment.paths)).toContain('/ed-fi/students');
      expect(Object.keys(studentsFragment.paths)).toContain('/ed-fi/students/{id}');

      // Should have the students tag
      expect(studentsFragment.tags).toHaveLength(1);
      expect(studentsFragment.tags[0].name).toBe('students');

      // Should have student-related schemas
      const schemaNames = Object.keys(studentsFragment.components.schemas);
      expect(schemaNames.some((name) => name.includes('Student'))).toBe(true);
    });

    it('should write out fragment examples for reference', () => {
      // This is helpful for understanding what the fragments should look like
      const debugOutput = {
        studentsFragment: extractResourceFragment(oldApiSchema.projectSchema.openApiCoreResources, 'students'),
        schoolsFragment: extractResourceFragment(oldApiSchema.projectSchema.openApiCoreResources, 'schools'),
        gradeLevelDescriptorsFragment: extractResourceFragment(
          oldApiSchema.projectSchema.openApiCoreDescriptors,
          'gradeLevelDescriptors',
        ),
      };

      // Verify fragments have expected structure
      Object.values(debugOutput).forEach((fragment) => {
        expect(fragment).toHaveProperty('paths');
        expect(fragment).toHaveProperty('components.schemas');
        expect(fragment).toHaveProperty('tags');
      });
    });
  });

  describe('Extension Fragment Comparison', () => {
    let oldTpdmSchema: any;
    let newTpdmSchema: any;

    beforeAll(() => {
      // Load the old TPDM API schema
      const oldTpdmPath = path.resolve(__dirname, './artifact/round-trip/old-tpdm-api-schema.json');
      oldTpdmSchema = JSON.parse(readFileSync(oldTpdmPath, 'utf8'));

      // Load the new TPDM API schema
      const newTpdmPath = path.resolve(__dirname, './artifact/v7_3/tpdm-api-schema-authoritative.json');
      newTpdmSchema = JSON.parse(readFileSync(newTpdmPath, 'utf8'));
    });

    describe('TPDM Schema Structure Validation', () => {
      it('should have the old TPDM schema structure with extension fragments', () => {
        expect(oldTpdmSchema.projectSchema.isExtensionProject).toBe(true);
        expect(oldTpdmSchema.projectSchema.openApiExtensionResourceFragments).toBeDefined();
        expect(oldTpdmSchema.projectSchema.openApiExtensionDescriptorFragments).toBeDefined();
      });

      it('should have the new TPDM schema structure with distributed fragments', () => {
        expect(newTpdmSchema.projectSchema.isExtensionProject).toBe(true);
        expect(newTpdmSchema.projectSchema.resourceSchemas).toBeDefined();

        // Should have extension resources
        const extensionResources = Object.values(newTpdmSchema.projectSchema.resourceSchemas).filter(
          (schema: any) => schema.isResourceExtension,
        );
        expect(extensionResources.length).toBeGreaterThan(0);
      });
    });

    describe('TPDM Extension Resource Fragments', () => {
      it('should reconstruct identical extension resource fragments', () => {
        const oldFragments = oldTpdmSchema.projectSchema.openApiExtensionResourceFragments;
        const reconstructedFragments = reconstructExtensionResourceFragments(newTpdmSchema);

        // Normalize for comparison
        const normalizedOld = normalizeOpenApiDocument(oldFragments);
        const normalizedReconstructed = normalizeOpenApiDocument(reconstructedFragments);

        // Compare the fragments
        expect(normalizedReconstructed).toEqual(normalizedOld);
      });

      it('should have matching exts in extension resource fragments', () => {
        const oldExts = oldTpdmSchema.projectSchema.openApiExtensionResourceFragments.exts;
        const reconstructedFragments = reconstructExtensionResourceFragments(newTpdmSchema);

        expect(Object.keys(reconstructedFragments.exts).sort()).toEqual(Object.keys(oldExts).sort());

        // Compare each ext schema
        Object.entries(oldExts).forEach(([schemaName, schema]) => {
          expect(reconstructedFragments.exts[schemaName]).toEqual(schema);
        });
      });
    });

    describe('TPDM Extension Descriptor Fragments', () => {
      it('should reconstruct identical extension descriptor fragments', () => {
        const oldFragments = oldTpdmSchema.projectSchema.openApiExtensionDescriptorFragments;
        const reconstructedFragments = reconstructExtensionDescriptorFragments(newTpdmSchema);

        // Normalize for comparison
        const normalizedOld = normalizeOpenApiDocument(oldFragments);
        const normalizedReconstructed = normalizeOpenApiDocument(reconstructedFragments);

        // Compare the fragments
        expect(normalizedReconstructed).toEqual(normalizedOld);
      });

      it('should have all extension descriptor paths', () => {
        const oldPaths = oldTpdmSchema.projectSchema.openApiExtensionDescriptorFragments.newPaths;
        const reconstructedFragments = reconstructExtensionDescriptorFragments(newTpdmSchema);

        expect(Object.keys(reconstructedFragments.newPaths).sort()).toEqual(Object.keys(oldPaths).sort());
      });

      it('should have all extension descriptor schemas', () => {
        const oldSchemas = oldTpdmSchema.projectSchema.openApiExtensionDescriptorFragments.newSchemas;
        const reconstructedFragments = reconstructExtensionDescriptorFragments(newTpdmSchema);

        expect(Object.keys(reconstructedFragments.newSchemas).sort()).toEqual(Object.keys(oldSchemas).sort());
      });
    });
  });

  describe('OpenAPI 3.0 Specification Validation', () => {
    let reconstructedResources: any;
    let reconstructedDescriptors: any;
    let mockNamespace: Namespace;

    beforeAll(() => {
      // Set up mock namespace for reconstruction
      mockNamespace = newNamespace();
      mockNamespace.namespaceName = 'EdFi';
      mockNamespace.data.edfiApiSchema = {
        apiSchema: newApiSchema,
        openApiBaseDocuments: newApiSchema.projectSchema.openApiBaseDocuments,
      } as NamespaceEdfiApiSchema;

      // Reconstruct documents
      reconstructedResources = reconstructOpenApiDocument(mockNamespace, OpenApiDocumentType.RESOURCES);
      reconstructedDescriptors = reconstructOpenApiDocument(mockNamespace, OpenApiDocumentType.DESCRIPTORS);
    });

    it('should produce a valid OpenAPI 3.0 resources document', async () => {
      // Validate using swagger-parser -- Brad confirmed throws error if invalid
      await expect(SwaggerParser.validate(reconstructedResources)).resolves.toBeDefined();
    });

    it('should produce a valid OpenAPI 3.0 descriptors document', async () => {
      // Validate using swagger-parser -- Brad confirmed throws error if invalid
      await expect(SwaggerParser.validate(reconstructedDescriptors)).resolves.toBeDefined();
    });

    it('should include all required OpenAPI 3.0 components', () => {
      // Check required fields for resources document
      expect(reconstructedResources.openapi).toBe('3.0.0');
      expect(reconstructedResources.info).toBeDefined();
      expect(reconstructedResources.info.title).toBeDefined();
      expect(reconstructedResources.info.version).toBeDefined();
      expect(reconstructedResources.paths).toBeDefined();
      expect(reconstructedResources.components).toBeDefined();

      // Check that paths have valid operations
      Object.entries(reconstructedResources.paths).forEach(([apiPath, pathItem]: [string, any]) => {
        expect(apiPath).toMatch(/^\/[a-zA-Z0-9\-/_{}]+$/); // Valid path pattern

        // Check for at least one operation
        const operations = ['get', 'post', 'put', 'delete'];
        const hasOperation = operations.some((op) => pathItem[op] !== undefined);
        expect(hasOperation).toBe(true);
      });

      // Same checks for descriptors
      expect(reconstructedDescriptors.openapi).toBe('3.0.0');
      expect(reconstructedDescriptors.info).toBeDefined();
      expect(reconstructedDescriptors.paths).toBeDefined();
    });

    it('should have valid schema references', async () => {
      // Use swagger-parser to dereference and validate all $ref
      const dereferencedResources = await SwaggerParser.dereference(reconstructedResources);
      const dereferencedDescriptors = await SwaggerParser.dereference(reconstructedDescriptors);

      // All references should be resolved
      expect(dereferencedResources).toBeDefined();
      expect(dereferencedDescriptors).toBeDefined();

      // Check that dereferencing didn't throw errors
      expect((dereferencedResources as any).components).toBeDefined();
      expect((dereferencedDescriptors as any).components).toBeDefined();
    });

    it('should validate with detailed error reporting', async () => {
      // Test both documents with detailed error reporting
      const documents = [
        { name: 'resources', doc: reconstructedResources },
        { name: 'descriptors', doc: reconstructedDescriptors },
      ];

      // eslint-disable-next-line no-restricted-syntax
      for (const { doc } of documents) {
        await SwaggerParser.validate(doc);
      }
    });

    it('should have valid operation IDs', () => {
      // Check each document separately for operation ID uniqueness
      [
        { name: 'resources', doc: reconstructedResources },
        { name: 'descriptors', doc: reconstructedDescriptors },
      ].forEach(({ name, doc }) => {
        const operationIds = new Set<string>();

        Object.values(doc.paths || {}).forEach((pathItem: any) => {
          ['get', 'post', 'put', 'delete'].forEach((method) => {
            const operation = pathItem[method];
            if (operation && operation.operationId) {
              // Check for duplicate operation IDs within the same document
              if (operationIds.has(operation.operationId)) {
                throw new Error(`Duplicate operation ID '${operation.operationId}' found in ${name} document`);
              }
              operationIds.add(operation.operationId);

              // Check operation ID format
              expect(operation.operationId).toMatch(/^[a-zA-Z0-9_]+$/);
            }
          });
        });
      });
    });

    it('should have valid response definitions', () => {
      [reconstructedResources, reconstructedDescriptors].forEach((doc) => {
        Object.values(doc.paths || {}).forEach((pathItem: any) => {
          ['get', 'post', 'put', 'delete'].forEach((method) => {
            const operation = pathItem[method];
            if (operation) {
              // Every operation should have responses
              expect(operation.responses).toBeDefined();

              // Should have at least one response code
              expect(Object.keys(operation.responses).length).toBeGreaterThan(0);

              // Common response codes should be properly formatted
              Object.keys(operation.responses).forEach((statusCode) => {
                expect(statusCode).toMatch(/^[1-5]\d{2}$|^default$/);
              });
            }
          });
        });
      });
    });
  });

  describe('Core Resource Validation', () => {
    let reconstructedResources: any;
    let mockNamespace: Namespace;

    beforeAll(() => {
      // Load the old DS 5.2 API schema
      const oldSchemaPath = path.resolve(__dirname, './artifact/round-trip/old-ds-5.2-api-schema.json');
      oldApiSchema = JSON.parse(readFileSync(oldSchemaPath, 'utf8'));

      // Load the new DS 5.2 API schema
      const newSchemaPath = path.resolve(__dirname, './artifact/v7_3/ds-5.2-api-schema-authoritative.json');
      newApiSchema = JSON.parse(readFileSync(newSchemaPath, 'utf8'));

      // Set up mock namespace for reconstruction
      mockNamespace = newNamespace();
      mockNamespace.namespaceName = 'EdFi';
      mockNamespace.data.edfiApiSchema = {
        apiSchema: newApiSchema,
        openApiBaseDocuments: newApiSchema.projectSchema.openApiBaseDocuments,
      } as NamespaceEdfiApiSchema;

      // Reconstruct resources document
      reconstructedResources = reconstructOpenApiDocument(mockNamespace, OpenApiDocumentType.RESOURCES);
    });

    it('should include SchoolYearType resource in reconstructed document', () => {
      const oldResources = oldApiSchema.projectSchema.openApiCoreResources;

      // Check paths
      expect(reconstructedResources.paths['/ed-fi/schoolYearTypes']).toBeDefined();
      expect(reconstructedResources.paths['/ed-fi/schoolYearTypes/{id}']).toBeDefined();

      // Verify paths match old schema
      expect(reconstructedResources.paths['/ed-fi/schoolYearTypes']).toEqual(oldResources.paths['/ed-fi/schoolYearTypes']);
      expect(reconstructedResources.paths['/ed-fi/schoolYearTypes/{id}']).toEqual(
        oldResources.paths['/ed-fi/schoolYearTypes/{id}'],
      );

      // Check tag
      const schoolYearTag = reconstructedResources.tags.find((tag: any) => tag.name === 'schoolYearTypes');
      expect(schoolYearTag).toBeDefined();
      expect(schoolYearTag.description).toBe('Identifier for a school year.');

      // Check schema
      expect(reconstructedResources.components.schemas.EdFi_SchoolYearTypeReference).toBeDefined();
      expect(reconstructedResources.components.schemas.EdFi_SchoolYearTypeReference).toEqual(
        oldResources.components.schemas.EdFi_SchoolYearTypeReference,
      );
    });

    it('should include EducationOrganization abstract resource in reconstructed document', () => {
      const oldResources = oldApiSchema.projectSchema.openApiCoreResources;

      // EducationOrganization is abstract, so it should only have schemas, no paths
      expect(reconstructedResources.paths['/ed-fi/educationOrganizations']).toBeUndefined();

      // Check main schema exists
      expect(reconstructedResources.components.schemas.EdFi_EducationOrganization).toBeDefined();

      // Verify schema matches old schema
      expect(reconstructedResources.components.schemas.EdFi_EducationOrganization).toEqual(
        oldResources.components.schemas.EdFi_EducationOrganization,
      );

      // Check that related schemas exist
      expect(reconstructedResources.components.schemas.EdFi_EducationOrganization_Address).toBeDefined();
      expect(
        reconstructedResources.components.schemas.EdFi_EducationOrganization_EducationOrganizationCategory,
      ).toBeDefined();
    });

    it('should include GeneralStudentProgramAssociation abstract resource in reconstructed document', () => {
      const oldResources = oldApiSchema.projectSchema.openApiCoreResources;

      // GeneralStudentProgramAssociation is abstract, so it should only have schemas, no paths
      expect(reconstructedResources.paths['/ed-fi/generalStudentProgramAssociations']).toBeUndefined();

      // Check schema exists
      expect(reconstructedResources.components.schemas.EdFi_GeneralStudentProgramAssociation).toBeDefined();

      // Verify schema matches old schema
      expect(reconstructedResources.components.schemas.EdFi_GeneralStudentProgramAssociation).toEqual(
        oldResources.components.schemas.EdFi_GeneralStudentProgramAssociation,
      );

      // Also check that concrete subclasses exist (e.g., StudentProgramAssociation)
      expect(reconstructedResources.components.schemas.EdFi_StudentProgramAssociation).toBeDefined();
      expect(reconstructedResources.paths['/ed-fi/studentProgramAssociations']).toBeDefined();
    });
  });
});
