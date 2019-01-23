import { MetaEdEnvironment, EnhancerResult, AssociationSubclass } from 'metaed-core';
import { getAllEntitiesOfType } from 'metaed-core';
import {
  typeGroupAssociation,
  createDefaultComplexType,
  createIdentityType,
  createReferenceType,
} from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddAssociationSubclassComplexTypesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'associationSubclass') as Array<AssociationSubclass>).forEach(
    (associationSubclass: AssociationSubclass) => {
      if (associationSubclass.baseEntity == null) return;

      associationSubclass.data.edfiXsd.xsdComplexTypes = createDefaultComplexType(
        associationSubclass,
        typeGroupAssociation,
        associationSubclass.baseEntity.data.edfiXsd.xsdMetaEdNameWithExtension(),
      );
      associationSubclass.data.edfiXsd.xsdIdentityType = createIdentityType(associationSubclass);
      associationSubclass.data.edfiXsd.xsdReferenceType = createReferenceType(associationSubclass);
    },
  );

  return {
    enhancerName,
    success: true,
  };
}
