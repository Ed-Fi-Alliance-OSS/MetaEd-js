// @flow
import type { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import type { ModelBase } from './ModelBase';

export type DomainEntitySubclassSourceMap = TopLevelEntitySourceMap;

export function newDomainEntitySubclassSourceMap(): DomainEntitySubclassSourceMap {
  return newTopLevelEntitySourceMap();
}

export type DomainEntitySubclass = {
  sourceMap: DomainEntitySubclassSourceMap,
  ...$Exact<TopLevelEntity>,
};

export function newDomainEntitySubclass(): DomainEntitySubclass {
  return {
    ...newTopLevelEntity(),
    type: 'domainEntitySubclass',
    typeHumanizedName: 'Domain Entity Subclass',
    sourceMap: newDomainEntitySubclassSourceMap(),
  };
}

export const asDomainEntitySubclass = (x: ModelBase): DomainEntitySubclass => ((x: any): DomainEntitySubclass);
