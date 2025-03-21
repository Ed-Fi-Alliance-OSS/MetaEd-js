// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { performEnumerationChangeQueryEnhancement } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { createDeleteTrackingTableModel } from './DeleteTrackingTableCreator';
import { createDeleteTrackingTriggerModel } from './DeleteTrackingTriggerCreator';
import { PLUGIN_NAME } from '../PluginHelper';
import { TARGET_DATABASE_PLUGIN_NAME } from './EnhancerHelper';

const enhancerName = 'EnumerationChangeQueryEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  performEnumerationChangeQueryEnhancement(
    metaEd,
    PLUGIN_NAME,
    TARGET_DATABASE_PLUGIN_NAME,
    createDeleteTrackingTableModel,
    createDeleteTrackingTriggerModel,
  );

  return {
    enhancerName,
    success: true,
  };
}
