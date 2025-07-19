// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { PathsObject, SchemaObject, Schemas, TagObject } from '../OpenApiTypes';

/**
 * OpenAPI fragment containing OpenAPI specification data for a resource
 */
export interface OpenApiFragment {
  /**
   * OpenAPI components for this resource
   */
  components: {
    schemas: Schemas;
  };

  /**
   * OpenAPI paths for this resource
   */
  paths?: PathsObject;

  /**
   * OpenAPI tags for this resource
   */
  tags?: TagObject[];

  /**
   * Extension schemas that extend other resources
   * Key is the extended schema name, value is the extension schema
   */
  exts?: { [extendedSchemaName: string]: SchemaObject };
}
