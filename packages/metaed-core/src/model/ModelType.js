// @flow

export type ModelType =
  | 'unknown'
  | 'association'
  | 'associationExtension'
  | 'associationSubclass'
  | 'choice'
  | 'common'
  | 'commonExtension'
  | 'decimalType'
  | 'descriptor'
  | 'domain'
  | 'domainItem'
  | 'domainEntity'
  | 'domainEntityExtension'
  | 'domainEntitySubclass'
  | 'enumeration'
  | 'enumerationItem'
  | 'integerType'
  | 'interchange'
  | 'interchangeExtension'
  | 'interchangeItem'
  | 'inlineCommon'
  | 'mapTypeEnumeration'
  | 'namespaceInfo'
  | 'schoolYearEnumeration'
  | 'sharedDecimal'
  | 'sharedInteger'
  | 'sharedShort'
  | 'sharedString'
  | 'stringType'
  | 'subdomain';

export const allEntityModelTypes: Array<ModelType> = [
  'unknown',
  'association',
  'associationExtension',
  'associationSubclass',
  'choice',
  'common',
  'commonExtension',
  'decimalType',
  'descriptor',
  'domain',
  'domainEntity',
  'domainEntityExtension',
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
];

export const allEntityModelTypesNoSimpleTypes: Array<ModelType> = [
  'unknown',
  'association',
  'associationExtension',
  'associationSubclass',
  'choice',
  'common',
  'commonExtension',
  'descriptor',
  'domain',
  'domainEntity',
  'domainEntityExtension',
  'domainEntitySubclass',
  'enumeration',
  'interchange',
  'interchangeExtension',
  'mapTypeEnumeration',
  'schoolYearEnumeration',
  'sharedDecimal',
  'sharedInteger',
  'sharedString',
  'subdomain',
];

export const allTopLevelEntityModelTypes: Array<ModelType> = [
  'unknown',
  'association',
  'associationExtension',
  'associationSubclass',
  'choice',
  'common',
  'commonExtension',
  'descriptor',
  'domainEntity',
  'domainEntityExtension',
  'domainEntitySubclass',
  'enumeration',
  'schoolYearEnumeration',
];

export const topLevelCoreEntityModelTypes: Array<ModelType> = [
  'association',
  'associationSubclass',
  'choice',
  'common',
  'descriptor',
  'domainEntity',
  'domainEntitySubclass',
  'enumeration',
  'mapTypeEnumeration',
  'schoolYearEnumeration',
];

export const asModelType = (x: string): ModelType => ((x: any): ModelType);
