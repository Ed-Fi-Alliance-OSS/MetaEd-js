import { SemVer } from '../MetaEdEnvironment';
import { Namespace } from '../model/Namespace';

/**
 *
 */
export interface PluginEnvironment {
  shortName: string;

  // the plugin-specific namespace partition to the plugin's entity repository
  namespace: Map<Namespace, any>;

  // the plugin's target technology version
  targetTechnologyVersion: SemVer;

  // plugin-wide configuration data
  config: any;

  // plugin-wide additional data
  data?: any;
}

/**
 *
 */
export const newPluginEnvironment: () => PluginEnvironment = () => ({
  shortName: '',
  namespace: new Map(),
  targetTechnologyVersion: '0.0.0',
  config: {},
  data: {},
});
