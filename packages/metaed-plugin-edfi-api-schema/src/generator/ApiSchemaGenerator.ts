import { MetaEdEnvironment, GeneratorResult, GeneratedOutput, PluginEnvironment } from '@edfi/metaed-core';
import stringify from 'json-stable-stringify';

import { PluginEnvironmentEdfiApiSchema } from '../model/PluginEnvironment';

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const { apiSchema } = (metaEd.plugin.get('edfiApiSchema') as PluginEnvironment).data as PluginEnvironmentEdfiApiSchema;

  const generatedOutput: GeneratedOutput[] = [
    {
      name: 'Meadowlark API Schema',
      namespace: 'ApiSchema',
      folderName: 'ApiSchema',
      fileName: 'ApiSchema.json',
      resultString: stringify(apiSchema, { space: 2 }),
      resultStream: null,
    },
  ];

  return {
    generatorName: 'edfiApiSchema.ApiSchemaGenerator',
    generatedOutput,
  };
}
