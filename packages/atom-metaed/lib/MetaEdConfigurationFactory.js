/** @babel */
// @flow
import { newMetaEdConfiguration } from 'metaed-core';
import type { MetaEdConfiguration } from 'metaed-core';

export function metaEdConfigurationFor(targetTechnologyVersion: string): MetaEdConfiguration {
  return {
    ...newMetaEdConfiguration(),
    pluginConfig: {
      edfiUnified: {
        targetTechnologyVersion,
      },
      edfiOds: {
        targetTechnologyVersion,
      },
      edfiOdsApi: {
        targetTechnologyVersion,
      },
      edfiXsd: {
        targetTechnologyVersion,
      },
      edfiHandbook: {
        targetTechnologyVersion,
      },
      edfiInterchangeBrief: {
        targetTechnologyVersion,
      },
      edfiXmlDictionary: {
        targetTechnologyVersion,
      },
    },
  };
}
