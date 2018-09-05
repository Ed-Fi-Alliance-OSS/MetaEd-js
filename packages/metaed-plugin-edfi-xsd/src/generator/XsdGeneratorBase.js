// @flow
import R from 'ramda';
import handlebars from 'handlebars';
import { html as beautify } from 'js-beautify';
import fs from 'fs';
import path from 'path';
import semverLib from 'semver';
import type { SemVer } from 'metaed-core';

// Handlebars instance scoped for this plugin
export const xsdHandlebars = handlebars.create();

function templateString(templateName: string) {
  return fs.readFileSync(path.join(__dirname, 'templates', `${templateName}.hbs`)).toString();
}

export function templateNamed(templateName: string) {
  return xsdHandlebars.compile(templateString(templateName));
}

export const template = R.memoizeWith(R.identity, () => ({
  interchange: templateNamed('interchange'),
  schema: templateNamed('schema'),
  schemaAnnotation: templateNamed('schemaAnnotation'),
  xsdWithHeader: templateNamed('xsdWithHeader'),
}));

export const registerPartials = R.once(() => {
  xsdHandlebars.registerPartial({
    annotation: templateString('annotation'),
    attribute: templateString('attribute'),
    complexType: templateString('complexType'),
    complexTypeItem: templateString('complexTypeItem'),
    simpleType: templateString('simpleType'),
  });
});

function formatXml(unformattedXml: string): string {
  const EOL = '\n';

  const beautifiedXml: string = beautify(unformattedXml, {
    indent_size: 2,
    eol: EOL,
    end_with_newline: true,
    content_unformatted: ['xs:documentation'],
  });
  const doubleQuoteRemovedXsd: string = beautifiedXml.replace(new RegExp(/""/g), '"');
  const emptyLinesRemovedXsd: string = doubleQuoteRemovedXsd.replace(new RegExp(`${EOL}${EOL}+`, 'g'), EOL);
  return emptyLinesRemovedXsd;
}

export function formatAndPrependHeader(xsdBody: string): string {
  const completeXsd: string = template().xsdWithHeader({
    xsdBody,
    copyrightYear: new Date().getFullYear(),
  });

  return formatXml(completeXsd);
}

export function formatVersionForSchema(version: SemVer): string {
  if (!semverLib.valid(version)) return '';
  const semverified = semverLib.parse(version);
  const major: string = semverified.major < 10 ? `0${semverified.major}` : `${semverified.major}`;
  const minor: string = `${semverified.minor}`;
  // METAED-835 - Patch version isn't represented in schema version
  const patch: string = '0';
  const prerelease: string = semverified.prerelease.length ? `-${semverified.prerelease.join('.')}` : '';
  return `${major}${minor}${patch}${prerelease}`;
}
