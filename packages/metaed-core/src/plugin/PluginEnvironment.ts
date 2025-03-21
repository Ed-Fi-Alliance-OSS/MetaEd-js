// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

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
  data: {},
});
