import { IntegerProperty, newIntegerProperty, newShortProperty, ShortProperty } from '@edfi/metaed-core';
import { newColumn, StringColumn, DecimalColumn } from '@edfi/metaed-plugin-edfi-ods-relational';
import { Column } from '@edfi/metaed-plugin-edfi-ods-relational';
import { buildApiProperty } from '../../../src/enhancer/apiModel/BuildApiProperty';
import { ApiProperty } from '../../../src/model/apiModel/ApiProperty';

describe('when building an api property from a not null integer column', (): void => {
  const columnId = 'Name';
  const description = 'Description';
  const column: Column = {
    ...newColumn(),
    type: 'integer',
    columnId,
    data: { edfiOdsSqlServer: { columnName: columnId } },
    description,
    isNullable: false,
  };

  const apiProperty: ApiProperty = buildApiProperty(column, '3.2.0');

  it('should have correct api property', (): void => {
    expect(apiProperty.propertyName).toBe(columnId);
    expect(apiProperty.description).toBe(description);
    expect(apiProperty.propertyType.dbType).toBe('Int32');
    expect(apiProperty.propertyType.isNullable).toBe(false);
    expect(apiProperty.isIdentifying).toBe(false);
    expect(apiProperty.isServerAssigned).toBe(false);
  });
});

describe('when building an api property from a nullable string column', (): void => {
  const columnId = 'Name';
  const description = 'Description';
  const column: Column = {
    ...newColumn(),
    type: 'string',
    length: '100',
    columnId,
    data: { edfiOdsSqlServer: { columnName: columnId } },
    description,
    isNullable: true,
  } as StringColumn;

  const apiProperty: ApiProperty = buildApiProperty(column, '3.2.0');

  it('should have correct api property', (): void => {
    expect(apiProperty.propertyName).toBe(columnId);
    expect(apiProperty.description).toBe(description);
    expect(apiProperty.propertyType.dbType).toBe('String');
    expect(apiProperty.propertyType.isNullable).toBe(true);
    expect(apiProperty.propertyType.maxLength).toBe(100);
    expect(apiProperty.isIdentifying).toBe(false);
    expect(apiProperty.isServerAssigned).toBe(false);
  });
});

describe('when building an api property from a decimal primary key column', (): void => {
  const columnId = 'Name';
  const description = 'Description';
  const column: Column = {
    ...newColumn(),
    type: 'decimal',
    scale: '10',
    precision: '100',
    columnId,
    data: { edfiOdsSqlServer: { columnName: columnId } },
    description,
    isPartOfPrimaryKey: true,
  } as DecimalColumn;

  const apiProperty: ApiProperty = buildApiProperty(column, '3.2.0');

  it('should have correct api property', (): void => {
    expect(apiProperty.propertyName).toBe(columnId);
    expect(apiProperty.description).toBe(description);
    expect(apiProperty.propertyType.dbType).toBe('Decimal');
    expect(apiProperty.propertyType.isNullable).toBe(false);
    expect(apiProperty.propertyType.scale).toBe(10);
    expect(apiProperty.propertyType.precision).toBe(100);
    expect(apiProperty.isIdentifying).toBe(true);
    expect(apiProperty.isServerAssigned).toBe(false);
  });
});

describe('when building an api property from an identity integer column', (): void => {
  const columnId = 'Name';
  const description = 'Description';
  const column: Column = {
    ...newColumn(),
    type: 'integer',
    columnId,
    data: { edfiOdsSqlServer: { columnName: columnId } },
    description,
    isIdentityDatabaseType: true,
  };

  const apiProperty: ApiProperty = buildApiProperty(column, '3.2.0');

  it('should have correct api property', (): void => {
    expect(apiProperty.propertyName).toBe(columnId);
    expect(apiProperty.description).toBe(description);
    expect(apiProperty.propertyType.dbType).toBe('Int32');
    expect(apiProperty.propertyType.isNullable).toBe(false);
    expect(apiProperty.isIdentifying).toBe(false);
    expect(apiProperty.isServerAssigned).toBe(true);
  });
});

describe('when building an api property from an integer column with min/max values for ODS/API version 7.0', (): void => {
  const columnId = 'Name';
  const description = 'Description';
  const column: Column = {
    ...newColumn(),
    type: 'integer',
    columnId,
    data: { edfiOdsSqlServer: { columnName: columnId } },
    description,
    isNullable: false,
    sourceEntityProperties: [
      {
        ...newIntegerProperty(),
        minValue: '10',
        maxValue: '20',
      } as IntegerProperty,
    ],
  };

  const apiProperty: ApiProperty = buildApiProperty(column, '7.0.0');

  it('should have correct api property', (): void => {
    expect(apiProperty).toMatchInlineSnapshot(`
      Object {
        "deprecationReasons": undefined,
        "description": "Description",
        "isDeprecated": undefined,
        "isIdentifying": false,
        "isServerAssigned": false,
        "propertyName": "Name",
        "propertyType": Object {
          "dbType": "Int32",
          "isNullable": false,
          "maxValue": 20,
          "minValue": 10,
        },
      }
    `);
  });
});

describe('when building an api property from an integer column without min/max values for ODS/API version 7.0', (): void => {
  const columnId = 'Name';
  const description = 'Description';
  const column: Column = {
    ...newColumn(),
    type: 'integer',
    columnId,
    data: { edfiOdsSqlServer: { columnName: columnId } },
    description,
    isNullable: false,
    sourceEntityProperties: [newIntegerProperty()],
  };

  const apiProperty: ApiProperty = buildApiProperty(column, '7.0.0');

  it('should have correct api property', (): void => {
    expect(apiProperty).toMatchInlineSnapshot(`
      Object {
        "deprecationReasons": undefined,
        "description": "Description",
        "isDeprecated": undefined,
        "isIdentifying": false,
        "isServerAssigned": false,
        "propertyName": "Name",
        "propertyType": Object {
          "dbType": "Int32",
          "isNullable": false,
        },
      }
    `);
  });
});

describe('when building an api property from a short column with min/max values for ODS/API version 7.0', (): void => {
  const columnId = 'Name';
  const description = 'Description';
  const column: Column = {
    ...newColumn(),
    type: 'short',
    columnId,
    data: { edfiOdsSqlServer: { columnName: columnId } },
    description,
    isNullable: false,
    sourceEntityProperties: [
      {
        ...newShortProperty(),
        minValue: '10',
        maxValue: '20',
      } as ShortProperty,
    ],
  };

  const apiProperty: ApiProperty = buildApiProperty(column, '7.0.0');

  it('should have correct api property', (): void => {
    expect(apiProperty).toMatchInlineSnapshot(`
      Object {
        "deprecationReasons": undefined,
        "description": "Description",
        "isDeprecated": undefined,
        "isIdentifying": false,
        "isServerAssigned": false,
        "propertyName": "Name",
        "propertyType": Object {
          "dbType": "Int16",
          "isNullable": false,
          "maxValue": 20,
          "minValue": 10,
        },
      }
    `);
  });
});

describe('when building an api property from a short column without min/max values for ODS/API version 7.0', (): void => {
  const columnId = 'Name';
  const description = 'Description';
  const column: Column = {
    ...newColumn(),
    type: 'short',
    columnId,
    data: { edfiOdsSqlServer: { columnName: columnId } },
    description,
    isNullable: false,
    sourceEntityProperties: [newShortProperty()],
  };

  const apiProperty: ApiProperty = buildApiProperty(column, '7.0.0');

  it('should have correct api property', (): void => {
    expect(apiProperty).toMatchInlineSnapshot(`
      Object {
        "deprecationReasons": undefined,
        "description": "Description",
        "isDeprecated": undefined,
        "isIdentifying": false,
        "isServerAssigned": false,
        "propertyName": "Name",
        "propertyType": Object {
          "dbType": "Int16",
          "isNullable": false,
        },
      }
    `);
  });
});
