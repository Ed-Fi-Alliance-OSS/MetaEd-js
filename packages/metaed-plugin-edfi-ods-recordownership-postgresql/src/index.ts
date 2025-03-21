// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { MetaEdPlugin } from '@edfi/metaed-core';
import { generate as addCreatedByOwnershipColumnForTableGenerator } from './generator/AddCreatedByOwnershipColumnForTableGenerator';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [],
    generator: [addCreatedByOwnershipColumnForTableGenerator],
    shortName: 'edfiOdsRecordOwnershipPostgresql',
  };
}
