// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { readFileSync } from 'node:fs';
import path from 'path';
import SwaggerParser from '@apidevtools/swagger-parser';
import type { OpenAPI } from 'openapi-types';
import type { ComponentsObject, Document, Schemas, TagObject } from '../../src/model/OpenApiTypes';
import { OpenApiDocumentType, type OpenApiDocumentTypeValue } from '../../src/model/api-schema/OpenApiDocumentType';
import type { OpenApiFragment } from '../../src/model/api-schema/OpenApiFragment';

/**
 * OpenAPI base documents keyed by API metadata document type.
 */
type OpenApiBaseDocuments = {
  [documentType in OpenApiDocumentTypeValue]?: Document;
};

/**
 * Abstract resource OpenAPI data carried in generated ApiSchema artifacts.
 */
type AbstractResourceArtifact = {
  openApiFragment?: OpenApiFragment;
};

/**
 * Resource OpenAPI data carried in generated ApiSchema artifacts.
 */
type ResourceSchemaArtifact = {
  openApiFragments: {
    [documentType in OpenApiDocumentTypeValue]?: OpenApiFragment;
  };
};

/**
 * Project OpenAPI data carried in generated ApiSchema artifacts.
 */
type ProjectSchemaArtifact = {
  abstractResources: { [resourceName: string]: AbstractResourceArtifact };
  openApiBaseDocuments?: OpenApiBaseDocuments;
  resourceSchemas: { [endpointName: string]: ResourceSchemaArtifact };
};

/**
 * Generated ApiSchema artifact shape needed by this validation.
 */
type ApiSchemaArtifact = {
  projectSchema: ProjectSchemaArtifact;
};

/**
 * OpenAPI document with initialized mutable components for composition.
 */
type ComposedOpenApiDocument = Document & {
  components: ComponentsObject & {
    parameters: NonNullable<ComponentsObject['parameters']>;
    responses: NonNullable<ComponentsObject['responses']>;
    schemas: Schemas;
  };
  tags: TagObject[];
};

/**
 * A core ApiSchema artifact and the extension artifacts compatible with it.
 */
type ValidationGroup = {
  artifactDirectory: string;
  coreArtifactFilename: string;
  extensionArtifactFilenames: string[];
  scenarioName: string;
};

/**
 * Groups of generated artifacts that compose into served OpenAPI documents.
 */
const validationGroups: ValidationGroup[] = [
  {
    artifactDirectory: 'v7_1',
    coreArtifactFilename: 'ds-5.0-api-schema-generated.json',
    extensionArtifactFilenames: [],
    scenarioName: 'ODS/API 7.1 data standard 5.0',
  },
  {
    artifactDirectory: 'v7_2',
    coreArtifactFilename: 'ds-5.1-api-schema-generated.json',
    extensionArtifactFilenames: ['tpdm-api-schema-generated.json'],
    scenarioName: 'ODS/API 7.2 data standard 5.1 with TPDM',
  },
  {
    artifactDirectory: 'v7_3',
    coreArtifactFilename: 'ds-5.2-api-schema-generated.json',
    extensionArtifactFilenames: [
      'homograph-api-schema-generated.json',
      'sample-api-schema-generated.json',
      'tpdm-api-schema-generated.json',
    ],
    scenarioName: 'ODS/API 7.3 data standard 5.2 with extensions',
  },
  {
    artifactDirectory: 'v7_3',
    coreArtifactFilename: 'ds-6.0-api-schema-generated.json',
    extensionArtifactFilenames: ['ds-6.0-homograph-api-schema-generated.json', 'ds-6.0-sample-api-schema-generated.json'],
    scenarioName: 'ODS/API 7.3 data standard 6.0 with extensions',
  },
  {
    artifactDirectory: 'v7_3',
    coreArtifactFilename: 'ds-6.1-api-schema-generated.json',
    extensionArtifactFilenames: ['ds-6.1-homograph-api-schema-generated.json', 'ds-6.1-sample-api-schema-generated.json'],
    scenarioName: 'ODS/API 7.3 data standard 6.1 with extensions',
  },
];

/**
 * Reads a generated ApiSchema artifact from the integration artifact directory.
 */
function readArtifact(artifactDirectory: string, artifactFilename: string): ApiSchemaArtifact {
  return JSON.parse(readFileSync(path.resolve(__dirname, 'artifact', artifactDirectory, artifactFilename), 'utf8'));
}

/**
 * Creates a composed OpenAPI document with components and tags safe for merge operations.
 */
function newComposedOpenApiDocument(baseDocument: Document): ComposedOpenApiDocument {
  return {
    ...baseDocument,
    components: {
      ...(baseDocument.components ?? {}),
      parameters: { ...(baseDocument.components?.parameters ?? {}) },
      responses: { ...(baseDocument.components?.responses ?? {}) },
      schemas: { ...(baseDocument.components?.schemas ?? {}) },
    },
    paths: { ...baseDocument.paths },
    tags: [...(baseDocument.tags ?? [])],
  };
}

/**
 * Returns OpenAPI tags by name for deterministic duplicate suppression.
 */
function tagsByNameFrom(tags: TagObject[]): Map<string, TagObject> {
  return new Map<string, TagObject>(tags.map((tag: TagObject): [string, TagObject] => [tag.name, tag]));
}

/**
 * Composes a base OpenAPI document with all compatible project fragments for one document type.
 */
function composeOpenApiDocument(
  baseDocument: Document,
  projectSchemas: ProjectSchemaArtifact[],
  documentType: OpenApiDocumentTypeValue,
): Document {
  const document: ComposedOpenApiDocument = newComposedOpenApiDocument(baseDocument);
  const tagsByName: Map<string, TagObject> = tagsByNameFrom(document.tags);

  projectSchemas.forEach((projectSchema: ProjectSchemaArtifact): void => {
    if (documentType === OpenApiDocumentType.RESOURCES) {
      Object.values(projectSchema.abstractResources).forEach((abstractResource: AbstractResourceArtifact): void => {
        Object.assign(document.components.schemas, abstractResource.openApiFragment?.components.schemas ?? {});
      });
    }

    Object.values(projectSchema.resourceSchemas).forEach((resourceSchema: ResourceSchemaArtifact): void => {
      const fragment: OpenApiFragment | undefined = resourceSchema.openApiFragments[documentType];

      Object.assign(document.components.schemas, fragment?.components.schemas ?? {});
      Object.assign(document.paths, fragment?.paths ?? {});
      (fragment?.tags ?? []).forEach((tag: TagObject): void => {
        tagsByName.set(tag.name, tag);
      });
    });
  });

  return {
    ...document,
    tags: Array.from(tagsByName.values()),
  };
}

/**
 * Returns the core OpenAPI base documents and fails the test if they are missing.
 */
function openApiBaseDocumentsFrom(apiSchemaArtifact: ApiSchemaArtifact): OpenApiBaseDocuments {
  expect(apiSchemaArtifact.projectSchema.openApiBaseDocuments).toBeDefined();

  return apiSchemaArtifact.projectSchema.openApiBaseDocuments as OpenApiBaseDocuments;
}

/**
 * Validates a generated OpenAPI document with the parser's own OpenAPI type boundary.
 */
async function validateOpenApiDocument(document: Document): Promise<OpenAPI.Document> {
  return SwaggerParser.validate(document as unknown as OpenAPI.Document);
}

describe('generated OpenAPI documents', (): void => {
  describe.each(validationGroups)('$scenarioName', (validationGroup: ValidationGroup): void => {
    it('should validate merged resources, descriptors, and change queries documents', async (): Promise<void> => {
      const coreArtifact: ApiSchemaArtifact = readArtifact(
        validationGroup.artifactDirectory,
        validationGroup.coreArtifactFilename,
      );
      const extensionArtifacts: ApiSchemaArtifact[] = validationGroup.extensionArtifactFilenames.map(
        (extensionArtifactFilename: string): ApiSchemaArtifact =>
          readArtifact(validationGroup.artifactDirectory, extensionArtifactFilename),
      );
      const projectSchemas: ProjectSchemaArtifact[] = [
        coreArtifact.projectSchema,
        ...extensionArtifacts.map(
          (extensionArtifact: ApiSchemaArtifact): ProjectSchemaArtifact => extensionArtifact.projectSchema,
        ),
      ];
      const openApiBaseDocuments: OpenApiBaseDocuments = openApiBaseDocumentsFrom(coreArtifact);
      const changeQueriesBaseDocument: Document | undefined = openApiBaseDocuments[OpenApiDocumentType.CHANGE_QUERIES];
      const descriptorsBaseDocument: Document | undefined = openApiBaseDocuments[OpenApiDocumentType.DESCRIPTORS];
      const resourcesBaseDocument: Document | undefined = openApiBaseDocuments[OpenApiDocumentType.RESOURCES];

      expect(changeQueriesBaseDocument).toBeDefined();
      expect(descriptorsBaseDocument).toBeDefined();
      expect(resourcesBaseDocument).toBeDefined();

      const documentsToValidate: Document[] = [
        changeQueriesBaseDocument as Document,
        composeOpenApiDocument(descriptorsBaseDocument as Document, projectSchemas, OpenApiDocumentType.DESCRIPTORS),
        composeOpenApiDocument(resourcesBaseDocument as Document, projectSchemas, OpenApiDocumentType.RESOURCES),
      ];

      await Promise.all(documentsToValidate.map(validateOpenApiDocument));
    });
  });
});
