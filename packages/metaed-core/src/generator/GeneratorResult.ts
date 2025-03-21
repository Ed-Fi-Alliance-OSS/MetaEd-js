// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { GeneratedOutput } from './GeneratedOutput';

/**
 * GeneratorResult is the object returned by a Generator.
 *
 * **generatorName** is the name of the Generator and should be the same as the Generator filename.
 *
 * **generatedOutput** is an array of GeneratedOutput objects, one per generated artifact.
 */
export interface GeneratorResult {
  generatorName: string;
  generatedOutput: GeneratedOutput[];
}
