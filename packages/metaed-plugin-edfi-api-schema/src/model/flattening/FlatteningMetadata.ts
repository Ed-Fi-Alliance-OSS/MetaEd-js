// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { MetaEdPropertyFullName } from '@edfi/metaed-core';
import type { TableMetadata } from './TableMetadata';

/**
 * ResourceSchema metadata describing how a subclass maps to its superclass identity.
 * Enables downstream enhancers to mark columns that participate in superclass joins.
 */
export type SuperclassIdentityMetadata = {
  /**
   * Fully-qualified MetaEd property name for the identity property renamed from the superclass.
   */
  identityPropertyFullName: MetaEdPropertyFullName;
};

/**
 * ResourceSchema metadata for the root flattening metadata structure
 * Contains the complete table hierarchy for flattening a resource to relational tables.
 */
export type FlatteningMetadata = {
  /**
   * Root table metadata for the resource.
   * Can be either a core resource table or an extension table.
   * Contains recursive structure for all nested collections.
   */
  table: TableMetadata;

  /**
   * Identity information inherited from a superclass when the resource is a subclass.
   * Undefined for non-subclass resources.
   */
  superclassIdentity?: SuperclassIdentityMetadata;
};
