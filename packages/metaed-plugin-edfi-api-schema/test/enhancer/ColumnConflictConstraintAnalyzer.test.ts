// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { TopLevelEntity, MetaEdPropertyPath, NoNamespace, Namespace } from '@edfi/metaed-core';
import {
  Table,
  Column,
  ColumnConflictPath as ColumnConflictPair,
  ForeignKey,
  ColumnType,
} from '@edfi/metaed-plugin-edfi-ods-relational';
import {
  analyzeColumnConflictConstraints,
  determineForeignKeyColumn,
  isColumnInAnyConflict,
  getActualConstraintConflicts,
  getNonConstraintConflicts,
} from '../../src/enhancer/ColumnConflictConstraintAnalyzer';

describe('ColumnConflictConstraintAnalyzer', () => {
  // Helper function to create a mock column
  function createMockColumn(options: {
    columnId: string;
    isPartOfPrimaryKey?: boolean;
    originalEntity?: TopLevelEntity | null;
  }): Column {
    return {
      columnId: options.columnId,
      isPartOfPrimaryKey: options.isPartOfPrimaryKey ?? false,
      originalEntity: options.originalEntity ?? null,
      nameComponents: [],
      parentTable: {} as Table,
      propertyPath: '' as MetaEdPropertyPath,
      type: 'string' as ColumnType,
      referenceContext: '',
      description: '',
      sqlEscapedDescription: '',
      originalContextPrefix: '',
      isNullable: true,
      isPartOfAlternateKey: false,
      isUniqueIndex: false,
      isIdentityDatabaseType: false,
      sourceEntityProperties: [],
      mergedReferenceContexts: [],
      isDeprecated: false,
      deprecationReasons: [],
      isFromUniqueIdProperty: false,
      isFromUsiProperty: false,
      data: {},
    } as Column;
  }

  // Helper function to create a mock table
  function createMockTable(options: {
    tableId: string;
    primaryKeys: Column[];
    foreignKeys?: ForeignKey[];
    columnConflictPairs?: ColumnConflictPair[];
    parentEntity?: TopLevelEntity;
  }): Table {
    return {
      tableId: options.tableId,
      primaryKeys: options.primaryKeys,
      foreignKeys: options.foreignKeys ?? [],
      columnConflictPairs: options.columnConflictPairs ?? [],
      existenceReason: {
        parentEntity: options.parentEntity,
        isImplementingCollection: false,
        isImplementingCommon: false,
        isEntityMainTable: true,
        isExtensionTable: false,
        isSubclassTable: false,
        isSynthetic: false,
        isBaseDescriptor: false,
      },
      nameGroup: { nameElements: [], isSynthetic: false, isGroup: true },
      columns: [],
      alternateKeys: [],
      uniqueIndexes: [],
      educationOrganizationIdColumns: [],
      hasEducationOrganizationIdColumns: false,
      usiColumns: [],
      hasUsiColumns: false,
      namespace: { ...NoNamespace, namespaceName: 'Test' } as Namespace,
      schema: 'test',
      type: 'Table',
      description: '',
      sqlEscapedDescription: '',
      typeHumanizedName: '',
      typeHumanizedNameWithIndefiniteArticle: '',
      includeCreateDateColumn: false,
      includeLastModifiedDateAndIdColumn: false,
      includeComputedDescriptorUriColumn: false,
      isRequiredCollectionTable: false,
      isTypeTable: false,
      hasAlternateKeys: false,
      parentEntity: options.parentEntity ?? ({} as TopLevelEntity),
      isAggregateRootTable: false,
      hideFromApiMetadata: false,
      hasDiscriminatorColumn: false,
      isDeprecated: false,
      deprecationReasons: [],
      data: {},
    } as Table;
  }

  // Helper function to create a mock entity
  function createMockEntity(metaEdName: string): TopLevelEntity {
    return {
      metaEdName,
      data: {},
    } as TopLevelEntity;
  }

  describe('analyzeColumnConflictConstraints', () => {
    it('should identify conflicts as non-constraints when table has additional identity columns', () => {
      const entityA = createMockEntity('EntityA');
      const entityB = createMockEntity('EntityB');

      const col1 = createMockColumn({
        columnId: 'col1',
        isPartOfPrimaryKey: true,
        originalEntity: entityA,
      });
      const col2 = createMockColumn({
        columnId: 'col2',
        isPartOfPrimaryKey: true,
        originalEntity: entityB,
      });
      const col3 = createMockColumn({
        columnId: 'col3',
        isPartOfPrimaryKey: true,
        originalEntity: entityA,
      });

      const conflictPair: ColumnConflictPair = {
        firstColumn: col1,
        secondColumn: col2,
      };

      const table = createMockTable({
        tableId: 'TestTable',
        primaryKeys: [col1, col2, col3],
        columnConflictPairs: [conflictPair],
        parentEntity: entityA,
      });

      const results = analyzeColumnConflictConstraints(table);

      expect(results).toHaveLength(1);
      expect(results[0].isActualConstraint).toBe(false);
      expect(results[0].reason).toContain('additional identity columns not in conflict');
      expect(results[0].nonConflictingIdentityColumns).toContain(col3);
    });

    it('should identify conflicts as constraints when all identity columns are involved in conflicts', () => {
      const entityA = createMockEntity('EntityA');
      const entityB = createMockEntity('EntityB');

      const col1 = createMockColumn({
        columnId: 'col1',
        isPartOfPrimaryKey: true,
        originalEntity: entityA,
      });
      const col2 = createMockColumn({
        columnId: 'col2',
        isPartOfPrimaryKey: true,
        originalEntity: entityB,
      });

      const conflictPair: ColumnConflictPair = {
        firstColumn: col1,
        secondColumn: col2,
      };

      const table = createMockTable({
        tableId: 'TestTable',
        primaryKeys: [col1, col2],
        columnConflictPairs: [conflictPair],
        parentEntity: entityA,
      });

      const results = analyzeColumnConflictConstraints(table);

      expect(results).toHaveLength(1);
      expect(results[0].isActualConstraint).toBe(true);
      expect(results[0].reason).toContain('All identity columns of the table are involved in conflicts');
    });

    it('should identify conflicts as non-constraints when one column is not part of primary key', () => {
      const col1 = createMockColumn({
        columnId: 'col1',
        isPartOfPrimaryKey: true,
      });
      const col2 = createMockColumn({
        columnId: 'col2',
        isPartOfPrimaryKey: false,
      });

      const conflictPair: ColumnConflictPair = {
        firstColumn: col1,
        secondColumn: col2,
      };

      const table = createMockTable({
        tableId: 'TestTable',
        primaryKeys: [col1],
        columnConflictPairs: [conflictPair],
      });

      const results = analyzeColumnConflictConstraints(table);

      expect(results).toHaveLength(1);
      expect(results[0].isActualConstraint).toBe(false);
      expect(results[0].reason).toContain("not part of the table's identity");
    });
  });

  describe('determineForeignKeyColumn', () => {
    it('should identify foreign key column based on foreign key definition', () => {
      const col1 = createMockColumn({ columnId: 'col1' });
      const col2 = createMockColumn({ columnId: 'col2' });

      const foreignKey: ForeignKey = {
        name: 'FK_Test',
        columnPairs: [
          {
            parentTableColumnId: col1.columnId,
            foreignTableColumnId: 'foreignCol1',
          },
        ],
        parentTable: {} as Table,
        foreignTableId: 'ForeignTable',
        foreignTableSchema: 'test',
        foreignTableNamespace: { ...NoNamespace, namespaceName: 'Test' } as Namespace,
        foreignTable: {} as Table,
        withDeleteCascade: true,
        withUpdateCascade: true,
        withReverseForeignKeyIndex: false,
        sourceReference: {
          isPartOfIdentity: false,
          isRequired: false,
          isOptional: false,
          isRequiredCollection: false,
          isOptionalCollection: false,
          isSubclassRelationship: false,
          isExtensionRelationship: false,
          isSyntheticRelationship: false,
          isSubtableRelationship: false,
          isPotentiallyLogical: false,
          propertyType: 'unknown',
          isRoleNamed: false,
          isIdentifying: false,
        },
        data: {},
      };

      const table = createMockTable({
        tableId: 'TestTable',
        primaryKeys: [],
        foreignKeys: [foreignKey],
      });

      const result = determineForeignKeyColumn(col1, col2, table);
      expect(result).toBe(col1);
    });

    it('should identify foreign key column based on original entity', () => {
      const entityA = createMockEntity('EntityA');
      const entityB = createMockEntity('EntityB');

      const col1 = createMockColumn({ columnId: 'col1', originalEntity: entityB });
      const col2 = createMockColumn({ columnId: 'col2', originalEntity: entityA });

      const table = createMockTable({
        tableId: 'TestTable',
        primaryKeys: [],
        parentEntity: entityA,
      });

      const result = determineForeignKeyColumn(col1, col2, table);
      expect(result).toBe(col1);
    });
  });

  describe('isColumnInAnyConflict', () => {
    it('should return true when column is in a conflict', () => {
      const col1 = createMockColumn({ columnId: 'col1' });
      const col2 = createMockColumn({ columnId: 'col2' });
      const col3 = createMockColumn({ columnId: 'col3' });

      const conflicts: ColumnConflictPair[] = [{ firstColumn: col1, secondColumn: col2 }];

      expect(isColumnInAnyConflict(col1, conflicts)).toBe(true);
      expect(isColumnInAnyConflict(col2, conflicts)).toBe(true);
      expect(isColumnInAnyConflict(col3, conflicts)).toBe(false);
    });
  });

  describe('getActualConstraintConflicts', () => {
    it('should return only conflicts that are actual constraints', () => {
      const col1 = createMockColumn({ columnId: 'col1', isPartOfPrimaryKey: true });
      const col2 = createMockColumn({ columnId: 'col2', isPartOfPrimaryKey: true });
      const col3 = createMockColumn({ columnId: 'col3', isPartOfPrimaryKey: false });
      const col4 = createMockColumn({ columnId: 'col4', isPartOfPrimaryKey: false });

      const constraintConflict: ColumnConflictPair = { firstColumn: col1, secondColumn: col2 };
      const nonConstraintConflict: ColumnConflictPair = { firstColumn: col3, secondColumn: col4 };

      const table = createMockTable({
        tableId: 'TestTable',
        primaryKeys: [col1, col2],
        columnConflictPairs: [constraintConflict, nonConstraintConflict],
      });

      const result = getActualConstraintConflicts(table);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(constraintConflict);
    });
  });

  describe('getNonConstraintConflicts', () => {
    it('should return only conflicts that are not actual constraints', () => {
      const col1 = createMockColumn({ columnId: 'col1', isPartOfPrimaryKey: true });
      const col2 = createMockColumn({ columnId: 'col2', isPartOfPrimaryKey: true });
      const col3 = createMockColumn({ columnId: 'col3', isPartOfPrimaryKey: false });
      const col4 = createMockColumn({ columnId: 'col4', isPartOfPrimaryKey: false });

      const constraintConflict: ColumnConflictPair = { firstColumn: col1, secondColumn: col2 };
      const nonConstraintConflict: ColumnConflictPair = { firstColumn: col3, secondColumn: col4 };

      const table = createMockTable({
        tableId: 'TestTable',
        primaryKeys: [col1, col2],
        columnConflictPairs: [constraintConflict, nonConstraintConflict],
      });

      const result = getNonConstraintConflicts(table);
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(nonConstraintConflict);
    });
  });
});
