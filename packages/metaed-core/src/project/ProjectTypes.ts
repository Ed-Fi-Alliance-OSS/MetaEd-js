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
