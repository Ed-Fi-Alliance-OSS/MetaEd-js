// @flow
import type { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';
import type { ModelType } from './ModelType';

export type NamespaceInfoSourceMap = {
  type: SourceMap,
  namespace: SourceMap,
  isExtension: SourceMap,
  projectExtension: SourceMap,
  projectName: SourceMap,
  extensionEntitySuffix: SourceMap,
};

export function newNamespaceInfoSourceMap(): NamespaceInfoSourceMap {
  return {
    type: NoSourceMap,
    namespace: NoSourceMap,
    isExtension: NoSourceMap,
    projectExtension: NoSourceMap,
    projectName: NoSourceMap,
    extensionEntitySuffix: NoSourceMap,
  };
}

export type NamespaceInfo = {
  type: ModelType,
  namespace: string,
  isExtension: boolean,
  projectExtension: string,
  projectName: string,
  extensionEntitySuffix: string,
  sourceMap: NamespaceInfoSourceMap,
  data: any,
  config: any,
};

export const DefaultExtensionEntitySuffix: string = 'Extension';

export function newNamespaceInfo(): NamespaceInfo {
  return {
    type: 'namespaceInfo',
    namespace: '',
    isExtension: false,
    projectExtension: '',
    projectName: '',
    extensionEntitySuffix: DefaultExtensionEntitySuffix,
    sourceMap: newNamespaceInfoSourceMap(),
    data: {},
    config: {},
  };
}

export const NoNamespaceInfo: NamespaceInfo = {
  ...newNamespaceInfo(),
  namespace: 'nonamespaceinfo',
  projectExtension: 'NoNamespaceInfo',
};
