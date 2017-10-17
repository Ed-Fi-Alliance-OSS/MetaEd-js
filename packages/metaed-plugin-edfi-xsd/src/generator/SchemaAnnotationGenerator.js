// @flow
import { formatAndPrependHeader, template } from './XsdGeneratorBase';
import { getEntitiesOfType } from '../../../metaed-core/index';
import { orderByName } from '../enhancer/schema/AddSchemaContainerEnhancer';
import type { MetaEdEnvironment, GeneratorResult, GeneratedOutput } from '../../../metaed-core/index';

export function generate(metaEd: MetaEdEnvironment): GeneratorResult {
  const results: Array<GeneratedOutput> = [];

  const descriptors: Array<{name: string}> =
    orderByName(getEntitiesOfType(metaEd.entity, 'descriptor').map(x => ({ name: x.data.edfiXsd.xsd_DescriptorName })));
  const formattedGeneratedResult = formatAndPrependHeader(template().schemaAnnotation({ descriptors }));
  results.push({
    name: 'Core XSD Schema Annotation',
    folderName: 'XSD',
    fileName: 'SchemaAnnotation.xsd',
    resultString: formattedGeneratedResult,
  });

  return {
    generatorName: 'SchemaAnnotationGenerator',
    generatedOutput: results,
  };
}
