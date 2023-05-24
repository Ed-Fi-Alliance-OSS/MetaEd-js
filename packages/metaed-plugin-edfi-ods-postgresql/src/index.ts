import type { MetaEdPlugin } from '@edfi/metaed-core';
import { generate as OdsGenerator } from './generator/OdsGenerator';
import { generate as SchemaGenerator } from './generator/SchemaGenerator';
import { generate as IdIndexesGenerator } from './generator/IdIndexesGenerator';

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
    generator: [SchemaGenerator, OdsGenerator, IdIndexesGenerator],
    shortName: 'edfiOdsPostgresql',
  };
}
