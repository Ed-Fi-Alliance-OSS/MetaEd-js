// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { type MetaEdEnvironment, type EnhancerResult, type Namespace } from '@edfi/metaed-core';
import { ComponentsObject, Document } from '../model/OpenApiTypes';
import { NamespaceEdfiApiSchema } from '../model/Namespace';
import { createHardcodedParameterResponses, createHardcodedComponentParameters } from './OpenApiSpecificationEnhancerBase';
import { newSchoolYearOpenApis } from './OpenApiComponentEnhancerBase';

/**
 * Creates the base OpenAPI document structure without paths, schemas, or tags.
 * This structure is common to all OpenAPI documents (resources, descriptors, etc.)
 */
function createBaseOpenApiDocument(metaEd: MetaEdEnvironment, documentType: string): Document {
  const components: ComponentsObject = {
    schemas: {},
    responses: createHardcodedParameterResponses(),
    parameters: createHardcodedComponentParameters(),
  };

  const openApiDocument: Document = {
    openapi: '3.0.0',
    info: {
      title: 'Ed-Fi Data Management Service API',
      description:
        'The Ed-Fi DMS API enables applications to read and write education data stored in an Ed-Fi DMS through a secure REST interface. \n***\n > *Note: Consumers of DMS information should sanitize all data for display and storage. DMS provides reasonable safeguards against cross-site scripting attacks and other malicious content, but the platform does not and cannot guarantee that the data it contains is free of all potentially harmful content.* \n***\n',
      version: '1',
      contact: { url: 'https://www.ed-fi.org/what-is-ed-fi/contact/' },
    },
    servers: [
      {
        url: '',
      },
    ],
    paths: {},
    components,
    tags: [],
  };

  // Add hardcoded SchoolYearTypeReference schema only to resources document
  if (documentType === 'resources') {
    const schoolYearOpenApis = newSchoolYearOpenApis(metaEd.minSchoolYear, metaEd.maxSchoolYear);
    components.schemas!.EdFi_SchoolYearTypeReference = schoolYearOpenApis.schoolYearEnumerationOpenApi;
  }

  return openApiDocument;
}

/**
 * Enhancer that creates the base OpenAPI document structures for core namespaces.
 * These base documents will be populated with fragments from ResourceSchema objects
 * during the generation phase.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    if (namespace.isExtension) return;

    const namespaceEdfiApiSchema: NamespaceEdfiApiSchema = namespace.data.edfiApiSchema as NamespaceEdfiApiSchema;

    // Create base documents for resources and descriptors
    namespaceEdfiApiSchema.openApiBaseDocuments = {
      resources: createBaseOpenApiDocument(metaEd, 'resources'),
      descriptors: createBaseOpenApiDocument(metaEd, 'descriptors'),
    };
  });

  return {
    enhancerName: 'OpenApiBaseDocumentEnhancer',
    success: true,
  };
}
