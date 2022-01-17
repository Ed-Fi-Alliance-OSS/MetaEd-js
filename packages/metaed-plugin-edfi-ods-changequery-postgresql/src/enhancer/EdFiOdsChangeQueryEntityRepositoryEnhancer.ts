import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { addEdFiOdsChangeQueryEntityRepositoryTo } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';
import { versionSatisfiesForPostgresChangeQuerySupport } from './EnhancerHelper';

const enhancerName = 'EdFiOdsChangeQueryEntityRepositorySetupEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  if (versionSatisfiesForPostgresChangeQuerySupport(metaEd)) {
    addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);
  }
  return {
    enhancerName,
    success: true,
  };
}
