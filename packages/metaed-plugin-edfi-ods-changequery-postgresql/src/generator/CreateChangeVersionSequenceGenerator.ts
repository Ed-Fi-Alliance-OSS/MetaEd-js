import { GeneratorResult, MetaEdEnvironment } from '@edfi/metaed-core';
import { performCreateChangeVersionSequenceGeneration } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';
import { getTemplateFileContents, databaseSpecificFolderName } from './ChangeQueryGeneratorBase';

const generatorName = `${PLUGIN_NAME}.CreateChangeVersionSequenceGenerator`;

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const results = performCreateChangeVersionSequenceGeneration(
    metaEd,
    getTemplateFileContents('0020-CreateChangeVersionSequence.sql'),
    databaseSpecificFolderName,
  );
  return {
    generatorName,
    generatedOutput: results,
  };
}
