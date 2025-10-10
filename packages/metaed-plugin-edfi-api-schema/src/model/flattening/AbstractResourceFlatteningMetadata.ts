// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/**
 * ApiSchema metadata for superclass resources.
 * Used to define union views that combine multiple concrete subclasses.
 */
export type AbstractResourceFlatteningMetadata = {
  /**
   * List of concrete subclass resource names that implement this abstract resource.
   * Example: ['schools', 'localEducationAgencies', 'stateEducationAgencies'] for EducationOrganization
   */
  subclassTypes: string[];

  /**
   * Name of the union view that provides polymorphic access to all subclasses.
   * Example: 'EducationOrganization' for the EducationOrganization abstract resource
   */
  unionViewName: string;
};
