import R from 'ramda';
import {
  MetaEdEnvironment,
  EnhancerResult,
  EntityProperty,
  getAllProperties,
  getAllTopLevelEntitiesForNamespaces,
} from 'metaed-core';

export interface EntityPropertyEdfiXsd {
  xsdName: string;
  xsdType: string;
  xsdIsDescriptor: boolean;
  xsdIsChoice: boolean;
}

// Enhancer for object setup
const enhancerName = 'EntityPropertySetupEnhancer';

export function addEntityPropertyEdfiXsdTo(property: EntityProperty) {
  if (property.data.edfiXsd == null) property.data.edfiXsd = {};

  Object.assign(property.data.edfiXsd, {
    xsdName: '',
    xsdType: '',
    xsdIsDescriptor: false,
    xsdIsChoice: false,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  [
    ...getAllProperties(metaEd.propertyIndex),
    ...R.chain((x) => x.queryableFields, getAllTopLevelEntitiesForNamespaces(Array.from(metaEd.namespace.values()))),
  ].forEach((property: EntityProperty) => {
    addEntityPropertyEdfiXsdTo(property);
  });

  return {
    enhancerName,
    success: true,
  };
}
