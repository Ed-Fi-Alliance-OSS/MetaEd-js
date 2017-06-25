// @flow
import fs from 'final-fs';
import path from 'path';
import winston from 'winston';
import type { PluginManifest, MetaEdCore, PluginData, MetaEdPlugin } from './PluginTypes';
import { NoMetaEdPlugin } from './PluginTypes';

export type PluginOptions = {
  pluginType: string,
}

function loadPluginManifest(directory: string, options: PluginOptions): ?PluginManifest {
  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(path.join(directory, 'package.json')));
  } catch (err) {
    return null;
  }
  if (!packageJson['metaed-plugin'] || !packageJson['metaed-plugin'][options.pluginType]) return null;

  const packageMetadata = packageJson['metaed-plugin'][options.pluginType];

  return {
    npmName: packageJson.name,
    version: packageJson.version,
    mainModule: path.resolve(directory, packageMetadata.mainModule) || 'none',
    pluginName: packageMetadata.pluginName || 'none',
    displayName: packageMetadata.displayName || 'none',
    author: packageMetadata.author || 'none',
    metaEdVersion: packageMetadata.metaEdVersion || 'none',
    dependencies: packageMetadata.dependencies || [],
    plugin: NoMetaEdPlugin,
    enabled: true,
  };
}

// Scans the immediate subdirectories for plugins. Requires absolute path.
export function scanDirectories(directories: string | Array<string>, options: PluginOptions): Array<PluginManifest> {
  // eslint-disable-next-line no-param-reassign
  if (!Array.isArray(directories)) directories = [directories];

  const result = [];
  directories.forEach(directory => {
    try {
      const subdirectories = fs.readdirSync(directory).filter(file => fs.lstatSync(path.join(directory, file)).isDirectory());
      subdirectories.forEach(subdirectory => {
        const directoryToTry = path.join(directory, subdirectory);
        const manifest = loadPluginManifest(directoryToTry, options);
        if (manifest) result.push(manifest);
      });
    } catch (err) {
      // ignore invalid directories
    }
  });
  return result;
}

export function materializePlugin(pluginData: PluginData, metaEdCore: MetaEdCore, plugManifest: PluginManifest) {
  try {
    /* eslint-disable */
    // $FlowIgnore - No one likes a dynamic require
    const pluginFactoryCandidate = require(plugManifest.mainModule);
    /* eslint-enable */
    const pluginFactory: (PluginData, MetaEdCore) => MetaEdPlugin = pluginFactoryCandidate.default ? pluginFactoryCandidate.default : pluginFactoryCandidate;
    plugManifest.plugin = pluginFactory(pluginData, metaEdCore);
  } catch (err) {
    winston.error(`PluginLoader: Attempted load of plugin '${plugManifest.pluginName}' at '${plugManifest.mainModule}' failed.`);
    winston.error(`PluginLoader: Error Message: ${err.message}`);
    plugManifest.plugin = NoMetaEdPlugin;
  }
}
