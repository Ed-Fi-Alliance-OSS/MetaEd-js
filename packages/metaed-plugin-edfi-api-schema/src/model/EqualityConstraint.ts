// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { JsonPath } from './api-schema/JsonPath';

/**
 * A pair of JsonPaths, the value of which must be equal in an Ed-Fi API JSON document.
 */
export type EqualityConstraint = {
  sourceJsonPath: JsonPath;
  targetJsonPath: JsonPath;
};

export function newEqualityConstraint(): EqualityConstraint {
  return {
    sourceJsonPath: '' as JsonPath,
    targetJsonPath: '' as JsonPath,
  };
}
