import * as R from 'ramda';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

// Handlebars instance scoped for this plugin
export const domainMetadataHandlebars = handlebars.create();

function templateString(templateName: string) {
  return fs.readFileSync(path.join(__dirname, 'templates', `${templateName}.hbs`)).toString();
}

export function templateNamed(templateName: string) {
  return domainMetadataHandlebars.compile(templateString(templateName));
}

export const template = R.memoizeWith(R.identity, () => ({
  domainMetadata: templateNamed('domainMetadata'),
  domainMetadataExtension: templateNamed('domainMetadataExtension'),
}));

export const registerPartials = R.once(() => {
  domainMetadataHandlebars.registerPartial({
    entityTable: templateString('entityTable'),
  } as any);
});
