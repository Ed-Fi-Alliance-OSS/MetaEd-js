import { ColumnDataTypes } from '@edfi/metaed-plugin-edfi-ods-sqlserver';
import type { MetaEdEnvironment, EntityProperty, IntegerType, DecimalType, StringType } from '@edfi/metaed-core';
import { HandbookEntry } from '../model/HandbookEntry';
import { newHandbookEntry } from '../model/HandbookEntry';
import { getAllReferentialProperties } from './EnhancerHelper';

type XsdType = StringType | IntegerType | DecimalType;

function getColumnString(xsdType: XsdType): string {
  switch (xsdType.type) {
    case 'stringType':
      return ColumnDataTypes.string((xsdType as StringType).maxLength);
    case 'decimalType':
      return ColumnDataTypes.decimal((xsdType as DecimalType).totalDigits, (xsdType as DecimalType).decimalPlaces);
    case 'integerType':
      return (xsdType as IntegerType).isShort ? ColumnDataTypes.short : ColumnDataTypes.integer;
    default:
      return '';
  }
}

function generatedTableSqlFor(xsdType: XsdType): Array<string> {
  return [`${xsdType.metaEdName} ${getColumnString(xsdType)}`];
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

function referringProperties(metaEd: MetaEdEnvironment, xsdType: XsdType): string[] {
  return getAllReferentialProperties(metaEd)
    .filter((x) => x.referencedEntity.metaEdName === xsdType.metaEdName)
    .map((x) => `${x.parentEntityName}.${x.metaEdName} (as ${getCardinalityStringFor(x)})`);
}

export function createDefaultHandbookEntry(
  xsdType: XsdType,
  metaEdType: string,
  umlType: string,
  metaEd: MetaEdEnvironment,
): HandbookEntry {
  return {
    ...newHandbookEntry(),
    definition: xsdType.documentation,
    entityUuid: xsdType.entityUuid,
    // This is the way the UI searches for entities
    uniqueIdentifier: xsdType.metaEdName + xsdType.entityUuid,
    odsFragment: generatedTableSqlFor(xsdType),
    metaEdType,
    umlType,
    modelReferencesUsedBy: referringProperties(metaEd, xsdType),
    name: xsdType.metaEdName,
    projectName: xsdType.namespace.projectName,
    optionList: [],
    typeCharacteristics: [],
  };
}
