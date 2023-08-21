import { HandbookEntityReferenceProperty } from './HandbookEntryReferenceProperty';
import { HandbookUsedByProperty } from './HandbookUsedByProperty';

export interface HandbookEntry {
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
  odsFragment: string[];
  optionList: string[];
  typeCharacteristics: string[];
  repositoryId: string;
  projectName: string;
}

export function newHandbookEntry(): HandbookEntry {
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
    odsFragment: [],
    optionList: [],
    typeCharacteristics: [],
    repositoryId: '',
    projectName: '',
  };
}
