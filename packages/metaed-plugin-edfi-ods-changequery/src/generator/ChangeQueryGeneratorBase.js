// @flow
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import R from 'ramda';

export const changeQueryPath: string = '/Database/SQLServer/ODS/Structure/Changes/';

// Handlebars instance scoped for this plugin
export const odsHandlebars = handlebars.create();

function templateString(templateName: string) {
  return fs.readFileSync(path.join(__dirname, 'templates', `${templateName}.hbs`)).toString();
}

export function templateNamed(templateName: string) {
  return odsHandlebars.compile(templateString(templateName));
}

export const template = R.memoizeWith(R.identity, () => ({
  addColumnChangeVersion: templateNamed('addColumnChangeVersion'),
  deleteTrackingTable: templateNamed('deleteTrackingTable'),
  deleteTrackingTrigger: templateNamed('deleteTrackingTrigger'),
  createTriggerUpdateChangeVersion: templateNamed('createTriggerUpdateChangeVersion'),
  addIndexChangeVersion: templateNamed('addIndexChangeVersion'),
}));
