// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { EntityProperty, MetaEdPropertyPath } from '@edfi/metaed-core';
import type { JsonPath } from '../api-schema/JsonPath';

/**
 * Identifier for a relational table expressed as a MetaEd property path (empty string for the root table).
 */
export type RelationalTablePath = '' | MetaEdPropertyPath;

/**
 * The intermediate data structure used to describe each relational table produced by the collection pipeline.
 */
export type RelationalTableNode = {
  /**
   * The MetaEd property path uniquely identifying this table.
   */
  tablePath: MetaEdPropertyPath;

  /**
   * The collection property that materializes the table.
   */
  property: EntityProperty;

  /**
   * The path of the parent table, if any. Empty string indicates this is the root table.
   */
  parentPath: RelationalTablePath;

  /**
   * The property chain leading to this table, including inline commons and choices for naming info.
   */
  propertyChain: EntityProperty[];

  /**
   * JsonPath pointing to the collection that materializes this table, if available.
   */
  collectionJsonPath: JsonPath | null;
};
