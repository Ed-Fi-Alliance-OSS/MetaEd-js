import { MetaEdEnvironment, EnhancerResult, PluginEnvironment } from '@edfi/metaed-core';
import { ApiSchema, newApiSchema } from './api-schema/ApiSchema';

export type PluginEnvironmentEdfiApiSchema = {
  apiSchema: ApiSchema;
};

const enhancerName = 'PluginEnvironmentSetupEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const pluginEnvironment = metaEd.plugin.get('edfiApiSchema') as PluginEnvironment;
  if (pluginEnvironment.data == null) pluginEnvironment.data = {};

  Object.assign(pluginEnvironment.data, {
    apiSchema: newApiSchema(),
  });

  return {
    enhancerName,
    success: true,
  };
}
