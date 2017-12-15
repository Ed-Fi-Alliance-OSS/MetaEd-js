// @flow
import type { MetaEdEnvironment, EnhancerResult, AssociationExtension } from 'metaed-core';

export type AssociationExtensionEdfiOds = {
  ods_ExtensionName: string;
};

const enhancerName: string = 'OdsAssociationExtensionSetupEnhancer';

export function addAssociationExtensionEdfiOdsTo(associationExtension: AssociationExtension) {
  if (associationExtension.data.edfiOds == null) associationExtension.data.edfiOds = {};

  Object.assign(associationExtension.data.edfiOds, {
    ods_ExtensionName: associationExtension.metaEdName + associationExtension.namespaceInfo.extensionEntitySuffix,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.entity.associationExtension.forEach((associationExtension: AssociationExtension) => {
    addAssociationExtensionEdfiOdsTo(associationExtension);
  });

  return {
    enhancerName,
    success: true,
  };
}
