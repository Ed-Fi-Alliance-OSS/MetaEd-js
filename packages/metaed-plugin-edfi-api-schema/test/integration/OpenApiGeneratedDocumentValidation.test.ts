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
import type {
  ComponentsObject,
  Document,
  HeaderObject,
  Operation,
  ParameterObject,
  PathItemObject,
  ResponseObject,
  SchemaObject,
  Schemas,
  TagObject,
} from '../../src/model/OpenApiTypes';
import { OpenApiDocumentType, type OpenApiDocumentTypeValue } from '../../src/model/api-schema/OpenApiDocumentType';
import type { OpenApiFragment } from '../../src/model/api-schema/OpenApiFragment';
import { metaEdPlugins } from './PluginHelper';

jest.setTimeout(120000);

const API_SCHEMA_GENERATOR_NAME = 'edfiApiSchema.ApiSchemaGenerator';
const AVAILABLE_CHANGE_VERSIONS_PATH = '/availableChangeVersions';
const GRADE_LEVEL_DESCRIPTOR_PATH = '/ed-fi/gradeLevelDescriptors';
const STUDENT_RESOURCE_PATH = '/ed-fi/students';

const PROBLEM_DETAILS_MEDIA_TYPE = 'application/problem+json';
const PROBLEM_DETAILS_SCHEMA_KEY = 'ProblemDetails';
const PROBLEM_DETAILS_SCHEMA_REF = `#/components/schemas/${PROBLEM_DETAILS_SCHEMA_KEY}`;
const SNAPSHOT_METHOD_NOT_ALLOWED_RESPONSE_KEY = 'SnapshotMethodNotAllowed';
const SNAPSHOT_METHOD_NOT_ALLOWED_RESPONSE_REF = `#/components/responses/${SNAPSHOT_METHOD_NOT_ALLOWED_RESPONSE_KEY}`;
const SNAPSHOT_NOT_FOUND_RESPONSE_KEY = 'SnapshotNotFound';
const SNAPSHOT_NOT_FOUND_RESPONSE_REF = `#/components/responses/${SNAPSHOT_NOT_FOUND_RESPONSE_KEY}`;
const USE_SNAPSHOT_PARAMETER_KEY = 'Use-Snapshot';
const USE_SNAPSHOT_PARAMETER_REF = `#/components/parameters/${USE_SNAPSHOT_PARAMETER_KEY}`;

const PROBLEM_DETAILS_REQUIRED_PROPERTIES: string[] = [
  'detail',
  'type',
  'title',
  'status',
  'correlationId',
  'validationErrors',
  'errors',
];

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
 * Validates a generated OpenAPI document with the parser's own OpenAPI type boundary. The parser
 * dereferences in place, so it is given a copy and the composed documents keep their `$ref`s for
 * the reference-resolution and snapshot-contract assertions.
 */
async function validateOpenApiDocument(document: Document): Promise<OpenAPI.Document> {
  return SwaggerParser.validate(structuredClone(document) as unknown as OpenAPI.Document);
}

/**
 * Asserts a snapshot-eligible GET operation advertises the Use-Snapshot header and the snapshot 404.
 */
function expectSnapshotEligibleGet(operation: Operation): void {
  expect(operation.parameters).toContainEqual({ $ref: USE_SNAPSHOT_PARAMETER_REF });
  expect(operation.responses['404']).toEqual({ $ref: SNAPSHOT_NOT_FOUND_RESPONSE_REF });
}

/**
 * Asserts a mutating operation documents the snapshot 405 and does not advertise the header.
 */
function expectSnapshotMutation(operation: Operation): void {
  expect(operation.parameters ?? []).not.toContainEqual({ $ref: USE_SNAPSHOT_PARAMETER_REF });
  expect(operation.responses['405']).toEqual({ $ref: SNAPSHOT_METHOD_NOT_ALLOWED_RESPONSE_REF });
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
  expectSnapshotEligibleGet(changeQueriesBaseDocument.paths[AVAILABLE_CHANGE_VERSIONS_PATH]?.get as Operation);
  // Change Queries has no mutating operation, so it deliberately carries no snapshot 405 component
  expect(changeQueriesBaseDocument.components?.responses?.[SNAPSHOT_METHOD_NOT_ALLOWED_RESPONSE_KEY]).toBeUndefined();
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
 * The three documents DMS serves independently for one validation scenario, plus the project
 * schemas they were composed from.
 */
type ServedOpenApiDocuments = {
  changeQueriesDocument: Document;
  descriptorsDocument: Document;
  extensionArtifacts: ApiSchemaArtifact[];
  projectSchemas: ProjectSchemaArtifact[];
  resourcesDocument: Document;
};

/**
 * Composes the resources and descriptors documents from every project's fragments and pairs them
 * with the standalone Change Queries document, mirroring how DMS assembles what it serves.
 */
function servedDocumentsFrom(apiSchemaArtifacts: ApiSchemaArtifact[]): ServedOpenApiDocuments {
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

  return {
    changeQueriesDocument: changeQueriesBaseDocument as Document,
    descriptorsDocument: composeOpenApiDocument(
      descriptorsBaseDocument as Document,
      projectSchemas,
      OpenApiDocumentType.DESCRIPTORS,
    ),
    extensionArtifacts,
    projectSchemas,
    resourcesDocument: composeOpenApiDocument(
      resourcesBaseDocument as Document,
      projectSchemas,
      OpenApiDocumentType.RESOURCES,
    ),
  };
}

/**
 * Returns every independently served document for a validation scenario.
 */
function allServedDocumentsFrom(servedDocuments: ServedOpenApiDocuments): Document[] {
  return [servedDocuments.changeQueriesDocument, servedDocuments.descriptorsDocument, servedDocuments.resourcesDocument];
}

/**
 * Collects every `$ref` string appearing anywhere in an OpenAPI document.
 */
function referencesFrom(value: unknown, references: Set<string>): Set<string> {
  if (Array.isArray(value)) {
    value.forEach((item: unknown): void => {
      referencesFrom(item, references);
    });
    return references;
  }

  if (value != null && typeof value === 'object') {
    Object.entries(value as { [key: string]: unknown }).forEach(([key, item]: [string, unknown]): void => {
      if (key === '$ref' && typeof item === 'string') {
        references.add(item);
        return;
      }
      referencesFrom(item, references);
    });
  }

  return references;
}

/**
 * Builds the set of component references an independently served document can resolve on its own.
 */
function resolvableReferencesFrom(document: Document): Set<string> {
  const resolvable: Set<string> = new Set<string>();

  Object.entries(document.components ?? {}).forEach(
    ([sectionName, section]: [string, { [key: string]: unknown } | undefined]): void => {
      Object.keys(section ?? {}).forEach((componentKey: string): void => {
        resolvable.add(`#/components/${sectionName}/${componentKey}`);
      });
    },
  );

  return resolvable;
}

/**
 * Asserts every reference in a document resolves against that same document's components, which is
 * what makes each base document servable on its own once extension fragments are composed in.
 */
function expectAllReferencesResolveWithinDocument(document: Document): void {
  const resolvable: Set<string> = resolvableReferencesFrom(document);
  const references: string[] = Array.from(referencesFrom(document, new Set<string>()));
  const unresolvable: string[] = references.filter((reference: string): boolean => !resolvable.has(reference));

  expect(references.length).toBeGreaterThan(0);
  expect(unresolvable).toEqual([]);
}

/**
 * Asserts every resource or descriptor operation in a composed document carries its snapshot
 * contract. Every GET in these documents is snapshot-eligible, and every POST, PUT, and DELETE is a
 * snapshot-rejected mutation, so iterating covers core and extension paths alike without naming any.
 */
function expectSnapshotOperationCoverage(document: Document): void {
  let eligibleGetCount = 0;
  let mutationCount = 0;

  Object.values(document.paths).forEach((pathItem: PathItemObject | undefined): void => {
    if (pathItem == null) return;

    if (pathItem.get != null) {
      eligibleGetCount += 1;
      expectSnapshotEligibleGet(pathItem.get);
    }

    [pathItem.post, pathItem.put, pathItem.delete].forEach((operation: Operation | undefined): void => {
      if (operation == null) return;
      mutationCount += 1;
      expectSnapshotMutation(operation);
    });
  });

  expect(eligibleGetCount).toBeGreaterThan(0);
  expect(mutationCount).toBeGreaterThan(0);
}

/**
 * Asserts the reusable Use-Snapshot header parameter has its exact documented shape.
 */
function expectUseSnapshotParameter(document: Document): void {
  expect(document.components?.parameters?.[USE_SNAPSHOT_PARAMETER_KEY]).toEqual({
    name: USE_SNAPSHOT_PARAMETER_KEY,
    in: 'header',
    description: 'Indicates whether the request should be served from the configured Snapshot.',
    schema: {
      type: 'boolean',
      default: false,
    },
  } as ParameterObject);
}

/**
 * Asserts the shared DMS ProblemDetails envelope schema is present with all required properties.
 */
function expectProblemDetailsSchema(document: Document): void {
  const problemDetails = document.components?.schemas?.[PROBLEM_DETAILS_SCHEMA_KEY] as SchemaObject | undefined;

  expect(problemDetails).toBeDefined();
  expect(problemDetails?.type).toBe('object');
  expect(problemDetails?.required).toEqual(PROBLEM_DETAILS_REQUIRED_PROPERTIES);
  expect(Object.keys(problemDetails?.properties ?? {}).sort()).toEqual([...PROBLEM_DETAILS_REQUIRED_PROPERTIES].sort());
}

/**
 * Asserts the snapshot 404 response carries the exact DMS problem details for Snapshot Not Found.
 */
function expectSnapshotNotFoundResponse(document: Document): void {
  const response = document.components?.responses?.[SNAPSHOT_NOT_FOUND_RESPONSE_KEY] as ResponseObject | undefined;

  expect(response).toBeDefined();
  expect(response?.content?.[PROBLEM_DETAILS_MEDIA_TYPE]?.schema).toEqual({ $ref: PROBLEM_DETAILS_SCHEMA_REF });
  expect(response?.content?.[PROBLEM_DETAILS_MEDIA_TYPE]?.example).toEqual({
    detail: 'Snapshot not found.',
    type: 'urn:ed-fi:api:not-found',
    title: 'Not Found',
    status: 404,
    correlationId: expect.any(String),
    validationErrors: {},
    errors: [],
  });
}

/**
 * Asserts the snapshot 405 response carries the exact DMS problem details and the Allow header.
 */
function expectSnapshotMethodNotAllowedResponse(document: Document): void {
  const response = document.components?.responses?.[SNAPSHOT_METHOD_NOT_ALLOWED_RESPONSE_KEY] as ResponseObject | undefined;

  expect(response).toBeDefined();
  expect(response?.content?.[PROBLEM_DETAILS_MEDIA_TYPE]?.schema).toEqual({ $ref: PROBLEM_DETAILS_SCHEMA_REF });
  expect(response?.content?.[PROBLEM_DETAILS_MEDIA_TYPE]?.example).toEqual({
    detail: 'An attempt was made to modify data in a Snapshot, but this data is read-only.',
    type: 'urn:ed-fi:api:snapshots:method-not-allowed',
    title: 'Method Not Allowed with Snapshots',
    status: 405,
    correlationId: expect.any(String),
    validationErrors: {},
    errors: [],
  });
  expect((response?.headers?.Allow as HeaderObject | undefined)?.example).toBe('GET');
  expect((response?.headers?.Allow as HeaderObject | undefined)?.schema).toEqual({ type: 'string' });
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
      const servedDocuments: ServedOpenApiDocuments = servedDocumentsFrom(apiSchemaArtifacts);
      const { changeQueriesDocument, descriptorsDocument, extensionArtifacts, projectSchemas, resourcesDocument } =
        servedDocuments;

      expectStandaloneChangeQueriesDocument(changeQueriesDocument);
      expectTrackedChangePathsInResourceDocuments(resourcesDocument, descriptorsDocument);
      expectNoExtensionBaseDocuments(extensionArtifacts);
      expectNoChangeQueriesFragments(projectSchemas);

      await Promise.all(allServedDocumentsFrom(servedDocuments).map(validateOpenApiDocument));
    });

    it('should carry the snapshot components in every independently served document', (): void => {
      const servedDocuments: ServedOpenApiDocuments = servedDocumentsFrom(apiSchemaArtifacts);
      const { changeQueriesDocument, descriptorsDocument, resourcesDocument } = servedDocuments;

      [resourcesDocument, descriptorsDocument, changeQueriesDocument].forEach((document: Document): void => {
        expectUseSnapshotParameter(document);
        expectProblemDetailsSchema(document);
        expectSnapshotNotFoundResponse(document);
      });

      [resourcesDocument, descriptorsDocument].forEach((document: Document): void => {
        expectSnapshotMethodNotAllowedResponse(document);
      });
    });

    it('should document the snapshot contract on every eligible composed operation', (): void => {
      const { descriptorsDocument, resourcesDocument } = servedDocumentsFrom(apiSchemaArtifacts);

      expectSnapshotOperationCoverage(resourcesDocument);
      expectSnapshotOperationCoverage(descriptorsDocument);
    });

    it('should resolve every reference within its own served document', (): void => {
      allServedDocumentsFrom(servedDocumentsFrom(apiSchemaArtifacts)).forEach(expectAllReferencesResolveWithinDocument);
    });
  });
});
