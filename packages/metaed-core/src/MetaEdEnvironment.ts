// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newPropertyIndex } from './model/property/PropertyRepository';
import { Namespace } from './model/Namespace';
import { PluginEnvironment } from './plugin/PluginEnvironment';
import { PropertyIndex } from './model/property/PropertyRepository';

/**
 *
 */
export type SemVer = string;

/**
 *
 */
export type SemVerRange = string;

/**
 * Provided to validators and enhancers
 */
export type MetaEdEnvironment = {
  // namespaces
  namespace: Map<string, Namespace>;

  // the property index, provided for convenience (a little hesitant here, as it should be dependent on entityRepository)
  propertyIndex: PropertyIndex;

  // plugin environment by plugin shortName
  plugin: Map<string, PluginEnvironment>;

  // the current MetaEd Version
  metaEdVersion: SemVer;

  // the data standard version to target
  dataStandardVersion: SemVer;

  // whether we are running in Alliance mode - which means assuming this is an Ed-Fi Alliance user
  allianceMode: boolean;

  // if set to true, the prerelease identifier is ignored in the version string.
  suppressPrereleaseVersion: boolean;

  // the earliest allowable school year enumeration
  minSchoolYear: number;

  // the latest allowable school year enumeration
  maxSchoolYear: number;
};

/**
 *
 */
export const newMetaEdEnvironment: () => MetaEdEnvironment = () => ({
  namespace: new Map(),
  propertyIndex: newPropertyIndex(),
  plugin: new Map(),
  metaEdVersion: '0.0.0',
  dataStandardVersion: '0.0.0',
  allianceMode: false,
  suppressPrereleaseVersion: true,
  minSchoolYear: 1900,
  maxSchoolYear: 2100,
});
