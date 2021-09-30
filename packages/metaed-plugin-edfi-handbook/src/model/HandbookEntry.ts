import { HandbookEntityReferenceProperty } from './HandbookEntryReferenceProperty';
import { HandbookUsedByProperty } from './HandbookUsedByProperty';

export interface HandbookEntry {
  definition: string;
  deprecationText: string;
  deprecationReason: string;
  metaEdId: string;
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
}

export function newHandbookEntry(): HandbookEntry {
  return {
    definition: '',
    deprecationText: '',
    deprecationReason: '',
    metaEdId: '',
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
  };
}
