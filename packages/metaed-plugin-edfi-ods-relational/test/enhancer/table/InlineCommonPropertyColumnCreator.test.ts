import { newInlineCommon, newInlineCommonProperty, newStringProperty, newIntegerProperty } from '@edfi/metaed-core';
import { Common, InlineCommonProperty, StringProperty, IntegerProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import { Column, StringColumn } from '../../../src/model/database/Column';
import { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';

describe('when creating columns for inline common with is collection property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const length = '50';
  let property: StringProperty;
  let columns: Column[];

  beforeAll(() => {
    const commonName = 'InlineCommonName';
    const common: Common = Object.assign(newInlineCommon(), {
      metaEdName: commonName,
      data: {
        edfiOdsRelational: {
          odsTableId: commonName,
          odsProperties: [],
        },
      },
    });

    const commonProperty: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
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

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(commonProperty);
    columns = columnCreator.createColumns(commonProperty, BuildStrategyDefault);
  });

  it('should return no columns', (): void => {
    expect(columns).toHaveLength(0);
  });
});

describe('when creating columns for inline common with only one property', (): void => {
  const contextName = 'ContextName';
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const propertyContextName = 'PropertyContextName';
  const length = '50';
  let property: StringProperty;
  let columns: Column[];

  beforeAll(() => {
    const commonName = 'InlineCommonName';
    const common: Common = Object.assign(newInlineCommon(), {
      metaEdName: commonName,
      data: {
        edfiOdsRelational: {
          odsTableId: commonName,
          odsProperties: [],
        },
      },
    });

    const commonProperty: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
      metaEdName: commonName,
      referencedEntity: common,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: contextName,
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
          odsContextPrefix: propertyContextName,
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    common.data.edfiOdsRelational.odsProperties.push(property);

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(commonProperty);
    columns = columnCreator.createColumns(commonProperty, BuildStrategyDefault);
  });

  it('should return a single column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('string');
    expect((columns[0] as StringColumn).maxLength).toBe(length);
    expect(columns[0].columnId).toBe(contextName + propertyContextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(false);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].originalContextPrefix).toBe(propertyContextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for inline common with two properties', (): void => {
  const contextName = 'ContextName';
  const stringPropertyName = 'StringPropertyName';
  const stringPropertyContextName = 'StringPropertyContextName';
  const length = '50';
  const integerPropertyName = 'IntegerPropertyName';
  const integerPropertyContextName = 'IntegerPropertyContextName';
  const propertyDocumentation = 'PropertyDocumentation';
  let stringProperty: StringProperty;
  let integerProperty: IntegerProperty;
  let columns: Column[];

  beforeAll(() => {
    const commonName = 'InlineCommonName';
    const common: Common = Object.assign(newInlineCommon(), {
      metaEdName: commonName,
      data: {
        edfiOdsRelational: {
          odsTableId: commonName,
          odsProperties: [],
        },
      },
    });

    const commonProperty: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
      metaEdName: commonName,
      referencedEntity: common,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: contextName,
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
          odsContextPrefix: stringPropertyContextName,
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
          odsContextPrefix: integerPropertyContextName,
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    common.data.edfiOdsRelational.odsProperties.push(stringProperty);
    common.data.edfiOdsRelational.odsProperties.push(integerProperty);

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(commonProperty);
    columns = columnCreator.createColumns(commonProperty, BuildStrategyDefault);
  });

  it('should return two columns', (): void => {
    expect(columns).toHaveLength(2);
  });

  it('should return a string column', (): void => {
    expect(columns[0].type).toBe('string');
    expect((columns[0] as StringColumn).maxLength).toBe(length);
    expect(columns[0].columnId).toBe(contextName + stringPropertyContextName + stringPropertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(false);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].originalContextPrefix).toBe(stringPropertyContextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(stringProperty);
  });

  it('should return an integer column', (): void => {
    expect(columns[1].type).toBe('integer');
    expect(columns[1].columnId).toBe(contextName + integerPropertyContextName + integerPropertyName);
    expect(columns[1].description).toBe(propertyDocumentation);
    expect(columns[1].isIdentityDatabaseType).toBe(false);
    expect(columns[1].isNullable).toBe(false);
    expect(columns[1].isPartOfPrimaryKey).toBe(false);
    expect(columns[1].originalContextPrefix).toBe(integerPropertyContextName);
    expect(columns[1].sourceEntityProperties[0]).toBe(integerProperty);
  });
});
