// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import path from 'path';
import { State } from '../State';
import { Logger } from '../Logger';

export function initializeMetaEdEnvironment(state: State): State {
  // set alliance mode given from configuration
  state.metaEd.allianceMode = state.metaEdConfiguration.allianceMode;
  // set suppress prerelease version identifier.
  state.metaEd.suppressPrereleaseVersion = state.metaEdConfiguration.suppressPrereleaseVersion;
  // set MetaEd version pulled from package.json
  const metaEdCorePackageJson = require(path.resolve(__dirname, '../../package.json')); // eslint-disable-line
  if (metaEdCorePackageJson.version != null) state.metaEd.metaEdVersion = metaEdCorePackageJson.version;

  Logger.info(`  Running MetaEd version ${state.metaEd.metaEdVersion}`);
  return state;
}
