// @flow
import sort from 'sort-array';
import { html as beautify } from 'js-beautify';
import fs from 'fs';
import path from 'path';
import ramda from 'ramda';
import handlebars from 'handlebars';
import type { TopLevelEntity, EntityProperty, Enumeration, ReferentialProperty, Descriptor, MetaEdEnvironment, ModelBase } from 'metaed-core';
import { getAllEntities } from 'metaed-core';
import type { HandbookEntry, HandbookEntityReferenceProperty } from '../model/HandbookEntry';
import { newHandbookEntry } from '../model/HandbookEntry';
import { getAllReferentialProperties } from './EnhancerHelper';

function generateUniqueId(entity: TopLevelEntity): string {
  return entity.metaEdName + entity.metaEdId;
}

function getCardinalityStringFor(property: EntityProperty, isHandbookEntityReferenceProperty: boolean = false): string {
  if (isHandbookEntityReferenceProperty && (property.isRequired || property.isPartOfIdentity || property.isIdentityRename)) return 'required';
  if (property.isPartOfIdentity) return 'identity';
  if (property.isRequired) return 'required';
  if (property.isRequiredCollection) return 'required collection';
  if (property.isOptional) return 'optional';
  if (property.isOptionalCollection) return 'optional collection';
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
  // $FlowIgnore
  return null;
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
  return fs.readFileSync(path.join(__dirname, './template/', `${templateName}.hbs`), 'utf8');
}

const registerPartials: () => void = ramda.once(
  () => {
    handlebars.registerPartial({
      complexTypeItem: getTemplateString('complexTypeItem'),
      annotation: getTemplateString('annotation'),
    });
  });

const getComplexTypeTemplate: () => (any) => string = ramda.once(() => handlebars.compile(getTemplateString('complexType')));

function generatedXsdFor(entity: TopLevelEntity): string {
  registerPartials();
  const results: Array<string> = [];
  if (!entity.data.edfiXsd.xsd_ComplexTypes) return '';
  entity.data.edfiXsd.xsd_ComplexTypes.forEach((complexType) => {
    const complexTypeTemplate: (any) => string = getComplexTypeTemplate();
    results.push(complexTypeTemplate(complexType));
  });
  return beautify(results.join('\n'), { indent_size: 2 });
}

function findEntityByMetaEdName(allEntities: Array<ModelBase>, metaEdName: string): boolean {
  return allEntities.some(x => x.metaEdName === metaEdName);
}

function findEntityByUniqueId(allEntities: Array<ModelBase>, uniqueId: string): boolean {
  return allEntities.some(x => (x.metaEdName + x.metaEdId) === uniqueId);
}

function getReferenceUniqueIdentifier(allEntities: Array<ModelBase>, property: EntityProperty): string {
  const uniqueIdCandidate: string = property.metaEdName + property.metaEdId;

  // If we have a metaEdId then this can be one of 3 scenarios:
  // 1) A reference entity with a child id that matches ids
  // I.E.: AcademicHonor has 702-HonorAwardDate and the entity is the same
  // 2) A reference entity with a child id that does not match the parent identity.
  // I.E.: AcademicHonor has 700-AcademicHonorCategory but the real entity is 120-AcademicHonorCategory
  // 3) A reference entity that has and Id but does not match

  // 1) First deal with reference enties that are matching.
  if (findEntityByUniqueId(allEntities, uniqueIdCandidate)) return uniqueIdCandidate;

  // Search to see if we find one in top level entities.
  const referentialProperty: ReferentialProperty = ((property: any): ReferentialProperty);
  if (referentialProperty.referencedEntity) {
    const referencedEntity = referentialProperty.referencedEntity;
    const uniqueIdReferenced: string = referencedEntity.metaEdName + referencedEntity.metaEdId;
    if (findEntityByUniqueId(allEntities, uniqueIdReferenced)) return uniqueIdReferenced;
  }

  // If we dont then we try to find one by just the name
  if (findEntityByMetaEdName(allEntities, property.metaEdName)) return property.metaEdName;

  // Default to create unique id pattern and let the UI figure it out.
  return uniqueIdCandidate;
}

function getDataTypeName(property: EntityProperty): string {
  const titleName: string = property.type[0].toUpperCase() + property.type.substring(1);
  return `${titleName}Property`;
}

function entityPropertyToHandbookEntityReferenceProperty(allEntities: Array<ModelBase>, property: EntityProperty): HandbookEntityReferenceProperty {
  const referentialProperty: ReferentialProperty = ((property: any): ReferentialProperty);
  return {
    edFiId: property.metaEdId,
    targetPropertyId: referentialProperty.referencedEntity ? referentialProperty.referencedEntity.metaEdId : '',
    referenceUniqueIdentifier: getReferenceUniqueIdentifier(allEntities, property),
    name: `${property.withContext}${property.metaEdName}`,
    dataType: getDataTypeName(property),
    definition: property.documentation,
    isIdentity: (property.isPartOfIdentity || property.isIdentityRename),
    cardinality: getCardinalityStringFor(property, true),
  };
}

function propertyMetadataFor(allEntities: Array<ModelBase>, entity: TopLevelEntity): Array<HandbookEntityReferenceProperty> {
  let results: Array<HandbookEntityReferenceProperty> = entity.properties.map(x => entityPropertyToHandbookEntityReferenceProperty(allEntities, x));
  results = sort(results, ['isIdentity', 'name'], { isIdentity: [true, false] });
  return results;
}

function referringProperties(allReferentialProperties: Array<ReferentialProperty>, entity: TopLevelEntity): Array<string> {
  return allReferentialProperties.filter((x) => x.referencedEntity.metaEdName === entity.metaEdName).map(x => `${x.parentEntityName}.${x.metaEdName} (as ${getCardinalityStringFor(x)})`);
}

export function createDefaultHandbookEntry(entity: TopLevelEntity, entityTypeName: string, metaEd: MetaEdEnvironment): HandbookEntry {
  const allEntities: Array<ModelBase> = getAllEntities(metaEd.entity);
  const allReferentialProperties: Array<ReferentialProperty> = getAllReferentialProperties(metaEd);
  return Object.assign(newHandbookEntry(), {
    definition: entity.documentation,
    edFiId: entity.metaEdId,
    // This is the way the UI seaches for entities
    uniqueIdentifier: generateUniqueId(entity),
    entityType: entityTypeName,
    modelReferencesContains: getPropertyNames(entity),
    modelReferencesContainsProperties: propertyMetadataFor(allEntities, entity),
    modelReferencesUsedBy: referringProperties(allReferentialProperties, entity),
    name: entity.metaEdName,
    odsFragment: generatedTableSqlFor(entity),
    optionList: enumerationShortDescriptionsFor(entity),
    typeCharacteristics: [],
    xsdFragment: generatedXsdFor(entity),
  });
}
