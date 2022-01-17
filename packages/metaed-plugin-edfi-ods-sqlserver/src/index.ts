import { MetaEdPlugin } from '@edfi/metaed-core';
import { generate as OdsGenerator } from './generator/OdsGenerator';
import { generate as SchemaGenerator } from './generator/SchemaGenerator';
import { generate as IdIndexesGenerator } from './generator/IdIndexesGenerator';

import { enhance as templateSpecificTablePropertyEnhancerV2 } from './enhancer/TemplateSpecificTablePropertyEnhancerV2';
import { enhance as templateSpecificTablePropertyEnhancer } from './enhancer/TemplateSpecificTablePropertyEnhancer';
import { enhance as sqlServerTableNamingEnhancer } from './enhancer/SqlServerTableNamingEnhancer';
import { enhance as sqlServerColumnNamingEnhancer } from './enhancer/SqlServerColumnNamingEnhancer';
import { enhance as sqlServerForeignKeyNamingEnhancer } from './enhancer/SqlServerForeignKeyNamingEnhancer';
import { enhance as modifyColumnDateTimeDiminisher } from './diminisher/ModifyColumnDateTimeDiminisher';
import { enhance as addSchemaContainerEnhancer } from './enhancer/AddSchemaContainerEnhancer';
import { enhance as sqlServerTableSetupEnhancer } from './model/Table';
import { enhance as namespaceSetupEnhancer } from './model/Namespace';

export { ColumnDataTypes } from './model/ColumnDataTypes';
export { enhance as sqlServerTableSetupEnhancer } from './model/Table';
export { enhance as sqlServerTableNamingEnhancer } from './enhancer/SqlServerTableNamingEnhancer';
export { enhance as sqlServerColumnNamingEnhancer } from './enhancer/SqlServerColumnNamingEnhancer';
export { enhance as sqlServerForeignKeyNamingEnhancer } from './enhancer/SqlServerForeignKeyNamingEnhancer';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [
      namespaceSetupEnhancer,
      sqlServerTableSetupEnhancer,
      sqlServerTableNamingEnhancer,
      sqlServerColumnNamingEnhancer,
      modifyColumnDateTimeDiminisher,
      templateSpecificTablePropertyEnhancerV2,
      templateSpecificTablePropertyEnhancer,
      sqlServerForeignKeyNamingEnhancer,
      addSchemaContainerEnhancer,
    ],
    generator: [SchemaGenerator, OdsGenerator, IdIndexesGenerator],
    configurationSchemas: new Map(),
  };
}
