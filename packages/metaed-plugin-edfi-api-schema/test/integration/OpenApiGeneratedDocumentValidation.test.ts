// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import path from 'path';
import SwaggerParser from '@apidevtools/swagger-parser';
import {
  buildMetaEd,
  buildParseTree,
  initializeNamespaces,
  loadFileIndex,
  loadFiles,
  loadPluginConfiguration,
  newMetaEdConfiguration,
  newState,
  runEnhancers,
  runGenerators,
  setupPlugins,
  type GeneratedOutput,
  type GeneratorResult,
  type MetaEdProject,
  type SemVer,
  type State,
  walkBuilders,
} from '@edfi/metaed-core';
import type { OpenAPI } from 'openapi-types';
import type { ComponentsObject, Document, Schemas, TagObject } from '../../src/model/OpenApiTypes';
import { OpenApiDocumentType, type OpenApiDocumentTypeValue } from '../../src/model/api-schema/OpenApiDocumentType';
import type { OpenApiFragment } from '../../src/model/api-schema/OpenApiFragment';
import { metaEdPlugins } from './PluginHelper';

jest.setTimeout(120000);

const API_SCHEMA_GENERATOR_NAME = 'edfiApiSchema.ApiSchemaGenerator';
const AVAILABLE_CHANGE_VERSIONS_PATH = '/availableChangeVersions';
const GRADE_LEVEL_DESCRIPTOR_PATH = '/ed-fi/gradeLevelDescriptors';
const STUDENT_RESOURCE_PATH = '/ed-fi/students';

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
  isExtensionProject: boolean;
  openApiBaseDocuments?: OpenApiBaseDocuments;
  projectName: string;
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
 * Project inputs needed to generate ApiSchema artifacts for a validation scenario.
 */
type ValidationGroup = {
  dataStandardVersion: SemVer;
  defaultPluginTechVersion: SemVer;
  projectPaths: string[];
  projects: MetaEdProject[];
  scenarioName: string;
};

/**
 * Groups of MetaEd projects that compose into served OpenAPI documents.
 */
const validationGroups: ValidationGroup[] = [
  {
    dataStandardVersion: '5.0.0',
    defaultPluginTechVersion: '7.1.0',
    projectPaths: ['./node_modules/@edfi/ed-fi-model-5.0/'],
    projects: [
      {
        projectName: 'Ed-Fi',
        namespaceName: 'EdFi',
        projectExtension: '',
        projectVersion: '5.0.0',
        description: 'The Ed-Fi Data Standard v5.0',
      },
    ],
    scenarioName: 'ODS/API 7.1 data standard 5.0',
  },
  {
    dataStandardVersion: '5.1.0',
    defaultPluginTechVersion: '7.2.0',
    projectPaths: ['./node_modules/@edfi/ed-fi-model-5.1/', path.resolve(__dirname, './tpdm-project')],
    projects: [
      {
        projectName: 'Ed-Fi',
        namespaceName: 'EdFi',
        projectExtension: '',
        projectVersion: '5.1.0',
        description: 'The Ed-Fi Data Standard v5.1',
      },
      {
        projectName: 'TPDM',
        namespaceName: 'TPDM',
        projectExtension: 'TPDM',
        projectVersion: '1.1.0',
        description: 'TPDM-Core',
      },
    ],
    scenarioName: 'ODS/API 7.2 data standard 5.1 with TPDM',
  },
  {
    dataStandardVersion: '5.2.0',
    defaultPluginTechVersion: '7.3.0',
    projectPaths: [
      './node_modules/@edfi/ed-fi-model-5.2/',
      path.resolve(__dirname, './homograph-project'),
      path.resolve(__dirname, './sample-project'),
      path.resolve(__dirname, './tpdm-project'),
    ],
    projects: [
      {
        projectName: 'Ed-Fi',
        namespaceName: 'EdFi',
        projectExtension: '',
        projectVersion: '5.2.0',
        description: 'The Ed-Fi Data Standard v5.2',
      },
      {
        projectName: 'Homograph',
        namespaceName: 'Homograph',
        projectExtension: 'Homograph',
        projectVersion: '1.0.0',
        description: 'Homograph',
      },
      {
        projectName: 'Sample',
        namespaceName: 'Sample',
        projectExtension: 'Sample',
        projectVersion: '1.1.0',
        description: 'Sample-Core',
      },
      {
        projectName: 'TPDM',
        namespaceName: 'TPDM',
        projectExtension: 'TPDM',
        projectVersion: '1.1.0',
        description: 'TPDM-Core',
      },
    ],
    scenarioName: 'ODS/API 7.3 data standard 5.2 with extensions',
  },
  {
    dataStandardVersion: '6.0.0',
    defaultPluginTechVersion: '7.3.0',
    projectPaths: [
      './node_modules/@edfi/ed-fi-model-6.0/',
      path.resolve(__dirname, './homograph-project'),
      path.resolve(__dirname, './sample-project'),
    ],
    projects: [
      {
        projectName: 'Ed-Fi',
        namespaceName: 'EdFi',
        projectExtension: '',
        projectVersion: '6.0.0',
        description: 'The Ed-Fi Data Standard v6.0',
      },
      {
        projectName: 'Homograph',
        namespaceName: 'Homograph',
        projectExtension: 'Homograph',
        projectVersion: '1.0.0',
        description: 'Homograph',
      },
      {
        projectName: 'Sample',
        namespaceName: 'Sample',
        projectExtension: 'Sample',
        projectVersion: '1.1.0',
        description: 'Sample-Core',
      },
    ],
    scenarioName: 'ODS/API 7.3 data standard 6.0 with extensions',
  },
  {
    dataStandardVersion: '6.1.0',
    defaultPluginTechVersion: '7.3.0',
    projectPaths: [
      './node_modules/@edfi/ed-fi-model-6.1/',
      path.resolve(__dirname, './homograph-project'),
      path.resolve(__dirname, './sample-project'),
    ],
    projects: [
      {
        projectName: 'Ed-Fi',
        namespaceName: 'EdFi',
        projectExtension: '',
        projectVersion: '6.1.0',
        description: 'The Ed-Fi Data Standard v6.1',
      },
      {
        projectName: 'Homograph',
        namespaceName: 'Homograph',
        projectExtension: 'Homograph',
        projectVersion: '1.0.0',
        description: 'Homograph',
      },
      {
        projectName: 'Sample',
        namespaceName: 'Sample',
        projectExtension: 'Sample',
        projectVersion: '1.1.0',
        description: 'Sample-Core',
      },
    ],
    scenarioName: 'ODS/API 7.3 data standard 6.1 with extensions',
  },
];

/**
 * Parses a generated ApiSchema artifact from generator output.
 */
function apiSchemaArtifactFrom(generatedOutput: GeneratedOutput): ApiSchemaArtifact {
  return JSON.parse(generatedOutput.resultString);
}

/**
 * Generates ApiSchema artifacts for a validation group using the full MetaEd pipeline.
 */
async function generatedApiSchemaArtifactsFor(validationGroup: ValidationGroup): Promise<ApiSchemaArtifact[]> {
  const state: State = {
    ...newState(),
    metaEdConfiguration: {
      ...newMetaEdConfiguration(),
      artifactDirectory: './MetaEdOutput/',
      defaultPluginTechVersion: validationGroup.defaultPluginTechVersion,
      pluginConfigDirectories: [path.resolve(__dirname)],
      projectPaths: validationGroup.projectPaths,
      projects: validationGroup.projects,
    },
    metaEdPlugins: metaEdPlugins(),
  };
  state.metaEd.dataStandardVersion = validationGroup.dataStandardVersion;

  setupPlugins(state);
  loadFiles(state);
  loadFileIndex(state);
  buildParseTree(buildMetaEd, state);
  await walkBuilders(state);
  initializeNamespaces(state);
  await loadPluginConfiguration(state);
  // eslint-disable-next-line no-restricted-syntax
  for (const metaEdPlugin of state.metaEdPlugins) {
    await runEnhancers(metaEdPlugin, state);
    await runGenerators(metaEdPlugin, state);
  }

  const generatorResult: GeneratorResult = state.generatorResults.filter(
    (result: GeneratorResult): boolean => result.generatorName === API_SCHEMA_GENERATOR_NAME,
  )[0];

  expect(generatorResult.generatedOutput).toHaveLength(validationGroup.projects.length);

  return generatorResult.generatedOutput.map(apiSchemaArtifactFrom);
}

/**
 * Returns the generated core ApiSchema artifact and fails the test if it is missing.
 */
function coreArtifactFrom(apiSchemaArtifacts: ApiSchemaArtifact[]): ApiSchemaArtifact {
  const coreArtifacts: ApiSchemaArtifact[] = apiSchemaArtifacts.filter(
    (apiSchemaArtifact: ApiSchemaArtifact): boolean => !apiSchemaArtifact.projectSchema.isExtensionProject,
  );

  expect(coreArtifacts).toHaveLength(1);

  return coreArtifacts[0];
}

/**
 * Returns the generated extension ApiSchema artifacts.
 */
function extensionArtifactsFrom(apiSchemaArtifacts: ApiSchemaArtifact[]): ApiSchemaArtifact[] {
  return apiSchemaArtifacts.filter(
    (apiSchemaArtifact: ApiSchemaArtifact): boolean => apiSchemaArtifact.projectSchema.isExtensionProject,
  );
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

/**
 * Asserts a composed OpenAPI document includes a GET path.
 */
function expectGetPath(document: Document, pathName: string): void {
  expect(document.paths[pathName]?.get).toBeDefined();
}

/**
 * Asserts the standalone Change Queries document contains only the fixed availableChangeVersions route.
 */
function expectStandaloneChangeQueriesDocument(changeQueriesBaseDocument: Document): void {
  expect(Object.keys(changeQueriesBaseDocument.paths)).toEqual([AVAILABLE_CHANGE_VERSIONS_PATH]);
  expect(changeQueriesBaseDocument.paths[AVAILABLE_CHANGE_VERSIONS_PATH]?.get).toBeDefined();
  expect(changeQueriesBaseDocument.paths[`${STUDENT_RESOURCE_PATH}/deletes`]).toBeUndefined();
  expect(changeQueriesBaseDocument.paths[`${STUDENT_RESOURCE_PATH}/keyChanges`]).toBeUndefined();
  expect(changeQueriesBaseDocument.paths[`${GRADE_LEVEL_DESCRIPTOR_PATH}/deletes`]).toBeUndefined();
  expect(changeQueriesBaseDocument.paths[`${GRADE_LEVEL_DESCRIPTOR_PATH}/keyChanges`]).toBeUndefined();
}

/**
 * Asserts resource-scoped tracked-change paths remain in the resource and descriptor OpenAPI documents.
 */
function expectTrackedChangePathsInResourceDocuments(resourcesDocument: Document, descriptorsDocument: Document): void {
  expect(resourcesDocument.paths[AVAILABLE_CHANGE_VERSIONS_PATH]).toBeUndefined();
  expect(descriptorsDocument.paths[AVAILABLE_CHANGE_VERSIONS_PATH]).toBeUndefined();
  expectGetPath(resourcesDocument, `${STUDENT_RESOURCE_PATH}/deletes`);
  expectGetPath(resourcesDocument, `${STUDENT_RESOURCE_PATH}/keyChanges`);
  expectGetPath(descriptorsDocument, `${GRADE_LEVEL_DESCRIPTOR_PATH}/deletes`);
  expectGetPath(descriptorsDocument, `${GRADE_LEVEL_DESCRIPTOR_PATH}/keyChanges`);
}

/**
 * Asserts extension projects do not carry core OpenAPI base documents.
 */
function expectNoExtensionBaseDocuments(extensionArtifacts: ApiSchemaArtifact[]): void {
  extensionArtifacts.forEach((extensionArtifact: ApiSchemaArtifact): void => {
    expect(extensionArtifact.projectSchema.openApiBaseDocuments).toBeUndefined();
  });
}

/**
 * Asserts resource schemas do not expose a changeQueries fragment document type.
 */
function expectNoChangeQueriesFragments(projectSchemas: ProjectSchemaArtifact[]): void {
  projectSchemas.forEach((projectSchema: ProjectSchemaArtifact): void => {
    Object.values(projectSchema.resourceSchemas).forEach((resourceSchema: ResourceSchemaArtifact): void => {
      expect(resourceSchema.openApiFragments[OpenApiDocumentType.CHANGE_QUERIES]).toBeUndefined();
    });
  });
}

describe('generated OpenAPI documents', (): void => {
  describe.each(validationGroups)('$scenarioName', (validationGroup: ValidationGroup): void => {
    let apiSchemaArtifacts: ApiSchemaArtifact[] = [];

    beforeAll(async (): Promise<void> => {
      apiSchemaArtifacts = await generatedApiSchemaArtifactsFor(validationGroup);
    });

    it('should validate OpenAPI documents and preserve Change Query path distribution', async (): Promise<void> => {
      const coreArtifact: ApiSchemaArtifact = coreArtifactFrom(apiSchemaArtifacts);
      const extensionArtifacts: ApiSchemaArtifact[] = extensionArtifactsFrom(apiSchemaArtifacts);
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

      const descriptorsDocument: Document = composeOpenApiDocument(
        descriptorsBaseDocument as Document,
        projectSchemas,
        OpenApiDocumentType.DESCRIPTORS,
      );
      const resourcesDocument: Document = composeOpenApiDocument(
        resourcesBaseDocument as Document,
        projectSchemas,
        OpenApiDocumentType.RESOURCES,
      );

      expectStandaloneChangeQueriesDocument(changeQueriesBaseDocument as Document);
      expectTrackedChangePathsInResourceDocuments(resourcesDocument, descriptorsDocument);
      expectNoExtensionBaseDocuments(extensionArtifacts);
      expectNoChangeQueriesFragments(projectSchemas);

      const documentsToValidate: Document[] = [
        changeQueriesBaseDocument as Document,
        descriptorsDocument,
        resourcesDocument,
      ];

      await Promise.all(documentsToValidate.map(validateOpenApiDocument));
    });
  });
});
