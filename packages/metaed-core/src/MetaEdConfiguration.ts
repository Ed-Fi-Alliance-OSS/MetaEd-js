import { MetaEdProject } from './project/ProjectTypes';
import { SemVer } from './MetaEdEnvironment';

/**
 *
 */
export interface PluginTargetTechnologyVersion {
  targetTechnologyVersion: SemVer;
}

/**
 *
 */
export interface MetaEdConfiguration {
  artifactDirectory: string;
  deployDirectory: string;
  pluginTechVersion: {
    [shortName: string]: PluginTargetTechnologyVersion;
  };
  defaultPluginTechVersion: string;
  projects: MetaEdProject[];
  // projectPaths is meant to parallel projects
  projectPaths: string[];

  // pluginConfigDirectories is an override for the directories to look for plugin configuration files
  pluginConfigDirectories: string[];
  allianceMode: boolean;
}

/**
 *
 */
export const newPluginTargetTechnologyVersion: () => PluginTargetTechnologyVersion = () => ({
  targetTechnologyVersion: '0.0.0',
});

/**
 *
 */
export const newMetaEdConfiguration: () => MetaEdConfiguration = () => ({
  artifactDirectory: '',
  deployDirectory: '',
  pluginTechVersion: {},
  projects: [],
  projectPaths: [],
  pluginConfigDirectories: [],
  defaultPluginTechVersion: '3.0.0',
  allianceMode: false,
});
