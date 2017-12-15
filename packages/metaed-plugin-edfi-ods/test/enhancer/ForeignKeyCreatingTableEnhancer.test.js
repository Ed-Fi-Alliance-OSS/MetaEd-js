// @flow
import R from 'ramda';
import {
  newDomainEntity,
  newDomainEntityProperty,
  newIntegerProperty,
  newMergedProperty,
  newMetaEdEnvironment,
} from 'metaed-core';
import type {
  DomainEntity,
  DomainEntityProperty,
  IntegerProperty,
  MetaEdEnvironment,
} from 'metaed-core';
import { enhance as initializeEdFiOdsEntityRepository } from '../../src/model/EdFiOdsEntityRepository';
import { newTable } from '../../src/model/database/Table';
import { newIntegerColumn } from '../../src/model/database/Column';
import {
  enhance,
  getMatchingColumnFromSourceEntityProperties,
  getMergePropertyColumn,
  getReferencePropertiesAndAssociatedColumns,
} from '../../src/enhancer/ForeignKeyCreatingTableEnhancer';

import type { Column } from '../../src/model/database/Column';
import type { PropertyColumnPair } from '../../src/enhancer/ForeignKeyCreatingTableEnhancer';
import type { Table } from '../../src/model/database/Table';

describe('when using get reference properties and associated columns with non reference properties', () => {
  let propertyColumnPair: Array<PropertyColumnPair>;
  const domainEntityPropertyName1: string = 'DomainEntityPropertyName1';
  const domainEntityPropertyName2: string = 'DomainEntityPropertyName2';
  const columnName1: string = 'ColumnName1';
  const columnName2: string = 'ColumnName2';

  beforeAll(() => {
    const table: Table = Object.assign(newTable(), {
      columns: [
        Object.assign(newIntegerColumn(), {
          name: columnName1,
          sourceEntityProperties: [
            Object.assign(newDomainEntityProperty(), {
              metaEdName: domainEntityPropertyName1,
            }),
            Object.assign(newIntegerProperty(), {
              metaEdName: 'IntegerPropertyName2',
            }),
          ],
        }),
        Object.assign(newIntegerColumn(), {
          name: columnName2,
          sourceEntityProperties: [
            Object.assign(newDomainEntityProperty(), {
              metaEdName: domainEntityPropertyName2,
            }),
            Object.assign(newIntegerProperty(), {
              metaEdName: 'IntegerPropertyName2',
            }),
          ],
        }),
      ],
    });
    propertyColumnPair = getReferencePropertiesAndAssociatedColumns(table);
  });

  it('should return two property column pairs', () => {
    expect(propertyColumnPair).toBeDefined();
    expect(propertyColumnPair).toHaveLength(2);
  });

  it('should have first reference pair', () => {
    expect(R.head(propertyColumnPair).columns).toHaveLength(1);
    expect(R.head(propertyColumnPair).property.metaEdName).toBe(domainEntityPropertyName1);
    expect(R.head(R.head(propertyColumnPair).columns).name).toBe(columnName1);
  });

  it('should have second reference pair', () => {
    expect(R.last(propertyColumnPair).columns).toHaveLength(1);
    expect(R.last(propertyColumnPair).property.metaEdName).toBe(domainEntityPropertyName2);
    expect(R.head(R.last(propertyColumnPair).columns).name).toBe(columnName2);
  });
});

describe('when using get reference properties and associated columns with weak reference properties', () => {
  let propertyColumnPair: Array<PropertyColumnPair>;
  const domainEntityPropertyName: string = 'DomainEntityPropertyName';
  const columnName1: string = 'ColumnName1';

  beforeAll(() => {
    const table: Table = Object.assign(newTable(), {
      columns: [
        Object.assign(newIntegerColumn(), {
          name: columnName1,
          sourceEntityProperties: [
            Object.assign(newDomainEntityProperty(), {
              metaEdName: domainEntityPropertyName,
            }),
          ],
        }),
        Object.assign(newIntegerColumn(), {
          name: 'ColumnName2',
          sourceEntityProperties: [
            Object.assign(newDomainEntityProperty(), {
              metaEdName: 'WeakReferencePropertyName',
              isWeak: true,
            }),
          ],
        }),
      ],
    });
    propertyColumnPair = getReferencePropertiesAndAssociatedColumns(table);
  });

  it('should only return strong reference property column pair', () => {
    expect(propertyColumnPair).toBeDefined();
    expect(R.head(propertyColumnPair).columns).toHaveLength(1);
    expect(R.head(propertyColumnPair).property.metaEdName).toBe(domainEntityPropertyName);
    expect(R.head(R.head(propertyColumnPair).columns).name).toBe(columnName1);
  });
});

describe('when using get reference properties and associated columns', () => {
  let propertyColumnPair: Array<PropertyColumnPair>;
  const domainEntityPropertyName1: string = 'DomainEntityPropertyName1';
  const domainEntityPropertyName2: string = 'DomainEntityPropertyName2';
  const columnName1: string = 'ColumnName1';
  const columnName2: string = 'ColumnName2';

  beforeAll(() => {
    const table: Table = Object.assign(newTable(), {
      columns: [
        Object.assign(newIntegerColumn(), {
          name: columnName1,
          sourceEntityProperties: [
            Object.assign(newDomainEntityProperty(), {
              metaEdName: domainEntityPropertyName1,
            }),
            Object.assign(newDomainEntityProperty(), {
              metaEdName: domainEntityPropertyName2,
            }),
          ],
        }),
        Object.assign(newIntegerColumn(), {
          name: columnName2,
          sourceEntityProperties: [
            Object.assign(newDomainEntityProperty(), {
              metaEdName: domainEntityPropertyName1,
            }),
          ],
        }),
      ],
    });
    propertyColumnPair = getReferencePropertiesAndAssociatedColumns(table);
  });

  it('should return two property column pairs', () => {
    expect(propertyColumnPair).toBeDefined();
    expect(propertyColumnPair).toHaveLength(2);
  });

  it('should have first pair with two columns', () => {
    expect(R.head(propertyColumnPair).columns).toHaveLength(2);
    expect(R.head(propertyColumnPair).property.metaEdName).toBe(domainEntityPropertyName1);
    expect(R.head(R.head(propertyColumnPair).columns).name).toBe(columnName1);
    expect(R.last(R.head(propertyColumnPair).columns).name).toBe(columnName2);
  });

  it('should have second pair with one column', () => {
    expect(R.last(propertyColumnPair).columns).toHaveLength(1);
    expect(R.last(propertyColumnPair).property.metaEdName).toBe(domainEntityPropertyName2);
    expect(R.head(R.last(propertyColumnPair).columns).name).toBe(columnName1);
  });
});

describe('when using get matching column from source entity properties with no matching source entity properties', () => {
  let column: ?Column;

  beforeAll(() => {
    const integerPropertyName1: string = 'IntegerPropertyName1';
    const integerColumn1: Column = Object.assign(newIntegerColumn(), {
      name: 'IntegerColumnName1',
      sourceEntityProperties: [
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName1 }),
      ],
      referenceContext: integerPropertyName1,
      mergedReferenceContexts: [
        integerPropertyName1,
      ],
    });

    const integerPropertyName2: string = 'IntegerPropertyName2';
    const integerColumn2: Column = Object.assign(newIntegerColumn(), {
      name: 'IntegerColumnName2',
      sourceEntityProperties: [
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName2 }),
      ],
      referenceContext: integerPropertyName2,
      mergedReferenceContexts: [
        integerPropertyName2,
      ],
    });

    const integerPropertyName3: string = 'IntegerPropertyName3';
    const integerColumn3: Column = Object.assign(newIntegerColumn(), {
      name: 'IntegerColumnName3',
      sourceEntityProperties: [
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName3 }),
      ],
      referenceContext: integerPropertyName3,
      mergedReferenceContexts: [
        integerPropertyName3,
      ],
    });

    column = getMatchingColumnFromSourceEntityProperties(integerColumn1, [integerColumn2, integerColumn3]);
  });

  it('should return null', () => {
    expect(column).toBeUndefined();
  });
});

describe('when using get matching column from source entity properties with matching source entity property only', () => {
  let column: ?Column;
  let matchingColumn: Column;

  beforeAll(() => {
    const matchingIntegerPropertyName: string = 'MatchingIntegerPropertyName';
    const matchingIntegerProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: matchingIntegerPropertyName,
    });

    const columnToMatch: Column = Object.assign(newIntegerColumn(), {
      name: 'ColumnToMatch',
      sourceEntityProperties: [
        matchingIntegerProperty,
        Object.assign(newIntegerProperty(), { metaEdName: 'IntegerPropertyName1' }),
      ],
      referenceContext: matchingIntegerPropertyName,
      mergedReferenceContexts: [
        matchingIntegerPropertyName,
      ],
    });

    const integerPropertyName2: string = 'IntegerPropertyName2';
    matchingColumn = Object.assign(newIntegerColumn(), {
      name: 'MatchingColumn',
      sourceEntityProperties: [
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName2 }),
        matchingIntegerProperty,
      ],
      referenceContext: integerPropertyName2,
      mergedReferenceContexts: [
        integerPropertyName2,
      ],
    });

    const integerPropertyName3: string = 'IntegerPropertyName3';
    const integerColumn: Column = Object.assign(newIntegerColumn(), {
      name: 'IntegerColumnName',
      sourceEntityProperties: [
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName3 }),
      ],
      referenceContext: integerPropertyName3,
      mergedReferenceContexts: [
        integerPropertyName3,
      ],
    });

    column = getMatchingColumnFromSourceEntityProperties(columnToMatch, [matchingColumn, integerColumn]);
  });

  it('should return matching column', () => {
    expect(column).toBe(matchingColumn);
  });
});

describe('when using get matching column from source entity properties with matching source entity property and column name', () => {
  const matchingColumnName: string = 'MatchingColumnName';
  let matchingIntegerProperty: IntegerProperty;
  let column: ?Column;
  let matchingColumn1: Column;

  beforeAll(() => {
    const matchingIntegerPropertyName: string = 'MatchingIntegerPropertyName';
    matchingIntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: matchingIntegerPropertyName,
    });

    const integerPropertyName1: string = 'IntegerPropertyName1';
    const columnToMatch: Column = Object.assign(newIntegerColumn(), {
      name: matchingColumnName,
      sourceEntityProperties: [
        matchingIntegerProperty,
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName1 }),
      ],
      referenceContext: matchingIntegerPropertyName,
      mergedReferenceContexts: [
        integerPropertyName1,
      ],
    });

    const integerPropertyName2: string = 'IntegerPropertyName2';
    matchingColumn1 = Object.assign(newIntegerColumn(), {
      name: matchingColumnName,
      sourceEntityProperties: [
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName2 }),
        matchingIntegerProperty,
      ],
      referenceContext: integerPropertyName2,
      mergedReferenceContexts: [
        integerPropertyName2,
      ],
    });

    const integerPropertyName3: string = 'IntegerPropertyName3';
    const matchingColumn2: Column = Object.assign(newIntegerColumn(), {
      name: 'matchingColumnName2',
      sourceEntityProperties: [
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName3 }),
        matchingIntegerProperty,
      ],
      referenceContext: integerPropertyName2,
      mergedReferenceContexts: [
        integerPropertyName2,
      ],
    });

    const integerPropertyName4: string = 'IntegerPropertyName4';
    const integerColumn: Column = Object.assign(newIntegerColumn(), {
      name: 'IntegerColumnName',
      sourceEntityProperties: [
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName4 }),
      ],
      referenceContext: integerPropertyName3,
      mergedReferenceContexts: [
        integerPropertyName3,
      ],
    });

    column = getMatchingColumnFromSourceEntityProperties(columnToMatch, [matchingColumn1, integerColumn, matchingColumn2]);
  });

  it('should return matching column with same name', () => {
    expect(column).toBe(matchingColumn1);
  });
});

describe('when using get matching column from source entity properties with matching column', () => {
  const matchingColumnName: string = 'MatchingColumnName';
  let matchingIntegerProperty: IntegerProperty;
  let column: ?Column;

  beforeAll(() => {
    const matchingIntegerPropertyName: string = 'MatchingIntegerPropertyName';
    matchingIntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: matchingIntegerPropertyName,
    });

    const integerPropertyName1: string = 'IntegerPropertyName1';
    const columnToMatch: Column = Object.assign(newIntegerColumn(), {
      name: matchingColumnName,
      sourceEntityProperties: [
        matchingIntegerProperty,
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName1 }),
      ],
      referenceContext: matchingIntegerPropertyName,
      mergedReferenceContexts: [
        matchingIntegerPropertyName,
        integerPropertyName1,
      ],
    });

    const integerPropertyName2: string = 'IntegerPropertyName2';
    const matchingColumn: Column = Object.assign(newIntegerColumn(), {
      name: matchingColumnName,
      sourceEntityProperties: [
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName2 }),
        matchingIntegerProperty,
      ],
      referenceContext: integerPropertyName2,
      mergedReferenceContexts: [
        integerPropertyName2,
        matchingIntegerPropertyName,
      ],
    });

    const integerPropertyName3: string = 'IntegerPropertyName3';
    const integerColumn: Column = Object.assign(newIntegerColumn(), {
      name: 'IntegerColumnName',
      sourceEntityProperties: [
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName3 }),
      ],
      referenceContext: integerPropertyName3,
      mergedReferenceContexts: [
        integerPropertyName3,
      ],
    });

    column = getMatchingColumnFromSourceEntityProperties(columnToMatch, [matchingColumn, integerColumn]);
  });

  it('should return matching column', () => {
    expect(column).toBeDefined();
    expect(R.prop('name')(column)).toBe(matchingColumnName);
    expect(R.prop('sourceEntityProperties')(column)).toContain(matchingIntegerProperty);
  });
});

describe('when using get merge property column with property that is not included in column source properties', () => {
  let column: ?Column;

  beforeAll(() => {
    const domainEntity1Property3: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: 'DomainEntityName3',
      mergedProperties: [
        Object.assign(newMergedProperty(), {
          mergeProperty: newIntegerProperty(),
        }),
      ],
    });

    column = getMergePropertyColumn(newTable(), newIntegerColumn(), domainEntity1Property3);
  });

  it('should return undefined', () => {
    expect(column).toBeUndefined();
  });
});

describe('when using get merge property column with column that has invalid merge reference context and source property', () => {
  let column: ?Column;

  beforeAll(() => {
    const domainEntityName3: string = 'DomainEntityName3';
    const domainEntityName2: string = 'DomainEntityName2';
    const domainEntity1Property3: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
    });
    const mergedProperty = Object.assign(newMergedProperty(), {
      mergeProperty: domainEntity1Property3,
      mergePropertyPath: [domainEntityName3, domainEntityName2],
      targetPropertyPath: [domainEntityName2],
    });
    domainEntity1Property3.mergedProperties.push(mergedProperty);

    const referencedColumn: Column = Object.assign(newIntegerColumn(), {
      name: domainEntityName3,
      isPartOfPrimaryKey: true,
      sourceEntityProperties: [newIntegerProperty()],
      mergedReferenceContexts: ['InvalidReferenceContext'],
    });

    const referencedTable: Table = Object.assign(newTable(), {
      name: `DomainEntityName1${domainEntityName2}`,
      columns: [referencedColumn],
    });

    column = getMergePropertyColumn(referencedTable, referencedColumn, domainEntity1Property3);
  });

  it('should return undefined', () => {
    expect(column).toBeUndefined();
  });
});

describe('when using get merge property column with non reference target property', () => {
  const domainEntityName1: string = 'DomainEntityName1';
  const nonReferencePropertyName: string = 'NonReferencePropertyName';
  const domainEntityName3: string = 'DomainEntityName3';
  let domainEntityProperty: DomainEntityProperty;
  let column: ?Column;

  beforeAll(() => {
    const nonReferenceProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: nonReferencePropertyName,
    });

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName1,
      data: {
        edfiOds: {
          ods_TableName: domainEntityName1,
        },
      },
    });
    domainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      parentEntity: domainEntity,
    });
    const mergedProperty = Object.assign(newMergedProperty(), {
      mergeProperty: domainEntityProperty,
      targetProperty: nonReferenceProperty,
      mergePropertyPath: [domainEntityName3, nonReferencePropertyName],
      targetPropertyPath: [nonReferencePropertyName],
    });
    domainEntityProperty.mergedProperties.push(mergedProperty);

    const referencedColumn: Column = Object.assign(newIntegerColumn(), {
      name: domainEntityName3,
      isPartOfPrimaryKey: true,
      sourceEntityProperties: [domainEntityProperty],
      mergedReferenceContexts: [domainEntityName1 + nonReferencePropertyName],
    });

    const referencedTable: Table = Object.assign(newTable(), {
      name: domainEntityName1 + nonReferencePropertyName,
      columns: [referencedColumn],
    });

    column = getMergePropertyColumn(referencedTable, referencedColumn, domainEntityProperty);
  });

  it('should return undefined', () => {
    expect(column).toBeUndefined();
  });
});

describe('when using get merge property column with reference property', () => {
  const domainEntityName1: string = 'DomainEntityName1';
  const domainEntityName2: string = 'DomainEntityName2';
  const domainEntityName3: string = 'DomainEntityName3';
  let domainEntity1Property3: DomainEntityProperty;
  let column: ?Column;

  beforeAll(() => {
    const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName2,
      data: { edfiOds: { } },
    });

    const domainEntity3: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName3,
      data: { edfiOds: { } },
    });
    const domainEntity3Property2: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      referencedEntity: domainEntity2,
      parentEntity: domainEntity3,
    });

    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName1,
      data: {
        edfiOds: {
          ods_TableName: domainEntityName1,
        },
      },
    });
    domainEntity1Property3 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      referencedEntity: domainEntity3,
      parentEntity: domainEntity1,
    });
    const mergedProperty = Object.assign(newMergedProperty(), {
      mergeProperty: domainEntity1Property3,
      targetProperty: domainEntity3Property2,
      mergePropertyPath: [domainEntityName3, domainEntityName2],
      targetPropertyPath: [domainEntityName2],
    });
    domainEntity1Property3.mergedProperties.push(mergedProperty);

    const referencedColumn: Column = Object.assign(newIntegerColumn(), {
      name: domainEntityName3,
      isPartOfPrimaryKey: true,
      sourceEntityProperties: [domainEntity1Property3],
      mergedReferenceContexts: [domainEntityName1 + domainEntityName2],
    });

    const parentTable: Table = Object.assign(newTable(), {
      columns: [referencedColumn],
    });
    domainEntity2.data.edfiOds.ods_EntityTable = parentTable;

    const referencedTable: Table = Object.assign(newTable(), {
      name: domainEntityName1 + domainEntityName2,
      columns: [referencedColumn],
    });

    column = getMergePropertyColumn(referencedTable, referencedColumn, domainEntity1Property3);
  });

  it('should return merge property column', () => {
    column = (column: any);
    expect(column).toBeDefined();
    expect(column.name).toBe(domainEntityName3);
    expect(R.head(column.sourceEntityProperties)).toBe(domainEntity1Property3);
    expect(R.head(column.mergedReferenceContexts)).toBe(domainEntityName1 + domainEntityName2);
  });
});

describe('when using get merge property column with multiple source entity properties', () => {
  const domainEntityName1: string = 'DomainEntityName1';
  const domainEntityName2: string = 'DomainEntityName2';
  const domainEntityName3: string = 'DomainEntityName3';
  let domainEntity1Property3: DomainEntityProperty;
  let column: ?Column;

  beforeAll(() => {
    const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName2,
      data: { edfiOds: { } },
    });

    const domainEntity3: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName3,
      data: { edfiOds: { } },
    });
    const domainEntity3Property2: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      referencedEntity: domainEntity2,
      parentEntity: domainEntity3,
    });

    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName1,
      data: {
        edfiOds: {
          ods_TableName: domainEntityName1,
        },
      },
    });
    domainEntity1Property3 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      referencedEntity: domainEntity3,
      parentEntity: domainEntity1,
    });
    const mergedProperty = Object.assign(newMergedProperty(), {
      mergeProperty: domainEntity1Property3,
      targetProperty: domainEntity3Property2,
      mergePropertyPath: [domainEntityName3, domainEntityName2],
      targetPropertyPath: [domainEntityName2],
    });
    domainEntity1Property3.mergedProperties.push(mergedProperty);

    const referencedColumn: Column = Object.assign(newIntegerColumn(), {
      name: domainEntityName3,
      isPartOfPrimaryKey: true,
      sourceEntityProperties: [domainEntity1Property3, newDomainEntityProperty()],
      mergedReferenceContexts: [domainEntityName1 + domainEntityName2],
    });

    const parentTable: Table = Object.assign(newTable(), {
      columns: [referencedColumn],
    });
    domainEntity2.data.edfiOds.ods_EntityTable = parentTable;

    const referencedTable: Table = Object.assign(newTable(), {
      name: domainEntityName1 + domainEntityName2,
      columns: [referencedColumn],
    });

    column = getMergePropertyColumn(referencedTable, referencedColumn, domainEntity1Property3);
  });

  it('should return merge property column', () => {
    column = (column: any);
    expect(column).toBeDefined();
    expect(column.name).toBe(domainEntityName3);
    expect(R.head(column.sourceEntityProperties)).toBe(domainEntity1Property3);
    expect(R.head(column.mergedReferenceContexts)).toBe(domainEntityName1 + domainEntityName2);
  });
});

describe('when ForeignKeyCreatingEnhancer enhances a table with primary key reference column', () => {
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  const sourceEntityName: string = 'SourceEntityName';
  const sourceEntityPkName: string = 'SourceEntityPkName';
  const parentTableName: string = 'ParentTableName';

  beforeAll(() => {
    const sourceEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: sourceEntityName,
      data: {
        edfiOds: {
          ods_CascadePrimaryKeyUpdates: false,
        },
      },
    });
    const sourceEntityPK: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: sourceEntityPkName,
      isPartOfIdentity: true,
    });
    sourceEntity.identityProperties.push(sourceEntityPK);

    const sourceReference: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: sourceEntityName,
      referencedEntity: sourceEntity,
      data: {
        edfiOds: {
          ods_DeleteCascadePrimaryKey: false,
          ods_CausesCyclicUpdateCascade: false,
        },
      },
    });

    initializeEdFiOdsEntityRepository(metaEd);

    const parentTable: Table = Object.assign(newTable(), {
      name: parentTableName,
    });
    const sourceColumn: Column = Object.assign(newIntegerColumn(), {
      name: sourceEntityName,
      referenceContext: sourceEntityName,
      mergedReferenceContexts: [sourceEntityName],
      sourceEntityProperties: [sourceReference],
    });
    parentTable.columns.push(sourceColumn);
    const sourceColumnPk: Column = Object.assign(newIntegerColumn(), {
      name: sourceEntityPkName,
      referenceContext: sourceEntityName + sourceEntityPkName,
      mergedReferenceContexts: [sourceEntityName + sourceEntityPkName],
      sourceEntityProperties: [sourceReference, sourceEntityPK],
    });
    parentTable.columns.push(sourceColumnPk);
    (metaEd.plugin.get('edfiOds'): any).entity.table.set(parentTable.name, parentTable);

    const foreignTable: Table = Object.assign(newTable(), {
      name: sourceEntityName,
      columns: [],
    });
    const foreignColumn: Column = Object.assign(newIntegerColumn(), {
      name: sourceEntityPkName,
      isPartOfPrimaryKey: true,
      referenceContext: sourceEntityName + sourceEntityPkName,
      mergedReferenceContexts: [sourceEntityName + sourceEntityPkName],
      sourceEntityProperties: [sourceEntityPK],
    });
    foreignTable.columns.push(foreignColumn);
    (metaEd.plugin.get('edfiOds'): any).entity.table.set(foreignTable.name, foreignTable);

    enhance(metaEd);
  });

  it('should have one foreign key', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(parentTableName): any);
    expect(table.foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', () => {
    const table = ((metaEd.plugin.get('edfiOds'): any).entity.table.get(parentTableName): any);
    expect(table.foreignKeys[0].columnNames).toHaveLength(1);
    expect(table.foreignKeys[0].parentTableName).toBe(parentTableName);
    expect(table.foreignKeys[0].columnNames[0].parentTableColumnName).toBe(sourceEntityPkName);

    expect(table.foreignKeys[0].foreignTableName).toBe(sourceEntityName);
    expect(table.foreignKeys[0].columnNames[0].foreignTableColumnName).toBe(sourceEntityPkName);
  });
});
