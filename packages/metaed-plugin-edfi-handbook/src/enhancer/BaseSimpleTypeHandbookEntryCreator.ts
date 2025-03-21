// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { HandbookEntry, newHandbookEntry } from '../model/HandbookEntry';

function generatedTableSqlFor(name: string, columnDefinition: string): string[] {
  return [`${name} ${columnDefinition}`];
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
    umlType: name,
    name,
    projectName: 'EdFi',
    odsFragment: generatedTableSqlFor(name, columnDefinition),
    optionList: [],
    typeCharacteristics: [],
  };
}
