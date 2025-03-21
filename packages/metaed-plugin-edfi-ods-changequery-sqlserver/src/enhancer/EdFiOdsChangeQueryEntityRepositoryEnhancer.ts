// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { addEdFiOdsChangeQueryEntityRepositoryTo } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { PLUGIN_NAME } from '../PluginHelper';

const enhancerName = 'EdFiOdsChangeQueryEntityRepositorySetupEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  addEdFiOdsChangeQueryEntityRepositoryTo(metaEd, PLUGIN_NAME);

  return {
    enhancerName,
    success: true,
  };
}
