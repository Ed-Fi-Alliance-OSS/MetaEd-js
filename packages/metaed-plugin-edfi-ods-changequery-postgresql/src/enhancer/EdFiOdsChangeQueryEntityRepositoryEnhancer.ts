import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { addEdFiOdsChangeQueryEntityRepositoryTo } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';

const enhancerName = 'EdFiOdsChangeQueryEntityRepositorySetupEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);

  return {
    enhancerName,
    success: true,
  };
}
