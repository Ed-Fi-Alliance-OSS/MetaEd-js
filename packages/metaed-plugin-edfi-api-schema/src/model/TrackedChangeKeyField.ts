// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { BrandType, EntityProperty } from '@edfi/metaed-core';

/**
 * A string type branded as a tracked-change key field name, which is the public field name used in OpenAPI key schemas.
 */
export type TrackedChangeKeyFieldName = BrandType<string, 'TrackedChangeKeyFieldName'>;

/**
 * A public tracked-change key field derived from semantic identity metadata.
 */
export type TrackedChangeKeyField = {
  fieldName: TrackedChangeKeyFieldName;
  sourceProperty: EntityProperty;
};
