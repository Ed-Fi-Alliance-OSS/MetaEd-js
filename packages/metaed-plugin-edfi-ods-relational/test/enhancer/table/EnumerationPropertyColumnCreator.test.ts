import { EnumerationProperty } from '@edfi/metaed-core';
import { newEnumerationProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import { Column } from '../../../src/model/database/Column';
import { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';

describe('when creating columns for enumeration property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: EnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newEnumerationProperty(), {
      documentation: propertyDocumentation,
      baseKeyName: '',
      isIdentityRename: false,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsTypeifiedBaseName: `${propertyName}Type`,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(`${propertyName}TypeId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for primary key enumeration property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: EnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newEnumerationProperty(), {
      documentation: propertyDocumentation,
      baseKeyName: '',
      isIdentityRename: false,
      isPartOfIdentity: true,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsTypeifiedBaseName: `${propertyName}Type`,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a primary key column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(`${propertyName}TypeId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].mergedReferenceContexts).toEqual([propertyName]);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for identity rename enumeration property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const propertyBaseKeyName = 'PropertyBaseKeyName';
  let property: EnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newEnumerationProperty(), {
      documentation: propertyDocumentation,
      baseKeyName: propertyBaseKeyName,
      isIdentityRename: true,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsTypeifiedBaseName: `${propertyName}Type`,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a primary key column with base key name', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(`${propertyBaseKeyName}Id`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].mergedReferenceContexts).toEqual([propertyName]);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for nullable enumeration property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: EnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newEnumerationProperty(), {
      documentation: propertyDocumentation,
      baseKeyName: '',
      isIdentityRename: false,
      isPartOfIdentity: false,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsTypeifiedBaseName: `${propertyName}Type`,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(`${propertyName}TypeId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].mergedReferenceContexts).toEqual([propertyName]);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for primary key enumeration property with suppress primary key creation strategy', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: EnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newEnumerationProperty(), {
      documentation: propertyDocumentation,
      baseKeyName: 'PropertyBaseKeyName',
      isIdentityRename: false,
      isPartOfIdentity: true,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsTypeifiedBaseName: `${propertyName}Type`,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault.suppressPrimaryKeyCreationFromPropertiesStrategy());
  });

  it('should return a column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(`${propertyName}TypeId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].mergedReferenceContexts).toEqual([propertyName]);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for identity rename enumeration property with suppress primary key creation strategy', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const propertyBaseKeyName = 'PropertyBaseKeyName';
  let property: EnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newEnumerationProperty(), {
      documentation: propertyDocumentation,
      baseKeyName: propertyBaseKeyName,
      isIdentityRename: true,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsTypeifiedBaseName: `${propertyName}Type`,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault.suppressPrimaryKeyCreationFromPropertiesStrategy());
  });

  it('should return a column with base key name', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(`${propertyBaseKeyName}Id`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].mergedReferenceContexts).toEqual([propertyName]);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});
