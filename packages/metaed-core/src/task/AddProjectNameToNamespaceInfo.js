// @flow
import type { State } from '../State';
import type { NamespaceInfo } from '../model/NamespaceInfo';
import type { MetaEdProject } from '../project/ProjectTypes';

// derives NamespaceInfo's projectName from its namespace
export function addProjectNameToNamespaceInfo(state: State): void {
  const projects: Array<MetaEdProject> = state.metaEdConfiguration.projects;
  const namespaceInfos: Array<NamespaceInfo> = Array.from(state.metaEd.entity.namespaceInfo.values());

  namespaceInfos.forEach((namespaceInfo: NamespaceInfo) => {
    const matchingProject: ?MetaEdProject = projects.find((p: MetaEdProject) => p.namespace === namespaceInfo.namespace);
    if (matchingProject) namespaceInfo.projectName = matchingProject.projectName;
  });
}
