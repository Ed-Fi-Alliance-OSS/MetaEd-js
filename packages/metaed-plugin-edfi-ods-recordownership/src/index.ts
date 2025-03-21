// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { MetaEdPlugin } from '@edfi/metaed-core';
import { enhance as recordOwnershipTableSetupEnhancer } from './model/Table';
import { enhance as addOwnershipTokenColumnTableEnhancer } from './enhancer/AddOwnershipTokenColumnTableEnhancer';

export { TableEdfiOdsRecordOwnership } from './model/Table';
export { recordOwnershipIndicated } from './enhancer/RecordOwnershipIndicator';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [recordOwnershipTableSetupEnhancer, addOwnershipTokenColumnTableEnhancer],
    generator: [],
    shortName: 'edfiOdsRecordOwnership',
  };
}
