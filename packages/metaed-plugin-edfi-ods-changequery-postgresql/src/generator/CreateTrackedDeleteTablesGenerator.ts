import { GeneratorResult, MetaEdEnvironment } from '@edfi/metaed-core';
import { performCreateTrackedDeleteTablesGeneration } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { template, databaseSpecificFolderName } from './ChangeQueryGeneratorBase';
import { PLUGIN_NAME } from '../PluginHelper';

const generatorName = `${PLUGIN_NAME}.CreateTrackedDeleteTablesGenerator`;

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results = performCreateTrackedDeleteTablesGeneration(metaEd, PLUGIN_NAME, template, databaseSpecificFolderName);
  return {
    generatorName,
    generatedOutput: results,
  };
}
