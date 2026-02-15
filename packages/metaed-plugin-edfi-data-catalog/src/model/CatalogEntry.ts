// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { HandbookEntityReferenceProperty } from './HandbookEntryReferenceProperty';
import { HandbookUsedByProperty } from './HandbookUsedByProperty';

export interface CatalogEntry {
  entityUuid: string;
  definition: string;
  deprecationText: string;
  deprecationReason: string;
  uniqueIdentifier: string;

  umlType: string;
  metaEdType: string;
  baseMetaEdType: string;
  showIdentityColumn: boolean;

  baseEntityUniqueIdentifier: string;
  modelReferencesContains: string[];
  modelReferencesContainsProperties: HandbookEntityReferenceProperty[];
  modelReferencesUsedBy: string[];
  modelReferencesUsedByProperties: HandbookUsedByProperty[];
  hasDeprecatedProperty: boolean;
  name: string;
  optionList: string[];
  typeCharacteristics: string[];
  repositoryId: string;
  projectName: string;
  domains: string[];
}

export function newCatalogEntry(): CatalogEntry {
  return {
    entityUuid: '',
    definition: '',
    deprecationText: '',
    deprecationReason: '',
    uniqueIdentifier: '',

    umlType: '',
    metaEdType: '',
    baseMetaEdType: '',
    showIdentityColumn: true,

    baseEntityUniqueIdentifier: '',
    modelReferencesContains: [],
    modelReferencesContainsProperties: [],
    modelReferencesUsedBy: [],
    modelReferencesUsedByProperties: [],
    hasDeprecatedProperty: false,
    name: '',
    optionList: [],
    typeCharacteristics: [],
    repositoryId: '',
    projectName: '',
    domains: [],
  };
}
