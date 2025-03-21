// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import {
  newDomainEntity,
  newDomainEntityProperty,
  newIntegerProperty,
  newMergeDirective,
  newMetaEdEnvironment,
  newNamespace,
  DomainEntity,
  DomainEntityProperty,
  IntegerProperty,
  MetaEdEnvironment,
  Namespace,
} from '@edfi/metaed-core';
import { enhance as initializeEdFiOdsRelationalEntityRepository } from '../../src/model/EdFiOdsRelationalEntityRepository';
import { newTable, Table } from '../../src/model/database/Table';
import { newColumn, Column } from '../../src/model/database/Column';
import {
  enhance,
  getMatchingColumnFromSourceEntityProperties,
  getMergePropertyColumn,
  getReferencePropertiesAndAssociatedColumns,
} from '../../src/enhancer/ForeignKeyCreatingTableEnhancer';
import { tableEntities } from '../../src/enhancer/EnhancerHelper';
import { PropertyColumnPair } from '../../src/enhancer/ForeignKeyCreatingTableEnhancer';

describe('when using get reference properties and associated columns with non reference properties', (): void => {
  let propertyColumnPair: PropertyColumnPair[];
  const domainEntityPropertyName1 = 'DomainEntityPropertyName1';
  const domainEntityPropertyName2 = 'DomainEntityPropertyName2';
  const columnName1 = 'ColumnName1';
  const columnName2 = 'ColumnName2';

  beforeAll(() => {
    const table: Table = {
      ...newTable(),
      columns: [
        {
          ...newColumn(),
          type: 'integer',
          columnId: columnName1,
          sourceEntityProperties: [
            Object.assign(newDomainEntityProperty(), {
              metaEdName: domainEntityPropertyName1,
            }),
            Object.assign(newIntegerProperty(), {
              metaEdName: 'IntegerPropertyName2',
            }),
          ],
        },
        {
          ...newColumn(),
          type: 'integer',
          columnId: columnName2,
          sourceEntityProperties: [
            Object.assign(newDomainEntityProperty(), {
              metaEdName: domainEntityPropertyName2,
            }),
            Object.assign(newIntegerProperty(), {
              metaEdName: 'IntegerPropertyName2',
            }),
          ],
        },
      ],
    };
    propertyColumnPair = getReferencePropertiesAndAssociatedColumns(table);
  });

  it('should return two property column pairs', (): void => {
    expect(propertyColumnPair).toBeDefined();
    expect(propertyColumnPair).toHaveLength(2);
  });

  it('should have first reference pair', (): void => {
    expect(R.head(propertyColumnPair).columns).toHaveLength(1);
    expect(R.head(propertyColumnPair).property.metaEdName).toBe(domainEntityPropertyName1);
    expect(R.head(R.head(propertyColumnPair).columns).columnId).toBe(columnName1);
  });

  it('should have second reference pair', (): void => {
    expect(propertyColumnPair[propertyColumnPair.length - 1].columns).toHaveLength(1);
    expect(propertyColumnPair[propertyColumnPair.length - 1].property.metaEdName).toBe(domainEntityPropertyName2);
    expect(R.head(propertyColumnPair[propertyColumnPair.length - 1].columns).columnId).toBe(columnName2);
  });
});

describe('when using get reference properties and associated columns with weak reference properties', (): void => {
  let propertyColumnPair: PropertyColumnPair[];
  const domainEntityPropertyName = 'DomainEntityPropertyName';
  const columnName1 = 'ColumnName1';

  beforeAll(() => {
    const table: Table = {
      ...newTable(),
      columns: [
        {
          ...newColumn(),
          type: 'integer',
          columnId: columnName1,
          sourceEntityProperties: [
            Object.assign(newDomainEntityProperty(), {
              metaEdName: domainEntityPropertyName,
            }),
          ],
        },
        {
          ...newColumn(),
          type: 'integer',
          columnId: 'ColumnName2',
          sourceEntityProperties: [
            Object.assign(newDomainEntityProperty(), {
              metaEdName: 'WeakReferencePropertyName',
              isWeak: true,
            }),
          ],
        },
      ],
    };
    propertyColumnPair = getReferencePropertiesAndAssociatedColumns(table);
  });

  it('should only return strong reference property column pair', (): void => {
    expect(propertyColumnPair).toBeDefined();
    expect(R.head(propertyColumnPair).columns).toHaveLength(1);
    expect(R.head(propertyColumnPair).property.metaEdName).toBe(domainEntityPropertyName);
    expect(R.head(R.head(propertyColumnPair).columns).columnId).toBe(columnName1);
  });
});

describe('when using get reference properties and associated columns', (): void => {
  let propertyColumnPair: PropertyColumnPair[];
  const domainEntityPropertyName1 = 'DomainEntityPropertyName1';
  const domainEntityPropertyName2 = 'DomainEntityPropertyName2';
  const columnName1 = 'ColumnName1';
  const columnName2 = 'ColumnName2';

  beforeAll(() => {
    const table: Table = {
      ...newTable(),
      columns: [
        {
          ...newColumn(),
          type: 'integer',
          columnId: columnName1,
          sourceEntityProperties: [
            Object.assign(newDomainEntityProperty(), {
              metaEdName: domainEntityPropertyName1,
            }),
            Object.assign(newDomainEntityProperty(), {
              metaEdName: domainEntityPropertyName2,
            }),
          ],
        },
        {
          ...newColumn(),
          type: 'integer',
          columnId: columnName2,
          sourceEntityProperties: [
            Object.assign(newDomainEntityProperty(), {
              metaEdName: domainEntityPropertyName1,
            }),
          ],
        },
      ],
    };
    propertyColumnPair = getReferencePropertiesAndAssociatedColumns(table);
  });

  it('should return two property column pairs', (): void => {
    expect(propertyColumnPair).toBeDefined();
    expect(propertyColumnPair).toHaveLength(2);
  });

  it('should have first pair with two columns', (): void => {
    expect(R.head(propertyColumnPair).columns).toHaveLength(2);
    expect(R.head(propertyColumnPair).property.metaEdName).toBe(domainEntityPropertyName1);
    expect(R.head(R.head(propertyColumnPair).columns).columnId).toBe(columnName1);
    expect(R.last(R.head(propertyColumnPair).columns).columnId).toBe(columnName2);
  });

  it('should have second pair with one column', (): void => {
    expect(propertyColumnPair[propertyColumnPair.length - 1].columns).toHaveLength(1);
    expect(propertyColumnPair[propertyColumnPair.length - 1].property.metaEdName).toBe(domainEntityPropertyName2);
    expect(R.head(propertyColumnPair[propertyColumnPair.length - 1].columns).columnId).toBe(columnName1);
  });
});

describe('when using get matching column from source entity properties with no matching source entity properties', (): void => {
  let column: Column;

  beforeAll(() => {
    const integerPropertyName1 = 'IntegerPropertyName1';
    const integerColumn1: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: 'IntegerColumnName1',
      sourceEntityProperties: [Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName1 })],
      referenceContext: integerPropertyName1,
      mergedReferenceContexts: [integerPropertyName1],
    };

    const integerPropertyName2 = 'IntegerPropertyName2';
    const integerColumn2: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: 'IntegerColumnName2',
      sourceEntityProperties: [Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName2 })],
      referenceContext: integerPropertyName2,
      mergedReferenceContexts: [integerPropertyName2],
    };

    const integerPropertyName3 = 'IntegerPropertyName3';
    const integerColumn3: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: 'IntegerColumnName3',
      sourceEntityProperties: [Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName3 })],
      referenceContext: integerPropertyName3,
      mergedReferenceContexts: [integerPropertyName3],
    };

    column = getMatchingColumnFromSourceEntityProperties(integerColumn1, [integerColumn2, integerColumn3]) as Column;
  });

  it('should return null', (): void => {
    expect(column).toBeUndefined();
  });
});

describe('when using get matching column from source entity properties with matching source entity property only', (): void => {
  let column: Column;
  let matchingColumn: Column;

  beforeAll(() => {
    const matchingIntegerPropertyName = 'MatchingIntegerPropertyName';
    const matchingIntegerProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: matchingIntegerPropertyName,
    });

    const columnToMatch: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: 'ColumnToMatch',
      sourceEntityProperties: [
        matchingIntegerProperty,
        Object.assign(newIntegerProperty(), { metaEdName: 'IntegerPropertyName1' }),
      ],
      referenceContext: matchingIntegerPropertyName,
      mergedReferenceContexts: [matchingIntegerPropertyName],
    };

    const integerPropertyName2 = 'IntegerPropertyName2';
    matchingColumn = {
      ...newColumn(),
      type: 'integer',
      columnId: 'MatchingColumn',
      sourceEntityProperties: [
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName2 }),
        matchingIntegerProperty,
      ],
      referenceContext: integerPropertyName2,
      mergedReferenceContexts: [integerPropertyName2],
    };

    const integerPropertyName3 = 'IntegerPropertyName3';
    const integerColumn: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: 'IntegerColumnName',
      sourceEntityProperties: [Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName3 })],
      referenceContext: integerPropertyName3,
      mergedReferenceContexts: [integerPropertyName3],
    };

    column = getMatchingColumnFromSourceEntityProperties(columnToMatch, [matchingColumn, integerColumn]) as Column;
  });

  it('should return matching column', (): void => {
    expect(column).toBe(matchingColumn);
  });
});

describe('when using get matching column from source entity properties with matching source entity property and column name', (): void => {
  const matchingColumnName = 'MatchingColumnName';
  let matchingIntegerProperty: IntegerProperty;
  let column: Column;
  let matchingColumn1: Column;

  beforeAll(() => {
    const matchingIntegerPropertyName = 'MatchingIntegerPropertyName';
    matchingIntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: matchingIntegerPropertyName,
    });

    const integerPropertyName1 = 'IntegerPropertyName1';
    const columnToMatch: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: matchingColumnName,
      sourceEntityProperties: [
        matchingIntegerProperty,
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName1 }),
      ],
      referenceContext: matchingIntegerPropertyName,
      mergedReferenceContexts: [integerPropertyName1],
    };

    const integerPropertyName2 = 'IntegerPropertyName2';
    matchingColumn1 = {
      ...newColumn(),
      type: 'integer',
      columnId: matchingColumnName,
      sourceEntityProperties: [
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName2 }),
        matchingIntegerProperty,
      ],
      referenceContext: integerPropertyName2,
      mergedReferenceContexts: [integerPropertyName2],
    };

    const integerPropertyName3 = 'IntegerPropertyName3';
    const matchingColumn2: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: 'matchingColumnName2',
      sourceEntityProperties: [
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName3 }),
        matchingIntegerProperty,
      ],
      referenceContext: integerPropertyName2,
      mergedReferenceContexts: [integerPropertyName2],
    };

    const integerPropertyName4 = 'IntegerPropertyName4';
    const integerColumn: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: 'IntegerColumnName',
      sourceEntityProperties: [Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName4 })],
      referenceContext: integerPropertyName3,
      mergedReferenceContexts: [integerPropertyName3],
    };

    column = getMatchingColumnFromSourceEntityProperties(columnToMatch, [
      matchingColumn1,
      integerColumn,
      matchingColumn2,
    ]) as Column;
  });

  it('should return matching column with same name', (): void => {
    expect(column).toBe(matchingColumn1);
  });
});

describe('when using get matching column from source entity properties with matching column', (): void => {
  const matchingColumnName = 'MatchingColumnName';
  let matchingIntegerProperty: IntegerProperty;
  let column: Column;

  beforeAll(() => {
    const matchingIntegerPropertyName = 'MatchingIntegerPropertyName';
    matchingIntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: matchingIntegerPropertyName,
    });

    const integerPropertyName1 = 'IntegerPropertyName1';
    const columnToMatch: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: matchingColumnName,
      sourceEntityProperties: [
        matchingIntegerProperty,
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName1 }),
      ],
      referenceContext: matchingIntegerPropertyName,
      mergedReferenceContexts: [matchingIntegerPropertyName, integerPropertyName1],
    };

    const integerPropertyName2 = 'IntegerPropertyName2';
    const matchingColumn: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: matchingColumnName,
      sourceEntityProperties: [
        Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName2 }),
        matchingIntegerProperty,
      ],
      referenceContext: integerPropertyName2,
      mergedReferenceContexts: [integerPropertyName2, matchingIntegerPropertyName],
    };

    const integerPropertyName3 = 'IntegerPropertyName3';
    const integerColumn: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: 'IntegerColumnName',
      sourceEntityProperties: [Object.assign(newIntegerProperty(), { metaEdName: integerPropertyName3 })],
      referenceContext: integerPropertyName3,
      mergedReferenceContexts: [integerPropertyName3],
    };

    column = getMatchingColumnFromSourceEntityProperties(columnToMatch, [matchingColumn, integerColumn]) as Column;
  });

  it('should return matching column', (): void => {
    expect(column).toBeDefined();
    expect(column.columnId).toBe(matchingColumnName);
    expect(column.sourceEntityProperties).toContain(matchingIntegerProperty);
  });
});

describe('when using get merge property column with property that is not included in column source properties', (): void => {
  let column: Column;

  beforeAll(() => {
    const domainEntity1Property3: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: 'DomainEntityName3',
      mergeDirectives: [
        Object.assign(newMergeDirective(), {
          sourceProperty: newIntegerProperty(),
        }),
      ],
    });

    column = getMergePropertyColumn(newTable(), newColumn(), domainEntity1Property3) as Column;
  });

  it('should return undefined', (): void => {
    expect(column).toBeUndefined();
  });
});

describe('when using get merge property column with column that has invalid merge reference context and source property', (): void => {
  let column: Column;

  beforeAll(() => {
    const domainEntityName3 = 'DomainEntityName3';
    const domainEntityName2 = 'DomainEntityName2';
    const domainEntity1Property3: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
    });
    const mergedProperty = Object.assign(newMergeDirective(), {
      sourceProperty: domainEntity1Property3,
      sourcePropertyPathStrings: [domainEntityName3, domainEntityName2],
      targetPropertyPathStrings: [domainEntityName2],
    });
    domainEntity1Property3.mergeDirectives.push(mergedProperty);

    const referencedColumn: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: domainEntityName3,
      isPartOfPrimaryKey: true,
      sourceEntityProperties: [newIntegerProperty()],
      mergedReferenceContexts: ['InvalidReferenceContext'],
    };

    const referencedTable: Table = {
      ...newTable(),
      tableId: `DomainEntityName1${domainEntityName2}`,
      columns: [referencedColumn],
    };

    column = getMergePropertyColumn(referencedTable, referencedColumn, domainEntity1Property3) as Column;
  });

  it('should return undefined', (): void => {
    expect(column).toBeUndefined();
  });
});

describe('when using get merge property column with non reference target property', (): void => {
  const domainEntityName1 = 'DomainEntityName1';
  const nonReferencePropertyName = 'NonReferencePropertyName';
  const domainEntityName3 = 'DomainEntityName3';
  let domainEntityProperty: DomainEntityProperty;
  let column: Column;

  beforeAll(() => {
    const nonReferenceProperty: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: nonReferencePropertyName,
    });

    const domainEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName1,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityName1,
        },
      },
    });
    domainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      parentEntity: domainEntity,
    });
    const mergedProperty = Object.assign(newMergeDirective(), {
      sourceProperty: domainEntityProperty,
      targetProperty: nonReferenceProperty,
      sourcePropertyPathStrings: [domainEntityName3, nonReferencePropertyName],
      targetPropertyPathStrings: [nonReferencePropertyName],
    });
    domainEntityProperty.mergeDirectives.push(mergedProperty);

    const referencedColumn: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: domainEntityName3,
      isPartOfPrimaryKey: true,
      sourceEntityProperties: [domainEntityProperty],
      mergedReferenceContexts: [domainEntityName1 + nonReferencePropertyName],
    };

    const referencedTable: Table = {
      ...newTable(),
      tableId: domainEntityName1 + nonReferencePropertyName,
      columns: [referencedColumn],
    };

    column = getMergePropertyColumn(referencedTable, referencedColumn, domainEntityProperty) as Column;
  });

  it('should return undefined', (): void => {
    expect(column).toBeUndefined();
  });
});

describe('when using get merge property column with reference property', (): void => {
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityName3 = 'DomainEntityName3';
  let domainEntity1Property3: DomainEntityProperty;
  let column: Column;

  beforeAll(() => {
    const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName2,
      data: { edfiOdsRelational: {} },
    });

    const domainEntity3: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName3,
      data: { edfiOdsRelational: {} },
    });
    const domainEntity3Property2: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      referencedEntity: domainEntity2,
      parentEntity: domainEntity3,
    });

    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName1,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityName1,
        },
      },
    });
    domainEntity1Property3 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      referencedEntity: domainEntity3,
      parentEntity: domainEntity1,
    });
    const mergedProperty = Object.assign(newMergeDirective(), {
      sourceProperty: domainEntity1Property3,
      targetProperty: domainEntity3Property2,
      sourcePropertyPathStrings: [domainEntityName3, domainEntityName2],
      targetPropertyPathStrings: [domainEntityName2],
    });
    domainEntity1Property3.mergeDirectives.push(mergedProperty);

    const referencedColumn: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: domainEntityName3,
      isPartOfPrimaryKey: true,
      sourceEntityProperties: [domainEntity1Property3],
      mergedReferenceContexts: [domainEntityName1 + domainEntityName2],
    };

    const parentTable: Table = { ...newTable(), columns: [referencedColumn] };
    domainEntity2.data.edfiOdsRelational.odsEntityTable = parentTable;

    const referencedTable: Table = {
      ...newTable(),
      tableId: domainEntityName1 + domainEntityName2,
      columns: [referencedColumn],
    };

    column = getMergePropertyColumn(referencedTable, referencedColumn, domainEntity1Property3) as Column;
  });

  it('should return merge property column', (): void => {
    expect(column).toBeDefined();
    expect(column.columnId).toBe(domainEntityName3);
    expect(column.sourceEntityProperties[0]).toBe(domainEntity1Property3);
    expect(column.mergedReferenceContexts[0]).toBe(domainEntityName1 + domainEntityName2);
  });
});

describe('when using get merge property column with multiple source entity properties', (): void => {
  const domainEntityName1 = 'DomainEntityName1';
  const domainEntityName2 = 'DomainEntityName2';
  const domainEntityName3 = 'DomainEntityName3';
  let domainEntity1Property3: DomainEntityProperty;
  let column: Column;

  beforeAll(() => {
    const domainEntity2: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName2,
      data: { edfiOdsRelational: {} },
    });

    const domainEntity3: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName3,
      data: { edfiOdsRelational: {} },
    });
    const domainEntity3Property2: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName2,
      referencedEntity: domainEntity2,
      parentEntity: domainEntity3,
    });

    const domainEntity1: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: domainEntityName1,
      data: {
        edfiOdsRelational: {
          odsTableId: domainEntityName1,
        },
      },
    });
    domainEntity1Property3 = Object.assign(newDomainEntityProperty(), {
      metaEdName: domainEntityName3,
      referencedEntity: domainEntity3,
      parentEntity: domainEntity1,
    });
    const mergedProperty = Object.assign(newMergeDirective(), {
      sourceProperty: domainEntity1Property3,
      targetProperty: domainEntity3Property2,
      sourcePropertyPathStrings: [domainEntityName3, domainEntityName2],
      targetPropertyPathStrings: [domainEntityName2],
    });
    domainEntity1Property3.mergeDirectives.push(mergedProperty);

    const referencedColumn: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: domainEntityName3,
      isPartOfPrimaryKey: true,
      sourceEntityProperties: [domainEntity1Property3, newDomainEntityProperty()],
      mergedReferenceContexts: [domainEntityName1 + domainEntityName2],
    };

    const parentTable: Table = { ...newTable(), columns: [referencedColumn] };
    domainEntity2.data.edfiOdsRelational.odsEntityTable = parentTable;

    const referencedTable: Table = {
      ...newTable(),
      tableId: domainEntityName1 + domainEntityName2,
      columns: [referencedColumn],
    };

    column = getMergePropertyColumn(referencedTable, referencedColumn, domainEntity1Property3) as Column;
  });

  it('should return merge property column', (): void => {
    expect(column).toBeDefined();
    expect(column.columnId).toBe(domainEntityName3);
    expect(R.head(column.sourceEntityProperties)).toBe(domainEntity1Property3);
    expect(R.head(column.mergedReferenceContexts)).toBe(domainEntityName1 + domainEntityName2);
  });
});

describe('when ForeignKeyCreatingEnhancer enhances a table with primary key reference column', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  const sourceEntityName = 'SourceEntityName';
  const sourceEntityPkName = 'SourceEntityPkName';
  const parentTableName = 'ParentTableName';

  beforeAll(() => {
    const sourceEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: sourceEntityName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsCascadePrimaryKeyUpdates: false,
        },
      },
    });
    const sourceEntityPK: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: sourceEntityPkName,
      isPartOfIdentity: true,
      namespace,
    });
    sourceEntity.identityProperties.push(sourceEntityPK);

    const sourceReference: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: sourceEntityName,
      namespace,
      referencedEntity: sourceEntity,
      data: {
        edfiOdsRelational: {
          odsDeleteCascadePrimaryKey: false,
          odsCausesCyclicUpdateCascade: false,
        },
      },
    });

    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const parentTable: Table = { ...newTable(), tableId: parentTableName, schema: 'edfi' };
    const sourceColumn: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: sourceEntityName,
      referenceContext: sourceEntityName,
      mergedReferenceContexts: [sourceEntityName],
      sourceEntityProperties: [sourceReference],
    };
    parentTable.columns.push(sourceColumn);
    const sourceColumnPk: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: sourceEntityPkName,
      referenceContext: sourceEntityName + sourceEntityPkName,
      mergedReferenceContexts: [sourceEntityName + sourceEntityPkName],
      sourceEntityProperties: [sourceReference, sourceEntityPK],
    };
    parentTable.columns.push(sourceColumnPk);
    tableEntities(metaEd, namespace).set(parentTable.tableId, parentTable);

    const foreignTable: Table = { ...newTable(), tableId: sourceEntityName, schema: 'edfi', columns: [] };
    const foreignColumn: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: sourceEntityPkName,
      isPartOfPrimaryKey: true,
      referenceContext: sourceEntityName + sourceEntityPkName,
      mergedReferenceContexts: [sourceEntityName + sourceEntityPkName],
      sourceEntityProperties: [sourceEntityPK],
    };
    foreignTable.columns.push(foreignColumn);
    tableEntities(metaEd, namespace).set(foreignTable.tableId, foreignTable);

    enhance(metaEd);
  });

  it('should have one foreign key', (): void => {
    const table = tableEntities(metaEd, namespace).get(parentTableName) as Table;
    expect(table.foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', (): void => {
    const table = tableEntities(metaEd, namespace).get(parentTableName) as Table;
    expect(table.foreignKeys[0].columnPairs).toHaveLength(1);
    expect(table.foreignKeys[0].parentTable.tableId).toBe(parentTableName);
    expect(table.foreignKeys[0].parentTable.schema).toBe('edfi');
    expect(table.foreignKeys[0].columnPairs[0].parentTableColumnId).toBe(sourceEntityPkName);

    expect(table.foreignKeys[0].foreignTableId).toBe(sourceEntityName);
    expect(table.foreignKeys[0].foreignTableSchema).toBe('edfi');
    expect(table.foreignKeys[0].columnPairs[0].foreignTableColumnId).toBe(sourceEntityPkName);
  });
});

describe('when ForeignKeyCreatingEnhancer enhances a table with primary key reference column across namespaces', (): void => {
  const namespace: Namespace = { ...newNamespace(), namespaceName: 'EdFi' };
  const extensionNamespace: Namespace = { ...newNamespace(), namespaceName: 'Extension', dependencies: [namespace] };
  const metaEd: MetaEdEnvironment = newMetaEdEnvironment();
  metaEd.namespace.set(namespace.namespaceName, namespace);
  metaEd.namespace.set(extensionNamespace.namespaceName, extensionNamespace);
  const sourceEntityName = 'SourceEntityName';
  const sourceEntityPkName = 'SourceEntityPkName';
  const parentTableName = 'ParentTableName';

  beforeAll(() => {
    const sourceEntity: DomainEntity = Object.assign(newDomainEntity(), {
      metaEdName: sourceEntityName,
      namespace,
      data: {
        edfiOdsRelational: {
          odsCascadePrimaryKeyUpdates: false,
        },
      },
    });
    const sourceEntityPK: IntegerProperty = Object.assign(newIntegerProperty(), {
      metaEdName: sourceEntityPkName,
      isPartOfIdentity: true,
      namespace: extensionNamespace,
    });
    sourceEntity.identityProperties.push(sourceEntityPK);

    const sourceReference: DomainEntityProperty = Object.assign(newDomainEntityProperty(), {
      metaEdName: sourceEntityName,
      namespace: extensionNamespace,
      referencedEntity: sourceEntity,
      data: {
        edfiOdsRelational: {
          odsDeleteCascadePrimaryKey: false,
          odsCausesCyclicUpdateCascade: false,
        },
      },
    });

    initializeEdFiOdsRelationalEntityRepository(metaEd);

    const parentTable: Table = { ...newTable(), tableId: parentTableName, schema: 'extension' };
    const sourceColumn: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: sourceEntityName,
      referenceContext: sourceEntityName,
      mergedReferenceContexts: [sourceEntityName],
      sourceEntityProperties: [sourceReference],
    };
    parentTable.columns.push(sourceColumn);
    const sourceColumnPk: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: sourceEntityPkName,
      referenceContext: sourceEntityName + sourceEntityPkName,
      mergedReferenceContexts: [sourceEntityName + sourceEntityPkName],
      sourceEntityProperties: [sourceReference, sourceEntityPK],
    };
    parentTable.columns.push(sourceColumnPk);
    tableEntities(metaEd, extensionNamespace).set(parentTable.tableId, parentTable);

    const foreignTable: Table = { ...newTable(), tableId: sourceEntityName, columns: [], schema: 'edfi' };
    const foreignColumn: Column = {
      ...newColumn(),
      type: 'integer',
      columnId: sourceEntityPkName,
      isPartOfPrimaryKey: true,
      referenceContext: sourceEntityName + sourceEntityPkName,
      mergedReferenceContexts: [sourceEntityName + sourceEntityPkName],
      sourceEntityProperties: [sourceEntityPK],
    };
    foreignTable.columns.push(foreignColumn);
    tableEntities(metaEd, namespace).set(foreignTable.tableId, foreignTable);

    enhance(metaEd);
  });

  it('should have one foreign key', (): void => {
    const table = tableEntities(metaEd, extensionNamespace).get(parentTableName) as Table;
    expect(table.foreignKeys).toHaveLength(1);
  });

  it('should have correct foreign key relationship', (): void => {
    const table = tableEntities(metaEd, extensionNamespace).get(parentTableName) as Table;
    expect(table.foreignKeys[0].columnPairs).toHaveLength(1);
    expect(table.foreignKeys[0].parentTable.tableId).toBe(parentTableName);
    expect(table.foreignKeys[0].parentTable.schema).toBe('extension');
    expect(table.foreignKeys[0].columnPairs[0].parentTableColumnId).toBe(sourceEntityPkName);

    expect(table.foreignKeys[0].foreignTableId).toBe(sourceEntityName);
    expect(table.foreignKeys[0].foreignTableSchema).toBe('edfi');
    expect(table.foreignKeys[0].columnPairs[0].foreignTableColumnId).toBe(sourceEntityPkName);
  });
});
