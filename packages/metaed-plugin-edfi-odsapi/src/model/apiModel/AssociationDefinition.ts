// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ApiFullName, NoApiFullName } from './ApiFullName';
import { ApiProperty } from './ApiProperty';
import { PhysicalNames } from './PhysicalNames';

export type AssociationDefinitionCardinality =
  | 'OneToOne'
  | 'OneToZeroOrOne'
  | 'OneToOneInheritance'
  | 'OneToOneExtension'
  | 'OneToOneOrMore'
  | 'OneToZeroOrMore'
  | 'Unknown';

export interface AssociationDefinition {
  fullName: ApiFullName;
  constraintNames?: PhysicalNames;
  cardinality: AssociationDefinitionCardinality;
  primaryEntityFullName: ApiFullName;
  primaryEntityProperties: ApiProperty[];
  secondaryEntityFullName: ApiFullName;
  secondaryEntityProperties: ApiProperty[];
  isIdentifying: boolean;
  isRequired: boolean;
  potentiallyLogical?: boolean;
}

export function newAssociationDefinition(): AssociationDefinition {
  return {
    fullName: NoApiFullName,
    cardinality: 'Unknown',
    primaryEntityFullName: NoApiFullName,
    primaryEntityProperties: [],
    secondaryEntityFullName: NoApiFullName,
    secondaryEntityProperties: [],
    isIdentifying: false,
    isRequired: false,
  };
}
