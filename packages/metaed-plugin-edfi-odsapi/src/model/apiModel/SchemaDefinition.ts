// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import deepFreeze from 'deep-freeze';

export interface SchemaDefinition {
  logicalName: string;
  physicalName: string;
  description?: string; // only used in 3.1.1+
  version?: string; // only used in 5.3+
}

// Allow anything that would be valid for a projectName, except strip out the spaces
export const deriveLogicalNameFromProjectName = (projectName: string): string => projectName.replace(/\s/g, '');

export const NoSchemaDefinition: SchemaDefinition = deepFreeze({
  logicalName: '',
  physicalName: '',
  description: '',
});

export const newSchemaDefinition = () => ({
  logicalName: '',
  physicalName: '',
  description: '',
});
