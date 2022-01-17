import { MetaEdEnvironment, EnhancerResult, EntityProperty, ChoiceProperty } from '@edfi/metaed-core';
import { EntityPropertyEdfiXsd } from './EntityProperty';

export type ChoicePropertyEdfiXsd = EntityPropertyEdfiXsd & {
  xsdProperties: EntityProperty[];
  xsdIsChoice: boolean;
};

// Enhancer for object setup
const enhancerName = 'ChoicePropertySetupEnhancer';

export function addChoicePropertyEdfiXsdTo(property: ChoiceProperty) {
  if (property.data.edfiXsd == null) property.data.edfiXsd = {};

  Object.assign(property.data.edfiXsd, {
    xsdProperties: [],
    xsdIsChoice: true,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.choice.forEach((property: ChoiceProperty) => {
    addChoicePropertyEdfiXsdTo(property);
  });

  return {
    enhancerName,
    success: true,
  };
}
