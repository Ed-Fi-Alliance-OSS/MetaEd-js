// @flow
import sort from 'array-sort';
import fs from 'fs';
import path from 'path';
import ramda from 'ramda';
import handlbars from 'handlebars';
import type { TopLevelEntity, EntityProperty, Enumeration, ReferentialProperty, Descriptor } from 'metaed-core';
import type { HandbookEntry, HandbookEntityReferenceProperty } from '../model/HandbookEntry';
import { newHandbookEntry } from '../model/HandbookEntry';

function generateUniqueId(entity: TopLevelEntity): string {
  return entity.metaEdName + entity.metaEdId;
}

function getCardinalityStringFor(property: EntityProperty, isHandbookEntityReferenceProperty: boolean = false): string {
  if (isHandbookEntityReferenceProperty && (property.isRequired || property.isPartOfIdentity || property.isIdentityRename)) return 'required';
  if (property.isPartOfIdentity) return 'identity';
  if (property.isRequired) return 'required';
  if (property.isRequiredCollectioon) return 'required collection';
  if (property.isOptional) return 'optional';
  if (property.isOptionalColelction) return 'optional collection';
  return 'UNKNOWN CARDINALITY';
}

function getPropertyNames(entity: TopLevelEntity): Array<string> {
  return entity.properties.map((p) => {
    const withContextName: string = p.withContext ? p.metaEdName : p.withContext + p.metaEdName;
    const cardinalityString: string = getCardinalityStringFor(p);
    return `${withContextName} (${cardinalityString})`;
  }).sort();
}

// sql is not implemented yet
// eslint-disable-next-line
function generatedTableSqlFor(entity: TopLevelEntity): Array<string> {
  // TODO when ods is finished.
  return [entity.metaEdName];
}

function getEnumerationItemsFor(enumeration: Enumeration): Array<string> {
  return enumeration.enumerationItems.map(e => e.shortDescription).sort();
}

function enumerationShortDescriptionsFor(entity: TopLevelEntity): Array<string> {
  if (entity.enumerationItems) return getEnumerationItemsFor(((entity: any): Enumeration));
  else if (entity.mapTypeEnumeration) return getEnumerationItemsFor(((entity: any): Descriptor).mapTypeEnumeration);
  return [];
}

function getTemplateString(templateName: string): string {
  return fs.readFileSync(path.join(__dirname, './template/', templateName), 'utf8');
}

const getComplexTypeTemplate = ramda.memoize(() => handlbars.compile(getTemplateString('complexType')));

function generatedXsdFor(entity: TopLevelEntity): string {
  const results: Array<string> = [];
  entity.data.edfiXsd.xsd_ComplexTypes.forEach((complexType) => {
    const complexTypeTemplate = getComplexTypeTemplate();
    results.push(complexTypeTemplate(complexType));
  });
  return results.join('\n');
}

function getReferenceUniqueIdentifier(property: EntityProperty): string {
  return property.metaEdName;
}

function entityPropertyToHandbookEntityReferenceProperty(property: EntityProperty): HandbookEntityReferenceProperty {
  const referentialProperty: ReferentialProperty = ((property: any): ReferentialProperty);
  return {
    edFiId: property.metaEdId,
    targetPropertyId: referentialProperty.referencedEntity ? referentialProperty.referencedEntity.metaEdId : '',
    referenceUniqueIdentifier: getReferenceUniqueIdentifier(property),
    name: `${property.withContext}${property.metaEdName}`,
    dataType: property.type,
    definition: property.documentation,
    isIdentity: (property.isPartOfIdentity || property.isIdentityRename),
    cardinality: getCardinalityStringFor(property, true),
  };
}

function propertyMetadataFor(entity: TopLevelEntity): Array<HandbookEntityReferenceProperty> {
  const results: Array<HandbookEntityReferenceProperty> = entity.properties.map(entityPropertyToHandbookEntityReferenceProperty);
  return sort(results, ['~isIdentity', 'name']);
}

export function createDefaultHandbookEntry(entity: TopLevelEntity, entityTypeName: string): HandbookEntry {
  return Object.assign(newHandbookEntry(), {
    definition: entity.documentation,
    edFiId: entity.metaEdId,
    // This is the way the UI seaches for entities
    uniqueIdentifier: generateUniqueId(entity),
    entityType: entityTypeName,
    modelReferencesContains: getPropertyNames(entity),
    modelReferencesContainsProperties: propertyMetadataFor(entity),
    modelReferencesUsedBy: [],
    name: entity.metaEdName,
    odsFragment: generatedTableSqlFor(entity),
    optionList: enumerationShortDescriptionsFor(entity),
    typeCharacteristics: [],
    xsdFragment: generatedXsdFor(entity),
  });
}
