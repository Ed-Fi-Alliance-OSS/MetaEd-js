// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ApiProperty } from './ApiProperty';
import { EntityIdentifier } from './EntityIdentifier';
import { PhysicalNames } from './PhysicalNames';

export interface EntityDefinition {
  schema: string;
  name: string;
  tableNames?: PhysicalNames;
  locallyDefinedProperties: ApiProperty[];
  identifiers: EntityIdentifier[];
  isAbstract: boolean;
  description: string;
  isDeprecated?: boolean;
  deprecationReasons?: string[];
}

export function newEntityDefinition(): EntityDefinition {
  return {
    schema: '',
    name: '',
    locallyDefinedProperties: [],
    identifiers: [],
    isAbstract: false,
    description: '',
  };
}
