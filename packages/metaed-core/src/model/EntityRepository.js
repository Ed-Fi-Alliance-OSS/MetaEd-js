// @flow
import type { Association } from './Association';
import type { AssociationExtension } from './AssociationExtension';
import type { AssociationSubclass } from './AssociationSubclass';
import type { Choice } from './Choice';
import type { Common } from './Common';
import type { CommonExtension } from './CommonExtension';
import type { DecimalType } from './DecimalType';
import type { Descriptor } from './Descriptor';
import type { DomainEntity } from './DomainEntity';
import type { DomainEntityExtension } from './DomainEntityExtension';
import type { DomainEntitySubclass } from './DomainEntitySubclass';
import type { Enumeration } from './Enumeration';
import type { IntegerType } from './IntegerType';
import type { Interchange } from './Interchange';
import type { InterchangeExtension } from './InterchangeExtension';
import type { MapTypeEnumeration } from './MapTypeEnumeration';
import type { NamespaceInfo } from './NamespaceInfo';
import type { SchoolYearEnumeration } from './SchoolYearEnumeration';
import type { SharedDecimal } from './SharedDecimal';
import type { SharedInteger } from './SharedInteger';
import type { SharedString } from './SharedString';
import type { StringType } from './StringType';
import type { Domain } from './Domain';
import type { Subdomain } from './Subdomain';
import type { ModelType } from './ModelType';
import type { ModelBase } from './ModelBase';
import type { TopLevelEntity } from './TopLevelEntity';
import { asTopLevelEntity } from './TopLevelEntity';
import {
  allEntityModelTypes,
  allTopLevelEntityModelTypes,
  topLevelCoreEntityModelTypes,
  allEntityModelTypesNoSimpleTypes,
} from './ModelType';

export class EntityRepository {
  unknown: Map<string, any>;
  association: Map<string, Association>;
  associationExtension: Map<string, AssociationExtension>;
  associationSubclass: Map<string, AssociationSubclass>;
  choice: Map<string, Choice>;
  common: Map<string, Common>;
  commonExtension: Map<string, CommonExtension>;
  decimalType: Map<string, DecimalType>;
  descriptor: Map<string, Descriptor>;
  domain: Map<string, Domain>;
  domainEntity: Map<string, DomainEntity>;
  domainEntityExtension: Map<string, DomainEntityExtension>;
  domainEntitySubclass: Map<string, DomainEntitySubclass>;
  enumeration: Map<string, Enumeration>;
  integerType: Map<string, IntegerType>;
  interchange: Map<string, Interchange>;
  interchangeExtension: Map<string, InterchangeExtension>;
  mapTypeEnumeration: Map<string, MapTypeEnumeration>;
  namespaceInfo: Map<string, NamespaceInfo>;
  schoolYearEnumeration: Map<string, SchoolYearEnumeration>;
  sharedDecimal: Map<string, SharedDecimal>;
  sharedInteger: Map<string, SharedInteger>;
  sharedString: Map<string, SharedString>;
  stringType: Map<string, StringType>;
  subdomain: Map<string, Subdomain>;
}

export function newEntityRepository(): EntityRepository {
  return Object.assign(new EntityRepository(), {
    unknown: new Map(),
    association: new Map(),
    associationExtension: new Map(),
    associationSubclass: new Map(),
    choice: new Map(),
    common: new Map(),
    commonExtension: new Map(),
    decimalType: new Map(),
    descriptor: new Map(),
    domain: new Map(),
    domainEntity: new Map(),
    domainEntityExtension: new Map(),
    domainEntitySubclass: new Map(),
    enumeration: new Map(),
    integerType: new Map(),
    interchange: new Map(),
    interchangeExtension: new Map(),
    mapTypeEnumeration: new Map(),
    namespaceInfo: new Map(),
    schoolYearEnumeration: new Map(),
    sharedDecimal: new Map(),
    sharedInteger: new Map(),
    sharedString: new Map(),
    stringType: new Map(),
    subdomain: new Map(),
  });
}

export function getAllEntities(repository: EntityRepository): Array<ModelBase> {
  const result = [];
  // $FlowIgnore - using model type repository lookup
  allEntityModelTypes.forEach(modelType => result.push(...repository[modelType].values()));
  return result;
}

export function getAllTopLevelEntities(repository: EntityRepository): Array<TopLevelEntity> {
  const result = [];
  // $FlowIgnore - using model type repository lookup
  allTopLevelEntityModelTypes.forEach(modelType => result.push(...repository[modelType].values()));
  return result;
}

export function getAllEntitiesNoSimpleTypes(repository: EntityRepository): Array<ModelBase> {
  const result = [];
  // $FlowIgnore - using model type repository lookup
  allEntityModelTypesNoSimpleTypes.forEach(modelType => result.push(...repository[modelType].values()));
  return result;
}
export function getEntitiesOfType(repository: EntityRepository, ...modelTypes: Array<ModelType>): Array<ModelBase> {
  const result = [];
  // $FlowIgnore - using model type repository lookup
  modelTypes.forEach(modelType => result.push(...repository[modelType].values()));
  return ((result: any): Array<ModelBase>);
}

export function getEntity(repository: EntityRepository, metaEdId: string, ...modelTypes: Array<ModelType>): ?ModelBase {
  let result: ?ModelBase = null;
  modelTypes.forEach(modelType => {
    // $FlowIgnore - using model type repository lookup
    if (!result) result = repository[modelType].get(metaEdId);
  });
  return result;
}

export function addEntity(repository: EntityRepository, entity: ModelBase) {
  // $FlowIgnore - indexing with type
  repository[entity.type].set(entity.metaEdName, entity);
}

export function getTopLevelCoreEntity(repository: EntityRepository, metaEdId: string): ?TopLevelEntity {
  let result: ?TopLevelEntity = null;
  topLevelCoreEntityModelTypes.forEach(modelType => {
    // $FlowIgnore - using model type repository lookup
    if (!result) result = asTopLevelEntity(repository[modelType].get(metaEdId));
  });
  return result;
}
