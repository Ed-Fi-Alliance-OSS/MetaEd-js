// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { type Namespace } from '@edfi/metaed-core';
import { type Document } from '../../src/model/OpenApiTypes';
import { type NamespaceEdfiApiSchema } from '../../src/model/Namespace';
import { type OpenApiDocumentTypeValue } from '../../src/model/api-schema/OpenApiDocumentType';
import { sortTagsByName } from '../../src/enhancer/OpenApiSpecificationEnhancerBase';

/**
 * Reconstructs a complete OpenAPI document from the base document and fragments
 * stored in ResourceSchema objects.
 *
 * @param namespace The namespace containing the base document and resource schemas
 * @param documentType The type of document to reconstruct (resources or descriptors)
 * @returns The reconstructed OpenAPI document
 */
export function reconstructOpenApiDocument(
  namespace: Namespace,
  documentType: OpenApiDocumentTypeValue,
): Document | undefined {
  const namespaceEdfiApiSchema = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;

  // Get the base document for this type
  const baseDocument = namespaceEdfiApiSchema.openApiBaseDocuments?.[documentType];
  if (!baseDocument) {
    return undefined;
  }

  // Clone the base document to avoid mutations
  const reconstructedDocument: Document = JSON.parse(JSON.stringify(baseDocument));

  // Initialize collections if they don't exist
  if (!reconstructedDocument.paths) reconstructedDocument.paths = {};
  if (!reconstructedDocument.components) reconstructedDocument.components = {};
  if (!reconstructedDocument.components.schemas) reconstructedDocument.components.schemas = {};
  if (!reconstructedDocument.tags) reconstructedDocument.tags = [];

  // Collect all fragments from ResourceSchema objects
  const resourceSchemas = namespaceEdfiApiSchema.apiSchema?.projectSchema?.resourceSchemas || {};

  Object.values(resourceSchemas).forEach((resourceSchema) => {
    const fragment = resourceSchema.openApiFragments?.[documentType];
    if (!fragment) return;

    // Don't process extension resources in core document reconstruction
    if (resourceSchema.isResourceExtension) return;

    // Merge paths
    if (fragment.paths) {
      Object.assign(reconstructedDocument.paths, fragment.paths);
    }

    // Merge schemas
    if (fragment.components?.schemas) {
      Object.assign(reconstructedDocument.components!.schemas!, fragment.components.schemas);
    }

    // Merge tags
    if (fragment.tags) {
      reconstructedDocument.tags!.push(...fragment.tags);
    }
  });

  // Also include abstract entities - they have schemas but no paths/tags
  // Abstract entities are only in resources document, not descriptors
  if (documentType === 'resources') {
    const abstractResources = namespaceEdfiApiSchema.apiSchema?.projectSchema?.abstractResources || {};
    Object.entries(abstractResources).forEach(([_, abstractResource]: [string, any]) => {
      const fragment = abstractResource.openApiFragment;
      if (!fragment) return;

      // Merge schemas
      if (fragment.components?.schemas) {
        Object.assign(reconstructedDocument.components!.schemas!, fragment.components.schemas);
      }
    });
  }

  // Sort tags alphabetically
  if (reconstructedDocument.tags && reconstructedDocument.tags.length > 0) {
    reconstructedDocument.tags = sortTagsByName(reconstructedDocument.tags);
  }

  return reconstructedDocument;
}
