import deepFreeze from 'deep-freeze';
import { TopLevelEntity, TopLevelEntitySourceMap } from './TopLevelEntity';
import { newTopLevelEntity, newTopLevelEntitySourceMap } from './TopLevelEntity';
import { DomainItem } from './DomainItem';
import { SourceMap } from './SourceMap';
import { NoSourceMap } from './SourceMap';
import { Subdomain } from './Subdomain';
import { ModelBase } from './ModelBase';

export interface DomainSourceMap extends TopLevelEntitySourceMap {
  domainItems: SourceMap[];
  entities: SourceMap[];
  footerDocumentation: SourceMap;
  subdomains: SourceMap[];
}

/**
 *
 */
export function newDomainSourceMap(): DomainSourceMap {
  return {
    ...newTopLevelEntitySourceMap(),
    domainItems: [],
    entities: [],
    footerDocumentation: NoSourceMap,
    subdomains: [],
  };
}

export interface Domain extends TopLevelEntity {
  sourceMap: DomainSourceMap;
  domainItems: DomainItem[];
  entities: TopLevelEntity[];
  footerDocumentation: string;
  subdomains: Subdomain[];
}

/**
 *
 */
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

/**
 *
 */
export const NoDomain: Domain = deepFreeze({
  ...newDomain(),
  metaEdName: 'NoDomain',
});

/**
 *
 */
export const asDomain = (x: ModelBase): Domain => x as Domain;

/**
 *
 */
export const asDomainBase = (x: ModelBase): Domain | Subdomain => x as Domain | Subdomain;
