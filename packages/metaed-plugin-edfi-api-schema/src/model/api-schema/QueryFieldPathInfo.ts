// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { EntityProperty } from '@edfi/metaed-core';
import type { JsonPath } from './JsonPath';
import type { PathType } from './PathType';

/**
 * The path information for a query field. sourceProperty must be stripped out before QueryFieldPathInfo
 * can be stringified.
 */
export type QueryFieldPathInfo = { path: JsonPath; type: PathType; sourceProperty?: EntityProperty };
