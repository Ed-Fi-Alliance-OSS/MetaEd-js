// @flow
import type { DomainEntity, DomainEntityProperty, IntegerProperty } from 'metaed-core';
import { newDomainEntity, newDomainEntityProperty, newIntegerProperty } from 'metaed-core';
import { BuildStrategyDefault } from '../../../src/enhancer/table/BuildStrategy';
import { columnCreatorFactory } from '../../../src/enhancer/table/ColumnCreatorFactory';
import type { Column } from '../../../src/model/database/Column';
import type { ColumnCreator } from '../../../src/enhancer/table/ColumnCreator';

describe('when creating columns for identity collection reference property', () => {
  let columns: Array<Column>;

  beforeAll(() => {
    const property: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: 'PropertyName',
      documentation: 'PropertyDocumentation',
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOds: {
          ods_Properties: [property],
          ods_IdentityProperties: [property],
        },
      },
    });

    const domainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      referencedEntity: domainEntity,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsCollection: true,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(domainEntityProperty);
    columns = columnCreator.createColumns(domainEntityProperty, BuildStrategyDefault);
  });

  it('should return no columns', () => {
    expect(columns).toHaveLength(0);
  });
});

describe('when creating columns for identity reference property', () => {
  const domainEntityPropertyName: string = 'DomainEntityPropertyName';
  const propertyName: string = 'PropertyName';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: IntegerProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newIntegerProperty(), {
      metaEdName: propertyName,
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOds: {
          ods_Properties: [property],
          ods_IdentityProperties: [property],
        },
      },
    });

    const domainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      referencedEntity: domainEntity,
      data: {
        edfiOds: {
          ods_Name: domainEntityPropertyName,
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(domainEntityProperty);
    columns = columnCreator.createColumns(domainEntityProperty, BuildStrategyDefault);
  });

  it('should return a primary key column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].dataType).toBe('[INT]');
    expect(columns[0].name).toBe(propertyName);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
    expect(columns[0].referenceContext).toBe(domainEntityPropertyName);
  });
});

describe('when creating columns for identity reference properties with composite primary key', () => {
  const domainEntityPropertyName: string = 'DomainEntityPropertyName';
  const propertyName1: string = 'PropertyName1';
  const propertyName2: string = 'PropertyName2';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property1: IntegerProperty;
  let property2: IntegerProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property1 = Object.assign(newIntegerProperty(), {
      metaEdName: propertyName1,
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });

    property2 = Object.assign(newIntegerProperty(), {
      metaEdName: propertyName2,
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOds: {
          ods_Properties: [property1, property2],
          ods_IdentityProperties: [property1, property2],
        },
      },
    });

    const domainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      referencedEntity: domainEntity,
      data: {
        edfiOds: {
          ods_Name: domainEntityPropertyName,
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(domainEntityProperty);
    columns = columnCreator.createColumns(domainEntityProperty, BuildStrategyDefault);
  });

  it('should return two columns', () => {
    expect(columns).toHaveLength(2);
  });

  it('should return a primary key column for first property', () => {
    expect(columns[0].type).toBe('integer');
    expect(columns[0].dataType).toBe('[INT]');
    expect(columns[0].name).toBe(propertyName1);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].sourceEntityProperties[0]).toBe(property1);
    expect(columns[0].referenceContext).toBe(domainEntityPropertyName);
  });

  it('should return a primary key column for second property', () => {
    expect(columns[1].type).toBe('integer');
    expect(columns[1].dataType).toBe('[INT]');
    expect(columns[1].name).toBe(propertyName2);
    expect(columns[1].description).toBe(propertyDocumentation);
    expect(columns[1].isNullable).toBe(false);
    expect(columns[1].isPartOfPrimaryKey).toBe(true);
    expect(columns[1].sourceEntityProperties[0]).toBe(property2);
    expect(columns[0].referenceContext).toBe(domainEntityPropertyName);
  });
});

describe('when creating columns for identity reference property that references entity with identity reference property', () => {
  const domainEntityPropertyName1: string = 'DomainEntityPropertyName1';
  const domainEntityPropertyName2: string = 'DomainEntityPropertyName2';
  const propertyName1: string = 'PropertyName1';
  const propertyDocumentation: string = 'PropertyDocumentation';
  let property: IntegerProperty;
  let columns: Array<Column>;

  beforeAll(() => {
    property = Object.assign(newIntegerProperty(), {
      metaEdName: propertyName1,
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      data: {
        edfiOds: {
          ods_ContextPrefix: '',
          ods_IsIdentityDatabaseType: false,
          ods_IsUniqueIndex: false,
        },
      },
    });

    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOds: {
          ods_Properties: [property],
          ods_IdentityProperties: [property],
        },
      },
    });

    const domainEntityProperty1: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      referencedEntity: domainEntity1,
      data: {
        edfiOds: {
          ods_Name: domainEntityPropertyName1,
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });

    const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      data: {
        edfiOds: {
          ods_Properties: [domainEntityProperty1],
          ods_IdentityProperties: [domainEntityProperty1],
        },
      },
    });

    const domainEntityProperty2: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      referencedEntity: domainEntity2,
      data: {
        edfiOds: {
          ods_Name: domainEntityPropertyName2,
          ods_ContextPrefix: '',
          ods_IsCollection: false,
        },
      },
    });

    const columnCreator: ColumnCreator = columnCreatorFactory.columnCreatorFor(domainEntityProperty2);
    columns = columnCreator.createColumns(domainEntityProperty2, BuildStrategyDefault);
  });

  it('should return a primary key column', () => {
    expect(columns).toHaveLength(1);
    expect(columns[0].type).toBe('integer');
    expect(columns[0].dataType).toBe('[INT]');
    expect(columns[0].name).toBe(propertyName1);
    expect(columns[0].description).toBe(propertyDocumentation);
    expect(columns[0].isNullable).toBe(false);
    expect(columns[0].isPartOfPrimaryKey).toBe(true);
    expect(columns[0].sourceEntityProperties[0]).toBe(property);
    expect(columns[0].referenceContext).toBe(domainEntityPropertyName2 + domainEntityPropertyName1);
  });
});
