// @flow
import { newDomainEntityProperty } from 'metaed-core';
import type { DomainEntityProperty, EntityProperty } from 'metaed-core';
import {
  addMergedReferenceContext,
  addSourceEntityProperty,
  columnConstraintMerge,
  initializeColumn,
  newIntegerColumn,
} from '../../../src/model/database/Column';
import type { EntityPropertyEdfiOds } from '../../../src/model/property/EntityProperty';
import type { Column } from '../../../src/model/database/Column';

describe('when merging column constraints on existing primary key column', () => {
  const integerColumnName1: string = 'IntegerColumnName1';
  let column: Column;

  beforeAll(() => {
    const domainEntityPropertyName1: string = 'DomainEntityPropertyName1';
    const domainEntityPropertyName2: string = 'DomainEntityPropertyName2';
    const domainEntityPropertyName3: string = 'DomainEntityPropertyName3';
    const domainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName1,
    });

    column = columnConstraintMerge(
      Object.assign(newIntegerColumn(), {
        name: integerColumnName1,
        isPartOfAlternateKey: true,
        isPartOfPrimaryKey: true,
        isUniqueIndex: true,
        isNullable: false,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName2 }),
        ],
        mergedReferenceContexts: [
          domainEntityPropertyName1,
          domainEntityPropertyName2,
        ],
      }),
      Object.assign(newIntegerColumn(), {
        name: 'IntegerColumnName2',
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
        isNullable: false,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName3 }),
        ],
        mergedReferenceContexts: [
          domainEntityPropertyName1,
          domainEntityPropertyName3,
        ],
      }),
    );
  });

  it('should return the existing column', () => {
    expect(column.name).toBe(integerColumnName1);
  });

  it('should be part of alternate key', () => {
    expect(column.isPartOfAlternateKey).toBe(true);
  });

  it('should be part of primary key', () => {
    expect(column.isPartOfPrimaryKey).toBe(true);
  });

  it('should be part of unique index', () => {
    expect(column.isUniqueIndex).toBe(true);
  });

  it('should not be nullable', () => {
    expect(column.isNullable).toBe(false);
  });

  it('should merge reference contexts', () => {
    expect(column.mergedReferenceContexts).toHaveLength(3);
  });

  it('should merge source entity properties', () => {
    expect(column.sourceEntityProperties).toHaveLength(3);
  });
});

describe('when merging column constraints on received primary key column', () => {
  const integerColumnName1: string = 'IntegerColumnName1';
  let column: Column;

  beforeAll(() => {
    const domainEntityPropertyName1: string = 'DomainEntityPropertyName1';
    const domainEntityPropertyName2: string = 'DomainEntityPropertyName2';
    const domainEntityPropertyName3: string = 'DomainEntityPropertyName3';
    const domainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName1,
    });

    column = columnConstraintMerge(
      Object.assign(newIntegerColumn(), {
        name: integerColumnName1,
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
        isNullable: false,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName2 }),
        ],
        mergedReferenceContexts: [
          domainEntityPropertyName1,
          domainEntityPropertyName2,
        ],
      }),
      Object.assign(newIntegerColumn(), {
        name: 'IntegerColumnName2',
        isPartOfAlternateKey: true,
        isPartOfPrimaryKey: true,
        isUniqueIndex: true,
        isNullable: false,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName3 }),
        ],
        mergedReferenceContexts: [
          domainEntityPropertyName1,
          domainEntityPropertyName3,
        ],
      }),
    );
  });

  it('should return the existing column', () => {
    expect(column.name).toBe(integerColumnName1);
  });

  it('should be part of alternate key', () => {
    expect(column.isPartOfAlternateKey).toBe(true);
  });

  it('should be part of primary key', () => {
    expect(column.isPartOfPrimaryKey).toBe(true);
  });

  it('should be part of unique index', () => {
    expect(column.isUniqueIndex).toBe(true);
  });

  it('should not be nullable', () => {
    expect(column.isNullable).toBe(false);
  });

  it('should merge reference contexts', () => {
    expect(column.mergedReferenceContexts).toHaveLength(3);
  });

  it('should merge source entity properties', () => {
    expect(column.sourceEntityProperties).toHaveLength(3);
  });
});

describe('when merging column constraints on existing non nullable column', () => {
  const integerColumnName1: string = 'IntegerColumnName1';
  let column: Column;

  beforeAll(() => {
    const domainEntityPropertyName1: string = 'DomainEntityPropertyName1';
    const domainEntityPropertyName2: string = 'DomainEntityPropertyName2';
    const domainEntityPropertyName3: string = 'DomainEntityPropertyName3';
    const domainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName1,
    });

    column = columnConstraintMerge(
      Object.assign(newIntegerColumn(), {
        name: integerColumnName1,
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
        isNullable: false,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName2 }),
        ],
        mergedReferenceContexts: [
          domainEntityPropertyName1,
          domainEntityPropertyName2,
        ],
      }),
      Object.assign(newIntegerColumn(), {
        name: 'IntegerColumnName2',
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
        isNullable: true,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName3 }),
        ],
        mergedReferenceContexts: [
          domainEntityPropertyName1,
          domainEntityPropertyName3,
        ],
      }),
    );
  });

  it('should return the existing column', () => {
    expect(column.name).toBe(integerColumnName1);
  });

  it('should be part of alternate key', () => {
    expect(column.isPartOfAlternateKey).toBe(false);
  });

  it('should be part of primary key', () => {
    expect(column.isPartOfPrimaryKey).toBe(false);
  });

  it('should be part of unique index', () => {
    expect(column.isUniqueIndex).toBe(false);
  });

  it('should not be nullable', () => {
    expect(column.isNullable).toBe(false);
  });

  it('should merge reference contexts', () => {
    expect(column.mergedReferenceContexts).toHaveLength(3);
  });

  it('should merge source entity properties', () => {
    expect(column.sourceEntityProperties).toHaveLength(3);
  });
});

describe('when merging column constraints on received non nullable column', () => {
  const integerColumnName1: string = 'IntegerColumnName1';
  let column: Column;

  beforeAll(() => {
    const domainEntityPropertyName1: string = 'DomainEntityPropertyName1';
    const domainEntityPropertyName2: string = 'DomainEntityPropertyName2';
    const domainEntityPropertyName3: string = 'DomainEntityPropertyName3';
    const domainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName1,
    });

    column = columnConstraintMerge(
      Object.assign(newIntegerColumn(), {
        name: integerColumnName1,
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
        isNullable: true,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName2 }),
        ],
        mergedReferenceContexts: [
          domainEntityPropertyName1,
          domainEntityPropertyName2,
        ],
      }),
      Object.assign(newIntegerColumn(), {
        name: 'IntegerColumnName2',
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
        isNullable: false,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName3 }),
        ],
        mergedReferenceContexts: [
          domainEntityPropertyName1,
          domainEntityPropertyName3,
        ],
      }),
    );
  });

  it('should return the existing column', () => {
    expect(column.name).toBe(integerColumnName1);
  });

  it('should be part of alternate key', () => {
    expect(column.isPartOfAlternateKey).toBe(false);
  });

  it('should be part of primary key', () => {
    expect(column.isPartOfPrimaryKey).toBe(false);
  });

  it('should be part of unique index', () => {
    expect(column.isUniqueIndex).toBe(false);
  });

  it('should not be nullable', () => {
    expect(column.isNullable).toBe(false);
  });

  it('should merge reference contexts', () => {
    expect(column.mergedReferenceContexts).toHaveLength(3);
  });

  it('should merge source entity properties', () => {
    expect(column.sourceEntityProperties).toHaveLength(3);
  });
});

describe('when merging column constraints on nullable column', () => {
  const integerColumnName1: string = 'IntegerColumnName1';
  let column: Column;

  beforeAll(() => {
    const domainEntityPropertyName1: string = 'DomainEntityPropertyName1';
    const domainEntityPropertyName2: string = 'DomainEntityPropertyName2';
    const domainEntityPropertyName3: string = 'DomainEntityPropertyName3';
    const domainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName1,
    });

    column = columnConstraintMerge(
      Object.assign(newIntegerColumn(), {
        name: integerColumnName1,
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
        isNullable: true,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName2 }),
        ],
        mergedReferenceContexts: [
          domainEntityPropertyName1,
          domainEntityPropertyName2,
        ],
      }),
      Object.assign(newIntegerColumn(), {
        name: 'IntegerColumnName2',
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
        isNullable: true,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName3 }),
        ],
        mergedReferenceContexts: [
          domainEntityPropertyName1,
          domainEntityPropertyName3,
        ],
      }),
    );
  });

  it('should return the existing column', () => {
    expect(column.name).toBe(integerColumnName1);
  });

  it('should be part of alternate key', () => {
    expect(column.isPartOfAlternateKey).toBe(false);
  });

  it('should be part of primary key', () => {
    expect(column.isPartOfPrimaryKey).toBe(false);
  });

  it('should be part of unique index', () => {
    expect(column.isUniqueIndex).toBe(false);
  });

  it('should not be nullable', () => {
    expect(column.isNullable).toBe(true);
  });

  it('should merge reference contexts', () => {
    expect(column.mergedReferenceContexts).toHaveLength(3);
  });

  it('should merge source entity properties', () => {
    expect(column.sourceEntityProperties).toHaveLength(3);
  });
});

describe('when using initialize column', () => {
  const mockColumnNamer = jest.fn(() => 'MockColumnNamer');
  const propertyDocumentation: string = 'PropertyDocumentation';
  const contextPrefix: string = 'ContextPrefix';
  let domainEntityProperty: DomainEntityProperty;
  let column: Column;

  beforeAll(() => {
    const domainEntityPropertyName1: string = 'DomainEntityPropertyName1';
    domainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName1,
      documentation: propertyDocumentation,
      isPartOfIdentity: true,
      isOptional: true,
      data: {
        edfiOds: {
          ods_IsIdentityDatabaseType: true,
          ods_ContextPrefix: contextPrefix,
          ods_IsUniqueIndex: true,
        },
      },
    });

    column = newIntegerColumn();
    initializeColumn(column, ((domainEntityProperty: any): (EntityPropertyEdfiOds & EntityProperty)), mockColumnNamer, false);
  });

  it('should call column namer', () => {
    expect(mockColumnNamer).toBeCalled();
  });

  it('should be part of alternate key', () => {
    expect(column.description).toBe(propertyDocumentation);
  });

  it('should be part of alternate key', () => {
    expect(column.isIdentityDatabaseType).toBe(true);
  });

  it('should be part of primary key', () => {
    expect(column.isPartOfPrimaryKey).toBe(true);
  });

  it('should be part of unique index', () => {
    expect(column.isNullable).toBe(true);
  });

  it('should not be nullable', () => {
    expect(column.originalContextPrefix).toBe(contextPrefix);
  });

  it('should merge reference contexts', () => {
    expect(column.isUniqueIndex).toBe(true);
  });

  it('should merge source entity properties', () => {
    expect(column.sourceEntityProperties[0]).toBe(domainEntityProperty);
  });
});

describe('when using add source entity property to a column with no existing duplicate', () => {
  const domainEntityPropertyName: string = 'DomainEntityPropertyName';
  let column: Column;

  beforeAll(() => {
    column = Object.assign(newIntegerColumn(), { name: 'IntegerColumnName' });
    addSourceEntityProperty(column, Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName,
    }));
  });

  it('should successfully add source entity property', () => {
    expect(column.sourceEntityProperties).toHaveLength(1);
    expect(column.sourceEntityProperties[0].metaEdName).toBe(domainEntityPropertyName);
  });
});

describe('when using add source entity property to a column with existing duplicate', () => {
  const domainEntityPropertyName: string = 'DomainEntityPropertyName';
  let column: Column;

  beforeAll(() => {
    column = Object.assign(newIntegerColumn(), { name: 'IntegerColumnName' });
    addSourceEntityProperty(column, Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName,
    }));
    addSourceEntityProperty(column, Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName,
    }));
  });

  it('should reject incoming source entity property', () => {
    expect(column.sourceEntityProperties).toHaveLength(1);
    expect(column.sourceEntityProperties[0].metaEdName).toBe(domainEntityPropertyName);
  });
});

describe('when using add merged reference context to a column with no existing duplicate', () => {
  const domainEntityPropertyName: string = 'DomainEntityPropertyName';
  let column: Column;

  beforeAll(() => {
    column = Object.assign(newIntegerColumn(), { name: 'IntegerColumnName' });
    addMergedReferenceContext(column, domainEntityPropertyName);
  });

  it('should successfully add merged reference context', () => {
    expect(column.mergedReferenceContexts).toHaveLength(1);
    expect(column.mergedReferenceContexts[0]).toBe(domainEntityPropertyName);
  });
});

describe('when using add merged reference context to a column with existing duplicate', () => {
  const domainEntityPropertyName: string = 'DomainEntityPropertyName';
  let column: Column;

  beforeAll(() => {
    column = Object.assign(newIntegerColumn(), { name: 'IntegerColumnName' });
    addMergedReferenceContext(column, domainEntityPropertyName);
    addMergedReferenceContext(column, domainEntityPropertyName);
  });

  it('should reject incoming merged reference context', () => {
    expect(column.mergedReferenceContexts).toHaveLength(1);
    expect(column.mergedReferenceContexts[0]).toBe(domainEntityPropertyName);
  });
});
