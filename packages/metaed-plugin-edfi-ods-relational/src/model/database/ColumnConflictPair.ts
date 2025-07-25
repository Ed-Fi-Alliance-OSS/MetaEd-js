// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { Column } from './Column';

/**
 * A pair of columns that conflict in a table and require an implicit merge.
 */
export type ColumnConflictPair = {
  firstColumn: Column;
  secondColumn: Column;
};
