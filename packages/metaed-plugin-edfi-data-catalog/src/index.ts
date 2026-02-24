// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdPlugin } from '@edfi/metaed-core';
import { enhance as dataCatalogEnhancer } from './enhancer/DataCatalogEnhancer';
import { generate as dataStandardListingGenerator } from './generator/EdFiDataStandardListingGenerator';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [dataCatalogEnhancer],
    generator: [dataStandardListingGenerator],
    shortName: 'edfiDataCatalog',
    configurationSchemas: new Map(),
  };
}
