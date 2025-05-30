// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { BrandType } from '@edfi/metaed-core';

/**
 * A string type branded as an AuthorizationPathway, which represents the path the authorization logic
 * should take to calculate the EducationOrganizations that can reach the related Securable Document(s).
 */
export type AuthorizationPathway = BrandType<string, 'AuthorizationPathway'>;
