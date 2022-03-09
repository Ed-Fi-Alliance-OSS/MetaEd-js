import { GeneratorResult, MetaEdEnvironment } from '@edfi/metaed-core';
import { generateCreateTrackedDeleteSchemas5dot3 } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { template, databaseSpecificFolderName } from './ChangeQueryGeneratorBase';
import { PLUGIN_NAME } from '../PluginHelper';

const generatorName = `${PLUGIN_NAME}.CreateTrackedDeleteSchemasGenerator`;

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results = generateCreateTrackedDeleteSchemas5dot3(metaEd, template, databaseSpecificFolderName);
  return {
    generatorName,
    generatedOutput: results,
  };
}
