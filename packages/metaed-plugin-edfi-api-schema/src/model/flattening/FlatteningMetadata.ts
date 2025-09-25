// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { TableMetadata } from './TableMetadata';

/**
 * Root flattening metadata structure for a resource.
 * Contains the complete table hierarchy for flattening a resource to relational tables.
 */
export interface FlatteningMetadata {
  /**
   * Root table metadata for the resource.
   * Can be either a core resource table or an extension table.
   * Contains recursive structure for all nested collections.
   */
  table: TableMetadata;
}
