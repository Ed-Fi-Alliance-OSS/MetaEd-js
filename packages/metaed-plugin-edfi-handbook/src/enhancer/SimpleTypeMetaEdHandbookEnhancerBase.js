// @flow
import fs from 'fs';
import path from 'path';
import ramda from 'ramda';
import handlbars from 'handlebars';
import type { ModelBase, MetaEdEnvironment, EntityProperty } from 'metaed-core';
import type { HandbookEntry } from '../model/HandbookEntry';
import { newHandbookEntry } from '../model/HandbookEntry';
import { getAllReferentialProperties } from './EnhancerHelper';

// TODO: finish once ods is up and running.
// eslint-disable-next-line
function generatedTableSqlFor(property: ModelBase): Array<string> {
  return [];
}

function getTemplateString(templateName: string): string {
  return fs.readFileSync(path.join(__dirname, './template/', `${templateName}.hbs`), 'utf8');
}

const getSimpleTypeTemplate: () => (any) => string = ramda.memoize(() => handlbars.compile(getTemplateString('simpleType')));

function generatedXsdFor(entity: ModelBase): string {
  if (!entity.data.edfiXsd.xsd_SimpleType) return '';
  const template: (any) => string = getSimpleTypeTemplate();
  return template(entity.data.edfiXsd.xsd_SimpleType);
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


function referringProperties(metaEd: MetaEdEnvironment, entity: ModelBase): Array<string> {
  return getAllReferentialProperties(metaEd).filter((x) => x.referencedEntity.metaEdName === entity.metaEdName).map(x => `${x.parentEntityName}.${x.metaEdName} (as ${getCardinalityStringFor(x)})`);
}

export function createDefaultHandbookEntry(property: ModelBase, entityTypeName: string, metaEd: MetaEdEnvironment): HandbookEntry {
  return Object.assign(newHandbookEntry(), {
    definition: property.documentation,
    edFiId: property.metaEdId,
    // This is the way the UI seaches for entities
    uniqueIdentifier: property.metaEdName + property.metaEdId,
    entityType: entityTypeName,
    modelReferencesUsedBy: referringProperties(metaEd, property),
    name: property.metaEdName,
    odsFragment: generatedTableSqlFor(property),
    optionList: [],
    typeCharacteristics: [],
    xsdFragment: generatedXsdFor(property),
  });
}
