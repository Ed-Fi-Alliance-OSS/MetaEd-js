// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { EntityProperty, MetaEdPropertyPath } from '@edfi/metaed-core';

/**
 * Identifier for a flattening table expressed as a MetaEd property path (empty string for the root table).
 */
export type TablePath = '' | MetaEdPropertyPath;

/**
 * The intermediate data structure used to describe each table produced by the flattening pipeline
 */
export type FlatteningTableNode = {
  /**
   * The MetaEd property path (or empty string for the root) uniquely identifying this table.
   */
  tablePath: MetaEdPropertyPath;

  /**
   * The property that materializes the table. Inline commons and choices are excluded.
   */
  property: EntityProperty;

  /**
   * The path of the parent table, if any. Empty string indicates this is the root table.
   */
  parentPath: TablePath;

  /**
   * The property chain leading to this table, including inline commons and choices for naming info.
   */
  propertyChain: EntityProperty[];
};
