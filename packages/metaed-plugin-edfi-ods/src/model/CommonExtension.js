// @flow
import type { MetaEdEnvironment, EnhancerResult, CommonExtension } from 'metaed-core';

export type CommonExtensionEdfiOds = {
  ods_ExtensionName: string;
};

const enhancerName: string = 'OdsCommonExtensionSetupEnhancer';

export function addCommonExtensionEdfiOdsTo(commonExtension: CommonExtension) {
  if (commonExtension.data.edfiOds == null) commonExtension.data.edfiOds = {};

  Object.assign(commonExtension.data.edfiOds, {
    ods_ExtensionName: commonExtension.metaEdName + commonExtension.namespaceInfo.extensionEntitySuffix,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.entity.commonExtension.forEach((commonExtension: CommonExtension) => {
    addCommonExtensionEdfiOdsTo(commonExtension);
  });

  return {
    enhancerName,
    success: true,
  };
}
