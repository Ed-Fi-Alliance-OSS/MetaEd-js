// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EntityProperty, MetaEdPropertyPath } from '@edfi/metaed-core';
import { PropertyModifier } from '../PropertyModifier';
import { FlatteningTableAnchor } from './FlatteningTableAnchor';

/**
 * Flattening-aware view of a collected property. Supplies the full MetaEd property path as well as
 * the collection anchor the property belongs to so downstream enhancers can determine table
 * membership without recomputing traversal metadata.
 */
export type FlatteningPropertyChain = {
  /**
   * Terminal property collected from the MetaEd model.
   */
  property: EntityProperty;

  /**
   * Naming and optionality modifiers inherited from parent properties.
   */
  propertyModifier: PropertyModifier;

  /**
   * Ordered list of properties (including inline commons and choices) that lead to the terminal property.
   */
  propertyChain: EntityProperty[];

  /**
   * Dot-separated property path composed of each element in propertyChain.
   * Aligns with keys in document paths and JSON path mappings.
   */
  fullPropertyPath: MetaEdPropertyPath;

  /**
   * The collection property that anchors a flattening table, if any.
   * Null indicates the property belongs to the root resource table.
   */
  owningCollection: FlatteningTableAnchor | null;

  /**
   * Property chain scoped to the owning collection. For root-level properties this matches propertyChain.
   * For collection members the chain excludes the collection anchor.
   */
  relativePropertyChain: EntityProperty[];

  /**
   * Dot-separated property path corresponding to relativePropertyChain. Empty string when the path
   * resolves to the collection anchor itself.
   */
  relativePropertyPath: MetaEdPropertyPath;
};
