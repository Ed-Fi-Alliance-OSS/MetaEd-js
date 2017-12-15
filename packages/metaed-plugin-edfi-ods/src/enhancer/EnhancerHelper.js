// @flow
import type { MetaEdEnvironment, PluginEnvironment } from 'metaed-core';

export function pluginEnvironment(metaEd: MetaEdEnvironment): PluginEnvironment {
  return ((metaEd.plugin.get('edfiOds'): any): PluginEnvironment);
}
