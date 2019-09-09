import { newDomainEntity, newInlineCommon, newInlineCommonProperty, newIntegerProperty } from 'metaed-core';
import { Common, DomainEntity, InlineCommonProperty, IntegerProperty } from 'metaed-core';
import { Column } from '../../../src/model/database/Column';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { collectPrimaryKeys } from '../../../src/enhancer/table/PrimaryKeyCollector';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';

describe('when collecting primary key columns for identity property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: IntegerProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newIntegerProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [property],
          odsIdentityProperties: [property],
        },
      },
    });

    columns = collectPrimaryKeys(entity, BuildStrategyDefault, columnCreatorFactory);
  });

  it('should return a primary key column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(false);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe('');
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when collecting primary key columns for inline common property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: IntegerProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newIntegerProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    const inlineCommon: Common = Object.assign(newInlineCommon(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [property],
          odsIdentityProperties: [property],
        },
      },
    });

    const inlineCommonProperty: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
      referencedEntity: inlineCommon,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [inlineCommonProperty],
          odsIdentityProperties: [],
        },
      },
    });

    columns = collectPrimaryKeys(entity, BuildStrategyDefault, columnCreatorFactory);
  });

  it('should return a primary key column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(false);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe('');
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when collecting primary key columns for identity property and inline common property', (): void => {
  const propertyName1 = 'PropertyName1';
  const propertyName2 = 'PropertyName2';
  const propertyDocumentation = 'PropertyDocumentation';
  let property1: IntegerProperty;
  let property2: IntegerProperty;
  let columns: Column[];

  beforeAll(() => {
    property1 = Object.assign(newIntegerProperty(), {
      metaEdName: propertyName1,
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    property2 = Object.assign(newIntegerProperty(), {
      metaEdName: propertyName2,
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    const inlineCommon: Common = Object.assign(newInlineCommon(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [property2],
          odsIdentityProperties: [property2],
        },
      },
    });

    const inlineCommonProperty: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
      referencedEntity: inlineCommon,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [inlineCommonProperty, property1],
          odsIdentityProperties: [property1],
        },
      },
    });

    columns = collectPrimaryKeys(entity, BuildStrategyDefault, columnCreatorFactory);
  });

  it('should return two columns', (): void => {
    expect(columns).toHaveLength(2);
  });

  it('should return a primary key column for identity property', (): void => {
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(propertyName1);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(false);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe('');
    expect(columns[0].sourceEntityProperties[0]).toBe(property1);
  });

  it('should return a primary key column for inline common property', (): void => {
    expect(columns[1].type).toBe('integer');
    expect(columns[1].columnId).toBe(propertyName2);
    expect(columns[1].description).toBe(propertyDocumentation);
    expect(columns[1].isIdentityDatabaseType).toBe(false);
    expect(columns[1].isNullable).toBe(false);
    expect(columns[1].isPartOfPrimaryKey).toBe(true);
    expect(columns[1].originalContextPrefix).toBe('');
    expect(columns[1].sourceEntityProperties[0]).toBe(property2);
  });
});

describe('when collecting primary key columns for two inline common properties with primary key to same inline common entity', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  let property: IntegerProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newIntegerProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    const inlineCommon: Common = Object.assign(newInlineCommon(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [property],
          odsIdentityProperties: [property],
        },
      },
    });

    const inlineCommonProperty1: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
      referencedEntity: inlineCommon,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    const inlineCommonProperty2: InlineCommonProperty = Object.assign(newInlineCommonProperty(), {
      referencedEntity: inlineCommon,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: contextName,
          odsIsIdentityDatabaseType: false,
          odsIsUniqueIndex: false,
        },
      },
    });

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOdsRelational: {
          odsProperties: [inlineCommonProperty1, inlineCommonProperty2],
          odsIdentityProperties: [],
        },
      },
    });

    columns = collectPrimaryKeys(entity, BuildStrategyDefault, columnCreatorFactory);
  });

  it('should return two columns', (): void => {
    expect(columns).toHaveLength(2);
  });

  it('should return a primary key column', (): void => {
    expect(columns[0].type).toBe('integer');

    expect(columns[0].columnId).toBe(propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isIdentityDatabaseType).toBe(false);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].originalContextPrefix).toBe('');
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });

  it('should return a primary key column role name', (): void => {
    expect(columns[1].type).toBe('integer');
    expect(columns[1].columnId).toBe(contextName + propertyName);
    expect(columns[1].description).toBe(propertyDocumentation);
    expect(columns[1].isIdentityDatabaseType).toBe(false);
    expect(columns[1].isNullable).toBe(false);
    expect(columns[1].isPartOfPrimaryKey).toBe(true);
    expect(columns[1].originalContextPrefix).toBe('');
    expect(columns[1].sourceEntityProperties[0]).toBe(property);
  });
});
