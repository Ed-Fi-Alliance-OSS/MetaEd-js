import {
  newBooleanProperty,
  newCurrencyProperty,
  newDateProperty,
  newDatetimeProperty,
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
} from '@edfi/metaed-core';
import {
  BooleanProperty,
  CurrencyProperty,
  DateProperty,
  DatetimeProperty,
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
} from '@edfi/metaed-core';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { Column, DecimalColumn, StringColumn } from '../../../src/model/database/Column';
import { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';

describe('when converting boolean property to column', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  let property: BooleanProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newBooleanProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: true,
          odsIsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('boolean');
    expect(columns[0].columnId).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting currency property to column', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  let property: CurrencyProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newCurrencyProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: true,
          odsIsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('currency');
    expect(columns[0].columnId).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting date property to column', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  let property: DateProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newDateProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: true,
          odsIsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('date');
    expect(columns[0].columnId).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting datetime property to column', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  let property: DatetimeProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newDatetimeProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: true,
          odsIsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('datetime');
    expect(columns[0].columnId).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting decimal property to column', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  const precision = '10';
  const scale = '2';
  let property: DecimalProperty;
  let columns: Column[];

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
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: true,
          odsIsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('decimal');
    expect((columns[0] as DecimalColumn).precision).toBe(precision);
    expect((columns[0] as DecimalColumn).scale).toBe(scale);
    expect(columns[0].columnId).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting duration property to column', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  let property: DurationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newDurationProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: true,
          odsIsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('duration');
    expect(columns[0].columnId).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting integer property to column', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  let property: IntegerProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newIntegerProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: true,
          odsIsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting percent property to column', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  let property: PercentProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newPercentProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: true,
          odsIsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('percent');
    expect(columns[0].columnId).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting shared decimal property to column', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  const precision = '10';
  const scale = '2';
  let property: SharedDecimalProperty;
  let columns: Column[];

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
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: true,
          odsIsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('decimal');
    expect((columns[0] as DecimalColumn).precision).toBe(precision);
    expect((columns[0] as DecimalColumn).scale).toBe(scale);
    expect(columns[0].columnId).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting shared integer property to column', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  let property: SharedIntegerProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSharedIntegerProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: true,
          odsIsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting shared short property to column', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  let property: SharedShortProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSharedShortProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: true,
          odsIsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting shared string property to column', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  const length = '100';
  let property: SharedStringProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSharedStringProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      maxLength: length,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: true,
          odsIsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('string');
    expect((columns[0] as StringColumn).length).toBe(length);
    expect(columns[0].columnId).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting short property to column', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  let property: ShortProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newShortProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: true,
          odsIsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting string property to column', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  const length = '100';
  let property: StringProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newStringProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      maxLength: length,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: true,
          odsIsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('string');
    expect((columns[0] as StringColumn).length).toBe(length);
    expect(columns[0].columnId).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting time property to column', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  let property: TimeProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newTimeProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: true,
          odsIsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('time');
    expect(columns[0].columnId).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when converting year property to column', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  let property: YearProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newYearProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      parentEntity: newDomainEntity(),
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: true,
          odsIsUniqueIndex: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return converted column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('year');
    expect(columns[0].columnId).toBe(contextName + propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(true);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe(contextName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});
