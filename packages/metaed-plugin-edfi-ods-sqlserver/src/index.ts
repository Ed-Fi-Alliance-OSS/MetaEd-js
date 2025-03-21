// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { MetaEdPlugin } from '@edfi/metaed-core';
import { generate as odsGenerator } from './generator/OdsGenerator';
import { generate as schemaGenerator } from './generator/SchemaGenerator';
import { generate as idIndexesGenerator } from './generator/IdIndexesGenerator';
import { generate as createEducationOrganizationAuthorizationIndexesGenerator } from './generator/CreateEducationOrganizationAuthorizationIndexesGenerator';
import { generate as updateEducationOrganizationAuthorizationIndexesGenerator } from './generator/UpdateEducationOrganizationAuthorizationIndexesGenerator';
import { generate as aggregateIdColumnGenerator } from './generator/AggregateIdColumnGenerator';

import { enhance as templateSpecificTablePropertyEnhancer } from './enhancer/TemplateSpecificTablePropertyEnhancer';
import { enhance as templateSpecificTablePropertyEnhancerV6x } from './enhancer/TemplateSpecificTablePropertyEnhancerV6x';
import { enhance as sqlServerTableNamingEnhancer } from './enhancer/SqlServerTableNamingEnhancer';
import { enhance as sqlServerColumnNamingEnhancer } from './enhancer/SqlServerColumnNamingEnhancer';
import { enhance as sqlServerForeignKeyNamingEnhancer } from './enhancer/SqlServerForeignKeyNamingEnhancer';
import { enhance as addSchemaContainerEnhancer } from './enhancer/AddSchemaContainerEnhancer';
import { enhance as sqlServerTableSetupEnhancer } from './model/Table';
import { enhance as namespaceSetupEnhancer } from './model/Namespace';

export { ColumnDataTypes } from './model/ColumnDataTypes';
export { enhance as sqlServerTableSetupEnhancer } from './model/Table';
export { enhance as sqlServerTableNamingEnhancer } from './enhancer/SqlServerTableNamingEnhancer';
export { enhance as sqlServerColumnNamingEnhancer, constructColumnNameFrom } from './enhancer/SqlServerColumnNamingEnhancer';
export { enhance as sqlServerForeignKeyNamingEnhancer } from './enhancer/SqlServerForeignKeyNamingEnhancer';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [
      namespaceSetupEnhancer,
      sqlServerTableSetupEnhancer,
      sqlServerTableNamingEnhancer,
      sqlServerColumnNamingEnhancer,
      templateSpecificTablePropertyEnhancer,
      templateSpecificTablePropertyEnhancerV6x,
      sqlServerForeignKeyNamingEnhancer,
      addSchemaContainerEnhancer,
    ],
    generator: [
      schemaGenerator,
      odsGenerator,
      idIndexesGenerator,
      createEducationOrganizationAuthorizationIndexesGenerator,
      aggregateIdColumnGenerator,
      updateEducationOrganizationAuthorizationIndexesGenerator,
    ],
    shortName: 'edfiOdsSqlServer',
  };
}
