import { ColumnDataTypes } from '@edfi/metaed-plugin-edfi-ods-sqlserver';
import { ModelBase, MetaEdEnvironment, EntityProperty } from '@edfi/metaed-core';
import { HandbookEntry } from '../model/HandbookEntry';
import { newHandbookEntry } from '../model/HandbookEntry';
import { getAllReferentialProperties } from './EnhancerHelper';

function getColumnString(property: any): string {
  switch (property.type) {
    case 'stringType':
      return ColumnDataTypes.string(property.maxLength);
    case 'decimalType':
      return ColumnDataTypes.decimal(property.totalDigits, property.decimalPlaces);
    case 'integerType':
      return property.isShort ? ColumnDataTypes.short : ColumnDataTypes.integer;
    default:
      return '';
  }
}

// eslint-disable-next-line
function generatedTableSqlFor(property: any): Array<string> {
  return [`${property.metaEdName} ${getColumnString(property)}`];
}

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
    // This is the way the UI searches for entities
    uniqueIdentifier: entity.metaEdName + entity.metaEdId,
    odsFragment: generatedTableSqlFor(entity),
    metaEdType,
    umlType,
    modelReferencesUsedBy: referringProperties(metaEd, entity),
    name: entity.metaEdName,
    projectName: entity.namespace.projectName,
    optionList: [],
    typeCharacteristics: [],
  };
}
