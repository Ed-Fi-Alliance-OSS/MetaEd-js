// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { JsonPath } from '../api-schema/JsonPath';
import type { RelationalBaseName } from '../api-schema/RelationalBaseName';

/**
 * Captures derived JSON and relational base names keyed by JsonPath.
 *
 * A base name is the stable PascalCase token that aligns JSON paths to relational naming,
 * before downstream suffixing/combining rules apply. For example:
 * - Collection table paths map to the singularized collection base name (table suffix).
 * - Reference object paths map to the reference name without the "Reference" suffix.
 * - Scalar paths map to the JSON property name before column suffixes like "DescriptorId".
 *
 * These base names are compared later to decide whether a relational name override is required.
 */
export type RelationalNamingPlan = {
  /**
   * JSON‑side base names keyed by JsonPath, derived from API naming rules like
   * top‑level collision handling, collection naming, reference object naming
   */
  jsonBaseNames: { [key: JsonPath]: RelationalBaseName };

  /**
   * Relational‑side base names keyed by the same JsonPaths, derived from
   * relational naming conventions for tables/columns. Populated
   * by the relational naming plan enhancer so we can compare JSON vs
   * relational names and produce overrides.
   */
  relationalBaseNames: { [key: JsonPath]: RelationalBaseName };
};
