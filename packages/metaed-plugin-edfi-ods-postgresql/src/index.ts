import type { MetaEdPlugin } from '@edfi/metaed-core';
import { generate as odsGenerator } from './generator/OdsGenerator';
import { generate as schemaGenerator } from './generator/SchemaGenerator';
import { generate as idIndexesGenerator } from './generator/IdIndexesGenerator';
import { generate as createEducationOrganizationAuthorizationIndexesGenerator } from './generator/CreateEducationOrganizationAuthorizationIndexesGenerator';
import { generate as updateEducationOrganizationAuthorizationIndexesGenerator } from './generator/UpdateEducationOrganizationAuthorizationIndexesGenerator';
import { generate as aggregateIdColumnGenerator } from './generator/AggregateIdColumnGenerator';

import { enhance as templateSpecificTablePropertyEnhancer } from './enhancer/TemplateSpecificTablePropertyEnhancer';
import { enhance as templateSpecificTablePropertyEnhancerV6x } from './enhancer/TemplateSpecificTablePropertyEnhancerV6x';
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
      templateSpecificTablePropertyEnhancerV6x,
      postgreSqlForeignKeyNamingEnhancer,
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
    shortName: 'edfiOdsPostgresql',
  };
}
