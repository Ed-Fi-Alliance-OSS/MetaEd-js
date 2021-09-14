import deepFreeze from 'deep-freeze';
import { EntityRepository } from './EntityRepository';
import { newEntityRepository } from './EntityRepository';

/**
 *
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
  config: any;

  // remove these
  type: boolean;
  sourceMap: boolean;
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
    config: {},

    type: false,
    sourceMap: false,
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
