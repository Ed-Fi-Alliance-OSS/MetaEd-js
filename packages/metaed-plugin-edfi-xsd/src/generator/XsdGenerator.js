// @flow
import type { MetaEdEnvironment, GeneratorResult, GeneratedOutput } from 'metaed-core';
import type { NamespaceInfoEdfiXsd } from '../model/NamespaceInfo';
import type { SchemaContainer } from '../model/schema/SchemaContainer';
import { formatAndPrependHeader, registerPartials, template, formatVersionForSchema } from './XsdGeneratorBase';

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  registerPartials();

  const results: Array<GeneratedOutput> = [];

  metaEd.entity.namespaceInfo.forEach(namespaceInfo => {
    const schema: SchemaContainer = ((namespaceInfo.data.edfiXsd: any): NamespaceInfoEdfiXsd).xsd_Schema;
    schema.schemaVersion = formatVersionForSchema(metaEd.dataStandardVersion);
    const formattedGeneratedResult = formatAndPrependHeader(template().schema(schema));
    results.push({
      name: 'XSD',
      namespace: namespaceInfo.namespace,
      folderName: 'XSD',
      fileName: namespaceInfo.isExtension ? `${namespaceInfo.projectExtension}-Ed-Fi-Extended-Core.xsd` : 'Ed-Fi-Core.xsd',
      resultString: formattedGeneratedResult,
      resultStream: null,
    });
  });

  return {
    generatorName: 'edfiXsd.XsdGenerator',
    generatedOutput: results,
  };
}
