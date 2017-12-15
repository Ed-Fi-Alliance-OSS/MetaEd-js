// @flow
import { newSchoolYearEnumerationProperty } from 'metaed-core';
import type { SchoolYearEnumerationProperty } from 'metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import type { Column } from '../../../src/model/database/Column';
import type { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';

describe('when creating columns for school year enumeration property', () => {
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      documentation: propertyDocumentation,
      isIdentityRename: false,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].dataType).toBe('[SMALLINT]');
    expect(columns[0].name).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for school year enumeration property with context', () => {
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  let property: SchoolYearEnumerationProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      documentation: propertyDocumentation,
      isIdentityRename: false,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOds: {
          ods_ContextPrefix: contextName,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a column with context', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].dataType).toBe('[SMALLINT]');
    expect(columns[0].name).toBe(`${contextName}SchoolYear`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for school year enumeration property with context and append parent context strategy', () => {
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  const parentContextName: string = 'ParentContextName';
  let property: SchoolYearEnumerationProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      documentation: propertyDocumentation,
      isIdentityRename: false,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOds: {
          ods_ContextPrefix: contextName,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault.appendParentContext(parentContextName));
  });

  it('should return a column with context', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].dataType).toBe('[SMALLINT]');
    expect(columns[0].name).toBe(`${parentContextName}${contextName}SchoolYear`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for nullable school year enumeration property', () => {
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      documentation: propertyDocumentation,
      isIdentityRename: false,
      isPartOfIdentity: false,
      isOptional: true,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a nullable column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].dataType).toBe('[SMALLINT]');
    expect(columns[0].name).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});


describe('when creating columns for primary key school year enumeration property', () => {
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      documentation: propertyDocumentation,
      isIdentityRename: false,
      isPartOfIdentity: true,
      isOptional: false,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a primary key column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].dataType).toBe('[SMALLINT]');
    expect(columns[0].name).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for identity rename school year enumeration property', () => {
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      documentation: propertyDocumentation,
      isIdentityRename: true,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a identity rename column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].dataType).toBe('[SMALLINT]');
    expect(columns[0].name).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});


describe('when creating columns for primary key school year enumeration property with suppress primary key creation strategy', () => {
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      documentation: propertyDocumentation,
      isIdentityRename: false,
      isPartOfIdentity: true,
      isOptional: false,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault.suppressPrimaryKeyCreationFromPropertiesStrategy());
  });

  it('should return a primary key column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].dataType).toBe('[SMALLINT]');
    expect(columns[0].name).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for identity rename school year enumeration property with suppress primary key creation strategy', () => {
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      documentation: propertyDocumentation,
      isIdentityRename: true,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault.suppressPrimaryKeyCreationFromPropertiesStrategy());
  });

  it('should return a identity rename column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].dataType).toBe('[SMALLINT]');
    expect(columns[0].name).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});
