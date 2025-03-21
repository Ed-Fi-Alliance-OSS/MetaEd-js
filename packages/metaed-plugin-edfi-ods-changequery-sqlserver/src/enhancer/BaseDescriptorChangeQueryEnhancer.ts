// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, Namespace } from '@edfi/metaed-core';
import { Table } from '@edfi/metaed-plugin-edfi-ods-relational';
import { tableEntities } from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  applyCreateDeleteTrackingTableEnhancement,
  applyCreateDeleteTrackingTriggerEnhancements,
} from '@edfi/metaed-plugin-edfi-ods-changequery';
import { createDeleteTrackingTableModel } from './DeleteTrackingTableCreator';
import { createDeleteTrackingTriggerModel } from './DeleteTrackingTriggerCreator';
import { TARGET_DATABASE_PLUGIN_NAME } from './EnhancerHelper';
import { PLUGIN_NAME } from '../PluginHelper';

const enhancerName = 'BaseDescriptorChangeQueryEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  const edfiNamespace: Namespace | undefined = metaEd.namespace.get('EdFi');
  if (edfiNamespace == null) return { enhancerName, success: false };

  const baseDescriptorTable: Table | undefined = tableEntities(metaEd, edfiNamespace).get('Descriptor');
  if (baseDescriptorTable == null) return { enhancerName, success: false };

  applyCreateDeleteTrackingTableEnhancement(
    metaEd,
    edfiNamespace,
    PLUGIN_NAME,
    baseDescriptorTable,
    createDeleteTrackingTableModel,
  );
  applyCreateDeleteTrackingTriggerEnhancements(
    metaEd,
    edfiNamespace,
    PLUGIN_NAME,
    baseDescriptorTable,
    createDeleteTrackingTriggerModel,
    TARGET_DATABASE_PLUGIN_NAME,
  );
  return {
    enhancerName,
    success: true,
  };
}
