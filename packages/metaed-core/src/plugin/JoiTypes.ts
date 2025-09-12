// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// schema from the joi library
// https://github.com/hapijs/joi/blob/master/API.md
export type JoiSchema = any;

export interface JoiErrorDetail {
  message: string;
  path: string[];
}

export interface JoiError {
  details: JoiErrorDetail[];
  message: string;
}

export interface JoiResult {
  error: JoiError | null;
}
