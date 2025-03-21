// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdResourceName } from './api-schema/MetaEdResourceName';
import { Schemas, PathsObject, SchemaObject, TagObject } from './OpenApiTypes';

export type Exts = { [key: MetaEdResourceName]: SchemaObject };

/**
 * Pieces of OpenApi spec for an extension, to be assembled by DMS
 */
export type OpenApiExtensionFragments = {
  /**
   * Paths for new extension endpoints
   */
  newPaths: PathsObject;
  /**
   * Schemas for new extension endpoints
   */
  newSchemas: Schemas;
  /**
   * Exts for extensions to existing data standard entities
   */
  exts: Exts;
  /**
   * Tags for new extension endpoints
   */
  newTags: TagObject[];
};
