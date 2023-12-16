import { DescriptorProperty, EntityProperty, newBooleanProperty } from '@edfi/metaed-core';
import { newDescriptorProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { Column } from '../../../src/model/database/Column';
import { createColumnFor } from '../../../src/enhancer/table/ColumnCreator';

describe('when creating columns for descriptor property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: DescriptorProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newDescriptorProperty(), {
      documentation: propertyDocumentation,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsDescriptorifiedBaseName: `${propertyName}Descriptor`,
          odsIsCollection: false,
        },
      },
    });

    columns = createColumnFor(property, BuildStrategyDefault, '6.1.0');
  });

  it('should return a column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(`${propertyName}DescriptorId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].mergedReferenceContexts).toEqual([propertyName]);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for primary key descriptor property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: DescriptorProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newDescriptorProperty(), {
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsDescriptorifiedBaseName: `${propertyName}Descriptor`,
          odsIsCollection: false,
        },
      },
    });

    columns = createColumnFor(property, BuildStrategyDefault, '6.1.0');
  });

  it('should return a primary key column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(`${propertyName}DescriptorId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].mergedReferenceContexts).toEqual([propertyName]);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for nullable descriptor property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: DescriptorProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newDescriptorProperty(), {
      documentation: propertyDocumentation,
      isPartOfIdentity: false,
      isOptional: true,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsDescriptorifiedBaseName: `${propertyName}Descriptor`,
          odsIsCollection: false,
        },
      },
    });

    columns = createColumnFor(property, BuildStrategyDefault, '6.1.0');
  });

  it('should return a nullable column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(`${propertyName}DescriptorId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].mergedReferenceContexts).toEqual([propertyName]);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for descriptor property role name', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  let property: DescriptorProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newDescriptorProperty(), {
      documentation: propertyDocumentation,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsDescriptorifiedBaseName: `${propertyName}Descriptor`,
          odsIsCollection: false,
        },
      },
    });

    columns = createColumnFor(property, BuildStrategyDefault, '6.1.0');
  });

  it('should return a nullable column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(`${contextName}${propertyName}DescriptorId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].mergedReferenceContexts).toEqual([propertyName]);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for descriptor property role name and append parent context strategy', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  const parentContextName = 'ParentContextName';
  const parentContextProperty: EntityProperty = {
    ...newBooleanProperty(),
    data: { edfiOdsRelational: { odsContextPrefix: parentContextName } },
  };
  let property: DescriptorProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newDescriptorProperty(), {
      documentation: propertyDocumentation,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: contextName,
          odsDescriptorifiedBaseName: `${propertyName}Descriptor`,
          odsIsCollection: false,
        },
      },
    });

    columns = createColumnFor(property, BuildStrategyDefault.appendParentContextProperty(parentContextProperty), '6.1.0');
  });

  it('should return a nullable column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(`${parentContextName}${contextName}${propertyName}DescriptorId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].mergedReferenceContexts).toEqual([propertyName]);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for collection descriptor property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: DescriptorProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newDescriptorProperty(), {
      documentation: propertyDocumentation,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsDescriptorifiedBaseName: `${propertyName}Descriptor`,
          odsIsCollection: true,
        },
      },
    });

    columns = createColumnFor(property, BuildStrategyDefault, '6.1.0');
  });

  it('should return a primary key column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(`${propertyName}DescriptorId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].mergedReferenceContexts).toEqual([propertyName]);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for primary key descriptor property with suppress primary key creation strategy', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: DescriptorProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newDescriptorProperty(), {
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsDescriptorifiedBaseName: `${propertyName}Descriptor`,
          odsIsCollection: false,
        },
      },
    });

    columns = createColumnFor(property, BuildStrategyDefault.suppressPrimaryKeyCreationFromPropertiesStrategy(), '6.1.0');
  });

  it('should return a column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(`${propertyName}DescriptorId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].mergedReferenceContexts).toEqual([propertyName]);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});

describe('when creating columns for collection descriptor property with suppress primary key creation strategy', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: DescriptorProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newDescriptorProperty(), {
      documentation: propertyDocumentation,
      isPartOfIdentity: false,
      isOptional: false,
      data: {
        edfiOdsRelational: {
          odsName: propertyName,
          odsContextPrefix: '',
          odsDescriptorifiedBaseName: `${propertyName}Descriptor`,
          odsIsCollection: true,
        },
      },
    });

    columns = createColumnFor(property, BuildStrategyDefault.suppressPrimaryKeyCreationFromPropertiesStrategy(), '6.1.0');
  });

  it('should return a column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].columnId).toBe(`${propertyName}DescriptorId`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].referenceContext).toBe(propertyName);
    expect(columns[0].mergedReferenceContexts).toEqual([propertyName]);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
  });
});
