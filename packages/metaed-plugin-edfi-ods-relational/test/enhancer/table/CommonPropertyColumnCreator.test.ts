import { newCommon, newCommonProperty, newIntegerProperty, newStringProperty } from '@edfi/metaed-core';
import { Common, CommonProperty, IntegerProperty, StringProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import { Column, StringColumn } from '../../../src/model/database/Column';
import { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';

describe('when creating columns for common with is collection property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const length = '50';
  let property: StringProperty;
  let columns: Column[];

  beforeAll(() => {
    const commonName = 'CommonName';
    const common: Common = Object.assign(newCommon(), {
      metaEdName: commonName,
      data: {
        edfiOdsRelational: {
          odsTableId: commonName,
          odsProperties: [],
        },
      },
    });

    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: commonName,
      referencedEntity: common,
      data: {
        edfiOdsRelational: {
          odsIsCollection: false,
        },
      },
    });

    property = Object.assign(newStringProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      maxLength: length,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
          odsIsCollection: true,
        },
      },
    });

    common.data.edfiOdsRelational.odsProperties.push(property);

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(commonProperty, '6.1.0');
    columns = columnCreator.createColumns(commonProperty, BuildStrategyDefault);
  });

  it('should return no columns', (): void => {
    expect(columns).toHaveLength(0);
  });
});

describe('when creating columns for common with only one property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const length = '50';
  let property: StringProperty;
  let columns: Column[];

  beforeAll(() => {
    const commonName = 'CommonName';
    const common: Common = Object.assign(newCommon(), {
      metaEdName: commonName,
      data: {
        edfiOdsRelational: {
          odsTableId: commonName,
          odsProperties: [],
        },
      },
    });

    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: commonName,
      referencedEntity: common,
      data: {
        edfiOdsRelational: {
          odsIsCollection: false,
        },
      },
    });

    property = Object.assign(newStringProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      maxLength: length,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    common.data.edfiOdsRelational.odsProperties.push(property);

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(commonProperty, '6.1.0');
    columns = columnCreator.createColumns(commonProperty, BuildStrategyDefault);
  });

  it('should return a single column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('string');
    expect((columns[0] as StringColumn).maxLength).toBe(length);
    expect(columns[0].columnId).toBe(propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(false);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].originalContextPrefix).toBe('');
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for common with two properties', (): void => {
  const stringPropertyName = 'StringPropertyName';
  const integerPropertyName = 'IntegerPropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const length = '50';
  let stringProperty: StringProperty;
  let integerProperty: IntegerProperty;
  let columns: Column[];

  beforeAll(() => {
    const commonName = 'CommonName';
    const common: Common = Object.assign(newCommon(), {
      metaEdName: commonName,
      data: {
        edfiOdsRelational: {
          odsTableId: commonName,
          odsProperties: [],
        },
      },
    });

    const commonProperty: CommonProperty = Object.assign(newCommonProperty(), {
      metaEdName: commonName,
      referencedEntity: common,
      data: {
        edfiOdsRelational: {
          odsIsCollection: false,
        },
      },
    });

    stringProperty = Object.assign(newStringProperty(), {
      metaEdName: stringPropertyName,
      documentation: propertyDocumentation,
      maxLength: length,
      data: {
        edfiOdsRelational: {
          odsName: stringPropertyName,
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    integerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: integerPropertyName,
      documentation: propertyDocumentation,
      data: {
        edfiOdsRelational: {
          odsName: integerPropertyName,
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    common.data.edfiOdsRelational.odsProperties.push(stringProperty);
    common.data.edfiOdsRelational.odsProperties.push(integerProperty);

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(commonProperty, '6.1.0');
    columns = columnCreator.createColumns(commonProperty, BuildStrategyDefault);
  });

  it('should return two columns', (): void => {
    expect(columns).toHaveLength(2);
  });

  it('should return a string column', (): void => {
    expect(columns[0].type).toBe('string');
    expect((columns[0] as StringColumn).maxLength).toBe(length);
    expect(columns[0].columnId).toBe(stringPropertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(false);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].originalContextPrefix).toBe('');
    expect(columns[0].sourceEntityProperties[0]).toBe(stringProperty);
  });

  it('should return an integer column', (): void => {
    expect(columns[1].type).toBe('integer');
    expect(columns[1].columnId).toBe(integerPropertyName);
    expect(columns[1].description).toBe(propertyDocumentation);
    expect(columns[1].isIdentityDatabaseType).toBe(false);
    expect(columns[1].isNullable).toBe(false);
    expect(columns[1].isPartOfPrimaryKey).toBe(false);
    expect(columns[1].originalContextPrefix).toBe('');
    expect(columns[1].sourceEntityProperties[0]).toBe(integerProperty);
  });
});
