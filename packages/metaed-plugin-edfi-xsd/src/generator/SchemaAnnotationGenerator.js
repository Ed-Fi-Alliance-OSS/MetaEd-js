// @flow
import type { MetaEdEnvironment, GeneratorResult, GeneratedOutput } from 'metaed-core';
import { getEntitiesOfType, orderByProp } from 'metaed-core';
import { formatAndPrependHeader, template } from './XsdGeneratorBase';

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: Array<GeneratedOutput> = [];

  const descriptors: Array<{name: string}> =
    orderByProp('name')(getEntitiesOfType(metaEd.entity, 'descriptor').map(x => ({ name: x.data.edfiXsd.xsd_DescriptorName })));
  const formattedGeneratedResult = formatAndPrependHeader(template().schemaAnnotation({ descriptors }));
  results.push({
    name: 'Core XSD Schema Annotation',
    folderName: 'XSD',
    fileName: 'SchemaAnnotation.xsd',
    resultString: formattedGeneratedResult,
    resultStream: null,
  });

  return {
    generatorName: 'edfiXsd.SchemaAnnotationGenerator',
    generatedOutput: results,
  };
}
