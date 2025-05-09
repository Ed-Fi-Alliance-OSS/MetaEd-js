// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import * as R from 'ramda';
import { Namespace } from '@edfi/metaed-core';

export const odsPath = '/Database/SQLServer/ODS/';
export const dataPath = `${odsPath}Data/`;
export const structurePath = `${odsPath}Structure/`;

export function fileNameFor(prefix: string, namespace: Namespace, suffix: string): string {
  if (namespace.namespaceName === 'EdFi') return `${prefix}-${suffix}.sql`;

  const extensionNamespace: string =
    namespace.projectExtension === '' ? namespace.namespaceName : `${namespace.projectExtension}-${namespace.namespaceName}`;
  return `${prefix}-${extensionNamespace}-${suffix}.sql`;
}

// Handlebars instance scoped for this plugin
export const odsHandlebars = handlebars.create();

function templateString(templateName: string) {
  return fs.readFileSync(path.join(__dirname, 'templates', `${templateName}.hbs`)).toString();
}

export function templateNamed(templateName: string) {
  return odsHandlebars.compile(templateString(templateName));
}

export const template = R.memoizeWith(R.identity, () => ({
  coreSchema: templateNamed('coreSchema'),
  table: templateNamed('table'),
  foreignKey: templateNamed('foreignKey'),
  idIndexes: templateNamed('idIndexes'),
  extendedProperties: templateNamed('extendedProperties'),
  enumerationRow: templateNamed('enumerationRow'),
  schoolYearEnumerationRow: templateNamed('schoolYearEnumerationRow'),
  extensionSchema: templateNamed('extensionSchema'),
  createEducationOrganizationAuthorizationIndexesGenerator: templateNamed('createEducationOrganizationAuthorizationIndexes'),
  updateEducationOrganizationAuthorizationIndexesGenerator: templateNamed('updateEducationOrganizationAuthorizationIndexes'),
  aggregateIdColumns: templateNamed('aggregateIdColumns'),
}));

export const registerPartials = R.once(() => {
  odsHandlebars.registerPartial({
    column: templateNamed('column'),
  });
});
