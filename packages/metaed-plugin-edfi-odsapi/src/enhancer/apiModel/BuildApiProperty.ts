import { Column, DecimalColumn, StringColumn } from '@edfi/metaed-plugin-edfi-ods-relational';
import { DecimalProperty, IntegerProperty, ShortProperty, versionSatisfies } from '@edfi/metaed-core';
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

function minValueFrom(column: Column): number | undefined {
  if (column.type !== 'integer' && column.type !== 'short' && column.type !== 'decimal') return undefined;
  if (column.sourceEntityProperties.length === 0) return undefined;
  const { minValue } = column.sourceEntityProperties[0] as IntegerProperty | ShortProperty | DecimalProperty;
  if (minValue == null || minValue === '') return undefined;
  return Number.parseInt(minValue, 10);
}

function maxValueFrom(column: Column): number | undefined {
  if (column.type !== 'integer' && column.type !== 'short' && column.type !== 'decimal') return undefined;
  if (column.sourceEntityProperties.length === 0) return undefined;
  const { maxValue } = column.sourceEntityProperties[0] as IntegerProperty | ShortProperty | DecimalProperty;
  if (maxValue == null || maxValue === '') return undefined;
  return Number.parseInt(maxValue, 10);
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

function apiPropertyTypefromNumeric(column: Column): ApiPropertyType {
  const minValue: number | undefined = minValueFrom(column);
  const maxValue: number | undefined = maxValueFrom(column);

  const result: ApiPropertyType = {
    dbType: dbTypeFrom(column),
    maxLength: maxLengthFrom(column),
    precision: precisionFrom(column),
    scale: scaleFrom(column),
    isNullable: column.isNullable,
  };

  if (minValue != null) result.minValue = minValue;
  if (maxValue != null) result.maxValue = maxValue;

  return result;
}

function apiPropertyTypeFrom(column: Column, targetTechnologyVersion: string): ApiPropertyType {
  // METAED-1299
  if (versionSatisfies(targetTechnologyVersion, '>=7.0') && (column.type === 'integer' || column.type === 'short')) {
    return apiPropertyTypefromNumeric(column);
  }

  // METAED-1330
  if (versionSatisfies(targetTechnologyVersion, '>=5.1') && column.type === 'decimal') {
    return apiPropertyTypefromNumeric(column);
  }

  return {
    dbType: dbTypeFrom(column),
    maxLength: maxLengthFrom(column),
    precision: precisionFrom(column),
    scale: scaleFrom(column),
    isNullable: column.isNullable,
  };
}

// locally defined "properties" are the columns on a table minus the columns there to provide a FK reference
export function buildApiProperty(column: Column, targetTechnologyVersion: string): ApiProperty {
  return {
    propertyName: column.data.edfiOdsSqlServer.columnName,
    propertyType: apiPropertyTypeFrom(column, targetTechnologyVersion),
    description: column.description,
    isIdentifying: column.isPartOfPrimaryKey,
    isServerAssigned: column.isIdentityDatabaseType,
    isDeprecated: column.isDeprecated ? true : undefined,
    deprecationReasons: column.deprecationReasons.length > 0 ? column.deprecationReasons : undefined,
  };
}
