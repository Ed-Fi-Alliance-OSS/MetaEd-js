import { MetaEdEnvironment, EnhancerResult, AssociationExtension } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { TopLevelEntityEdfiXsd } from '../../model/TopLevelEntity';
import {
  typeGroupAssociation,
  createDefaultComplexType,
  createCoreRestrictionForExtensionParent,
  restrictionName,
} from './AddComplexTypesBaseEnhancer';

const enhancerName = 'AddAssociationExtensionComplexTypesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'associationExtension') as AssociationExtension[]).forEach(
    (associationExtension: AssociationExtension) => {
      if (associationExtension.data.edfiXsd.xsdHasExtensionOverrideProperties()) {
        const associationExtensionEdfiXsd: TopLevelEntityEdfiXsd = associationExtension.data.edfiXsd;
        associationExtensionEdfiXsd.xsdComplexTypes = [createCoreRestrictionForExtensionParent(associationExtension)];
        associationExtensionEdfiXsd.xsdComplexTypes.push(
          ...createDefaultComplexType(associationExtension, typeGroupAssociation, restrictionName(associationExtension)),
        );
      } else {
        if (associationExtension.baseEntity == null) return;

        associationExtension.data.edfiXsd.xsdComplexTypes = createDefaultComplexType(
          associationExtension,
          typeGroupAssociation,
          associationExtension.baseEntity.data.edfiXsd.xsdMetaEdNameWithExtension(),
        );
      }
    },
  );

  return {
    enhancerName,
    success: true,
  };
}
