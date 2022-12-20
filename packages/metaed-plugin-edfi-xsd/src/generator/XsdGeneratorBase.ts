import * as R from 'ramda';
import handlebars from 'handlebars';
import { html as beautify } from 'js-beautify';
import fs from 'fs';
import path from 'path';
import semver from 'semver';
import { SemVer, MetaEdEnvironment, Namespace, versionSatisfies, PluginEnvironment, V5OrGreater } from '@edfi/metaed-core';
import { edfiXsdRepositoryForNamespace } from '../enhancer/EnhancerHelper';
import { EdFiXsdEntityRepository } from '../model/EdFiXsdEntityRepository';

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
  } as any);
});

function formatXml(unformattedXml: string): string {
  const EOL = '\n';

  const beautifiedXml: string = beautify(unformattedXml, {
    indent_size: 2,
    eol: EOL,
    end_with_newline: true,
    content_unformatted: ['xs:documentation'],
  });
  const doubleQuoteRemovedXsd: string = beautifiedXml.replace(/""/g, '"');
  const emptyLinesRemovedXsd: string = doubleQuoteRemovedXsd.replace(new RegExp(`${EOL}${EOL}+`, 'g'), EOL);
  return emptyLinesRemovedXsd;
}

export function formatAndPrependHeader(xsdBody: string): string {
  const completeXsd: string = template().xsdWithHeader({
    xsdBody,
  });

  return formatXml(completeXsd);
}

function isTargetTechnologyV5OrGreater(metaEd: MetaEdEnvironment): boolean {
  return versionSatisfies((metaEd.plugin.get('edfiXsd') as PluginEnvironment).targetTechnologyVersion, V5OrGreater);
}

export function formatVersionForSchema(metaEd: MetaEdEnvironment): string {
  const version: SemVer = metaEd.dataStandardVersion;
  if (isTargetTechnologyV5OrGreater(metaEd)) return version;
  if (!semver.valid(version)) return '';
  const semverified = semver.parse(version);
  if (semverified == null) return '';
  const major: string = semverified.major < 10 ? `0${semverified.major}` : `${semverified.major}`;
  const minor = `${semverified.minor}`;
  // METAED-835 - Patch version isn't represented in schema version
  const patch = '0';
  const prerelease: string = semverified.prerelease.length ? `${semverified.prerelease.join('.')}` : '';
  return `${major}${minor}${patch}${prerelease}`;
}

// METAED-997
export function hasDuplicateEntityNameInNamespace(metaEd: MetaEdEnvironment, namespace: Namespace): boolean {
  const edFiXsdEntityRepository: EdFiXsdEntityRepository | null = edfiXsdRepositoryForNamespace(metaEd, namespace);
  if (edFiXsdEntityRepository == null) return false;
  return edFiXsdEntityRepository.hasDuplicateEntityNameInDependencyNamespace;
}
