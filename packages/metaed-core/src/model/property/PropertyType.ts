import { EntityProperty } from './EntityProperty';

/**
 *
 */
export type PropertyType =
  | 'unknown'
  | 'association'
  | 'boolean'
  | 'choice'
  | 'common'
  | 'currency'
  | 'date'
  | 'datetime'
  | 'decimal'
  | 'descriptor'
  | 'domainEntity'
  | 'duration'
  | 'enumeration'
  | 'inlineCommon'
  | 'integer'
  | 'percent'
  | 'schoolYearEnumeration'
  | 'sharedDecimal'
  | 'sharedInteger'
  | 'sharedShort'
  | 'sharedString'
  | 'short'
  | 'string'
  | 'time'
  | 'year';

/**
 *
 */
const sharedProperty: PropertyType[] = ['sharedDecimal', 'sharedInteger', 'sharedShort', 'sharedString'];
/**
 *
 */
export const isSharedProperty = (property: EntityProperty): boolean => sharedProperty.includes(property.type);

/**
 *
 */
const referentialProperty: PropertyType[] = [
  'association',
  'choice',
  'common',
  'descriptor',
  'domainEntity',
  'enumeration',
  'inlineCommon',
  'schoolYearEnumeration',
];
/**
 *
 */
export const isReferentialProperty = (property: EntityProperty): boolean => referentialProperty.includes(property.type);

/**
 *
 */
export const allPropertyTypes: PropertyType[] = [
  'association',
  'boolean',
  'choice',
  'common',
  'currency',
  'date',
  'datetime',
  'decimal',
  'descriptor',
  'domainEntity',
  'duration',
  'enumeration',
  'inlineCommon',
  'integer',
  'percent',
  'schoolYearEnumeration',
  'sharedDecimal',
  'sharedInteger',
  'sharedShort',
  'sharedString',
  'short',
  'string',
  'time',
  'year',
];

export const scalarPropertyTypes: PropertyType[] = [
  'boolean',
  'currency',
  'date',
  'datetime',
  'decimal',
  'descriptor',
  'duration',
  'enumeration',
  'integer',
  'percent',
  'schoolYearEnumeration',
  'sharedDecimal',
  'sharedInteger',
  'sharedShort',
  'sharedString',
  'short',
  'string',
  'time',
  'year',
];
