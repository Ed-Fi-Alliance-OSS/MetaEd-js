// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SourceMap } from '../model/SourceMap';
import { FileMap } from '../file/FileIndex';

export type ValidationFailureCategory = 'error' | 'warning' | 'info';
/**
 *
 */
export interface ValidationFailure {
  validatorName: string;
  category: ValidationFailureCategory;
  message: string;
  sourceMap: SourceMap | null;
  fileMap: FileMap | null;
}
