// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { QueryFieldPathInfo } from './QueryFieldPathInfo';

/**
 * A mapping from a query field string to a list of QueryFieldPathInfo, providing JsonPaths in the document that
 * should be part of the query.
 */
export type QueryFieldMapping = { [queryField: string]: QueryFieldPathInfo[] };
