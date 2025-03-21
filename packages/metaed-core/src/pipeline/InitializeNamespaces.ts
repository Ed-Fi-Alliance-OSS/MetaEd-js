// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { State } from '../State';
import { Namespace } from '../model/Namespace';
import { MetaEdProject } from '../project/ProjectTypes';

// derives Namespace's projectName from its namespaceName
export function addProjectNameToNamespace(state: State): void {
  const { projects }: { projects: MetaEdProject[] } = state.metaEdConfiguration;
  const namespaces: Namespace[] = Array.from(state.metaEd.namespace.values());

  namespaces.forEach((namespace: Namespace) => {
    const matchingProject: MetaEdProject | undefined = projects.find(
      (p: MetaEdProject) => p.namespaceName === namespace.namespaceName,
    );
    if (matchingProject) {
      namespace.projectName = matchingProject.projectName;
      namespace.projectVersion = matchingProject.projectVersion;
      namespace.projectDescription = matchingProject.description;
    }
  });
}

// Setting up extension namespace dependencies only to the core namespace
// This will change completely if/when we support extensions of extensions.
export function setupNamespaceDependencyOrdering(state: State): void {
  const coreNamespace: Namespace | undefined = Array.from(state.metaEd.namespace.values()).find(
    (namespace: Namespace) => !namespace.isExtension,
  );

  if (coreNamespace == null) return;

  state.metaEd.namespace.forEach((namespace: Namespace) => {
    if (namespace.isExtension) namespace.dependencies.push(coreNamespace);
  });
}

export function initializeNamespaces(state: State): void {
  addProjectNameToNamespace(state);
  setupNamespaceDependencyOrdering(state);
}
