// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { indirectUpdateCascadeTriggerEnhancer } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { DATABASE_PLUGIN_NAME, PLUGIN_NAME } from '../PluginHelper';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  return indirectUpdateCascadeTriggerEnhancer(metaEd, DATABASE_PLUGIN_NAME, PLUGIN_NAME);
}
