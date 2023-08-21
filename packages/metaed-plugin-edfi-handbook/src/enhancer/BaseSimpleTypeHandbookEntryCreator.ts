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
