import { Enhancer } from '@edfi/metaed-core';
import { enhance as entityPropertyApiSchemaDataSetupEnhancer } from '../model/EntityPropertyApiSchemaData';
import { enhance as entityApiSchemaDataSetupEnhancer } from '../model/EntityApiSchemaData';
import { enhance as subclassPropertyNamingCollisionEnhancer } from './SubclassPropertyNamingCollisionEnhancer';
import { enhance as referenceComponentEnhancer } from './ReferenceComponentEnhancer';
import { enhance as apiPropertyMappingEnhancer } from './ApiPropertyMappingEnhancer';
import { enhance as apiEntityMappingEnhancer } from './ApiEntityMappingEnhancer';
import { enhance as subclassApiEntityMappingEnhancer } from './SubclassApiEntityMappingEnhancer';
import { enhance as propertyCollectingEnhancer } from './PropertyCollectingEnhancer';
import { enhance as subclassPropertyCollectingEnhancer } from './SubclassPropertyCollectingEnhancer';
import { enhance as jsonSchemaEnhancerForInsert } from './JsonSchemaEnhancerForInsert';
import { enhance as jsonSchemaEnhancerForUpdate } from './JsonSchemaEnhancerForUpdate';
import { enhance as jsonPathsMappingEnhancer } from './JsonPathsMappingEnhancer';
import { enhance as equalityConstraintEnhancer } from './EqualityConstraintEnhancer';

export function enhancerList(): Enhancer[] {
  return [
    entityPropertyApiSchemaDataSetupEnhancer,
    entityApiSchemaDataSetupEnhancer,
    subclassPropertyNamingCollisionEnhancer,
    referenceComponentEnhancer,
    apiPropertyMappingEnhancer,
    propertyCollectingEnhancer,
    subclassPropertyCollectingEnhancer,
    apiEntityMappingEnhancer,
    subclassApiEntityMappingEnhancer,
    jsonSchemaEnhancerForInsert,
    jsonSchemaEnhancerForUpdate,
    jsonPathsMappingEnhancer,
    equalityConstraintEnhancer,
  ];
}
