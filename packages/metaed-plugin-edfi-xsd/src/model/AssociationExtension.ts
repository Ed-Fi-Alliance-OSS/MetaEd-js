import { MetaEdEnvironment, EnhancerResult, AssociationExtension } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { metaEdNameWithExtensionIncludingSuffix } from './shared/AddMetaEdNameWithExtension';

export interface AssociationExtensionEdfiXsd {
  xsdMetaEdNameWithExtension: () => string;
}

const enhancerName = 'AssociationExtensionSetupEnhancer';

export function addAssociationExtensionEdfiXsdTo(associationExtension: AssociationExtension) {
  if (associationExtension.data.edfiXsd == null) associationExtension.data.edfiXsd = {};

  Object.assign(associationExtension.data.edfiXsd, {
    xsdMetaEdNameWithExtension: metaEdNameWithExtensionIncludingSuffix(associationExtension),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'associationExtension') as AssociationExtension[]).forEach(
    (associationExtension: AssociationExtension) => {
      addAssociationExtensionEdfiXsdTo(associationExtension);
    },
  );

  return {
    enhancerName,
    success: true,
  };
}
