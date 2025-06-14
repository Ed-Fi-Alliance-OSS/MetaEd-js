// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { JsonPath } from './JsonPath';

/**
 * Represents an array uniqueness constraint with support for nested arrays
 */
export type ArrayUniquenessConstraint = {
  // Present only when this ArrayUniquenessConstraint is a nestedConstraint,
  // this is its parent ArrayUniquenessConstraint array path, and always of
  // the form $.XYZ[*]
  basePath?: JsonPath;

  // A list of scalar paths on an array, always of the form $.XYZ[*].something
  paths?: JsonPath[];

  // Nested ArrayUniquenessConstraints for nested arrays
  nestedConstraints?: ArrayUniquenessConstraint[];
};
