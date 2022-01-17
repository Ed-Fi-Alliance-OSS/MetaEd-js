import { GeneratorResult, MetaEdEnvironment } from '@edfi/metaed-core';
import { performCreateTrackedDeleteSchemasGeneration } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { template, databaseSpecificFolderName } from './ChangeQueryGeneratorBase';
import { PLUGIN_NAME } from '../PluginHelper';

const generatorName = `${PLUGIN_NAME}.CreateTrackedDeleteSchemasGenerator`;

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results = performCreateTrackedDeleteSchemasGeneration(metaEd, template, databaseSpecificFolderName);
  return {
    generatorName,
    generatedOutput: results,
  };
}
