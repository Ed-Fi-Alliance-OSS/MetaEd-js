import { GeneratedOutput, GeneratorResult, MetaEdEnvironment } from '@edfi/metaed-core';
import { performAddIndexChangeVersionForTableGeneration } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';
import { template, databaseSpecificFolderName } from './ChangeQueryGeneratorBase';

const generatorName = `${PLUGIN_NAME}.AddIndexChangeVersionForTableGenerator`;

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results: GeneratedOutput[] = performAddIndexChangeVersionForTableGeneration(
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
