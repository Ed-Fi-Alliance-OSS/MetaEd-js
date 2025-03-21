// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// 'fatal' means pipeline execution is aborted, 'error' means it can be worked around e.g. single plugin load failure
// 'warning' communicates an unusual condition e.g. a directory provided in a configuration is not found
export type PipelineFailureCategory = 'error' | 'warning' | 'fatal';
/**
 *
 */
export interface PipelineFailure {
  category: PipelineFailureCategory;
  message: string;
}
