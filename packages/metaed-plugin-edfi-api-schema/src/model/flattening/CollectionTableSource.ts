// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EntityProperty, MetaEdPropertyPath } from '@edfi/metaed-core';
import { JsonPath } from '../api-schema/JsonPath';

/**
 * Information on a collection property that is the source of a flattening child table.
 */
export type CollectionTableSource = {
  /**
   * Collection property that introduces a child table.
   */
  property: EntityProperty;

  /**
   * MetaEd property path describing the collection, including any inline or choice prefixes.
   */
  propertyPath: MetaEdPropertyPath;

  /**
   * JsonPath pointing to the collection container (e.g., `$.addresses[*]`).
   */
  collectionJsonPath: JsonPath | null;
};
