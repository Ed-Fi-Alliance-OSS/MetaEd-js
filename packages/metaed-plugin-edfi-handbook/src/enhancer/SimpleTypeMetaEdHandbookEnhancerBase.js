// @flow
import fs from 'fs';
import path from 'path';
import ramda from 'ramda';
import handlbars from 'handlebars';
import type { ModelBase } from 'metaed-core';
import type { HandbookEntry } from '../model/HandbookEntry';
import { newHandbookEntry } from '../model/HandbookEntry';

// TODO: finish once ods is up and running.
// eslint-disable-next-line
function generatedTableSqlFor(property: ModelBase): Array<string> {
  return [];
}

function getTemplateString(templateName: string): string {
  return fs.readFileSync(path.join(__dirname, './template/', templateName), 'utf8');
}

const getSimpleTypeTemplate = ramda.memoize(() => handlbars.compile(getTemplateString('simpleType')));

function generatedXsdFor(entity: ModelBase): string {
  if (entity.data.edfiXsd.xsd_SimpleType) return '';
  const template = getSimpleTypeTemplate();
  return template(entity.data.edfiXsd.xsd_SimpleType);
}

export function createDefaultHandbookEntry(property: ModelBase, entityTypeName: string): HandbookEntry {
  return Object.assign(newHandbookEntry(), {
    definition: property.documentation,
    edFiId: property.metaEdId,
    // This is the way the UI seaches for entities
    uniqueIdentifier: property.metaEdName + property.metaEdId,
    entityType: entityTypeName,
    modelReferencesUsedBy: [],
    name: property.metaEdName,
    odsFragment: generatedTableSqlFor(property),
    optionList: [],
    typeCharacteristics: [],
    xsdFragment: generatedXsdFor(property),
  });
}
