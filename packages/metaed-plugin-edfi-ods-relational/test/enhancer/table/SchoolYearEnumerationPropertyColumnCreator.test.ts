import { newSchoolYearEnumerationProperty, EntityProperty, newBooleanProperty } from '@edfi/metaed-core';
import { SchoolYearEnumerationProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import { Column } from '../../../src/model/database/Column';
import { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';

describe('when creating columns for school year enumeration property', (): void => {
  const propertyDocumentation = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      documentation: propertyDocumentation,
      isIdentityRename: false,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for school year enumeration property role name', (): void => {
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  let property: SchoolYearEnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      documentation: propertyDocumentation,
      isIdentityRename: false,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: contextName,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a column role name', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe(`${contextName}SchoolYear`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for school year enumeration property role name and append parent context strategy', (): void => {
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  const parentContextName = 'ParentContextName';
  const parentContextProperty: EntityProperty = {
    ...newBooleanProperty(),
    data: { edfiOdsRelational: { odsContextPrefix: parentContextName } },
  };
  let property: SchoolYearEnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      documentation: propertyDocumentation,
      isIdentityRename: false,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: contextName,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault.appendParentContextProperty(parentContextProperty));
  });

  it('should return a column role name', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe(`${parentContextName}${contextName}SchoolYear`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for nullable school year enumeration property', (): void => {
  const propertyDocumentation = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      documentation: propertyDocumentation,
      isIdentityRename: false,
      isPartOfIdentity: false,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a nullable column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for primary key school year enumeration property', (): void => {
  const propertyDocumentation = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      documentation: propertyDocumentation,
      isIdentityRename: false,
      isPartOfIdentity: true,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a primary key column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for identity rename school year enumeration property', (): void => {
  const propertyDocumentation = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      documentation: propertyDocumentation,
      isIdentityRename: true,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a identity rename column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for primary key school year enumeration property with suppress primary key creation strategy', (): void => {
  const propertyDocumentation = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      documentation: propertyDocumentation,
      isIdentityRename: false,
      isPartOfIdentity: true,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault.suppressPrimaryKeyCreationFromPropertiesStrategy());
  });

  it('should return a primary key column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for identity rename school year enumeration property with suppress primary key creation strategy', (): void => {
  const propertyDocumentation = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      documentation: propertyDocumentation,
      isIdentityRename: true,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsContextPrefix: '',
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault.suppressPrimaryKeyCreationFromPropertiesStrategy());
  });

  it('should return a identity rename column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});
