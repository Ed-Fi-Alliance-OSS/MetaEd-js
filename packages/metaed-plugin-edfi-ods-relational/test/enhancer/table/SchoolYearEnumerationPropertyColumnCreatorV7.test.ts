import {
  newSchoolYearEnumerationProperty,
  EntityProperty,
  newBooleanProperty,
  MetaEdPropertyPath,
  DomainEntity,
  newDomainEntity,
} from '@edfi/metaed-core';
import { SchoolYearEnumerationProperty } from '@edfi/metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { Column } from '../../../src/model/database/Column';
import { createColumnFor } from '../../../src/enhancer/table/ColumnCreator';

describe('when creating columns for school year enumeration property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      metaEdName: propertyName,
      fullPropertyName: propertyName,
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

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      properties: [property],
      data: {
        edfiOdsRelational: {
          odsTableId: 'Entity',
          odsProperties: [],
        },
      },
    });

    columns = createColumnFor(
      entity,
      property,
      BuildStrategyDefault,
      property.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );
  });

  it('should return a column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
    expect(columns[0].propertyPath).toMatchInlineSnapshot(`"PropertyName"`);
    expect(columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});

describe('when creating columns for school year enumeration property role name', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  const contextName = 'ContextName';
  let property: SchoolYearEnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      metaEdName: propertyName,
      fullPropertyName: propertyName,
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

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      properties: [property],
      data: {
        edfiOdsRelational: {
          odsTableId: 'Entity',
          odsProperties: [],
        },
      },
    });

    columns = createColumnFor(
      entity,
      property,
      BuildStrategyDefault,
      property.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );
  });

  it('should return a column role name', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe(`${contextName}SchoolYear`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
    expect(columns[0].propertyPath).toMatchInlineSnapshot(`"PropertyName"`);
    expect(columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});

describe('when creating columns for school year enumeration property role name and append parent context strategy', (): void => {
  const propertyName = 'PropertyName';
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
      metaEdName: propertyName,
      fullPropertyName: propertyName,
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

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      properties: [property],
      data: {
        edfiOdsRelational: {
          odsTableId: 'Entity',
          odsProperties: [],
        },
      },
    });

    columns = createColumnFor(
      entity,
      property,
      BuildStrategyDefault.appendParentContextProperty(parentContextProperty),
      property.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );
  });

  it('should return a column role name', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe(`${parentContextName}${contextName}SchoolYear`);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
    expect(columns[0].propertyPath).toMatchInlineSnapshot(`"PropertyName"`);
    expect(columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});

describe('when creating columns for nullable school year enumeration property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      metaEdName: propertyName,
      fullPropertyName: propertyName,
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

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      properties: [property],
      data: {
        edfiOdsRelational: {
          odsTableId: 'Entity',
          odsProperties: [],
        },
      },
    });

    columns = createColumnFor(
      entity,
      property,
      BuildStrategyDefault,
      property.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );
  });

  it('should return a nullable column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(true);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
    expect(columns[0].propertyPath).toMatchInlineSnapshot(`"PropertyName"`);
    expect(columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});

describe('when creating columns for primary key school year enumeration property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      metaEdName: propertyName,
      fullPropertyName: propertyName,
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

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      properties: [property],
      data: {
        edfiOdsRelational: {
          odsTableId: 'Entity',
          odsProperties: [],
        },
      },
    });

    columns = createColumnFor(
      entity,
      property,
      BuildStrategyDefault,
      property.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );
  });

  it('should return a primary key column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
    expect(columns[0].propertyPath).toMatchInlineSnapshot(`"PropertyName"`);
    expect(columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});

describe('when creating columns for identity rename school year enumeration property', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      metaEdName: propertyName,
      fullPropertyName: propertyName,
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

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      properties: [property],
      data: {
        edfiOdsRelational: {
          odsTableId: 'Entity',
          odsProperties: [],
        },
      },
    });

    columns = createColumnFor(
      entity,
      property,
      BuildStrategyDefault,
      property.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );
  });

  it('should return a identity rename column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
    expect(columns[0].propertyPath).toMatchInlineSnapshot(`"PropertyName"`);
    expect(columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});

describe('when creating columns for primary key school year enumeration property with suppress primary key creation strategy', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      metaEdName: propertyName,
      fullPropertyName: propertyName,
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

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      properties: [property],
      data: {
        edfiOdsRelational: {
          odsTableId: 'Entity',
          odsProperties: [],
        },
      },
    });

    columns = createColumnFor(
      entity,
      property,
      BuildStrategyDefault.suppressPrimaryKeyCreationFromPropertiesStrategy(),
      property.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );
  });

  it('should return a primary key column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
    expect(columns[0].propertyPath).toMatchInlineSnapshot(`"PropertyName"`);
    expect(columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});

describe('when creating columns for identity rename school year enumeration property with suppress primary key creation strategy', (): void => {
  const propertyName = 'PropertyName';
  const propertyDocumentation = 'PropertyDocumentation';
  let property: SchoolYearEnumerationProperty;
  let columns: Column[];

  beforeAll(() => {
    property = Object.assign(newSchoolYearEnumerationProperty(), {
      metaEdName: propertyName,
      fullPropertyName: propertyName,
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

    const entity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: 'Entity',
      properties: [property],
      data: {
        edfiOdsRelational: {
          odsTableId: 'Entity',
          odsProperties: [],
        },
      },
    });

    columns = createColumnFor(
      entity,
      property,
      BuildStrategyDefault.suppressPrimaryKeyCreationFromPropertiesStrategy(),
      property.fullPropertyName as MetaEdPropertyPath,
      '7.0.0',
    );
  });

  it('should return a identity rename column', (): void => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('short');
    expect(columns[0].columnId).toBe('SchoolYear');
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(false);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
    expect(columns[0].propertyPath).toMatchInlineSnapshot(`"PropertyName"`);
    expect(columns[0].originalEntity?.metaEdName).toMatchInlineSnapshot(`"Entity"`);
  });
});
