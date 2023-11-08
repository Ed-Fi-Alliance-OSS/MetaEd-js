import type { MetaEdPlugin } from '@edfi/metaed-core';
import { generate as odsGenerator } from './generator/OdsGenerator';
import { generate as schemaGenerator } from './generator/SchemaGenerator';
import { generate as idIndexesGenerator } from './generator/IdIndexesGenerator';
import { generate as educationOrganizationAuthorizationIndexesGenerator } from './generator/EducationOrganizationAuthorizationIndexesGenerator';

import { enhance as templateSpecificTablePropertyEnhancer } from './enhancer/TemplateSpecificTablePropertyEnhancer';
import { enhance as templateSpecificTablePropertyEnhancerV6dot1 } from './enhancer/TemplateSpecificTablePropertyEnhancerV6dot1';
import { enhance as postgreSqlTableNamingEnhancer } from './enhancer/PostgresqlTableNamingEnhancer';
import { enhance as postgreSqlColumnNamingEnhancer } from './enhancer/PostgresqlColumnNamingEnhancer';
import { enhance as postgreSqlForeignKeyNamingEnhancer } from './enhancer/PostgresqlForeignKeyNamingEnhancer';
import { enhance as addSchemaContainerEnhancer } from './enhancer/AddSchemaContainerEnhancer';
import { enhance as tableSetupEnhancer } from './model/Table';
import { enhance as namespaceSetupEnhancer } from './model/Namespace';

export { ColumnDataTypes } from './model/ColumnDataTypes';

export { enhance as postgreSqlTableSetupEnhancer } from './model/Table';
export { enhance as postgreSqlTableNamingEnhancer } from './enhancer/PostgresqlTableNamingEnhancer';
export {
  enhance as postgreSqlColumnNamingEnhancer,
  constructColumnNameFrom,
} from './enhancer/PostgresqlColumnNamingEnhancer';
export { enhance as postgreSqlForeignKeyNamingEnhancer } from './enhancer/PostgresqlForeignKeyNamingEnhancer';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [
      namespaceSetupEnhancer,
      tableSetupEnhancer,
      postgreSqlTableNamingEnhancer,
      postgreSqlColumnNamingEnhancer,
      templateSpecificTablePropertyEnhancer,
      templateSpecificTablePropertyEnhancerV6dot1,
      postgreSqlForeignKeyNamingEnhancer,
      addSchemaContainerEnhancer,
    ],
    generator: [schemaGenerator, odsGenerator, idIndexesGenerator, educationOrganizationAuthorizationIndexesGenerator],
    shortName: 'edfiOdsPostgresql',
  };
}
