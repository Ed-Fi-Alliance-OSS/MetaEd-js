// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { newDomainEntityProperty } from '@edfi/metaed-core';
import { DomainEntityProperty } from '@edfi/metaed-core';
import {
  addMergedReferenceContext,
  addSourceEntityProperty,
  columnConstraintMerge,
  newColumn,
} from '../../../src/model/database/Column';
import { Column } from '../../../src/model/database/Column';

describe('when merging column constraints on existing primary key column', (): void => {
  const integerColumnName1 = 'IntegerColumnName1';
  let column: Column;

  beforeAll(() => {
    const domainEntityPropertyName1 = 'DomainEntityPropertyName1';
    const domainEntityPropertyName2 = 'DomainEntityPropertyName2';
    const domainEntityPropertyName3 = 'DomainEntityPropertyName3';
    const domainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName1,
    });

    column = columnConstraintMerge(
      {
        ...newColumn(),
        type: 'integer',
        columnId: integerColumnName1,
        isPartOfAlternateKey: true,
        isPartOfPrimaryKey: true,
        isUniqueIndex: true,
        isNullable: false,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName2 }),
        ],
        mergedReferenceContexts: [domainEntityPropertyName1, domainEntityPropertyName2],
      },
      {
        ...newColumn(),
        type: 'integer',
        columnId: 'IntegerColumnName2',
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
        isNullable: false,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName3 }),
        ],
        mergedReferenceContexts: [domainEntityPropertyName1, domainEntityPropertyName3],
      },
    );
  });

  it('should return the existing column', (): void => {
    expect(column.columnId).toBe(integerColumnName1);
  });

  it('should be part of alternate key', (): void => {
    expect(column.isPartOfAlternateKey).toBe(true);
  });

  it('should be part of primary key', (): void => {
    expect(column.isPartOfPrimaryKey).toBe(true);
  });

  it('should be part of unique index', (): void => {
    expect(column.isUniqueIndex).toBe(true);
  });

  it('should not be nullable', (): void => {
    expect(column.isNullable).toBe(false);
  });

  it('should merge reference contexts', (): void => {
    expect(column.mergedReferenceContexts).toHaveLength(3);
  });

  it('should merge source entity properties', (): void => {
    expect(column.sourceEntityProperties).toHaveLength(3);
  });
});

describe('when merging column constraints on received primary key column', (): void => {
  const integerColumnName1 = 'IntegerColumnName1';
  let column: Column;

  beforeAll(() => {
    const domainEntityPropertyName1 = 'DomainEntityPropertyName1';
    const domainEntityPropertyName2 = 'DomainEntityPropertyName2';
    const domainEntityPropertyName3 = 'DomainEntityPropertyName3';
    const domainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName1,
    });

    column = columnConstraintMerge(
      {
        ...newColumn(),
        type: 'integer',
        columnId: integerColumnName1,
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
        isNullable: false,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName2 }),
        ],
        mergedReferenceContexts: [domainEntityPropertyName1, domainEntityPropertyName2],
      },
      {
        ...newColumn(),
        type: 'integer',
        columnId: 'IntegerColumnName2',
        isPartOfAlternateKey: true,
        isPartOfPrimaryKey: true,
        isUniqueIndex: true,
        isNullable: false,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName3 }),
        ],
        mergedReferenceContexts: [domainEntityPropertyName1, domainEntityPropertyName3],
      },
    );
  });

  it('should return the existing column', (): void => {
    expect(column.columnId).toBe(integerColumnName1);
  });

  it('should be part of alternate key', (): void => {
    expect(column.isPartOfAlternateKey).toBe(true);
  });

  it('should be part of primary key', (): void => {
    expect(column.isPartOfPrimaryKey).toBe(true);
  });

  it('should be part of unique index', (): void => {
    expect(column.isUniqueIndex).toBe(true);
  });

  it('should not be nullable', (): void => {
    expect(column.isNullable).toBe(false);
  });

  it('should merge reference contexts', (): void => {
    expect(column.mergedReferenceContexts).toHaveLength(3);
  });

  it('should merge source entity properties', (): void => {
    expect(column.sourceEntityProperties).toHaveLength(3);
  });
});

describe('when merging column constraints on existing non nullable column', (): void => {
  const integerColumnName1 = 'IntegerColumnName1';
  let column: Column;

  beforeAll(() => {
    const domainEntityPropertyName1 = 'DomainEntityPropertyName1';
    const domainEntityPropertyName2 = 'DomainEntityPropertyName2';
    const domainEntityPropertyName3 = 'DomainEntityPropertyName3';
    const domainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName1,
    });

    column = columnConstraintMerge(
      {
        ...newColumn(),
        type: 'integer',
        columnId: integerColumnName1,
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
        isNullable: false,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName2 }),
        ],
        mergedReferenceContexts: [domainEntityPropertyName1, domainEntityPropertyName2],
      },
      {
        ...newColumn(),
        type: 'integer',
        columnId: 'IntegerColumnName2',
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
        isNullable: true,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName3 }),
        ],
        mergedReferenceContexts: [domainEntityPropertyName1, domainEntityPropertyName3],
      },
    );
  });

  it('should return the existing column', (): void => {
    expect(column.columnId).toBe(integerColumnName1);
  });

  it('should be part of alternate key', (): void => {
    expect(column.isPartOfAlternateKey).toBe(false);
  });

  it('should be part of primary key', (): void => {
    expect(column.isPartOfPrimaryKey).toBe(false);
  });

  it('should be part of unique index', (): void => {
    expect(column.isUniqueIndex).toBe(false);
  });

  it('should not be nullable', (): void => {
    expect(column.isNullable).toBe(false);
  });

  it('should merge reference contexts', (): void => {
    expect(column.mergedReferenceContexts).toHaveLength(3);
  });

  it('should merge source entity properties', (): void => {
    expect(column.sourceEntityProperties).toHaveLength(3);
  });
});

describe('when merging column constraints on received non nullable column', (): void => {
  const integerColumnName1 = 'IntegerColumnName1';
  let column: Column;

  beforeAll(() => {
    const domainEntityPropertyName1 = 'DomainEntityPropertyName1';
    const domainEntityPropertyName2 = 'DomainEntityPropertyName2';
    const domainEntityPropertyName3 = 'DomainEntityPropertyName3';
    const domainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName1,
    });

    column = columnConstraintMerge(
      {
        ...newColumn(),
        type: 'integer',
        columnId: integerColumnName1,
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
        isNullable: true,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName2 }),
        ],
        mergedReferenceContexts: [domainEntityPropertyName1, domainEntityPropertyName2],
      },
      {
        ...newColumn(),
        type: 'integer',
        columnId: 'IntegerColumnName2',
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
        isNullable: false,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName3 }),
        ],
        mergedReferenceContexts: [domainEntityPropertyName1, domainEntityPropertyName3],
      },
    );
  });

  it('should return the existing column', (): void => {
    expect(column.columnId).toBe(integerColumnName1);
  });

  it('should be part of alternate key', (): void => {
    expect(column.isPartOfAlternateKey).toBe(false);
  });

  it('should be part of primary key', (): void => {
    expect(column.isPartOfPrimaryKey).toBe(false);
  });

  it('should be part of unique index', (): void => {
    expect(column.isUniqueIndex).toBe(false);
  });

  it('should not be nullable', (): void => {
    expect(column.isNullable).toBe(false);
  });

  it('should merge reference contexts', (): void => {
    expect(column.mergedReferenceContexts).toHaveLength(3);
  });

  it('should merge source entity properties', (): void => {
    expect(column.sourceEntityProperties).toHaveLength(3);
  });
});

describe('when merging column constraints on nullable column', (): void => {
  const integerColumnName1 = 'IntegerColumnName1';
  let column: Column;

  beforeAll(() => {
    const domainEntityPropertyName1 = 'DomainEntityPropertyName1';
    const domainEntityPropertyName2 = 'DomainEntityPropertyName2';
    const domainEntityPropertyName3 = 'DomainEntityPropertyName3';
    const domainEntityProperty: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityPropertyName1,
    });

    column = columnConstraintMerge(
      {
        ...newColumn(),
        type: 'integer',
        columnId: integerColumnName1,
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
        isNullable: true,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName2 }),
        ],
        mergedReferenceContexts: [domainEntityPropertyName1, domainEntityPropertyName2],
      },
      {
        ...newColumn(),
        type: 'integer',
        columnId: 'IntegerColumnName2',
        isPartOfAlternateKey: false,
        isPartOfPrimaryKey: false,
        isUniqueIndex: false,
        isNullable: true,
        sourceEntityProperties: [
          domainEntityProperty,
          Object.assign(newDomainEntityProperty(), { metaEdName: domainEntityPropertyName3 }),
        ],
        mergedReferenceContexts: [domainEntityPropertyName1, domainEntityPropertyName3],
      },
    );
  });

  it('should return the existing column', (): void => {
    expect(column.columnId).toBe(integerColumnName1);
  });

  it('should be part of alternate key', (): void => {
    expect(column.isPartOfAlternateKey).toBe(false);
  });

  it('should be part of primary key', (): void => {
    expect(column.isPartOfPrimaryKey).toBe(false);
  });

  it('should be part of unique index', (): void => {
    expect(column.isUniqueIndex).toBe(false);
  });

  it('should not be nullable', (): void => {
    expect(column.isNullable).toBe(true);
  });

  it('should merge reference contexts', (): void => {
    expect(column.mergedReferenceContexts).toHaveLength(3);
  });

  it('should merge source entity properties', (): void => {
    expect(column.sourceEntityProperties).toHaveLength(3);
  });
});

describe('when using add source entity property to a column with no existing duplicate', (): void => {
  const domainEntityPropertyName = 'DomainEntityPropertyName';
  let column: Column;

  beforeAll(() => {
    column = { ...newColumn(), type: 'integer', columnId: 'IntegerColumnName' };
    addSourceEntityProperty(
      column,
      Object.assign(newDomainEntityProperty(), {
        metaEdName: domainEntityPropertyName,
      }),
    );
  });

  it('should successfully add source entity property', (): void => {
    expect(column.sourceEntityProperties).toHaveLength(1);
    expect(column.sourceEntityProperties[0].metaEdName).toBe(domainEntityPropertyName);
  });
});

describe('when using add source entity property to a column with existing duplicate', (): void => {
  const domainEntityPropertyName = 'DomainEntityPropertyName';
  let column: Column;

  beforeAll(() => {
    column = { ...newColumn(), type: 'integer', columnId: 'IntegerColumnName' };
    addSourceEntityProperty(
      column,
      Object.assign(newDomainEntityProperty(), {
        metaEdName: domainEntityPropertyName,
      }),
    );
    addSourceEntityProperty(
      column,
      Object.assign(newDomainEntityProperty(), {
        metaEdName: domainEntityPropertyName,
      }),
    );
  });

  it('should reject incoming source entity property', (): void => {
    expect(column.sourceEntityProperties).toHaveLength(1);
    expect(column.sourceEntityProperties[0].metaEdName).toBe(domainEntityPropertyName);
  });
});

describe('when using add merged reference context to a column with no existing duplicate', (): void => {
  const domainEntityPropertyName = 'DomainEntityPropertyName';
  let column: Column;

  beforeAll(() => {
    column = { ...newColumn(), type: 'integer', columnId: 'IntegerColumnName' };
    addMergedReferenceContext(column, domainEntityPropertyName);
  });

  it('should successfully add merged reference context', (): void => {
    expect(column.mergedReferenceContexts).toHaveLength(1);
    expect(column.mergedReferenceContexts[0]).toBe(domainEntityPropertyName);
  });
});

describe('when using add merged reference context to a column with existing duplicate', (): void => {
  const domainEntityPropertyName = 'DomainEntityPropertyName';
  let column: Column;

  beforeAll(() => {
    column = { ...newColumn(), type: 'integer', columnId: 'IntegerColumnName' };
    addMergedReferenceContext(column, domainEntityPropertyName);
    addMergedReferenceContext(column, domainEntityPropertyName);
  });

  it('should reject incoming merged reference context', (): void => {
    expect(column.mergedReferenceContexts).toHaveLength(1);
    expect(column.mergedReferenceContexts[0]).toBe(domainEntityPropertyName);
  });
});
