// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { HandbookEntry, newHandbookEntry } from '../model/HandbookEntry';
import { HandbookUsedByProperty } from '../model/HandbookUsedByProperty';

function generatedTableSqlFor(name: string, columnDefinition: string): string[] {
  return [`${name} ${columnDefinition}`];
}

function parentNameAndPropertyCardinalityProperties(uniqueIdentifier: string, metaEdName: string): HandbookUsedByProperty[] {
  const item: HandbookUsedByProperty = {
    referenceUniqueIdentifier: metaEdName + uniqueIdentifier,
    name: metaEdName,
    cardinality: 'optional',
  };
  return [item];
}

export function createDefaultHandbookEntry({
  entityUuid,
  name,
  definition,
  columnDefinition,
}: {
  entityUuid: string;
  name: string;
  definition: string;
  columnDefinition: string;
}): HandbookEntry {
  return {
    ...newHandbookEntry(),
    definition,
    // This is the way the UI searches for entities
    uniqueIdentifier: name + entityUuid,
    metaEdType: `${name} Base Type`,
    modelReferencesUsedBy: [],
    modelReferencesUsedByProperties: parentNameAndPropertyCardinalityProperties(entityUuid, name),
    umlType: name,
    name,
    projectName: 'EdFi',
    odsFragment: generatedTableSqlFor(name, columnDefinition),
    optionList: [],
    typeCharacteristics: [],
  };
}
