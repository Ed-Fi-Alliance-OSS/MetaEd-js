// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SchemaObject } from '../JsonSchema';
import { JsonPath } from './JsonPath';
import { ProjectEndpointName } from './ProjectEndpointName';

/**
 * Describes an attachment point where a common extension inserts properties
 * into a core entity's jsonSchemaForInsert under _ext.{project}.
 */
export type CommonExtensionOverride = {
  /** JSONPath locations in core jsonSchemaForInsert where _ext.{project} attaches (e.g. "$.properties.addresses.items") */
  insertionLocations: JsonPath[];
  /** Extension project key (e.g. "sample") */
  projectEndpointName: ProjectEndpointName;
  /** The schema fragment inserted under _ext.{project} at each location */
  schemaFragment: SchemaObject;
};
