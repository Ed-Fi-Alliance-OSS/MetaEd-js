import { MetaEdProject } from './project/ProjectTypes';
import { SemVer } from './MetaEdEnvironment';

/**
 * The default plugin technology version, which is typically the lowest supported technology version of the ODS/API.
 */
export const defaultPluginTechVersion: SemVer = '5.1.0';

/**
 *
 */
export type PluginTargetTechnologyVersion = {
  targetTechnologyVersion: SemVer;
};

/**
 *
 */
export type MetaEdConfiguration = {
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
  suppressPrereleaseVersion: boolean;
};

/**
 *
 */
export const newPluginTargetTechnologyVersion: () => PluginTargetTechnologyVersion = () => ({
  targetTechnologyVersion: defaultPluginTechVersion,
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
  defaultPluginTechVersion,
  allianceMode: false,
  suppressPrereleaseVersion: true,
});
