/* eslint-disable no-restricted-syntax */
// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { ColumnConflictPath as ColumnConflictPair, Table, Column } from '@edfi/metaed-plugin-edfi-ods-relational';

/**
 * Result of analyzing a column conflict pair to determine if it's an actual constraint
 */
export interface ColumnConflictAnalysis {
  columnConflictPair: ColumnConflictPair;
  isActualConstraint: boolean;
  reason: string;
  foreignKeyColumn: Column | null;
  nativeColumn: Column | null;
  nonConflictingIdentityColumns: Column[];
}

/**
 * Determines which column in a conflict pair comes from a foreign key relationship
 *
 * @param firstColumn First column in the conflict pair
 * @param secondColumn Second column in the conflict pair
 * @param table The table containing the columns
 * @returns The column that comes from a foreign key, or firstColumn if unable to determine
 */
export function determineForeignKeyColumn(firstColumn: Column, secondColumn: Column, table: Table): Column {
  // Check which column appears in any foreign key definition
  for (const fk of table.foreignKeys) {
    for (const columnPair of fk.columnPairs) {
      if (columnPair.parentTableColumnId === firstColumn.columnId) return firstColumn;
      if (columnPair.parentTableColumnId === secondColumn.columnId) return secondColumn;
    }
  }

  // Fallback: check which column's originalEntity differs from the table's entity
  // Foreign key columns often have originalEntity pointing to the parent entity
  if (table.existenceReason.parentEntity) {
    if (
      firstColumn.originalEntity &&
      firstColumn.originalEntity.metaEdName !== table.existenceReason.parentEntity.metaEdName
    ) {
      return firstColumn;
    }
    if (
      secondColumn.originalEntity &&
      secondColumn.originalEntity.metaEdName !== table.existenceReason.parentEntity.metaEdName
    ) {
      return secondColumn;
    }
  }

  // Unable to determine definitively - return first column as default
  return firstColumn;
}

/**
 * Checks if a column is involved in any conflict pair
 *
 * @param column The column to check
 * @param conflicts Array of column conflict pairs
 * @returns True if the column is part of any conflict pair
 */
export function isColumnInAnyConflict(column: Column, conflicts: ColumnConflictPair[]): boolean {
  return conflicts.some(
    (conflict) => conflict.firstColumn.columnId === column.columnId || conflict.secondColumn.columnId === column.columnId,
  );
}

/**
 * Analyzes column conflict pairs in a table to determine which ones are actual constraints
 * vs which ones are not constraints because the table has additional identity columns.
 *
 * A conflict is NOT a constraint when:
 * 1. One or both columns are not part of the table's identity (primary key)
 * 2. The table has additional identity columns that are not involved in any conflicts
 *
 * @param table The table to analyze
 * @returns Array of analysis results for each column conflict pair
 */
export function analyzeColumnConflictConstraints(table: Table): ColumnConflictAnalysis[] {
  const analyses: ColumnConflictAnalysis[] = [];

  for (const conflictPair of table.columnConflictPairs) {
    const { firstColumn, secondColumn } = conflictPair;

    // Step 1: Determine which column is from the foreign key (parent) and which is native to this table
    const foreignKeyColumn = determineForeignKeyColumn(firstColumn, secondColumn, table);
    const nativeColumn = foreignKeyColumn === firstColumn ? secondColumn : firstColumn;

    // Step 2: Check if both columns are part of the table's identity
    const bothAreIdentityColumns = nativeColumn.isPartOfPrimaryKey && foreignKeyColumn.isPartOfPrimaryKey;

    if (!bothAreIdentityColumns) {
      // If either column is not part of the identity, it's not a constraint
      analyses.push({
        columnConflictPair: conflictPair,
        isActualConstraint: false,
        reason: "One or both columns are not part of the table's identity",
        foreignKeyColumn,
        nativeColumn,
        nonConflictingIdentityColumns: [],
      });
      // eslint-disable-next-line no-continue
      continue;
    }

    // Step 3: Find all identity columns for this table
    const allIdentityColumns = table.primaryKeys;

    // Step 4: Find identity columns that don't have conflicts
    const nonConflictingIdentityColumns = allIdentityColumns.filter(
      (col) => !isColumnInAnyConflict(col, table.columnConflictPairs),
    );

    // Step 5: Determine if this is an actual constraint
    if (nonConflictingIdentityColumns.length > 0) {
      analyses.push({
        columnConflictPair: conflictPair,
        isActualConstraint: false,
        reason: `Table has ${
          nonConflictingIdentityColumns.length
        } additional identity columns not in conflict: ${nonConflictingIdentityColumns.map((c) => c.columnId).join(', ')}`,
        foreignKeyColumn,
        nativeColumn,
        nonConflictingIdentityColumns,
      });
    } else {
      // All identity columns are involved in conflicts - this IS a constraint
      analyses.push({
        columnConflictPair: conflictPair,
        isActualConstraint: true,
        reason: 'All identity columns of the table are involved in conflicts with parent table',
        foreignKeyColumn,
        nativeColumn,
        nonConflictingIdentityColumns: [],
      });
    }
  }

  return analyses;
}

/**
 * Filters column conflict pairs to return only those that are actual constraints
 *
 * @param table The table to analyze
 * @returns Array of column conflict pairs that represent actual constraints
 */
export function getActualConstraintConflicts(table: Table): ColumnConflictPair[] {
  const analyses = analyzeColumnConflictConstraints(table);
  return analyses.filter((analysis) => analysis.isActualConstraint).map((analysis) => analysis.columnConflictPair);
}

/**
 * Filters column conflict pairs to return only those that are NOT actual constraints
 *
 * @param table The table to analyze
 * @returns Array of column conflict pairs that do not represent actual constraints
 */
export function getNonConstraintConflicts(table: Table): ColumnConflictPair[] {
  const analyses = analyzeColumnConflictConstraints(table);
  return analyses.filter((analysis) => !analysis.isActualConstraint).map((analysis) => analysis.columnConflictPair);
}
