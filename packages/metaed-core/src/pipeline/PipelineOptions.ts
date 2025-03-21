// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

export interface PipelineOptions {
  runValidators: boolean;
  runEnhancers: boolean;
  runGenerators: boolean;
  stopOnValidationFailure: boolean;
}

export const newPipelineOptions: () => PipelineOptions = () => ({
  runValidators: false,
  runEnhancers: false,
  runGenerators: false,
  stopOnValidationFailure: false,
});
