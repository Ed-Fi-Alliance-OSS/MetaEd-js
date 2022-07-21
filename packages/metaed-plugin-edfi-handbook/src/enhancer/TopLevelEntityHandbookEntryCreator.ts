import sort from 'sort-array';
import fs from 'fs';
import path from 'path';
import ramda from 'ramda';
import handlebars from 'handlebars';
import {
  TopLevelEntity,
  EntityProperty,
  Enumeration,
  ReferentialProperty,
  Descriptor,
  MetaEdEnvironment,
  ModelBase,
  getAllEntitiesForNamespaces,
} from '@edfi/metaed-core';
import type { Table, TopLevelEntityEdfiOds } from '@edfi/metaed-plugin-edfi-ods-relational';
import { HandbookEntry } from '../model/HandbookEntry';
import { newHandbookEntry } from '../model/HandbookEntry';
import { getAllReferentialProperties } from './EnhancerHelper';
import { HandbookEntityReferenceProperty } from '../model/HandbookEntryReferenceProperty';
import { HandbookMergeProperty } from '../model/HandbookMergeProperty';
import { umlDatatypeMatrix, jsonDatatypeMatrix, getSqlDatatype, getMetaEdDatatype } from './DatatypeLookup';

function generateUniqueId(entity: TopLevelEntity): string {
  return entity.metaEdName + entity.metaEdId;
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

function getPropertyNames(entity: TopLevelEntity): string[] {
  return entity.properties
    .map((p) => {
      const roleNameName: string = p.roleName ? p.metaEdName : p.roleName + p.metaEdName;
      const cardinalityString: string = getCardinalityStringFor(p);
      return `${roleNameName} (${cardinalityString})`;
    })
    .sort();
}

function getEnumerationItemsFor(enumeration: Enumeration): string[] {
  return enumeration.enumerationItems.map((e) => e.shortDescription).sort();
}

function enumerationShortDescriptionsFor(entity: TopLevelEntity): string[] {
  if (entity.type === 'enumeration' || entity.type === 'mapTypeEnumeration' || entity.type === 'schoolYearEnumeration') {
    return getEnumerationItemsFor(entity as Enumeration);
  }
  if (entity.type === 'descriptor') return getEnumerationItemsFor((entity as Descriptor).mapTypeEnumeration);
  return [];
}

function getTemplateString(templateName: string): string {
  return fs.readFileSync(path.join(__dirname, './template/', `${templateName}.hbs`), 'utf8');
}

const getHandbookTableTemplate: () => (x: any) => string = ramda.once(() =>
  handlebars.compile(getTemplateString('handbookTable')),
);

function generatedTableSqlFor(entity: TopLevelEntity): string[] {
  if (entity.data.edfiOdsRelational == null || entity.data.edfiOdsRelational.odsTables == null) return [];

  const tables: Table[] = (entity.data.edfiOdsRelational as TopLevelEntityEdfiOds).odsTables;
  const results: string[] = [];

  tables.forEach((table: Table) => {
    const handbookTableTemplate: (x: any) => string = getHandbookTableTemplate();
    results.push(handbookTableTemplate({ table }));
  });

  return results.sort();
}

function findEntityByMetaEdName(allEntities: ModelBase[], metaEdName: string): boolean {
  return allEntities.some((x) => x.metaEdName === metaEdName);
}

function findEntityByUniqueId(allEntities: ModelBase[], uniqueId: string): boolean {
  return allEntities.some((x) => x.metaEdName + x.metaEdId === uniqueId);
}

function getReferenceUniqueIdentifier(allEntities: ModelBase[], property: EntityProperty): string {
  // Search to see if we find one in top level entities.
  if ((property as ReferentialProperty).referencedEntity != null) {
    const { referencedEntity } = property as ReferentialProperty;
    return referencedEntity.metaEdName + referencedEntity.metaEdId;
  }

  // If we have a metaEdId then this can be one of 3 scenarios:
  // 1) A reference entity with a child id that matches ids
  // I.E.: AcademicHonor has 702-HonorAwardDate and the entity is the same
  // 2) A reference entity with a child id that does not match the parent identity.
  // I.E.: AcademicHonor has 700-AcademicHonorCategory but the real entity is 120-AcademicHonorCategory
  // 3) A reference entity that has and Id but does not match

  const uniqueIdCandidate: string = property.metaEdName + property.metaEdId;

  // First deal with reference enties that are matching.
  if (findEntityByUniqueId(allEntities, uniqueIdCandidate)) return uniqueIdCandidate;

  // If we dont then we try to find one by just the name
  if (findEntityByMetaEdName(allEntities, property.metaEdName)) return property.metaEdName;

  // Default to create unique id pattern and let the UI figure it out.
  return uniqueIdCandidate;
}

function getMergedProperties(property: ReferentialProperty): HandbookMergeProperty[] {
  if (!property.mergeDirectives) return [];

  return property.mergeDirectives.map((x) => ({
    propertyPath: x.sourcePropertyPathStrings,
    targetPath: x.targetPropertyPathStrings,
  }));
}

function entityPropertyToHandbookEntityReferenceProperty(
  allEntities: ModelBase[],
  property: EntityProperty,
): HandbookEntityReferenceProperty {
  const referentialProperty: ReferentialProperty = property as ReferentialProperty;
  const isPropertyOnExtensionEntity: boolean = ['associationExtension', 'domainEntityExtension', 'commonExtension'].includes(
    property.parentEntity.type,
  );
  return {
    metaEdId: property.metaEdId,
    targetPropertyId: referentialProperty.referencedEntity ? referentialProperty.referencedEntity.metaEdId : '',
    referenceUniqueIdentifier: getReferenceUniqueIdentifier(allEntities, property),
    name: property.roleName === property.metaEdName ? `${property.roleName}` : `${property.roleName}${property.metaEdName}`,
    deprecationText: property.isDeprecated ? 'DEPRECATED' : '',
    deprecationReason: property.deprecationReason,
    extensionParentName: isPropertyOnExtensionEntity ? property.parentEntity.metaEdName : '',
    extensionParentNamespaceName: isPropertyOnExtensionEntity ? property.parentEntity.namespace.namespaceName : '',
    umlDatatype: umlDatatypeMatrix[property.type],
    jsonDatatype: jsonDatatypeMatrix[property.type],
    metaEdDatatype: getMetaEdDatatype(property),
    sqlDatatype: getSqlDatatype(property),
    isIdentity: property.isPartOfIdentity || property.isIdentityRename,
    isOdsApiIdentity: property.isPartOfIdentity || property.isIdentityRename,
    cardinality: getCardinalityStringFor(property, true),
    definition: property.documentation,
    mergeDirectives: getMergedProperties(referentialProperty),
  };
}

function propertyMetadataFor(allEntities: ModelBase[], entity: TopLevelEntity): HandbookEntityReferenceProperty[] {
  let results: HandbookEntityReferenceProperty[] = entity.properties.map((x) =>
    entityPropertyToHandbookEntityReferenceProperty(allEntities, x),
  );
  results = sort(results, ['isIdentity', 'name'], { isIdentity: [true, false] });
  return results;
}

function extensionPropertyMetadataFor(allEntities: ModelBase[], entity: TopLevelEntity): HandbookEntityReferenceProperty[] {
  const results: HandbookEntityReferenceProperty[] = [];
  entity.extendedBy.forEach((extensionEntity) => results.push(...propertyMetadataFor(allEntities, extensionEntity)));
  return results;
}

function referringProperties(allReferentialProperties: ReferentialProperty[], entity: TopLevelEntity): string[] {
  return allReferentialProperties
    .filter((x) => x.referencedEntity.metaEdName === entity.metaEdName)
    .map((x) => `${x.parentEntityName}.${x.metaEdName} (as ${getCardinalityStringFor(x)})`);
}

export function createDefaultHandbookEntry(
  entity: TopLevelEntity,
  metaEdType: string,
  umlType: string,
  metaEd: MetaEdEnvironment,
): HandbookEntry {
  const allEntities: ModelBase[] = getAllEntitiesForNamespaces([...metaEd.namespace.values()]);
  const allReferentialProperties: ReferentialProperty[] = getAllReferentialProperties(metaEd);
  return {
    ...newHandbookEntry(),
    definition: entity.documentation,
    metaEdId: entity.metaEdId,
    // This is the way the UI searches for entities
    uniqueIdentifier: generateUniqueId(entity),
    metaEdType,
    umlType,
    modelReferencesContains: getPropertyNames(entity),
    modelReferencesContainsProperties: [
      ...propertyMetadataFor(allEntities, entity),
      ...extensionPropertyMetadataFor(allEntities, entity),
    ],
    modelReferencesUsedBy: referringProperties(allReferentialProperties, entity),
    name:
      entity.namespace.projectName === 'Ed-Fi'
        ? entity.metaEdName
        : `${entity.metaEdName} (${entity.namespace.projectName})`,
    projectName: entity.namespace.projectName,
    deprecationText: entity.isDeprecated ? ' - DEPRECATED' : '',
    deprecationReason: entity.deprecationReason,
    hasDeprecatedProperty: entity.properties.some((p) => p.isDeprecated),
    odsFragment: generatedTableSqlFor(entity),
    optionList: enumerationShortDescriptionsFor(entity),
    typeCharacteristics: [],
  };
}
