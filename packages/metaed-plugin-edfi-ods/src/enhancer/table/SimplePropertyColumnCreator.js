// @flow
import R from 'ramda';
import type { EntityProperty, PropertyType, SimpleProperty } from 'metaed-core';
import {
  initializeColumn,
  newBooleanColumn,
  newCurrencyColumn,
  newDateColumn,
  newDecimalColumn,
  newDurationColumn,
  newIntegerColumn,
  newPercentColumn,
  newShortColumn,
  newStringColumn,
  newTimeColumn,
  newYearColumn,
} from '../../model/database/Column';
import type { BuildStrategy } from './BuildStrategy';
import type { Column } from '../../model/database/Column';
import type { ColumnCreator } from './ColumnCreator';
import type { ColumnNamer } from '../../model/database/ColumnNamer';

const createDecimalColumn = (property: SimpleProperty): Column => newDecimalColumn(...R.props(['totalDigits', 'decimalPlaces'])(property));
const createStringColumn = (property: SimpleProperty): Column => newStringColumn(R.prop('maxLength')(property));

export function createNewColumnFor(property: SimpleProperty): Column {
  const createNewColumn: { [PropertyType]: () => Column } = {
    boolean: () => newBooleanColumn(),
    currency: () => newCurrencyColumn(),
    date: () => newDateColumn(),
    decimal: () => createDecimalColumn(property),
    duration: () => newDurationColumn(),
    integer: () => newIntegerColumn(),
    percent: () => newPercentColumn(),
    sharedDecimal: () => createDecimalColumn(property),
    sharedInteger: () => newIntegerColumn(),
    sharedShort: () => newShortColumn(),
    sharedString: () => createStringColumn(property),
    short: () => newShortColumn(),
    string: () => createStringColumn(property),
    time: () => newTimeColumn(),
    year: () => newYearColumn(),
  };

  return createNewColumn[property.type]();
}

export function simplePropertyColumnCreator(): ColumnCreator {
  return {
    createColumns: (property: EntityProperty, strategy: BuildStrategy): Array<Column> => {
      if (!strategy.buildColumns(property)) return [];

      const column: Column = createNewColumnFor(((property: any): SimpleProperty));
      const columnNamer: ColumnNamer = strategy.columnNamer(
        strategy.parentContext(),
        property.data.edfiOds.ods_ContextPrefix,
        property.metaEdName,
      );
      const suppressPrimaryKey: boolean = strategy.suppressPrimaryKeyCreation();

      return [initializeColumn(column, property, columnNamer, suppressPrimaryKey)];
    },
  };
}
