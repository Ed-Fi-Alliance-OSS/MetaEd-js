import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { ChangeQueryTemplates } from '@edfi/metaed-plugin-edfi-ods-changequery';

export const databaseSpecificFolderName: string = 'SQLServer';

// Handlebars instance scoped for this plugin
export const odsHandlebars = handlebars.create();

function templateString(templateName: string) {
  return fs.readFileSync(path.join(__dirname, 'templates', `${templateName}.hbs`)).toString();
}

function templateNamed(templateName: string) {
  return odsHandlebars.compile(templateString(templateName));
}

export const template = () =>
  ({
    addColumnChangeVersion: templateNamed('addColumnChangeVersion'),
    deleteTrackingSchema: templateNamed('deleteTrackingSchema'),
    deleteTrackingTable: templateNamed('deleteTrackingTable'),
    deleteTrackingTrigger: templateNamed('deleteTrackingTrigger'),
    createTriggerUpdateChangeVersion: templateNamed('createTriggerUpdateChangeVersion'),
    addIndexChangeVersion: templateNamed('addIndexChangeVersion'),
    createChangeVersionSequence: templateNamed('createChangeVersionSequence'),
    indirectUpdateCascadeTrigger: templateNamed('indirectUpdateCascadeTrigger'),
  } as ChangeQueryTemplates);

export function getTemplateFileContents(filename: string): string {
  return fs.readFileSync(path.resolve(__dirname, `./templates/${filename}`), 'utf8') as string;
}
