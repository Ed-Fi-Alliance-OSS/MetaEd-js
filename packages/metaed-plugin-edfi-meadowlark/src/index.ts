import { MetaEdPlugin, newMetaEdPlugin } from '@edfi/metaed-core';
import { enhancerList } from './enhancer/EnhancerList';

export { enhance as entityPropertyMeadowlarkDataSetupEnhancer } from './model/EntityPropertyMeadowlarkData';
export { enhance as entityMeadowlarkDataSetupEnhancer } from './model/EntityMeadowlarkData';
export { enhance as referenceComponentEnhancer } from './enhancer/ReferenceComponentEnhancer';
export { enhance as apiPropertyMappingEnhancer } from './enhancer/ApiPropertyMappingEnhancer';
export { enhance as propertyCollectingEnhancer } from './enhancer/PropertyCollectingEnhancer';
export { enhance as apiEntityMappingEnhancer } from './enhancer/ApiEntityMappingEnhancer';
export { enhance as subclassPropertyNamingCollisionEnhancer } from './enhancer/SubclassPropertyNamingCollisionEnhancer';
export { enhance as subclassPropertyCollectingEnhancer } from './enhancer/SubclassPropertyCollectingEnhancer';
export { enhance as subclassApiEntityMappingEnhancer } from './enhancer/SubclassApiEntityMappingEnhancer';

export type { CollectedProperty } from './model/CollectedProperty';
export type { EntityMeadowlarkData } from './model/EntityMeadowlarkData';
export type { EntityPropertyMeadowlarkData } from './model/EntityPropertyMeadowlarkData';
export { prefixedName } from './model/PropertyModifier';
export { isReferenceElement } from './model/ReferenceComponent';
export type { ReferenceComponent, ReferenceGroup } from './model/ReferenceComponent';
export { topLevelApiNameOnEntity, pluralize, uncapitalize } from './Utility';
export type { ApiPropertyMapping } from './model/ApiPropertyMapping';

export function initialize(): MetaEdPlugin {
  return {
    ...newMetaEdPlugin(),
    enhancer: enhancerList(),
  };
}
