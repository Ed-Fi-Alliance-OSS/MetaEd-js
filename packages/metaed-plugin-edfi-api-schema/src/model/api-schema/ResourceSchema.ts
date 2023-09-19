// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EqualityConstraint } from './EqualityConstraint';
import { DocumentPaths } from './DocumentPaths';
import { SchemaRoot } from './JsonSchema';
import { PropertyFullName } from './PropertyFullName';
import { ResourceName } from './ResourceName';
import { ProjectName } from './ProjectName';

/**
 * API resource schema information common between regular and subclass resources
 */
export type BaseResourceSchema = {
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

/**
 * The additional ResourceSchema fields for a subclass
 */
type SubclassResourceSchema = BaseResourceSchema & {
  /**
   * The project name and resource name for the superclass
   */
  superclassProjectName: ProjectName;
  superclassResourceName: ResourceName;

  /**
   * The superclass identity field and the matching subclass identity field name.
   * This is found in MetaEd as an "identity rename". MetaEd only allows the super/subclass
   * relationship to have a single common identity field.
   */
  superclassIdentityFullname: PropertyFullName;
  subclassIdentityFullname: PropertyFullName;
};

/**
 * API resource schema information as a whole, with "isSubclass" as a differentiator between
 * regular and subclass resources.
 */
export type ResourceSchema =
  | (BaseResourceSchema & {
      isSubclass: false;
    })
  | (SubclassResourceSchema & {
      isSubclass: true;
    });
