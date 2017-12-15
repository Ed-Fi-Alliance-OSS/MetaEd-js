// @flow
import R from 'ramda';
import winston from 'winston';
import { EntityProperty } from 'metaed-core';
import { ColumnDataTypes } from './ColumnDataTypes';
import type { ColumnType } from './ColumnType';
import type { ColumnNamer } from './ColumnNamer';

winston.cli();

export type Column = {
  name: string;
  type: ColumnType;
  dataType: string;
  referenceContext: string;
  description: string;
  sqlEscapedDescription: string;
  originalContextPrefix: string;
  isNullable: boolean;
  isPartOfPrimaryKey: boolean;
  isPartOfAlternateKey: boolean;
  isUniqueIndex: boolean;
  isIdentityDatabaseType: boolean;
  sourceEntityProperties: Array<EntityProperty>;
  mergedReferenceContexts: Array<string>;
}

export type DecimalColumn = {
  ...$Exact<Column>;
  precision: string;
  scale: string;
}

export type StringColumn = {
  ...$Exact<Column>;
  length: string;
}

export function newColumn(): Column {
  return {
    name: '',
    type: 'unknown',
    dataType: '',
    referenceContext: '',
    description: '',
    sqlEscapedDescription: '',
    originalContextPrefix: '',
    isNullable: false,
    isPartOfPrimaryKey: false,
    isPartOfAlternateKey: false,
    isUniqueIndex: false,
    isIdentityDatabaseType: false,
    sourceEntityProperties: [],
    mergedReferenceContexts: [],
  };
}

export const NoColumn: Column = Object.assign(newColumn(), {
  name: 'NoColumn',
});

export function initializeColumn(
  column: Column,
  property: EntityProperty,
  columnNamer: ColumnNamer,
  suppressPrimaryKey: boolean,
): Column {
  Object.assign(column, {
    name: columnNamer(),
    description: property.documentation,
    isIdentityDatabaseType: property.data.edfiOds.ods_IsIdentityDatabaseType,
    isNullable: property.isOptional,
    isPartOfPrimaryKey: suppressPrimaryKey ? false : property.isPartOfIdentity,
    isUniqueIndex: property.data.edfiOds.ods_IsUniqueIndex,
    originalContextPrefix: property.data.edfiOds.ods_ContextPrefix,
  });
  column.sourceEntityProperties.push(property);
  return column;
}

export function cloneColumn(column: Column): Column {
  // shallow clone for now because R.clone is about 50x slower
  return R.merge({}, column);
}

export function columnConstraintMerge(existing: Column, received: Column): Column {
  const clone = cloneColumn(existing);
  clone.mergedReferenceContexts = R.union(clone.mergedReferenceContexts, received.mergedReferenceContexts);
  clone.sourceEntityProperties = R.union(clone.sourceEntityProperties, received.sourceEntityProperties);

  // ensure alternate key if set by either
  if (received.isPartOfAlternateKey) clone.isPartOfAlternateKey = true;

  // ensure unique index key if set by either
  if (received.isUniqueIndex) clone.isUniqueIndex = true;

  // ensure primary key if set by either
  if (clone.isPartOfPrimaryKey) return clone;
  if (received.isPartOfPrimaryKey) {
    clone.isPartOfPrimaryKey = true;
    clone.isNullable = false;
    return clone;
  }

  // ensure not nullable if set by either
  if (!clone.isNullable) return clone;
  if (!received.isNullable) {
    clone.isNullable = false;
    return clone;
  }

  return clone;
}

export function addSourceEntityProperty(column: Column, property: EntityProperty): void {
  const existingProperty = column.sourceEntityProperties.find(x => x.metaEdName === property.metaEdName && x.type === property.type);
  if (existingProperty == null) {
    column.sourceEntityProperties.push(property);
  } else {
    winston.warn(`Attempt to add duplicate source entity property: ${property.metaEdName} (${property.typeHumanizedName})  to column ${column.name} failed.`);
  }
}

export function addMergedReferenceContext(column: Column, referenceContext: string): void {
  const existingProperty = column.mergedReferenceContexts.find(x => x === referenceContext);
  if (existingProperty == null) {
    column.mergedReferenceContexts.push(referenceContext);
  } else {
    // winston.warn(`Attempt to add duplicate merged reference context: ${referenceContext} to column ${column.name} failed.`);
  }
}

export function newBooleanColumn(): Column {
  return Object.assign({}, newColumn(), {
    type: 'boolean',
    dataType: ColumnDataTypes.boolean,
  });
}

export function newCurrencyColumn(): Column {
  return Object.assign({}, newColumn(), {
    type: 'currency',
    dataType: ColumnDataTypes.currency,
  });
}

export function newDateColumn(): Column {
  return Object.assign({}, newColumn(), {
    type: 'date',
    dataType: ColumnDataTypes.date,
  });
}

export function newDecimalColumn(precision: string, scale: string): DecimalColumn {
  return Object.assign({}, newColumn(), {
    type: 'decimal',
    dataType: ColumnDataTypes.decimal(precision, scale),
    precision,
    scale,
  });
}

export function newDurationColumn(): Column {
  return Object.assign({}, newColumn(), {
    type: 'duration',
    dataType: ColumnDataTypes.duration,
  });
}

export function newIntegerColumn(): Column {
  return Object.assign({}, newColumn(), {
    type: 'integer',
    dataType: ColumnDataTypes.integer,
  });
}

export function newPercentColumn(): Column {
  return Object.assign({}, newColumn(), {
    type: 'percent',
    dataType: ColumnDataTypes.percent,
  });
}

export function newShortColumn(): Column {
  return Object.assign({}, newColumn(), {
    type: 'short',
    dataType: ColumnDataTypes.short,
  });
}

export function newStringColumn(length: string): StringColumn {
  return Object.assign({}, newColumn(), {
    type: 'string',
    dataType: ColumnDataTypes.string(length),
    length,
  });
}

export function newTimeColumn(): Column {
  return Object.assign({}, newColumn(), {
    type: 'time',
    dataType: ColumnDataTypes.time,
  });
}

export function newYearColumn(): Column {
  return Object.assign({}, newColumn(), {
    type: 'year',
    dataType: ColumnDataTypes.year,
  });
}
