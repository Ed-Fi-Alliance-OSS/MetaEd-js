// @flow
import fs from 'fs';
import R from 'ramda';
import path from 'path';
import handlebars from 'handlebars';
import { orderByProp } from 'metaed-core';
import type { MetaEdEnvironment, GeneratedOutput, GeneratorResult, NamespaceInfo } from 'metaed-core';
import type { EducationOrganizationReference } from '../../model/educationOrganizationReferenceMetadata/EducationOrganizationReference';

const generatorName: string = 'edfiOdsApi.EducationOrganizationReferenceMetadataGenerator';
const outputName: string = 'Education Organization Reference Metadata';

export const educationOrganizationReferenceHandlebars = handlebars.create();

function templateString(templateName: string) {
  return fs.readFileSync(path.join(__dirname, 'templates', `${templateName}.hbs`)).toString();
}

export function templateNamed(templateName: string) {
  return educationOrganizationReferenceHandlebars.compile(templateString(templateName));
}

export const template = R.memoize(() => templateNamed('educationOrganizationReferenceMetadata'))();

function generateFile(input: any, namespaceInfo: NamespaceInfo): GeneratedOutput {
  return {
    name: outputName,
    namespace: namespaceInfo.namespace,
    folderName: 'ApiMetadata',
    fileName: `EdOrgReferenceMetadata${namespaceInfo.projectExtension ? `-${namespaceInfo.projectExtension}` : ''}.xml`,
    resultString: template(input),
    resultStream: null,
  };
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: Array<GeneratedOutput> = [];

  if (metaEd.entity.namespaceInfo.size > 0) {
    metaEd.entity.namespaceInfo.forEach((namespaceInfo: NamespaceInfo) => {
      const educationOrganizationReferences: Array<EducationOrganizationReference> = orderByProp('name')(
        namespaceInfo.data.edfiOdsApi.api_EducationOrganizationReferences,
      );
      if (educationOrganizationReferences.length > 0) {
        results.push(generateFile({ educationOrganizationReferences }, namespaceInfo));
      }
    });
  }

  return {
    generatorName,
    generatedOutput: results,
  };
}
