// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { BrandType } from '@edfi/metaed-core';

/**
 * A string type branded as a JsonPath, which is a standard JSONPath expression.
 * See https://goessner.net/articles/JsonPath/index.html
 */

export type JsonPath = BrandType<string, 'JsonPath'>;
