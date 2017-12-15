// @flow
import { newCommon, newCommonProperty, newIntegerProperty, newStringProperty } from 'metaed-core';
import type { Common, CommonProperty, IntegerProperty, StringProperty } from 'metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import type { Column } from '../../../src/model/database/Column';
import type { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';

describe('when creating columns for common with is collection property', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const length: string = '50';
  let property: StringProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    const commonName: string = 'CommonName';
    const common: Common = Object.assign(newCommon(), {
      metaEdName: commonName,
      data: {
        edfiOds: {
          ods_TableName: commonName,
          ods_Properties: [],
        },
      },
    });

    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: commonName,
      referencedEntity: common,
      data: {
        edfiOds: {
          ods_IsCollection: false,
        },
      },
    });

    property = Object.assign(newStringProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      maxLength: length,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
          ods_IsCollection: true,
        },
      },
    });

    common.data.edfiOds.ods_Properties.push(property);

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(commonProperty);
    columns = columnCreator.createColumns(commonProperty, BuildStrategyDefault);
  });

  it('should return no columns', () => {
    expect(columns).toHaveLength(0);
  });
});

describe('when creating columns for common with only one property', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const length: string = '50';
  let property: StringProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    const commonName: string = 'CommonName';
    const common: Common = Object.assign(newCommon(), {
      metaEdName: commonName,
      data: {
        edfiOds: {
          ods_TableName: commonName,
          ods_Properties: [],
        },
      },
    });

    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: commonName,
      referencedEntity: common,
      data: {
        edfiOds: {
          ods_IsCollection: false,
        },
      },
    });

    property = Object.assign(newStringProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      maxLength: length,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });

    common.data.edfiOds.ods_Properties.push(property);

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(commonProperty);
    columns = columnCreator.createColumns(commonProperty, BuildStrategyDefault);
  });

  it('should return a single column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('string');
    expect(columns[0].dataType).toBe(`[NVARCHAR](${length})`);
    expect(columns[0].name).toBe(propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(false);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].originalContextPrefix).toBe('');
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for common with two properties', () => {
  const stringPropertyName: string = 'StringPropertyName';
  const integerPropertyName: string = 'IntegerPropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const length: string = '50';
  let stringProperty: StringProperty;
  let integerProperty: IntegerProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    const commonName: string = 'CommonName';
    const common: Common = Object.assign(newCommon(), {
      metaEdName: commonName,
      data: {
        edfiOds: {
          ods_TableName: commonName,
          ods_Properties: [],
        },
      },
    });

    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: commonName,
      referencedEntity: common,
      data: {
        edfiOds: {
          ods_IsCollection: false,
        },
      },
    });

    stringProperty = Object.assign(newStringProperty(), {
      metaEdName: stringPropertyName,
      documentation: propertyDocumentation,
      maxLength: length,
      data: {
        edfiOds: {
          ods_Name: stringPropertyName,
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });

    integerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: integerPropertyName,
      documentation: propertyDocumentation,
      data: {
        edfiOds: {
          ods_Name: integerPropertyName,
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });

    common.data.edfiOds.ods_Properties.push(stringProperty);
    common.data.edfiOds.ods_Properties.push(integerProperty);

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(commonProperty);
    columns = columnCreator.createColumns(commonProperty, BuildStrategyDefault);
  });

  it('should return two columns', () => {
    expect(columns).toHaveLength(2);
  });

  it('should return a string column', () => {
    expect(columns[0].type).toBe('string');
    expect(columns[0].dataType).toBe(`[NVARCHAR](${length})`);
    expect(columns[0].name).toBe(stringPropertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(false);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].originalContextPrefix).toBe('');
    expect(columns[0].sourceEntityProperties[0]).toBe(stringProperty);
  });

  it('should return an integer column', () => {
    expect(columns[1].type).toBe('integer');
    expect(columns[1].dataType).toBe('[INT]');
    expect(columns[1].name).toBe(integerPropertyName);
    expect(columns[1].description).toBe(propertyDocumentation);
    expect(columns[1].isIdentityDatabaseType).toBe(false);
    expect(columns[1].isNullable).toBe(false);
    expect(columns[1].isPartOfPrimaryKey).toBe(false);
    expect(columns[1].originalContextPrefix).toBe('');
    expect(columns[1].sourceEntityProperties[0]).toBe(integerProperty);
  });
});
