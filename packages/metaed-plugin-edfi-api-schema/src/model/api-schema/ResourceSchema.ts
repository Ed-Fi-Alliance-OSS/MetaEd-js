// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EqualityConstraint } from './EqualityConstraint';
import { DocumentPaths } from './DocumentPaths';
import { SchemaRoot } from './JsonSchema';
import { PropertyFullName } from './PropertyFullName';
import { ResourceName } from './ResourceName';

/**
 * API resource schema information
 */
export type ResourceSchema = {
  /**
   * The resource name. Typically, this is the entity metaEdName.
   */
  resourceName: ResourceName;

  /**
   * Whether this resource is a descriptor. Descriptors are treated differently from other resources
   */
  isDescriptor: boolean;

  /**
   * Whether API clients are permitted to modify the identity of an existing resource document.
   */
  allowIdentityUpdates: boolean;

  /**
   * The API document JSON schema that corresponds to this resource on insert.
   */
  jsonSchemaForInsert: SchemaRoot;

  /**
   * The API document JSON schema that corresponds to this resource on update.
   */
  jsonSchemaForUpdate: SchemaRoot;

  /**
   * The API document JSON schema that corresponds to this resource on query.
   */
  jsonSchemaForQuery: SchemaRoot;

  /**
   * A list of EqualityConstraints to be applied to a resource document. An EqualityConstraint
   * is a source/target JsonPath pair.
   */
  equalityConstraints: EqualityConstraint[];

  /**
   * A list of the MetaEd property fullnames for each property that is part of the identity
   * for this resource, in lexical order
   */
  identityFullnames: PropertyFullName[];

  /**
   * A collection of MetaEd property fullnames mapped to DocumentPaths objects,
   * which provide JsonPaths to the corresponding values in a resource document.
   */
  documentPathsMapping: { [key: PropertyFullName]: DocumentPaths };
};
