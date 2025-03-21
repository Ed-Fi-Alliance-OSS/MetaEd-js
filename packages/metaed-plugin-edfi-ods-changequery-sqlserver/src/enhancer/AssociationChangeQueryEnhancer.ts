// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult } from '@edfi/metaed-core';
import { performAssociationChangeQueryEnhancement } from '@edfi/metaed-plugin-edfi-ods-changequery';
import { TARGET_DATABASE_PLUGIN_NAME } from './EnhancerHelper';
import { createDeleteTrackingTableModel } from './DeleteTrackingTableCreator';
import { createDeleteTrackingTriggerModel } from './DeleteTrackingTriggerCreator';
import { PLUGIN_NAME } from '../PluginHelper';

const enhancerName = 'AssociationChangeQueryEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  performAssociationChangeQueryEnhancement(
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
