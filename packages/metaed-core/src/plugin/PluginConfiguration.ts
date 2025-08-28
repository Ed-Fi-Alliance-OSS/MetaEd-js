import { ConfigurationStructure } from './ConfigurationSchema';

/**
 *
 */
export interface PluginConfiguration {
  filepath: string;
  configObject: ConfigurationStructure;
}
