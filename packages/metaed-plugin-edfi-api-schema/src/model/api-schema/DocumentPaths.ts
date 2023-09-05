// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { JsonPath } from './JsonPath';

/**
 * JsonPath information for a reference MetaEd property
 */
export type ReferencePaths = {
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
   * An ordered array of JsonPaths mapping to the corresponding data elements in the API document.
   *
   * As an example, these are the JsonPaths for CourseOffering on Section, a reference with four fields:
   *
   * [
   *   '$.courseOfferingReference.localCourseCode',
   *   '$.courseOfferingReference.schoolId',
   *   '$.courseOfferingReference.schoolYear',
   *   '$.courseOfferingReference.sessionName',
   * ]
   *
   * Arrays are always in sorted order.
   */
  paths: JsonPath[];
};

/**
 * A JsonPath for a scalar MetaEd property
 */
export type ScalarPath = {
  /**
   * Discriminator between reference and scalar path types
   */
  isReference: false;

  /**
   * A JsonPath mapping to the corresponding data element in the API document.
   *
   * As an example, this is the JsonPath for SectionIdentifier on Section:
   *
   * '$.sectionIdentifier'
   */
  path: JsonPath;
};

/**
 * DocumentPaths provides JsonPaths to values corresponding to reference and scalar MetaEd properties in a resource document.
 */
export type DocumentPaths = ReferencePaths | ScalarPath;
