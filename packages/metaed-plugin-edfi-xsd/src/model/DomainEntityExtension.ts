import { MetaEdEnvironment, EnhancerResult, DomainEntityExtension } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { metaEdNameWithExtensionIncludingSuffix } from './shared/AddMetaEdNameWithExtension';

export interface DomainEntityExtensionEdfiXsd {
  xsdMetaEdNameWithExtension: () => string;
}

const enhancerName = 'DomainEntityExtensionSetupEnhancer';

export function addDomainEntityExtensionEdfiXsdTo(domainEntityExtension: DomainEntityExtension) {
  if (domainEntityExtension.data.edfiXsd == null) domainEntityExtension.data.edfiXsd = {};

  Object.assign(domainEntityExtension.data.edfiXsd, {
    xsdMetaEdNameWithExtension: metaEdNameWithExtensionIncludingSuffix(domainEntityExtension),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'domainEntityExtension') as DomainEntityExtension[]).forEach(
    (domainEntityExtension: DomainEntityExtension) => {
      addDomainEntityExtensionEdfiXsdTo(domainEntityExtension);
    },
  );

  return {
    enhancerName,
    success: true,
  };
}
