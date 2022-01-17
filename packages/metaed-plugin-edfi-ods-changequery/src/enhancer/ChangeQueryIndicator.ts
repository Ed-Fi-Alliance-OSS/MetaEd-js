import { MetaEdEnvironment, PluginEnvironment } from '@edfi/metaed-core';
import { versionSatisfies } from '@edfi/metaed-core';

export function changeQueryIndicated(metaEd: MetaEdEnvironment): boolean {
  const edfiOdsPlugin: PluginEnvironment | undefined = metaEd.plugin.get('edfiOdsRelational');
  if (edfiOdsPlugin == null) return false;

  return versionSatisfies(edfiOdsPlugin.targetTechnologyVersion, '>=3.1.0');
}
