// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { HandbookMergeProperty } from './HandbookMergeProperty';

// A row in the "References" table on an Entity Handbook page
export type HandbookEntityReferenceProperty = {
  propertyUuid: string;
  targetPropertyId: string;
  referenceUniqueIdentifier: string;
  name: string;
  deprecationText: string;
  deprecationReason: string;
  extensionParentName: string;
  extensionParentNamespaceName: string;
  umlDatatype: string;
  jsonDatatype: string;
  jsonElementName: string;
  metaEdDatatype: string;
  sqlDatatype: string;
  isIdentity: boolean;
  isOdsApiIdentity: boolean;
  cardinality: string;
  definition: string;
  mergeDirectives?: HandbookMergeProperty[];
};
