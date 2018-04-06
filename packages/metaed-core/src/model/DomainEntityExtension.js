// @flow
import type { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import type { ModelBase } from './ModelBase';

export type DomainEntityExtensionSourceMap = TopLevelEntitySourceMap;

export function newDomainEntityExtensionSourceMap(): DomainEntityExtensionSourceMap {
  return newTopLevelEntitySourceMap();
}

export type DomainEntityExtension = {
  sourceMap: DomainEntityExtensionSourceMap,
  ...$Exact<TopLevelEntity>,
};

export function newDomainEntityExtension(): DomainEntityExtension {
  return {
    ...newTopLevelEntity(),
    type: 'domainEntityExtension',
    typeHumanizedName: 'Domain Entity Extension',
    sourceMap: newDomainEntityExtensionSourceMap(),
  };
}

export const asDomainEntityExtension = (x: ModelBase): DomainEntityExtension => ((x: any): DomainEntityExtension);
