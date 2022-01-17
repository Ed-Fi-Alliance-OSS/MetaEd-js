import { newMetaEdConfiguration } from '@edfi/metaed-core';
import { MetaEdConfiguration } from '@edfi/metaed-core';

export function metaEdConfigurationFor(defaultPluginTechVersion: string, allianceMode: boolean): MetaEdConfiguration {
  return {
    ...newMetaEdConfiguration(),
    defaultPluginTechVersion,
    allianceMode,
  };
}
