import { ModelBase, MetaEdEnvironment, EntityProperty } from 'metaed-core';
import { HandbookEntry } from '../model/HandbookEntry';
import { newHandbookEntry } from '../model/HandbookEntry';
import { getAllReferentialProperties } from './EnhancerHelper';

function getCardinalityStringFor(property: EntityProperty, isHandbookEntityReferenceProperty: boolean = false): string {
  if (isHandbookEntityReferenceProperty && (property.isRequired || property.isPartOfIdentity || property.isIdentityRename))
    return 'required';
  if (property.isPartOfIdentity) return 'identity';
  if (property.isRequired) return 'required';
  if (property.isRequiredCollection) return 'required collection';
  if (property.isOptional) return 'optional';
  if (property.isOptionalCollection) return 'optional collection';
  return 'UNKNOWN CARDINALITY';
}

function referringProperties(metaEd: MetaEdEnvironment, entity: ModelBase): string[] {
  return getAllReferentialProperties(metaEd)
    .filter((x) => x.referencedEntity.metaEdName === entity.metaEdName)
    .map((x) => `${x.parentEntityName}.${x.metaEdName} (as ${getCardinalityStringFor(x)})`);
}

export function createDefaultHandbookEntry(
  entity: ModelBase,
  metaEdType: string,
  umlType: string,
  metaEd: MetaEdEnvironment,
): HandbookEntry {
  return {
    ...newHandbookEntry(),
    definition: entity.documentation,
    metaEdId: entity.metaEdId,
    // This is the way the UI seaches for entities
    uniqueIdentifier: entity.metaEdName + entity.metaEdId,
    metaEdType,
    umlType,
    modelReferencesUsedBy: referringProperties(metaEd, entity),
    name: entity.metaEdName,
    projectName: entity.namespace.projectName,
    optionList: [],
    typeCharacteristics: [],
  };
}
