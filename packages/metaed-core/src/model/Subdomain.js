// @flow
import { newDomain } from './Domain';
import type { Domain } from './Domain';
import type { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';
import type { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import type { DomainItem } from './DomainItem';
import type { ModelBase } from './ModelBase';

export type SubdomainSourceMap = {
  ...$Exact<TopLevelEntitySourceMap>,
  domainItems: Array<SourceMap>,
  entities: Array<SourceMap>,
  parent: ?SourceMap,
  parentMetaEdName: ?SourceMap,
  position: ?SourceMap,
};

export function newSubdomainSourceMap(): SubdomainSourceMap {
  return {
    ...newTopLevelEntitySourceMap(),
    domainItems: [],
    entities: [],
    parent: NoSourceMap,
    parentMetaEdName: NoSourceMap,
    position: NoSourceMap,
  };
}

export type Subdomain = {
  sourceMap: SubdomainSourceMap,
  ...$Exact<TopLevelEntity>,
  domainItems: Array<DomainItem>,
  entities: Array<TopLevelEntity>,
  parent: Domain,
  parentMetaEdName: string,
  position: number,
};

export function newSubdomain(): Subdomain {
  return {
    ...newTopLevelEntity(),
    type: 'subdomain',
    typeHumanizedName: 'Subdomain',
    domainItems: [],
    entities: [],
    parent: newDomain(),
    parentMetaEdName: '',
    position: 0,
    sourceMap: newSubdomainSourceMap(),
  };
}

export const asSubdomain = (x: ModelBase): Subdomain => ((x: any): Subdomain);
