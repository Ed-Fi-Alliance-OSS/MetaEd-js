import { GeneratorResult, MetaEdEnvironment } from '@edfi/metaed-core';
import { performCreateTriggerUpdateChangeVersionGeneration } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { template, databaseSpecificFolderName } from './ChangeQueryGeneratorBase';
import { PLUGIN_NAME } from '../PluginHelper';

const generatorName = `${PLUGIN_NAME}.CreateTriggerUpdateChangeVersionGenerator`;

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results = performCreateTriggerUpdateChangeVersionGeneration(
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
