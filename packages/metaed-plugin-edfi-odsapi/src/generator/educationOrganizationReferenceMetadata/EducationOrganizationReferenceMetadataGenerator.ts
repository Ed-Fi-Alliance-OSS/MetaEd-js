// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import fs from 'fs';
import * as R from 'ramda';
import path from 'path';
import handlebars from 'handlebars';
import { orderByProp, PluginEnvironment, versionSatisfies } from '@edfi/metaed-core';
import { MetaEdEnvironment, GeneratedOutput, GeneratorResult, Namespace } from '@edfi/metaed-core';
import { EducationOrganizationReference } from '../../model/educationOrganizationReferenceMetadata/EducationOrganizationReference';

const generatorName = 'edfiOdsApi.EducationOrganizationReferenceMetadataGenerator';
const outputName = 'Education Organization Reference Metadata';

export const educationOrganizationReferenceHandlebars = handlebars.create();

function templateString(templateName: string) {
  return fs.readFileSync(path.join(__dirname, 'templates', `${templateName}.hbs`)).toString();
}

export function templateNamed(templateName: string) {
  return educationOrganizationReferenceHandlebars.compile(templateString(templateName));
}

export const template = R.memoizeWith(R.identity, () => templateNamed('educationOrganizationReferenceMetadata'))();

function generateFile(input: any, namespace: Namespace): GeneratedOutput {
  return {
    name: outputName,
    namespace: namespace.namespaceName,
    folderName: 'ApiMetadata',
    fileName: `EdOrgReferenceMetadata${namespace.projectExtension ? `-${namespace.projectExtension}` : ''}.xml`,
    resultString: template(input),
    resultStream: null,
  };
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = [];

  if (!versionSatisfies((metaEd.plugin.get('edfiOdsApi') as PluginEnvironment).targetTechnologyVersion, '<6.0.0')) {
    return { generatorName, generatedOutput: results };
  }

  metaEd.namespace.forEach((namespace: Namespace) => {
    const educationOrganizationReferences: EducationOrganizationReference[] = orderByProp('name')(
      namespace.data.edfiOdsApi.apiEducationOrganizationReferences,
    );
    if (educationOrganizationReferences.length > 0) {
      results.push(generateFile({ educationOrganizationReferences }, namespace));
    }
  });

  return {
    generatorName,
    generatedOutput: results,
  };
}
