// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { JsonPath } from './JsonPath';
import { ReferenceJsonPaths } from './ReferenceJsonPaths';

/**
 * JsonPath information for a reference MetaEd property
 */
export type DocumentReferencePaths = {
  /**
   * Discriminator between reference and scalar path types
   */
  isReference: true;

  /**
   * The MetaEd project name the referenced API resource is defined in e.g. "EdFi" for a data standard entity.
   */
  projectName: string;

  /**
   * The name of the referenced API resource. Typically, this is the same as the corresponding MetaEd entity name. However,
   * there are exceptions, for example descriptors have a "Descriptor" suffix on their resource name.
   */
  resourceName: string;

  /**
   * Whether this reference is a descriptor. Descriptors are treated differently from other documents
   */
  isDescriptor: boolean;

  /**
   * JsonPath information for a document reference and it's corresponding identity in the referenced document.
   * This information is used to ensure that construction of a DocumentReference by an API implementation
   * can use the correct naming to match the DocumentIdentity of the document being referenced.
   *
   * The array is in the correct identity ordering for constructing an identity hash.
   *
   * For example, this is the referenceJsonPaths for CourseOffering on Section:
   *  [
   *    {
   *      "identityJsonPath": "$.localCourseCode",
   *      "referenceJsonPath": "$.courseOfferingReference.localCourseCode"
   *    },
   *    {
   *      "identityJsonPath": "$.schoolReference.schoolId",
   *      "referenceJsonPath": "$.courseOfferingReference.schoolId"
   *    },
   *    {
   *      "identityJsonPath": "$.sessionReference.schoolYear",
   *      "referenceJsonPath": "$.courseOfferingReference.schoolYear"
   *    },
   *    {
   *      "identityJsonPath": "$.sessionReference.sessionName",
   *      "referenceJsonPath": "$.courseOfferingReference.sessionName"
   *    }
   *  ]
   */
  referenceJsonPaths: ReferenceJsonPaths[];
};

/**
 * A DocumentPaths for a descriptor MetaEd property
 */

export type DescriptorReferencePath = {
  /**
   * Discriminator between reference and scalar path types
   */
  isReference: true;

  /**
   * The MetaEd project name the referenced API resource is defined in e.g. "EdFi" for a data standard entity.
   */
  projectName: string;

  /**
   * The name of the referenced API resource. Typically, this is the same as the corresponding MetaEd entity name. However,
   * there are exceptions, for example descriptors have a "Descriptor" suffix on their resource name.
   */
  resourceName: string;

  /**
   * Whether this reference is a descriptor. Descriptors are treated differently from other documents
   */
  isDescriptor: true;

  /**
   * The JsonPath to the document value
   */
  path: JsonPath;
};

/**
 * A DocumentPaths for a scalar MetaEd property
 */
export type ScalarPath = {
  /**
   * Discriminator between reference and scalar path types
   */
  isReference: false;

  /**
   * The JsonPath to the scalar value
   */
  path: JsonPath;
};

/**
 * DocumentPaths provides JsonPaths to values corresponding to reference and scalar MetaEd properties in a resource document.
 */
export type DocumentPaths = DocumentReferencePaths | DescriptorReferencePath | ScalarPath;
