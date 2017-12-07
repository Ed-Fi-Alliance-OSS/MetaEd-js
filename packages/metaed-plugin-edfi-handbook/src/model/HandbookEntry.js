// @flow

export type HandbookEntityReferenceProperty = {
  edFiId: string,
  targetPropertyId: string,
  referenceUniqueIdentifier: string,
  name: string,
  dataType: string,
  isIdentity: boolean,
  cardinality: string,
  definition: string,
};

export type HandbookEntry = {
  definition: string,
  edFiId: string,
  uniqueIdentifier: string,
  entityType: string,
  modelReferencesContains: Array<string>,
  modelReferencesContainsProperties: Array<HandbookEntityReferenceProperty>,
  modelReferencesUsedBy: Array<string>,
  name: string,
  odsFragment: Array<string>,
  optionList: Array<string>,
  typeCharacteristics: Array<string>,
  xsdFragment: string,
  repositoryId: string,
  namespace: string,
  metaEdType: string,
};

export function newHandbookEntry(): HandbookEntry {
  return {
    definition: '',
    edFiId: '',
    uniqueIdentifier: '',
    entityType: '',
    modelReferencesContains: [],
    modelReferencesContainsProperties: [],
    modelReferencesUsedBy: [],
    name: '',
    odsFragment: [],
    optionList: [],
    typeCharacteristics: [],
    xsdFragment: '',
    repositoryId: '',
    namespace: '',
    metaEdType: '',
  };
}
