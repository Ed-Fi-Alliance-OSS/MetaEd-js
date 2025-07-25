// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { BrandType } from '@edfi/metaed-core';

/**
 * A string type branded as a DomainName, which is metaEdName for a Domain
 */
export type DomainName = BrandType<string, 'DomainName'>;
