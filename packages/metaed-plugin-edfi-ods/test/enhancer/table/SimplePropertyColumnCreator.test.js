// @flow
import {
  newBooleanProperty,
  newCurrencyProperty,
  newDateProperty,
  newDecimalProperty,
  newDomainEntity,
  newDurationProperty,
  newIntegerProperty,
  newPercentProperty,
  newSharedDecimalProperty,
  newSharedIntegerProperty,
  newSharedShortProperty,
  newSharedStringProperty,
  newShortProperty,
  newStringProperty,
  newTimeProperty,
  newYearProperty,
} from 'metaed-core';
import type {
  BooleanProperty,
  CurrencyProperty,
  DateProperty,
  DecimalProperty,
  DurationProperty,
  IntegerProperty,
  PercentProperty,
  SharedDecimalProperty,
  SharedIntegerProperty,
  SharedShortProperty,
  SharedStringProperty,
  ShortProperty,
  StringProperty,
  TimeProperty,
  YearProperty,
} from 'metaed-core';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import type { Column } from '../../../src/model/database/Column';
import type { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';

describe('when converting boolean property to column', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  let property: BooleanProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newBooleanProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_IsIdentityDatabaseType: true,
          ods_IsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('boolean');
    expect(columns[0].dataType).toBe('[BIT]');
    expect(columns[0].name).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting currency property to column', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  let property: CurrencyProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newCurrencyProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_IsIdentityDatabaseType: true,
          ods_IsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('currency');
    expect(columns[0].dataType).toBe('[MONEY]');
    expect(columns[0].name).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting date property to column', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  let property: DateProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newDateProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_IsIdentityDatabaseType: true,
          ods_IsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('date');
    expect(columns[0].dataType).toBe('[DATE]');
    expect(columns[0].name).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting decimal property to column', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  const precision: string = '10';
  const scale: string = '2';
  let property: DecimalProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newDecimalProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      totalDigits: precision,
      decimalPlaces: scale,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_IsIdentityDatabaseType: true,
          ods_IsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('decimal');
    expect(columns[0].dataType).toBe(`[DECIMAL](${precision}, ${scale})`);
    expect(columns[0].name).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting duration property to column', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  let property: DurationProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newDurationProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_IsIdentityDatabaseType: true,
          ods_IsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('duration');
    expect(columns[0].dataType).toBe('[NVARCHAR](30)');
    expect(columns[0].name).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting integer property to column', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  let property: IntegerProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newIntegerProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_IsIdentityDatabaseType: true,
          ods_IsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].dataType).toBe('[INT]');
    expect(columns[0].name).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting percent property to column', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  let property: PercentProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newPercentProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_IsIdentityDatabaseType: true,
          ods_IsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('percent');
    expect(columns[0].dataType).toBe('[DECIMAL](5, 4)');
    expect(columns[0].name).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting shared decimal property to column', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  const precision: string = '10';
  const scale: string = '2';
  let property: SharedDecimalProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newSharedDecimalProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      totalDigits: precision,
      decimalPlaces: scale,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_IsIdentityDatabaseType: true,
          ods_IsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('decimal');
    expect(columns[0].dataType).toBe(`[DECIMAL](${precision}, ${scale})`);
    expect(columns[0].name).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting shared integer property to column', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  let property: SharedIntegerProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newSharedIntegerProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_IsIdentityDatabaseType: true,
          ods_IsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].dataType).toBe('[INT]');
    expect(columns[0].name).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting shared short property to column', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  let property: SharedShortProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newSharedShortProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_IsIdentityDatabaseType: true,
          ods_IsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].dataType).toBe('[SMALLINT]');
    expect(columns[0].name).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting shared string property to column', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  const length: string = '100';
  let property: SharedStringProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newSharedStringProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      maxLength: length,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_IsIdentityDatabaseType: true,
          ods_IsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('string');
    expect(columns[0].dataType).toBe(`[NVARCHAR](${length})`);
    expect(columns[0].name).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting short property to column', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  let property: ShortProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newShortProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_IsIdentityDatabaseType: true,
          ods_IsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].dataType).toBe('[SMALLINT]');
    expect(columns[0].name).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting string property to column', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  const length: string = '100';
  let property: StringProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newStringProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      maxLength: length,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_IsIdentityDatabaseType: true,
          ods_IsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('string');
    expect(columns[0].dataType).toBe(`[NVARCHAR](${length})`);
    expect(columns[0].name).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting time property to column', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  let property: TimeProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newTimeProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_IsIdentityDatabaseType: true,
          ods_IsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('time');
    expect(columns[0].dataType).toBe('[TIME](7)');
    expect(columns[0].name).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting year property to column', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  let property: YearProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newYearProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_IsIdentityDatabaseType: true,
          ods_IsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('year');
    expect(columns[0].dataType).toBe('[SMALLINT]');
    expect(columns[0].name).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});
