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

  const apiProperty: ApiProperty = buildApiProperty(column);

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

  const apiProperty: ApiProperty = buildApiProperty(column);

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

  const apiProperty: ApiProperty = buildApiProperty(column);

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

  const apiProperty: ApiProperty = buildApiProperty(column);

  it('should have correct api property', (): void => {
    expect(apiProperty.propertyName).toBe(columnId);
    expect(apiProperty.description).toBe(description);
    expect(apiProperty.propertyType.dbType).toBe('Int32');
    expect(apiProperty.propertyType.isNullable).toBe(false);
    expect(apiProperty.isIdentifying).toBe(false);
    expect(apiProperty.isServerAssigned).toBe(true);
  });
});
