import { Column, DecimalColumn, StringColumn } from '@edfi/metaed-plugin-edfi-ods-relational';
import { ApiProperty } from '../../model/apiModel/ApiProperty';
import { ApiPropertyType } from '../../model/apiModel/ApiPropertyType';
import { DbType } from '../../model/apiModel/DbType';

function dbTypeFrom(column: Column): DbType {
  if (column.type === 'boolean') return 'Boolean';
  if (column.type === 'currency') return 'Currency';
  if (column.type === 'date') return 'Date';
  if (column.type === 'datetime') return 'DateTime2';
  if (column.type === 'decimal') return 'Decimal';
  if (column.type === 'duration') return 'String';
  if (column.type === 'integer') return 'Int32';
  if (column.type === 'percent') return 'Decimal';
  if (column.type === 'short') return 'Int16';
  if (column.type === 'string') return 'String';
  if (column.type === 'time') return 'Time';
  if (column.type === 'year') return 'Int16';

  return 'Unknown';
}

function maxLengthFrom(column: Column): number {
  if (column.type === 'duration') return 30;
  if (column.type === 'string') return Number.parseInt((column as StringColumn).length, 10);
  return 0;
}

function precisionFrom(column: Column): number {
  if (column.type === 'currency') return 19;
  if (column.type === 'decimal') return Number.parseInt((column as DecimalColumn).precision, 10);
  if (column.type === 'percent') return 5;
  if (column.type === 'integer') return 10;
  if (column.type === 'short') return 5;
  if (column.type === 'year') return 5;
  return 0;
}

function scaleFrom(column: Column): number {
  if (column.type === 'currency') return 4;
  if (column.type === 'decimal') return Number.parseInt((column as DecimalColumn).scale, 10);
  if (column.type === 'percent') return 4;
  return 0;
}

function apiPropertyTypeFrom(column: Column): ApiPropertyType {
  return {
    dbType: dbTypeFrom(column),
    maxLength: maxLengthFrom(column),
    precision: precisionFrom(column),
    scale: scaleFrom(column),
    isNullable: column.isNullable,
  };
}

// locally defined "properties" are the columns on a table minus the columns there to provide a FK reference
export function buildApiProperty(column: Column): ApiProperty {
  return {
    propertyName: column.data.edfiOdsSqlServer.columnName,
    propertyType: apiPropertyTypeFrom(column),
    description: column.description,
    isIdentifying: column.isPartOfPrimaryKey,
    isServerAssigned: column.isIdentityDatabaseType,
    isDeprecated: column.isDeprecated ? true : undefined,
    deprecationReasons: column.deprecationReasons.length > 0 ? column.deprecationReasons : undefined,
  };
}
