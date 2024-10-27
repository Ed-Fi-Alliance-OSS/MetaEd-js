import deepFreeze from 'deep-freeze';
import { EntityRepository } from './EntityRepository';
import { newEntityRepository } from './EntityRepository';

/**
 * A Namespace is the highest level of organization of entities, and maps to
 * a single MetaEd project. There is a namespace for the Data Standard
 * project and one for each extension project.
 */
export interface Namespace {
  entity: EntityRepository;
  namespaceName: string;
  isExtension: boolean;
  // Namespace dependencies, in closest dependency first order
  dependencies: Namespace[];
  projectExtension: string;
  projectName: string;
  projectVersion: string;
  projectDescription: string;
  extensionEntitySuffix: string;
  data: any;
}

/**
 *
 */
export const DefaultExtensionEntitySuffix = 'Extension';

/**
 *
 */
export function newNamespace(): Namespace {
  return {
    entity: newEntityRepository(),
    namespaceName: '',
    isExtension: false,
    dependencies: [],
    projectExtension: '',
    projectName: '',
    projectVersion: '',
    projectDescription: '',
    extensionEntitySuffix: DefaultExtensionEntitySuffix,
    data: {},
  };
}

/**
 *
 */
export const NoNamespace: Namespace = deepFreeze({
  ...newNamespace(),
  namespaceName: 'nonamespace',
  projectExtension: 'NoNamespace',
});
