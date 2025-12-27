// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { JsonPath } from './JsonPath';
import type { RelationalBaseName } from './RelationalBaseName';

/**
 * Optional naming overrides that align JSON paths with relational base names.
 */
export type RelationalMetadata = {
  /**
   * Optional relational root table name override.
   */
  rootTableNameOverride?: RelationalBaseName;

  /**
   * Optional map of JSONPath to relational base name overrides.
   */
  nameOverrides?: { [key: JsonPath]: RelationalBaseName };
};
