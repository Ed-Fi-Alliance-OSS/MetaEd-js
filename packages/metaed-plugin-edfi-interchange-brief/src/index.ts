import { MetaEdPlugin } from '@edfi/metaed-core';
/*
import { enhance as interchangeItemSetupEnhancer } from './model/InterchangeItem';
import { enhance as mergedInterchangeSetupEnhancer } from './model/MergedInterchange';
import { enhance as mergedInterchangeDescriptorDependenciesEnhancer } from './enhancer/MergedInterchangeDescriptorDependenciesEnhancer';
import { enhance as mergedInterchangeDocumentationEnhancer } from './enhancer/MergedInterchangeDocumentationEnhancer';
import { enhance as mergedInterchangeEntitiesEnhancer } from './enhancer/MergedInterchangeEntitiesEnhancer';
import { enhance as mergedInterchangeExtendedReferencesEnhancer } from './enhancer/MergedInterchangeExtendedReferencesEnhancer';
import { generate as interchangeBriefSvgGenerator } from './generator/InterchangeBriefSvgGenerator';
import { generate as interchangeBriefAsMarkdownGenerator } from './generator/InterchangeBriefAsMarkdownGenerator';

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [
      interchangeItemSetupEnhancer,
      mergedInterchangeSetupEnhancer,
      mergedInterchangeDescriptorDependenciesEnhancer,
      mergedInterchangeDocumentationEnhancer,
      mergedInterchangeEntitiesEnhancer,
      mergedInterchangeExtendedReferencesEnhancer,
    ],
    generator: [interchangeBriefSvgGenerator, interchangeBriefAsMarkdownGenerator],
  };
}
*/

export function initialize(): MetaEdPlugin {
  return {
    validator: [],
    enhancer: [],
    generator: [],
    configurationSchemas: new Map(),
  };
}
