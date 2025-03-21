// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import handlebars from 'handlebars';
import { html as beautify } from 'js-beautify';
import fs from 'fs';
import path from 'path';
import semver from 'semver';
import {
  MetaEdEnvironment,
  Namespace,
  versionSatisfies,
  PluginEnvironment,
  V7OrGreater,
  formatVersionWithSuppressPrereleaseVersion,
} from '@edfi/metaed-core';
import { edfiXsdRepositoryForNamespace } from '../enhancer/EnhancerHelper';
import { EdFiXsdEntityRepository } from '../model/EdFiXsdEntityRepository';

// Handlebars instance scoped for this plugin
export const xsdHandlebars = handlebars.create();

/**
 * This function escapes XML characters to replace them with the encoded version or a word equivalent.
 * @param xmlString string to be cleaned.
 * @returns The string with the escape characters replaced.
 */
function replaceXmlEscapeCharacters(xmlString: string): string {
  return xmlString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function templateString(templateName: string) {
  return fs.readFileSync(path.join(__dirname, 'templates', `${templateName}.hbs`)).toString();
}

export function registerHandleBarHelper() {
  xsdHandlebars.registerHelper('replaceXmlEscapeCharacters', (documentation: string) =>
    replaceXmlEscapeCharacters(documentation),
  );
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
  // Add a helper to replace escape characters
  registerHandleBarHelper();
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

function isTargetTechnologyV7OrGreater(metaEd: MetaEdEnvironment): boolean {
  return versionSatisfies((metaEd.plugin.get('edfiXsd') as PluginEnvironment).targetTechnologyVersion, V7OrGreater);
}

function isTargetTechnologyV5OrV6(metaEd: MetaEdEnvironment): boolean {
  return versionSatisfies((metaEd.plugin.get('edfiXsd') as PluginEnvironment).targetTechnologyVersion, '>=5.0.0 <7.0.0');
}

export function formatVersionForSchema(metaEd: MetaEdEnvironment): string {
  const { dataStandardVersion } = metaEd;
  if (isTargetTechnologyV5OrV6(metaEd)) return dataStandardVersion;

  if (isTargetTechnologyV7OrGreater(metaEd))
    return formatVersionWithSuppressPrereleaseVersion(dataStandardVersion, metaEd.suppressPrereleaseVersion);

  if (!semver.valid(dataStandardVersion)) return '';
  const semverified = semver.parse(dataStandardVersion);
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
