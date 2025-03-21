// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { EducationOrganizationSecurityElement } from './EducationOrganizationSecurityElement';
import { JsonPath } from './JsonPath';

/**
 * A list of the elements this resource can be secured on, along with the JsonPaths to those elements.
 */
export type SecurityElements = {
  Namespace: JsonPath[];
  EducationOrganization: EducationOrganizationSecurityElement[];
};
