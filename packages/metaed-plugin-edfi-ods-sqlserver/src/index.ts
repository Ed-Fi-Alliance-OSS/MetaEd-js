import type { MetaEdPlugin } from '@edfi/metaed-core';
import { generate as odsGenerator } from './generator/OdsGenerator';
import { generate as schemaGenerator } from './generator/SchemaGenerator';
import { generate as idIndexesGenerator } from './generator/IdIndexesGenerator';
import { generate as educationOrganizationAuthorizationIndexesGenerator } from './generator/EducationOrganizationAuthorizationIndexesGenerator';

import { enhance as templateSpecificTablePropertyEnhancer } from './enhancer/TemplateSpecificTablePropertyEnhancer';
import { enhance as templateSpecificTablePropertyEnhancerV6dot1 } from './enhancer/TemplateSpecificTablePropertyEnhancerV6dot1';
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
      templateSpecificTablePropertyEnhancerV6dot1,
      sqlServerForeignKeyNamingEnhancer,
      addSchemaContainerEnhancer,
    ],
    generator: [schemaGenerator, odsGenerator, idIndexesGenerator, educationOrganizationAuthorizationIndexesGenerator],
    shortName: 'edfiOdsSqlServer',
  };
}
