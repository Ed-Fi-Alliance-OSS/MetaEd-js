// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdPlugin } from '@edfi/metaed-core';
import { generate as apiCatalogGenerator } from './generator/ApiCatalogGenerator';

/**
 * Initializes the Ed-Fi API Catalog plugin
 * This plugin generates an Excel spreadsheet catalog of API resources and their properties
 */
export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [],
    generator: [apiCatalogGenerator],
    shortName: 'edfiApiCatalog',
    configurationSchemas: new Map(),
  };
}
