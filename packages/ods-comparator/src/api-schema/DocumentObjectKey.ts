// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { BrandType } from '@edfi/metaed-core';

/**
 * A string type branded as a DocumentObjectKey, which is standard JSON document object key
 */
export type DocumentObjectKey = BrandType<string, 'DocumentObjectKey'>;
