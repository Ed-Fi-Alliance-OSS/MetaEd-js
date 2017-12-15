// @flow
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import R from 'ramda';

// Handlebars instance scoped for this plugin
export const odsHandlebars = handlebars.create();

function templateString(templateName: string) {
  return fs.readFileSync(path.join(__dirname, 'templates', `${templateName}.hbs`)).toString();
}

export function templateNamed(templateName: string) {
  return odsHandlebars.compile(templateString(templateName));
}

export const template = R.memoize(
  () =>
    ({
      table: templateNamed('table'),
      foreignKey: templateNamed('foreignKey'),
      deleteEventTable: templateNamed('deleteEventTable'),
      trigger: templateNamed('trigger'),
      enumerationRow: templateNamed('enumerationRow'),
      schoolYearEnumerationRow: templateNamed('schoolYearEnumerationRow'),
    }),
  );

export const registerPartials = R.once(
  () => {
    odsHandlebars.registerPartial({
      column: templateNamed('column'),
    });
  });
