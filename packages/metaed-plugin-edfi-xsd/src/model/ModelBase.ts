import { MetaEdEnvironment, EnhancerResult, ModelBase } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { metaEdNameWithExtension } from './shared/AddMetaEdNameWithExtension';

export interface ModelBaseEdfiXsd {
  xsdMetaEdNameWithExtension: () => string;
}

const enhancerName = 'ModelBaseSetupEnhancer';

export function addModelBaseEdfiXsdTo(modelBase: ModelBase) {
  if (modelBase.data.edfiXsd == null) modelBase.data.edfiXsd = {};

  Object.assign(modelBase.data.edfiXsd, {
    xsdMetaEdNameWithExtension: metaEdNameWithExtension(modelBase),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllEntitiesOfType(
    metaEd,
    'association',
    'associationSubclass',
    'choice',
    'common',
    'commonSubclass',
    'decimalType',
    'domain',
    'domainEntity',
    'domainEntitySubclass',
    'enumeration',
    'integerType',
    'interchange',
    'interchangeExtension',
    'mapTypeEnumeration',
    'schoolYearEnumeration',
    'sharedDecimal',
    'sharedInteger',
    'sharedString',
    'stringType',
  ).forEach((entity) => {
    addModelBaseEdfiXsdTo(entity);
  });

  return {
    enhancerName,
    success: true,
  };
}
