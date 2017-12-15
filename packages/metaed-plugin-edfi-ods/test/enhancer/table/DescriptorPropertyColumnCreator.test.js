// @flow
import type { DescriptorProperty } from 'metaed-core';
import { newDescriptorProperty } from 'metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import type { Column } from '../../../src/model/database/Column';
import type { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';

describe('when creating columns for descriptor property', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: DescriptorProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newDescriptorProperty(), {
      documentation: propertyDocumentation,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: '',
          ods_DescriptorifiedBaseName: `${propertyName}Descriptor`,
          ods_IsCollection: false,
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
    expect(columns[0].name).toBe(`${propertyName}DescriptorId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for primary key descriptor property', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: DescriptorProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newDescriptorProperty(), {
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      isOptional: false,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: '',
          ods_DescriptorifiedBaseName: `${propertyName}Descriptor`,
          ods_IsCollection: false,
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
    expect(columns[0].name).toBe(`${propertyName}DescriptorId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for nullable descriptor property', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: DescriptorProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newDescriptorProperty(), {
      documentation: propertyDocumentation,
      isPartOfIdentity: false,
      isOptional: true,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: '',
          ods_DescriptorifiedBaseName: `${propertyName}Descriptor`,
          ods_IsCollection: false,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a nullable column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].dataType).toBe('[INT]');
    expect(columns[0].name).toBe(`${propertyName}DescriptorId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for descriptor property with context', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  let property: DescriptorProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newDescriptorProperty(), {
      documentation: propertyDocumentation,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_DescriptorifiedBaseName: `${propertyName}Descriptor`,
          ods_IsCollection: false,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault);
  });

  it('should return a nullable column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].dataType).toBe('[INT]');
    expect(columns[0].name).toBe(`${contextName}${propertyName}DescriptorId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for descriptor property with context and append parent context strategy', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextName: string = 'ContextName';
  const parentContextName: string = 'ParentContextName';
  let property: DescriptorProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newDescriptorProperty(), {
      documentation: propertyDocumentation,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: contextName,
          ods_DescriptorifiedBaseName: `${propertyName}Descriptor`,
          ods_IsCollection: false,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(property);
    columns = columnCreator.createColumns(property, BuildStrategyDefault.appendParentContext(parentContextName));
  });

  it('should return a nullable column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].dataType).toBe('[INT]');
    expect(columns[0].name).toBe(`${parentContextName}${propertyName}DescriptorId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for collection descriptor property', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: DescriptorProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newDescriptorProperty(), {
      documentation: propertyDocumentation,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: '',
          ods_DescriptorifiedBaseName: `${propertyName}Descriptor`,
          ods_IsCollection: true,
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
    expect(columns[0].name).toBe(`${propertyName}DescriptorId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for primary key descriptor property with suppress primary key creation strategy', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: DescriptorProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newDescriptorProperty(), {
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      isOptional: false,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: '',
          ods_DescriptorifiedBaseName: `${propertyName}Descriptor`,
          ods_IsCollection: false,
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
    expect(columns[0].name).toBe(`${propertyName}DescriptorId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for collection descriptor property with suppress primary key creation strategy', () => {
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: DescriptorProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newDescriptorProperty(), {
      documentation: propertyDocumentation,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOds: {
          ods_Name: propertyName,
          ods_ContextPrefix: '',
          ods_DescriptorifiedBaseName: `${propertyName}Descriptor`,
          ods_IsCollection: true,
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
    expect(columns[0].name).toBe(`${propertyName}DescriptorId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});
