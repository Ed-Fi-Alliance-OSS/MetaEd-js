// @flow
import path from 'path';
import winston from 'winston';
import { scanDirectories, materializePlugin } from '../../plugin/PluginLoader';
import type { State } from '../State';
import type { MetaEdCore, PluginData, PluginManifest } from '../../plugin/PluginTypes';
import { NoMetaEdPlugin } from '../../plugin/PluginTypes';

const cachedPluginManifest: Array<PluginManifest> = [];

export function loadPlugins(state: State): State {
  if (cachedPluginManifest.length > 0) {
    state.pluginManifest = cachedPluginManifest;
    return state;
  }

  // default to local plugin loading if not specified
  if (!state.pluginScanDirectory) state.pluginScanDirectory = path.resolve(__dirname, '../../plugin');

  const pluginManifests = scanDirectories(state.pluginScanDirectory, { pluginType: 'artifact-specific' });

  const data: PluginData = { todo: 'any set up data that the plugin should receive' };
  const interfaceToMetaEdCore: MetaEdCore = { exampleIsModelObjectFactory: 'should be an interface with methods to create new model objects' };

  pluginManifests.forEach(pluginManifest => {
    materializePlugin(data, interfaceToMetaEdCore, pluginManifest);
    if (pluginManifest.plugin !== NoMetaEdPlugin) {
      winston.info(`LoadPlugins: Loaded plugin '${pluginManifest.pluginName}'`);
    } else {
      winston.info(`LoadPlugins: Could not load plugin '${pluginManifest.pluginName}'`);
    }

    cachedPluginManifest.push(pluginManifest);
  });

  state.pluginManifest = cachedPluginManifest;
  return state;
}
