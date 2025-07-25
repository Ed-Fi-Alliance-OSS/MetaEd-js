// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/**
 * Constants for different types of OpenAPI documents
 */
export const OpenApiDocumentType = {
  RESOURCES: 'resources',
  DESCRIPTORS: 'descriptors',
} as const;

export type OpenApiDocumentTypeValue = typeof OpenApiDocumentType[keyof typeof OpenApiDocumentType];
