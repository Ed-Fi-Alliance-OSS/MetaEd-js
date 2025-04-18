// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import {
  EntityProperty,
  DecimalProperty,
  StringProperty,
  SimpleProperty,
  IntegerProperty,
  MetaEdPropertyPath,
  TopLevelEntity,
} from '@edfi/metaed-core';
import {
  initializeColumn,
  newColumn,
  StringColumn,
  DecimalColumn,
  ColumnNaming,
  newColumnNameComponent,
} from '../../model/database/Column';
import { BuildStrategy } from './BuildStrategy';
import { Column } from '../../model/database/Column';

const createDecimalColumn = (property: DecimalProperty): DecimalColumn => ({
  ...newColumn(),
  type: 'decimal',
  precision: property.totalDigits,
  scale: property.decimalPlaces,
});

const createStringColumn = (property: StringProperty): StringColumn => ({
  ...newColumn(),
  type: 'string',
  minLength: property.minLength || '0',
  maxLength: property.maxLength || '0',
});

function createNewColumnFor(property: SimpleProperty): Column {
  const createNewColumn: { [propertyType: string]: () => Column } = {
    boolean: () => ({
      ...newColumn(),
      type: 'boolean',
    }),
    currency: () => ({
      ...newColumn(),
      type: 'currency',
    }),
    date: () => ({
      ...newColumn(),
      type: 'date',
    }),
    datetime: () => ({
      ...newColumn(),
      type: 'datetime',
    }),
    decimal: () => createDecimalColumn(property as DecimalProperty),
    duration: () => ({
      ...newColumn(),
      type: 'duration',
    }),
    integer: () => ({
      ...newColumn(),
      type: (property as IntegerProperty).hasBigHint ? 'bigint' : 'integer',
    }),
    percent: () => ({
      ...newColumn(),
      type: 'percent',
    }),
    sharedDecimal: () => createDecimalColumn(property as DecimalProperty),
    sharedInteger: () => ({
      ...newColumn(),
      type: 'integer',
    }),
    sharedShort: () => ({
      ...newColumn(),
      type: 'short',
    }),
    sharedString: () => createStringColumn(property as StringProperty),
    short: () => ({
      ...newColumn(),
      type: 'short',
    }),
    string: () => createStringColumn(property as StringProperty),
    time: () => ({
      ...newColumn(),
      type: 'time',
    }),
    year: () => ({
      ...newColumn(),
      type: 'year',
    }),
  };

  return createNewColumn[property.type]();
}

export function simplePropertyColumnCreator(
  originalEntity: TopLevelEntity,
  property: EntityProperty,
  strategy: BuildStrategy,
  currentPropertyPath: MetaEdPropertyPath,
): Column[] {
  if (!strategy.buildColumns(property)) return [];

  const column: Column = {
    ...createNewColumnFor(property as SimpleProperty),
    referenceContext: property.data.edfiOdsRelational.odsName,
    mergedReferenceContexts: [property.data.edfiOdsRelational.odsName],
    propertyPath: currentPropertyPath,
    originalEntity,
  };
  const columnNamer: () => ColumnNaming = strategy.columnNamer(
    strategy.parentContext(),
    strategy.parentContextProperties(),
    property.data.edfiOdsRelational.odsContextPrefix,
    {
      ...newColumnNameComponent(),
      name: property.data.edfiOdsRelational.odsContextPrefix,
      isPropertyRoleName: true,
      sourceProperty: property,
    },
    property.metaEdName,
    {
      ...newColumnNameComponent(),
      name: property.metaEdName,
      isMetaEdName: true,
      sourceProperty: property,
    },
  );
  const suppressPrimaryKey: boolean = strategy.suppressPrimaryKeyCreation();

  return [initializeColumn(column, property, columnNamer, suppressPrimaryKey)];
}
