import { EntityProperty, DecimalProperty, StringProperty, SimpleProperty } from '@edfi/metaed-core';
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
import { ColumnCreator } from './ColumnCreator';

const createDecimalColumn = (property: DecimalProperty): DecimalColumn => ({
  ...newColumn(),
  type: 'decimal',
  precision: property.totalDigits,
  scale: property.decimalPlaces,
});

const createStringColumn = (property: StringProperty): StringColumn => ({
  ...newColumn(),
  type: 'string',
  length: property.maxLength || '0',
});

export function createNewColumnFor(property: SimpleProperty): Column {
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
      type: 'integer',
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

export function simplePropertyColumnCreator(): ColumnCreator {
  return {
    createColumns: (property: EntityProperty, strategy: BuildStrategy): Column[] => {
      if (!strategy.buildColumns(property)) return [];

      const column: Column = {
        ...createNewColumnFor(property as SimpleProperty),
        referenceContext: property.data.edfiOdsRelational.odsName,
        mergedReferenceContexts: [property.data.edfiOdsRelational.odsName],
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
    },
  };
}
