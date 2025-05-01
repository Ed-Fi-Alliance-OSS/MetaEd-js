// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { JsonPath } from './JsonPath';
import { PathType } from './PathType';

/**
 * JsonPath information for a document reference and it's corresponding identity in the referenced document.
 * This information is used to ensure that construction of a DocumentReference by an API implementation
 * can use the correct naming to match the DocumentIdentity of the document being referenced.
 *
 * For example, a document might have a reference to a School, which has schoolId as an element of its identity.
 * The reference JsonPath would look like "$.schoolReference.schoolId". On a School document, the schoolId element
 * is defined as a scalar and so its identity JsonPath would be "$.schoolId".
 */
export type ReferenceJsonPaths = {
  /**
   * The JsonPath for an element of the reference in the referring document
   */
  referenceJsonPath: JsonPath;

  /**
   * The corresponding JsonPath for the identity element in the document being referenced
   */
  identityJsonPath: JsonPath;

  /**
   * Type of the reference JsonPath
   */
  type: PathType;
};
