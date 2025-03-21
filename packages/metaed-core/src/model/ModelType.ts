// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/**
 *
 */
export type ModelType =
  | 'unknown'
  | 'association'
  | 'associationExtension'
  | 'associationSubclass'
  | 'choice'
  | 'common'
  | 'commonExtension'
  | 'commonSubclass'
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
  | 'schoolYearEnumeration'
  | 'sharedDecimal'
  | 'sharedInteger'
  | 'sharedString'
  | 'stringType'
  | 'subdomain';

/**
 *
 */
export const allEntityModelTypes: ModelType[] = [
  'unknown',
  'association',
  'associationExtension',
  'associationSubclass',
  'choice',
  'common',
  'commonExtension',
  'commonSubclass',
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

/**
 *
 */
export const allEntityModelTypesNoSimpleTypes: ModelType[] = [
  'unknown',
  'association',
  'associationExtension',
  'associationSubclass',
  'choice',
  'common',
  'commonExtension',
  'commonSubclass',
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

/**
 *
 */
export const allTopLevelEntityModelTypes: ModelType[] = [
  'unknown',
  'association',
  'associationExtension',
  'associationSubclass',
  'choice',
  'common',
  'commonExtension',
  'commonSubclass',
  'descriptor',
  'domainEntity',
  'domainEntityExtension',
  'domainEntitySubclass',
  'enumeration',
  'schoolYearEnumeration',
];

/**
 *
 */
export const topLevelCoreEntityModelTypes: ModelType[] = [
  'association',
  'associationSubclass',
  'choice',
  'common',
  'commonSubclass',
  'descriptor',
  'domainEntity',
  'domainEntitySubclass',
  'enumeration',
  'mapTypeEnumeration',
  'schoolYearEnumeration',
];

/**
 *
 */
export const asModelType = (x: string): ModelType => x as ModelType;
