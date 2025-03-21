// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
