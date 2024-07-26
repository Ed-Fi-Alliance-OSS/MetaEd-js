import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { indirectUpdateCascadeTriggerEnhancer } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { DATABASE_PLUGIN_NAME, PLUGIN_NAME } from '../PluginHelper';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  return indirectUpdateCascadeTriggerEnhancer(metaEd, DATABASE_PLUGIN_NAME, PLUGIN_NAME);
}
