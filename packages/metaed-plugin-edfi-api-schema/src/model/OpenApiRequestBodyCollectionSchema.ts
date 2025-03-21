// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { OpenApiObject } from './OpenApi';

/**
 * The OpenApiProperty defines both a schema and its property name for request body collections
 */

export type OpenApiRequestBodyCollectionSchema = {
  schema: OpenApiObject;
  propertyName: string;
};
