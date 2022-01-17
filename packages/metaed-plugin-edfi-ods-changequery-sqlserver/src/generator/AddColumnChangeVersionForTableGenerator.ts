import { GeneratorResult, MetaEdEnvironment, GeneratedOutput } from '@edfi/metaed-core';
import { performColumnChangeVersionForTableGeneration } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';
import { template, databaseSpecificFolderName } from './ChangeQueryGeneratorBase';

const generatorName = `${PLUGIN_NAME}.AddColumnChangeVersionForTableGenerator`;

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = performColumnChangeVersionForTableGeneration(
    metaEd,
    PLUGIN_NAME,
    template,
    databaseSpecificFolderName,
  );

  return {
    generatorName,
    generatedOutput: results,
  };
}
