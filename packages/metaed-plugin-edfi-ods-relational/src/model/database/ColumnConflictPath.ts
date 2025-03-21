// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdPropertyPath, TopLevelEntity } from '@edfi/metaed-core';

/**
 * A pair of MetaEdPropertyPaths for two properties that resolve to a single column conflict in a table.
 */
export type ColumnConflictPath = {
  firstPath: MetaEdPropertyPath;
  secondPath: MetaEdPropertyPath;
  firstOriginalEntity: TopLevelEntity;
  secondOriginalEntity: TopLevelEntity;
};
