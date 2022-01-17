import { MetaEdPlugin } from '@edfi/metaed-core';

import { enhance as EdFiMappingEDURepositorySetupEnhancer } from './model/EdFiMappingEduRepository';
import { enhance as XsdElementGroupEnhancer } from './enhancer/XsdElementGroupEnhancer';
import { enhance as ElementGroupDefinitionEnhancer } from './enhancer/ElementGroupDefinitionEnhancer';
import { enhance as EntityDefinitionEnhancer } from './enhancer/EntityDefinitionEnhancer';
import { enhance as ElementDefinitionEnhancer } from './enhancer/ElementDefinitionEnhancer';
import { enhance as EnumerationDefinitionEnhancer } from './enhancer/EnumerationDefinitionEnhancer';
import { enhance as EnumerationItemDefinitionEnhancer } from './enhancer/EnumerationItemDefinitionEnhancer';
import { generate as MappingEduGenerator } from './generator/MappingEduGenerator';

export const initialize = (): MetaEdPlugin => ({
  validator: [],
  enhancer: [
    EdFiMappingEDURepositorySetupEnhancer,
    XsdElementGroupEnhancer,
    ElementGroupDefinitionEnhancer,
    EntityDefinitionEnhancer,
    ElementDefinitionEnhancer,
    EnumerationDefinitionEnhancer,
    EnumerationItemDefinitionEnhancer,
  ],
  generator: [MappingEduGenerator],
  configurationSchemas: new Map(),
});
