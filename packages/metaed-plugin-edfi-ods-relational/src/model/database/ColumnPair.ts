// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/** A matching pair of columns in a foreign key relationship */
export interface ColumnPair {
  /** The id of the column on the table that owns the foreign key */
  parentTableColumnId: string;
  /** The id of the column on the target table of a foreign key */
  foreignTableColumnId: string;
}

export function newColumnPair(): ColumnPair {
  return {
    parentTableColumnId: '',
    foreignTableColumnId: '',
  };
}
