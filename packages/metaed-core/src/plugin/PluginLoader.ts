import fs from 'final-fs';
import path from 'path';
import Topo from 'topo';
import semver from 'semver';
import winston from 'winston';
import { NoMetaEdPlugin } from './MetaEdPlugin';
import { PluginManifest } from './PluginManifest';
import { MetaEdPlugin } from './MetaEdPlugin';
import { SemVerRange } from '../MetaEdEnvironment';
import { PipelineFailure } from '../pipeline/PipelineFailure';

// Resolve roughly like Typescript does with "node" strategy  (https://www.typescriptlang.org/docs/handbook/module-resolution.html)
function mainModuleResolver(directory: string, packageJson: any): string {
  const pathFromMain = path.resolve(directory, packageJson.main);
  if (fs.existsSync(pathFromMain)) return pathFromMain;
  const pathFromMainTypescriptified = pathFromMain.replace(/\.js$/gim, '.ts');
  if (fs.existsSync(pathFromMainTypescriptified)) return pathFromMainTypescriptified;
  const pathForIndexJs = path.join(directory, 'index.js');
  if (fs.existsSync(pathForIndexJs)) return pathForIndexJs;
  const pathForIndexTs = path.join(directory, 'index.ts');
  if (fs.existsSync(pathForIndexTs)) return pathForIndexTs;
  return '';
}

function loadPluginManifest(directory: string): PluginManifest | null {
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
    npmName: packageJson.name,
    description: packageJson.description,
    version: packageJson.version,
    mainModule: mainModuleResolver(directory, packageJson),
    shortName: packageMetadata.shortName || 'none',
    authorName: packageMetadata.authorName || 'none',
    metaEdVersion: (semver.validRange(packageMetadata.metaEdVersion) || '0.0.0') as SemVerRange,
    technologyVersion: (semver.validRange(packageMetadata.technologyVersion) || '0.0.0') as SemVerRange,
    dependencies: packageMetadata.dependencies || [],
    metaEdPlugin: NoMetaEdPlugin,
    // eslint-disable-next-line no-unneeded-ternary
    enabled: packageMetadata.enabled === false ? false : true, // must be false, not just falsy
  };
}

/**
 * Scans the immediate subdirectories for plugins, and return manifests in dependency order. Requires absolute path.
 */
export function scanDirectories(directories: string | string[]): {
  manifests: PluginManifest[];
  pipelineFailures: PipelineFailure[];
} {
  const pipelineFailures: PipelineFailure[] = [];

  // eslint-disable-next-line no-param-reassign
  if (!Array.isArray(directories)) directories = [directories];

  // if this looks like a development environment, add those directories
  if (path.resolve(__dirname, '../../../..').match(`\${path.sep}metaed-plugin[^\${path.sep}]*$`)) {
    directories.push(path.resolve(__dirname, '../../../../..'));
  }

  const pluginOrdering: Topo = new Topo();

  directories.forEach((directory) => {
    let subdirectories: string[] | null = null;

    try {
      subdirectories = fs.readdirSync(directory).filter((file) => fs.statSync(path.join(directory, file)).isDirectory());
    } catch (err) {
      // ignore invalid directories
      return;
    }
    if (!subdirectories) return;

    subdirectories.forEach((subdirectory) => {
      if (!subdirectory.startsWith('metaed-plugin-')) return;
      const directoryToTry: string = path.join(directory, subdirectory);
      const manifest: PluginManifest | null = loadPluginManifest(directoryToTry);
      if (manifest) {
        try {
          pluginOrdering.add(manifest, {
            group: manifest.npmName,
            after: manifest.dependencies,
          });
        } catch (err) {
          const message = `Attempted load of npm package ${manifest.npmName} plugin '${manifest.description}' failed due to dependency issue.`;
          winston.error(`${message}`);
          pipelineFailures.push({ category: 'error', message });
        }
      }
    });
  });

  return { manifests: pluginOrdering.nodes, pipelineFailures };
}

export function materializePlugin(pluginManifest: PluginManifest): PipelineFailure[] {
  const pipelineFailures: PipelineFailure[] = [];

  try {
    if (!pluginManifest.mainModule) {
      const message = `Attempted load of npm package ${pluginManifest.npmName} plugin '${pluginManifest.description}' at '${pluginManifest.mainModule}' failed.  Module entry point not found.`;
      winston.error(`${message}`);
      pipelineFailures.push({ category: 'error', message });
      return pipelineFailures;
    }

    const pluginFactoryCandidate = require(pluginManifest.mainModule); // eslint-disable-line

    // Plugins must have an "initialize" method
    const pluginFactory: () => MetaEdPlugin = pluginFactoryCandidate.initialize;
    if (pluginFactory) {
      pluginManifest.metaEdPlugin = pluginFactory();
    } else {
      const message = `Attempted load of npm package ${pluginManifest.npmName} plugin '${pluginManifest.description}' at '${pluginManifest.mainModule}' failed. initialize() not found.`;
      winston.error(`${message}`);
      pipelineFailures.push({ category: 'error', message });
    }
  } catch (err) {
    const message = `Attempted load of npm package ${pluginManifest.npmName} plugin '${pluginManifest.description}' at '${pluginManifest.mainModule}' failed. Error message: ${err.message}`;
    winston.error(`${message}`);
    pipelineFailures.push({ category: 'error', message });
  }

  return pipelineFailures;
}
