// @flow
import type { Validator } from '../core/validator/Validator';

export type MetaEdPlugin = {
  validators: Array<Validator>,
}

export function defaultMetaEdPlugin(): MetaEdPlugin {
  return {
    validators: [],
  };
}

export const NoMetaEdPlugin = defaultMetaEdPlugin();

export type PluginManifest = {
  npmName: string,
  version: string,
  mainModule: string,
  pluginName: string,
  displayName: string,
  author: string,
  metaEdVersion: string,
  dependencies: Array<string>,
  plugin: MetaEdPlugin,
  enabled: boolean,
}

export type PluginData = {
  todo: string
}

export type MetaEdCore = {
  exampleIsModelObjectFactory: string,
}
