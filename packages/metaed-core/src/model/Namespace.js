// @flow
import deepFreeze from 'deep-freeze';
import type { EntityRepository } from './EntityRepository';
import { newEntityRepository } from './EntityRepository';

/**
 *
 */
export type Namespace = {
  entity: EntityRepository,
  namespaceName: string,
  isExtension: boolean,
  // Namespace dependencies, in closest dependency first order
  dependencies: Array<Namespace>,
  projectExtension: string,
  projectName: string,
  projectVersion: string,
  extensionEntitySuffix: string,
  data: any,
  config: any,

  // remove these
  type: boolean,
  sourceMap: boolean,
};

/**
 *
 */
export const DefaultExtensionEntitySuffix: string = 'Extension';

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
