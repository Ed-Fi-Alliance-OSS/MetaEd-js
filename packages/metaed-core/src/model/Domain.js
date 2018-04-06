// @flow
import type { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import type { DomainItem } from './DomainItem';
import type { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';
import type { Subdomain } from './Subdomain';
import type { ModelBase } from './ModelBase';

export type DomainSourceMap = {
  ...$Exact<TopLevelEntitySourceMap>,
  domainItems: Array<SourceMap>,
  entities: Array<SourceMap>,
  footerDocumentation: SourceMap,
  subdomains: Array<SourceMap>,
};

export function newDomainSourceMap(): DomainSourceMap {
  return {
    ...newTopLevelEntitySourceMap(),
    domainItems: [],
    entities: [],
    footerDocumentation: NoSourceMap,
    subdomains: [],
  };
}

export type Domain = {
  sourceMap: DomainSourceMap,
  ...$Exact<TopLevelEntity>,
  domainItems: Array<DomainItem>,
  entities: Array<TopLevelEntity>,
  footerDocumentation: string,
  subdomains: Array<Subdomain>,
};

export function newDomain(): Domain {
  return {
    ...newTopLevelEntity(),
    type: 'domain',
    typeHumanizedName: 'Domain',
    domainItems: [],
    entities: [],
    footerDocumentation: '',
    subdomains: [],
    sourceMap: newDomainSourceMap(),
  };
}

export const NoDomain: Domain = {
  ...newDomain(),
  metaEdName: 'NoDomain',
};

export const asDomain = (x: ModelBase): Domain => ((x: any): Domain);

export const asDomainBase = (x: ModelBase): Domain | Subdomain => ((x: any): Domain | Subdomain);
