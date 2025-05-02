// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  MetaEdEnvironment,
  EnhancerResult,
  getAllEntitiesOfType,
  ModelBase,
  MetaEdPropertyFullName,
} from '@edfi/metaed-core';
import { ApiEntityMapping, NoApiEntityMapping } from './ApiEntityMapping';
import type { CollectedProperty } from './CollectedProperty';
import { SchemaRoot, NoSchemaRoot } from './JsonSchema';
import type { EqualityConstraint } from './EqualityConstraint';
import type { JsonPathsMapping } from './JsonPathsMapping';
import { MetaEdResourceName } from './api-schema/MetaEdResourceName';
import { EndpointName } from './api-schema/EndpointName';
import { DocumentPathsMapping } from './api-schema/DocumentPathsMapping';
import { JsonPath } from './api-schema/JsonPath';
import { QueryFieldMapping } from './api-schema/QueryFieldMapping';
import { NoOpenApiObject, OpenApiObject } from './OpenApi';
import { EducationOrganizationSecurableElement } from './api-schema/EducationOrganizationSecurableElement';
import { OpenApiRequestBodyCollectionSchema } from './OpenApiRequestBodyCollectionSchema';
import { AuthorizationPathway } from './api-schema/AuthorizationPathway';

export type EntityApiSchemaData = {
  /**
   * API shape metadata for this entity.
   */
  apiMapping: ApiEntityMapping;

  /**
   * The API document JSON schema that corresponds to this MetaEd entity.
   */
  jsonSchemaForInsert: SchemaRoot;

  /**
   * The Open API request body component for this MetaEd entity.
   */
  openApiRequestBodyComponent: OpenApiObject;

  /**
   * The property name for the Open API request body component.
   */
  openApiRequestBodyComponentPropertyName: string;

  /**
   * The Open API reference component for this MetaEd entity.
   */
  openApiReferenceComponent: OpenApiObject;

  /**
   * The property name for the Open API reference component.
   */
  openApiReferenceComponentPropertyName: string;

  /**
   * The Open API request body collection component list for this MetaEd entity.
   */
  openApiRequestBodyCollectionComponents: OpenApiRequestBodyCollectionSchema[];

  /**
   * Properties that belong under this entity in the API body. Excludes Choice and Inline Common properties
   * as they have no expression in API body. Instead, the properties on the Choice and Inline Common referenced
   * entities are "pulled-up" to this entity.
   */
  collectedApiProperties: CollectedProperty[];

  /**
   * All the properties that belong under this entity, including superclass properties if the entity is a subclass.
   */
  allProperties: CollectedProperty[];

  /**
   * A mapping of dot-separated MetaEd property paths to corresponding JsonPaths to data elements
   * in the API document.
   *
   * Includes both paths ending in references and paths ending in scalars. PropertyPaths ending in
   * scalars have a single JsonPath, while PropertyPaths ending in references may have multiple
   * JsonPaths, as document references are often composed of multiple elements.
   *
   * The JsonPaths array is always in sorted order.
   */
  allJsonPathsMapping: JsonPathsMapping;

  /**
   * A mapping of dot-separated MetaEd property paths to corresponding JsonPaths to data elements
   * in the API document.
   *
   * Similar to allJsonPathsMapping in structure, but preserves original MetaEd naming
   *
   * The JsonPaths array is always is sorted order.
   */
  mergeJsonPathsMapping: JsonPathsMapping;

  /**
   * A list of EqualityConstraints to be applied to an Ed-Fi API document. An EqualityConstraint
   * is a source/target JsonPath pair.
   */
  equalityConstraints: EqualityConstraint[];

  /**
   * The API resource endpoint name for this entity, if it is a TopLevelEntity.
   */
  endpointName: EndpointName;

  /**
   * The API resource name for this entity, if it is a TopLevelEntity.
   */
  resourceName: MetaEdResourceName;

  /**
   * The property fullnames for every identity property on this entity, in sorted order
   */
  identityFullnames: MetaEdPropertyFullName[];

  /**
   * A list of the JsonPaths that are part of the identity for this resource, in lexical order.
   */
  identityJsonPaths: JsonPath[];

  /**
   * A list of the JsonPaths that are of type boolean for use in type coercion.
   */
  booleanJsonPaths: JsonPath[];

  /**
   * A list of the JsonPaths that are numeric for use in type coercion.
   */
  numericJsonPaths: JsonPath[];

  /**
   * A list of the JsonPaths that are date-time for use in type coercion.
   */
  dateTimeJsonPaths: JsonPath[];

  /**
   * A mapping of PropertyFullNames to DocumentPaths, which are JsonPaths in an API document for a specific MetaEd
   * property.
   */
  documentPathsMapping: DocumentPathsMapping;

  /**
   * A mapping of API query term strings to the JsonPaths in the document that should be part of the query
   */
  queryFieldMapping: QueryFieldMapping;

  /**
   * A list of the namespace-based security elements for this entity
   */
  namespaceSecurableElements: JsonPath[];

  /**
   * A list of the student-based security elements for this entity
   */
  studentSecurableElements: JsonPath[];

  /**
   * A list of the contact-based security elements for this entity
   */
  contactSecurableElements: JsonPath[];

  /**
   * A list of the staff-based security elements for this entity
   */
  staffSecurableElements: JsonPath[];

  /**
   * The AuthorizationPathways this entity is a part of.
   */
  authorizationPathways: AuthorizationPathway[];

  /**
   * A list of the EducationOrganization-based security elements for this entity
   */
  educationOrganizationSecurableElements: EducationOrganizationSecurableElement[];

  /**
   * JsonPaths to array items in the document that will need uniqueness validation
   * based on those paths. There can be multiple arrays in a document, so
   * constraint JsonPaths are grouped by the paths to each individual array.
   */
  arrayUniquenessConstraints: JsonPath[][];
};

/**
 * Initialize entity with ApiSchema data placeholder.
 */
export function addEntityApiSchemaDataTo(entity: ModelBase) {
  if (entity.data.edfiApiSchema == null) entity.data.edfiApiSchema = {};

  Object.assign(entity.data.edfiApiSchema, {
    apiMapping: NoApiEntityMapping,
    jsonSchemaForInsert: NoSchemaRoot,
    openApiRequestBodyComponent: NoOpenApiObject,
    openApiRequestBodyComponentPropertyName: '',
    openApiRequestBodyCollectionComponents: [],
    openApiReferenceComponent: NoOpenApiObject,
    openApiReferenceComponentPropertyName: '',
    collectedApiProperties: [],
    allJsonPathsMapping: {},
    mergeJsonPathsMapping: {},
    equalityConstraints: [],
    endpointName: '' as EndpointName,
    resourceName: '' as MetaEdResourceName,
    identityFullnames: [],
    queryFieldMapping: {},
    namespaceSecurableElements: [],
    educationOrganizationSecurableElements: [],
    studentAuthorizationSecurablePaths: [],
    authorizationPathways: [],
    studentSecurableElements: [],
    contactSecurableElements: [],
    staffSecurableElements: [],
    arrayUniquenessConstraints: [],
  });
}

/**
 * Initialize all properties with ApiSchema data placeholder.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(
    metaEd,
    'domainEntity',
    'association',
    'domainEntitySubclass',
    'associationSubclass',
    'domainEntityExtension',
    'associationExtension',
    'descriptor',
    'common',
    'commonSubclass',
    'commonExtension',
    'choice',
    'schoolYearEnumeration',
  ).forEach((entity) => {
    if (entity.data.edfiApiSchema == null) entity.data.edfiApiSchema = {};
    addEntityApiSchemaDataTo(entity);
  });

  return {
    enhancerName: 'EntityApiSchemaDataSetupEnhancer',
    success: true,
  };
}
