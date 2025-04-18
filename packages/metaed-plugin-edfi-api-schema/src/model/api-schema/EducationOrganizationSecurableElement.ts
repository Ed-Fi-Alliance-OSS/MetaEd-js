// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { JsonPath } from './JsonPath';

export type EducationOrganizationSecurableElement = {
  /**
   * The MetaEd property name for the security element
   */
  metaEdName: string;

  /**
   * The JsonPath in the API document for the security element
   */
  jsonPath: JsonPath;
};
