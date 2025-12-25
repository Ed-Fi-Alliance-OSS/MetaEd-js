// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { JsonPath } from '../api-schema/JsonPath';
import type { RelationalBaseName } from '../api-schema/RelationalBaseName';

/**
 * Intermediate relational name override mapping keyed by JsonPath.
 */
export type RelationalNameOverrides = { [key: JsonPath]: RelationalBaseName };
