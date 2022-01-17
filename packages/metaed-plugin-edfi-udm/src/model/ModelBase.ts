import { MetaEdEnvironment, EnhancerResult, ModelBase } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { String as sugar } from 'sugar';

export interface ModelBaseEdfiUdm {
  humanizedName: string;
}

const enhancerName = 'DomainSetupEnhancer';

export function addModelBaseEdfiUdmTo(modelBase: ModelBase) {
  if (modelBase.data.edfiUdm == null) modelBase.data.edfiUdm = {};

  Object.assign(modelBase.data.edfiUdm, {
    humanizedName: modelBase.metaEdName ? sugar.titleize(modelBase.metaEdName) : '',
    markdownTableEscapedDocumentation: modelBase.documentation.replace(/\r\n?|\n/g, '<br/>'),
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
    'subdomain',
  ).forEach((entity) => {
    addModelBaseEdfiUdmTo(entity);
  });

  return {
    enhancerName,
    success: true,
  };
}
