import { PropertyType, EntityProperty, StringProperty, DecimalProperty } from 'metaed-core';

export const umlDatatypeMatrix: { [type in PropertyType]: string } = {
  unknown: '',
  association: 'Reference',
  boolean: 'Boolean',
  choice: 'Reference',
  common: 'Reference',
  currency: 'Number',
  date: 'Date',
  datetime: 'DateTime',
  decimal: 'Number',
  descriptor: 'Reference',
  domainEntity: 'Reference',
  duration: 'Number',
  enumeration: 'Reference',
  inlineCommon: 'Reference',
  integer: 'Number',
  percent: 'Number',
  schoolYearEnumeration: 'Reference',
  sharedDecimal: 'Number',
  sharedInteger: 'Number',
  sharedShort: 'Number',
  sharedString: 'String',
  short: 'Number',
  string: 'String',
  time: 'Time',
  year: 'Number',
};

export const jsonDatatypeMatrix: { [type in PropertyType]: string } = {
  unknown: '',
  association: 'object',
  boolean: 'boolean',
  choice: 'object',
  common: 'object',
  currency: 'number',
  date: 'number',
  datetime: 'number',
  decimal: 'number',
  descriptor: 'object',
  domainEntity: 'object',
  duration: 'number',
  enumeration: 'object',
  inlineCommon: 'object',
  integer: 'number',
  percent: 'number',
  schoolYearEnumeration: 'object',
  sharedDecimal: 'number',
  sharedInteger: 'number',
  sharedShort: 'number',
  sharedString: 'string',
  short: 'number',
  string: 'string',
  time: 'number',
  year: 'number',
};

const sqlDatatypes: { [type in PropertyType]: any } = {
  unknown: '',
  association: '',
  boolean: 'BOOLEAN',
  choice: '',
  common: '',
  currency: 'MONEY',
  date: 'DATE',
  datetime: 'TIMESTAMP',
  decimal: (precision, scale) => `DECIMAL(${precision}, ${scale})`,
  descriptor: '',
  domainEntity: '',
  duration: 'VARCHAR(30)',
  enumeration: '',
  inlineCommon: '',
  integer: 'INT',
  percent: 'DECIMAL(5, 4)',
  schoolYearEnumeration: '',
  sharedDecimal: (precision, scale) => `DECIMAL(${precision}, ${scale})`,
  sharedInteger: 'INT',
  sharedShort: 'SMALLINT',
  sharedString: (length) => `VARCHAR(${length})`,
  short: 'SMALLINT',
  string: (length) => `VARCHAR(${length})`,
  time: 'TIME',
  year: 'SMALLINT',
};

export function getSqlDatatype(property: EntityProperty): string {
  switch (property.type) {
    case 'decimal':
    case 'sharedDecimal':
      return sqlDatatypes.decimal((property as DecimalProperty).totalDigits, (property as DecimalProperty).decimalPlaces);
    case 'string':
    case 'sharedString':
      return sqlDatatypes.string((property as StringProperty).maxLength);
    default:
      return sqlDatatypes[property.type];
  }
}

export function getMetaEdDatatype(property: EntityProperty): string {
  const titleName: string = property.type[0].toUpperCase() + property.type.substring(1);
  return `${titleName}Property`;
}
