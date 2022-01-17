import { MetaEdEnvironment, EnhancerResult, Association } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import {
  typeGroupAssociation,
  baseTypeTopLevelEntity,
  createDefaultComplexType,
  createIdentityType,
  createReferenceType,
} from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddAssociationComplexTypesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'association') as Association[]).forEach((association: Association) => {
    association.data.edfiXsd.xsdComplexTypes = createDefaultComplexType(
      association,
      typeGroupAssociation,
      baseTypeTopLevelEntity,
    );
    association.data.edfiXsd.xsdIdentityType = createIdentityType(association);
    association.data.edfiXsd.xsdReferenceType = createReferenceType(association);
  });

  return {
    enhancerName,
    success: true,
  };
}
