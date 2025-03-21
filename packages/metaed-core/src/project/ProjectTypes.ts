// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { SemVer } from '../MetaEdEnvironment';
import { uppercaseThenAlphanumericOnly } from '../Utility';

export interface MetaEdProject {
  namespaceName: string;
  projectName: string;
  projectVersion: SemVer;
  description: string;
  projectExtension?: string;
}

export interface MetaEdProjectPathPairs {
  path: string;
  project: MetaEdProject;
}

export const newMetaEdProject: () => MetaEdProject = () => ({
  namespaceName: '',
  projectName: '',
  projectVersion: '0.0.0',
  description: '',
  projectExtension: '',
});

export const deriveNamespaceFromProjectName = (projectName: string): string | null =>
  uppercaseThenAlphanumericOnly(projectName);

export const isDataStandard = (project: MetaEdProject): boolean => project.namespaceName === 'EdFi';

export function findDataStandardVersions(projects: MetaEdProject[]): SemVer[] {
  return projects.filter((project) => isDataStandard(project)).map((project) => project.projectVersion);
}
