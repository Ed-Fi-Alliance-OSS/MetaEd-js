// @flow
import R from 'ramda';
import type { MetaEdEnvironment, EnhancerResult, EntityProperty } from '../../../../metaed-core/index';
import { getAllProperties, getAllTopLevelEntities } from '../../../../metaed-core/index';

export type EntityPropertyEdfiXsd = {
  xsd_Name: string,
  xsd_Type: string,
  xsd_IsDescriptor: boolean,
  xsd_IsChoice: boolean,
}

// Enhancer for object setup
const enhancerName: string = 'EntityPropertySetupEnhancer';

export function addEntityPropertyEdfiXsdTo(property: EntityProperty) {
  if (property.data.edfiXsd == null) property.data.edfiXsd = {};

  Object.assign(property.data.edfiXsd, {
    xsd_Name: '',
    xsd_Type: '',
    xsd_IsDescriptor: false,
    xsd_IsChoice: false,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  [...getAllProperties(metaEd.propertyIndex), ...R.chain(x => x.queryableFields, getAllTopLevelEntities(metaEd.entity))]
  .forEach((property: EntityProperty) => {
    addEntityPropertyEdfiXsdTo(property);
  });

  return {
    enhancerName,
    success: true,
  };
}
