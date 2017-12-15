// @flow
import type { EnumerationProperty } from 'metaed-core';
import { newEnumerationProperty } from 'metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import type { Column } from '../../../src/model/database/Column';
import type { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';

describe('when creating columns for enumeration property', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: EnumerationProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newEnumerationProperty(), {
      documentation: propertyDocumentation,
      baseKeyName: '',
      isIdentityRename: false,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: '',
          ods_TypeifiedBaseName: `${propertyName}Type`,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].dataType).toBe('[INT]');
    expect(columns[0].name).toBe(`${propertyName}TypeId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for primary key enumeration property', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: EnumerationProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newEnumerationProperty(), {
      documentation: propertyDocumentation,
      baseKeyName: '',
      isIdentityRename: false,
      isPartOfIdentity: true,
      isOptional: false,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: '',
          ods_TypeifiedBaseName: `${propertyName}Type`,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a primary key column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].dataType).toBe('[INT]');
    expect(columns[0].name).toBe(`${propertyName}TypeId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for identity rename enumeration property', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const propertyBaseKeyName: string = 'PropertyBaseKeyName';
  let property: EnumerationProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newEnumerationProperty(), {
      documentation: propertyDocumentation,
      baseKeyName: propertyBaseKeyName,
      isIdentityRename: true,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: '',
          ods_TypeifiedBaseName: `${propertyName}Type`,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a primary key column with base key name', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].dataType).toBe('[INT]');
    expect(columns[0].name).toBe(`${propertyBaseKeyName}Id`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for nullable enumeration property', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: EnumerationProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newEnumerationProperty(), {
      documentation: propertyDocumentation,
      baseKeyName: '',
      isIdentityRename: false,
      isPartOfIdentity: false,
      isOptional: true,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: '',
          ods_TypeifiedBaseName: `${propertyName}Type`,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].dataType).toBe('[INT]');
    expect(columns[0].name).toBe(`${propertyName}TypeId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for primary key enumeration property with suppress primary key creation strategy', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: EnumerationProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newEnumerationProperty(), {
      documentation: propertyDocumentation,
      baseKeyName: 'PropertyBaseKeyName',
      isIdentityRename: false,
      isPartOfIdentity: true,
      isOptional: false,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: '',
          ods_TypeifiedBaseName: `${propertyName}Type`,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault.suppressPrimaryKeyCreationFromPropertiesStrategy());
  });

  it('should return a column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].dataType).toBe('[INT]');
    expect(columns[0].name).toBe(`${propertyName}TypeId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for identity rename enumeration property with suppress primary key creation strategy', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const propertyBaseKeyName: string = 'PropertyBaseKeyName';
  let property: EnumerationProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newEnumerationProperty(), {
      documentation: propertyDocumentation,
      baseKeyName: propertyBaseKeyName,
      isIdentityRename: true,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: '',
          ods_TypeifiedBaseName: `${propertyName}Type`,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault.suppressPrimaryKeyCreationFromPropertiesStrategy());
  });

  it('should return a column with base key name', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].dataType).toBe('[INT]');
    expect(columns[0].name).toBe(`${propertyBaseKeyName}Id`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});
