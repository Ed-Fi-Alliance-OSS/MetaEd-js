import { GeneratorResult, MetaEdEnvironment } from '@edfi/metaed-core';
import { performCreateDeletedForTrackingTriggerGeneration } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { template, databaseSpecificFolderName } from './ChangeQueryGeneratorBase';
import { PLUGIN_NAME } from '../PluginHelper';

const generatorName = `${PLUGIN_NAME}.CreateDeletedForTrackingTriggersGenerator`;

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results = performCreateDeletedForTrackingTriggerGeneration(
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
