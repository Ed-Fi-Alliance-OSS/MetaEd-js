// @flow
import sort from 'array-sort';
import fs from 'fs';
import path from 'path';
import ramda from 'ramda';
import handlebars from 'handlebars';
import type { TopLevelEntity, EntityProperty, Enumeration, ReferentialProperty, Descriptor, MetaEdEnvironment, ModelBase } from 'metaed-core';
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
  return fs.readFileSync(path.join(__dirname, './template/', `${templateName}.hbs`), 'utf8');
}

const registerPartials = ramda.once(
  () => {
    handlebars.registerPartial({
      complexTypeItem: getTemplateString('complexTypeItem'),
      annotation: getTemplateString('annotation'),
    });
  });

const getComplexTypeTemplate = ramda.once(() => handlebars.compile(getTemplateString('complexType')));

function generatedXsdFor(entity: TopLevelEntity): string {
  registerPartials();
  const results: Array<string> = [];
  if (!entity.data.edfiXsd.xsd_ComplexTypes) return '';
  entity.data.edfiXsd.xsd_ComplexTypes.forEach((complexType) => {
    const complexTypeTemplate = getComplexTypeTemplate();
    results.push(complexTypeTemplate(complexType));
  });
  return results.join('\n');
}

const getAllOtherTypes = ramda.once((metaEd: ?MetaEdEnvironment) => {
  const results: Array<ModelBase> = [];
  if (metaEd) {
    results.push(...metaEd.entity.association.values());
    results.push(...metaEd.entity.associationExtension.values());
    results.push(...metaEd.entity.associationSubclass.values());
    results.push(...metaEd.entity.choice.values());
    results.push(...metaEd.entity.common.values());
    results.push(...metaEd.entity.commonExtension.values());
    results.push(...metaEd.entity.decimalType.values());
    results.push(...metaEd.entity.descriptor.values());
    results.push(...metaEd.entity.domain.values());
    results.push(...metaEd.entity.domainEntity.values());
    results.push(...metaEd.entity.domainEntityExtension.values());
    results.push(...metaEd.entity.domainEntitySubclass.values());
    results.push(...metaEd.entity.enumeration.values());
    results.push(...metaEd.entity.integerType.values());
    results.push(...metaEd.entity.interchange.values());
    results.push(...metaEd.entity.interchangeExtension.values());
    results.push(...metaEd.entity.mapTypeEnumeration.values());
    results.push(...metaEd.entity.schoolYearEnumeration.values());
    results.push(...metaEd.entity.sharedDecimal.values());
    results.push(...metaEd.entity.sharedInteger.values());
    results.push(...metaEd.entity.sharedString.values());
    results.push(...metaEd.entity.stringType.values());
  }
  return results;
});
function findEntityByMetaEdName(metaEdName: string): boolean {
  return getAllOtherTypes().some(x => x.metaEdName === metaEdName);
}

function findEntityByUniqueId(uniqueId: string): boolean {
  return getAllOtherTypes().some(x => (x.metaEdName + x.metaEdId) === uniqueId);
}


function getReferenceUniqueIdentifier(property: EntityProperty): string {
  const uniqueIdCandidate = property.metaEdName + property.metaEdId;

  // If we have a metaEdId then this can be one of 3 scenarios:
  // 1) A reference entity with a child id that matches ids
  // I.E.: AcademicHonor has 702-HonorAwardDate and the entity is the same
  // 2) A reference entity with a child id that does not match the parent identity.
  // I.E.: AcademicHonor has 700-AcademicHonorCategory but the real entity is 120-AcademicHonorCategory
  // 3) A reference entity that has and Id but does not match

  // 1) First deal with reference enties that are matching.
  if (findEntityByUniqueId(uniqueIdCandidate)) return uniqueIdCandidate;

  // Seach to see if we find one in top level entities.
  const referencialProperty: ReferentialProperty = ((property: any): ReferentialProperty);
  if (referencialProperty.referencedEntity) {
    const referencedEntity = referencialProperty.referencedEntity;
    const uniqueIdReferenced: string = referencedEntity.metaEdName + referencedEntity.metaEdId;
    if (findEntityByUniqueId(uniqueIdReferenced)) return uniqueIdReferenced;
  }

  // If we dont then we try to find one by just the name
  if (findEntityByMetaEdName(property.metaEdName)) return property.metaEdName;

  // Default to create unique id pattern and let the UI figure it out.
  return uniqueIdCandidate;
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
  sort(results, ['~isIdentity', 'name']);
  return results;
}

export function createDefaultHandbookEntry(entity: TopLevelEntity, entityTypeName: string, metaEd: MetaEdEnvironment): HandbookEntry {
  getAllOtherTypes(metaEd);

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
