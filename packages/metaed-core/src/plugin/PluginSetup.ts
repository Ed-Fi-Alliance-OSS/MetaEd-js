// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { State } from '../State';
import { MetaEdPlugin } from './MetaEdPlugin';
import { newPluginEnvironment } from './PluginEnvironment';
import { Logger } from '../Logger';

export function setupPlugins(state: State): void {
  state.metaEdPlugins.forEach((metaEdPlugin: MetaEdPlugin) => {
    const targetTechnologyVersion = state.metaEdConfiguration.defaultPluginTechVersion;
    Logger.info(`- ${metaEdPlugin.shortName}, tech version ${targetTechnologyVersion}`);

    state.metaEd.plugin.set(metaEdPlugin.shortName, {
      ...newPluginEnvironment(),
      shortName: metaEdPlugin.shortName,
      targetTechnologyVersion,
    });
  });
}
