// @flow
import type { State } from '../State';
import type { Namespace } from '../model/Namespace';
import type { MetaEdProject } from '../project/ProjectTypes';

// derives Namespace's projectName from its namespaceName
export function addProjectNameToNamespace(state: State): void {
  const { projects }: { projects: Array<MetaEdProject> } = state.metaEdConfiguration;
  const namespaces: Array<Namespace> = Array.from(state.metaEd.namespace.values());

  namespaces.forEach((namespace: Namespace) => {
    const matchingProject: ?MetaEdProject = projects.find((p: MetaEdProject) => p.namespaceName === namespace.namespaceName);
    if (matchingProject) {
      namespace.projectName = matchingProject.projectName;
      namespace.projectVersion = matchingProject.projectVersion;
    }
  });
}

// Setting up extension namespace dependencies only to the core namespace
// This will change completely if/when we support extensions of extensions.
export function setupNamespaceDependencyOrdering(state: State): void {
  const coreNamespace: ?Namespace = Array.from(state.metaEd.namespace.values()).find(
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
