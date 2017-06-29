// @flow
import type { Association } from './Association';
import type { AssociationExtension } from './AssociationExtension';
import type { AssociationSubclass } from './AssociationSubclass';
import type { Choice } from './Choice';
import type { Common } from './Common';
import type { CommonExtension } from './CommonExtension';
import type { Descriptor } from './Descriptor';
import type { DomainEntity } from './DomainEntity';
import type { DomainEntityExtension } from './DomainEntityExtension';
import type { DomainEntitySubclass } from './DomainEntitySubclass';
import type { Enumeration } from './Enumeration';
import type { Interchange } from './Interchange';
import type { InterchangeExtension } from './InterchangeExtension';
import type { MapTypeEnumeration } from './MapTypeEnumeration';
import type { NamespaceInfo } from './NamespaceInfo';
import type { SchoolYearEnumeration } from './SchoolYearEnumeration';
import type { SharedDecimal } from './SharedDecimal';
import type { SharedInteger } from './SharedInteger';
import type { SharedString } from './SharedString';
import type { Domain } from './Domain';
import type { Subdomain } from './Subdomain';
import type { PropertyRepository } from './property/PropertyRepository';
import { propertyRepositoryFactory } from './property/PropertyRepository';

export class EntityRepository {
  association: Map<string, Association>;
  associationExtension: Map<string, AssociationExtension>;
  associationSubclass: Map<string, AssociationSubclass>;
  choice: Map<string, Choice>;
  common: Map<string, Common>;
  commonExtension: Map<string, CommonExtension>;
  descriptor: Map<string, Descriptor>;
  domain: Map<string, Domain>;
  domainEntity: Map<string, DomainEntity>;
  domainEntityExtension: Map<string, DomainEntityExtension>;
  domainEntitySubclass: Map<string, DomainEntitySubclass>;
  enumeration: Map<string, Enumeration>;
  interchange: Map<string, Interchange>;
  interchangeExtension: Map<string, InterchangeExtension>;
  mapTypeEnumeration: Map<string, MapTypeEnumeration>;
  namespaceInfo: Array<NamespaceInfo>;
  schoolYearEnumeration: Map<string, SchoolYearEnumeration>;
  sharedDecimal: Map<string, SharedDecimal>;
  sharedInteger: Map<string, SharedInteger>;
  sharedString: Map<string, SharedString>;
  subdomain: Map<string, Subdomain>;
}

export function entityRepositoryFactory(): EntityRepository {
  return Object.assign(new EntityRepository(), {
    association: new Map(),
    associationExtension: new Map(),
    associationSubclass: new Map(),
    choice: new Map(),
    common: new Map(),
    commonExtension: new Map(),
    descriptor: new Map(),
    domain: new Map(),
    domainEntity: new Map(),
    domainEntityExtension: new Map(),
    domainEntitySubclass: new Map(),
    enumeration: new Map(),
    interchange: new Map(),
    interchangeExtension: new Map(),
    mapTypeEnumeration: new Map(),
    namespaceInfo: [],
    schoolYearEnumeration: new Map(),
    sharedDecimal: new Map(),
    sharedInteger: new Map(),
    sharedString: new Map(),
    subdomain: new Map(),
  });
}

export class Repository {
  configuration: any;
  entity: EntityRepository;
  property: PropertyRepository;
}

export function repositoryFactory(): Repository {
  return Object.assign(new Repository(), {
    configuration: null,
    entity: entityRepositoryFactory(),
    property: propertyRepositoryFactory(),
  });
}

export type MostEntities =
  Association |
  AssociationSubclass |
  Choice |
  Common |
  DomainEntity |
  DomainEntitySubclass |
  SharedDecimal |
  SharedInteger |
  SharedString;

// Domains, Subdomains, Interchanges, Enumerations and Descriptors don't have standard cross entity naming issues
// and extension entities don't define a new identifier
export function entitiesNeedingDuplicateChecking(repository: Repository): Array<MostEntities> {
  const result: Array<MostEntities> = [];
  result.push(...repository.entity.association.values());
  result.push(...repository.entity.associationSubclass.values());
  result.push(...repository.entity.choice.values());
  result.push(...repository.entity.common.values());
  result.push(...repository.entity.domainEntity.values());
  result.push(...repository.entity.domainEntitySubclass.values());
  result.push(...repository.entity.sharedDecimal.values());
  result.push(...repository.entity.sharedInteger.values());
  result.push(...repository.entity.sharedString.values());
  return result;
}
