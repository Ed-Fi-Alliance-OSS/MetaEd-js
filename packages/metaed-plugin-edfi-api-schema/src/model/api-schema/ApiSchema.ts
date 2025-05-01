// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { SemVer } from '@edfi/metaed-core';
import { ProjectSchema } from './ProjectSchema';

/**
 * API information
 */
export type ApiSchema = {
  /**
   * The single ProjectSchema for this ApiSchema file
   */
  projectSchema: ProjectSchema;

  /**
   * The version of ApiSchema being generated, used by consumers of the ApiSchema to determine
   * whether this is an ApiSchema version they support.
   */
  apiSchemaVersion: SemVer;
};

export function newApiSchema(): ApiSchema {
  return { projectSchema: {} as any, apiSchemaVersion: '1.0.0' as SemVer };
}
