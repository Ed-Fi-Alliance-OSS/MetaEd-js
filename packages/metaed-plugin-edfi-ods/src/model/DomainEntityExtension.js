// @flow
import type { MetaEdEnvironment, EnhancerResult, DomainEntityExtension } from 'metaed-core';

export type DomainEntityExtensionEdfiOds = {
  ods_ExtensionName: string;
};

const enhancerName: string = 'OdsDomainEntityExtensionSetupEnhancer';

export function addDomainEntityExtensionEdfiOdsTo(domainEntityExtension: DomainEntityExtension) {
  if (domainEntityExtension.data.edfiOds == null) domainEntityExtension.data.edfiOds = {};

  Object.assign(domainEntityExtension.data.edfiOds, {
    ods_ExtensionName: domainEntityExtension.metaEdName + domainEntityExtension.namespaceInfo.extensionEntitySuffix,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.entity.domainEntityExtension.forEach((domainEntityExtension: DomainEntityExtension) => {
    addDomainEntityExtensionEdfiOdsTo(domainEntityExtension);
  });

  return {
    enhancerName,
    success: true,
  };
}
