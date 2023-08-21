import { EntityProperty } from '@edfi/metaed-core';
import { HandbookEntry } from '../model/HandbookEntry';
import { newHandbookEntry } from '../model/HandbookEntry';

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

function propertyNamer(property: EntityProperty): string {
  return property.roleName === property.metaEdName ? property.metaEdName : property.roleName + property.metaEdName;
}

function parentNameAndPropertyCardinality(property: EntityProperty): string {
  return `${property.parentEntityName}.${propertyNamer(property)} (as ${getCardinalityStringFor(property)})`;
}

function getPropertyName(property: EntityProperty): string {
  const nameRuleExeptions: string[] = ['BeginDate', 'AsOfDate', 'EndDate'];
  if (nameRuleExeptions.includes(property.metaEdName)) return `${property.metaEdName} (${property.parentEntity.metaEdName})`;
  return property.metaEdName;
}

function generatedTableSqlFor(property: EntityProperty, columnDatatype: string): Array<string> {
  return [`${property.metaEdName} ${columnDatatype}`];
}

export function createDefaultHandbookEntry(
  property: EntityProperty,
  metaEdType: string,
  umlType: string,
  columnDatatype: string,
): HandbookEntry {
  return {
    ...newHandbookEntry(),
    definition: property.documentation,
    entityUuid: property.propertyUuid,
    // This is the way the UI seaches for entities
    uniqueIdentifier: property.metaEdName + property.propertyUuid,
    metaEdType,
    umlType,
    modelReferencesUsedBy: [parentNameAndPropertyCardinality(property)],
    name: getPropertyName(property),
    projectName: property.namespace.projectName,
    odsFragment: generatedTableSqlFor(property, columnDatatype),
    optionList: [],
    typeCharacteristics: [],
  };
}
