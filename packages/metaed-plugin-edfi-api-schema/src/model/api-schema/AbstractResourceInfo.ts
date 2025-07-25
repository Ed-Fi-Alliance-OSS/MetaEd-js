// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { JsonPath } from './JsonPath';
import { OpenApiFragment } from './OpenApiFragment';

export type AbstractResourceInfo = {
  /**
   * A list of the JsonPaths that are part of the identity for this resource, in lexical order.
   */
  identityJsonPaths: JsonPath[];

  /**
   * OpenAPI fragment for this abstract resource (schemas only, no paths or tags).
   * Optional during transition phase.
   */
  openApiFragment?: OpenApiFragment;
};
