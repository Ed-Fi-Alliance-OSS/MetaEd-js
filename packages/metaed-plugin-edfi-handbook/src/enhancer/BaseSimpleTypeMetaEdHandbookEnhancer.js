// @flow
import fs from 'fs';
import path from 'path';
import ramda from 'ramda';
import handlbars from 'handlebars';
import type { SimpleType } from 'metaed-plugin-edfi-xsd';
import type { HandbookEntry } from '../model/HandbookEntry';
import { newHandbookEntry } from '../model/HandbookEntry';

// TODO: finish once ods is up and running.
// eslint-disable-next-line
function generatedTableSqlFor(property: SimpleType): Array<string> {
  return [];
}

function getTemplateString(templateName: string): string {
  return fs.readFileSync(path.join(__dirname, './template/', `${templateName}.hbs`), 'utf8');
}

const getSimpleTypeTemplate: () => (any) => string = ramda.once(() => handlbars.compile(getTemplateString('simpleType')));

function generatedXsdFor(entity: SimpleType): string {
  const template: (any) => string = getSimpleTypeTemplate();
  return template(entity);
}

export function createDefaultHandbookEntry(property: SimpleType, edfiId: string, name: string, documentation: string): HandbookEntry {
  return Object.assign(newHandbookEntry(), {
    definition: documentation,
    edFiId: edfiId,
    // This is the way the UI seaches for entities
    uniqueIdentifier: name + edfiId,
    entityType: `${name} Base Type`,
    modelReferencesUsedBy: [],
    name,
    odsFragment: generatedTableSqlFor(property),
    optionList: [],
    typeCharacteristics: [],
    xsdFragment: generatedXsdFor(property),
  });
}
