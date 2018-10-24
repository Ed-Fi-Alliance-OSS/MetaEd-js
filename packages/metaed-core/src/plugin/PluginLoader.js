// @flow
import fs from 'final-fs';
import path from 'path';
import Topo from 'topo';
import winston from 'winston';
import { NoMetaEdPlugin } from './MetaEdPlugin';
import type { PluginManifest } from './PluginManifest';
import type { MetaEdPlugin } from './MetaEdPlugin';

// Resolve roughly like require.resolve() does (https://nodejs.org/api/modules.html#modules_all_together)
function mainModuleResolver(directory: string, packageJson: any): string {
  const pathFromMain = path.resolve(directory, packageJson.main);
  if (fs.existsSync(pathFromMain)) return pathFromMain;
  const pathForIndexJs = path.join(directory, 'index.js');
  if (fs.existsSync(pathForIndexJs)) return pathForIndexJs;
  const pathForIndexJson = path.join(directory, 'index.json');
  if (fs.existsSync(pathForIndexJson)) return pathForIndexJs;
  const pathForIndexNode = path.join(directory, 'index.node');
  if (fs.existsSync(pathForIndexNode)) return pathForIndexNode;
  return '';
}

function loadPluginManifest(directory: string): ?PluginManifest {
  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(path.join(directory, 'package.json')));
  } catch (err) {
    // ignore errors on file loading
    return null;
  }

  if (!packageJson['metaed-plugin']) return null;
  const packageMetadata = packageJson['metaed-plugin'];

  return {
    pluginType: packageMetadata.pluginType,
    npmName: packageJson.name,
    description: packageJson.description,
    version: packageJson.version,
    mainModule: mainModuleResolver(directory, packageJson),
    shortName: packageMetadata.shortName || 'none',
    authorName: packageMetadata.authorName || 'none',
    metaEdVersion: packageMetadata.metaEdVersion || 'none',
    technologyVersion: packageMetadata.technologyVersion || 'none',
    dependencies: packageMetadata.dependencies || [],
    metaEdPlugin: NoMetaEdPlugin,
    enabled: true,
  };
}

// Scans the immediate subdirectories for plugins, and return manifests in dependency order. Requires absolute path.
export function scanDirectories(directories: string | Array<string>): Array<PluginManifest> {
  // eslint-disable-next-line no-param-reassign
  if (!Array.isArray(directories)) directories = [directories];

  // if this looks like a development environment, add those directories
  if (path.resolve(__dirname, '../../../..').match(/\/metaed-plugin[^/]*$/)) {
    directories.push(path.resolve(__dirname, '../../../../..'));
  }

  const pluginOrdering: Topo = new Topo();

  directories.forEach(directory => {
    let subdirectories: ?Array<string> = null;

    try {
      subdirectories = fs.readdirSync(directory).filter(file => fs.statSync(path.join(directory, file)).isDirectory());
    } catch (err) {
      // ignore invalid directories
      return;
    }
    if (!subdirectories) return;

    subdirectories.forEach(subdirectory => {
      if (!subdirectory.startsWith('metaed-plugin-')) return;
      const directoryToTry: string = path.join(directory, subdirectory);
      const manifest: ?PluginManifest = loadPluginManifest(directoryToTry);
      if (manifest) {
        try {
          pluginOrdering.add(manifest, {
            group: manifest.npmName,
            after: manifest.dependencies,
          });
        } catch (err) {
          winston.error(
            `PluginLoader: Attempted load of npm package ${manifest.npmName} plugin '${
              manifest.description
            }' failed due to dependency issue: ${err.message}`,
          );
        }
      }
    });
  });

  return pluginOrdering.nodes;
}

export function materializePlugin(pluginManifest: PluginManifest) {
  try {
    if (!pluginManifest.mainModule) {
      winston.error(
        `PluginLoader: Attempted load of npm package ${pluginManifest.npmName} plugin '${pluginManifest.description}' at '${
          pluginManifest.mainModule
        }' failed.  Module entry point not found.`,
      );
      return;
    }

    /* eslint-disable */
    // $FlowIgnore - No one likes a dynamic require
    const pluginFactoryCandidate = require(pluginManifest.mainModule);
    /* eslint-enable */

    // Plugins must have an "initialize" method
    const pluginFactory: any => MetaEdPlugin = pluginFactoryCandidate.initialize;
    if (pluginFactory) {
      pluginManifest.metaEdPlugin = pluginFactory();
    } else {
      winston.error(
        `PluginLoader: Attempted load of npm package ${pluginManifest.npmName} plugin '${pluginManifest.description}' at '${
          pluginManifest.mainModule
        }' failed. initialize() not found.`,
      );
    }
  } catch (err) {
    winston.error(
      `PluginLoader: Attempted load of npm package ${pluginManifest.npmName} plugin '${pluginManifest.description}' at '${
        pluginManifest.mainModule
      }' failed.`,
    );
    winston.error(`PluginLoader: Error Message: ${err.message}`);
  }
}
