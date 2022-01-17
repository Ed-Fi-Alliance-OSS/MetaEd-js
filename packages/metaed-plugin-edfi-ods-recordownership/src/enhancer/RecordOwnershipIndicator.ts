import { MetaEdEnvironment, PluginEnvironment } from '@edfi/metaed-core';
import { versionSatisfies } from '@edfi/metaed-core';

export function recordOwnershipIndicated(metaEd: MetaEdEnvironment): boolean {
  const edfiOdsPlugin: PluginEnvironment | undefined = metaEd.plugin.get('edfiOdsRecordOwnership');
  if (edfiOdsPlugin == null) return false;

  return versionSatisfies(edfiOdsPlugin.targetTechnologyVersion, '>=3.3.0');
}
