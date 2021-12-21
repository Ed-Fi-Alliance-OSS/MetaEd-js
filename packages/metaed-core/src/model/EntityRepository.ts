import { MetaEdEnvironment } from '../MetaEdEnvironment';
import { Association } from './Association';
import { AssociationExtension } from './AssociationExtension';
import { AssociationSubclass } from './AssociationSubclass';
import { Choice } from './Choice';
import { Common } from './Common';
import { CommonExtension } from './CommonExtension';
import { CommonSubclass } from './CommonSubclass';
import { DecimalType } from './DecimalType';
import { Descriptor } from './Descriptor';
import { DomainEntity } from './DomainEntity';
import { DomainEntityExtension } from './DomainEntityExtension';
import { DomainEntitySubclass } from './DomainEntitySubclass';
import { Enumeration } from './Enumeration';
import { IntegerType } from './IntegerType';
import { Interchange } from './Interchange';
import { InterchangeExtension } from './InterchangeExtension';
import { MapTypeEnumeration } from './MapTypeEnumeration';
import { Namespace } from './Namespace';
import { SchoolYearEnumeration } from './SchoolYearEnumeration';
import { SharedDecimal } from './SharedDecimal';
import { SharedInteger } from './SharedInteger';
import { SharedString } from './SharedString';
import { StringType } from './StringType';
import { Domain } from './Domain';
import { Subdomain } from './Subdomain';
import { ModelType } from './ModelType';
import { ModelBase } from './ModelBase';
import { TopLevelEntity } from './TopLevelEntity';
import { allEntityModelTypes, allTopLevelEntityModelTypes, allEntityModelTypesNoSimpleTypes } from './ModelType';

/**
 *
 */
export interface EntityRepository {
  unknown: Map<string, any>;
  association: Map<string, Association>;
  associationExtension: Map<string, AssociationExtension>;
  associationSubclass: Map<string, AssociationSubclass>;
  choice: Map<string, Choice>;
  common: Map<string, Common>;
  commonExtension: Map<string, CommonExtension>;
  commonSubclass: Map<string, CommonSubclass>;
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
  schoolYearEnumeration: Map<string, SchoolYearEnumeration>;
  sharedDecimal: Map<string, SharedDecimal>;
  sharedInteger: Map<string, SharedInteger>;
  sharedString: Map<string, SharedString>;
  stringType: Map<string, StringType>;
  subdomain: Map<string, Subdomain>;
}

/**
 *
 */
export function newEntityRepository(): EntityRepository {
  return {
    unknown: new Map(),
    association: new Map(),
    associationExtension: new Map(),
    associationSubclass: new Map(),
    choice: new Map(),
    common: new Map(),
    commonExtension: new Map(),
    commonSubclass: new Map(),
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
    schoolYearEnumeration: new Map(),
    sharedDecimal: new Map(),
    sharedInteger: new Map(),
    sharedString: new Map(),
    stringType: new Map(),
    subdomain: new Map(),
  };
}

/**
 *
 */
export function getAllEntities(repository: EntityRepository): ModelBase[] {
  const result: ModelBase[] = [];
  allEntityModelTypes.forEach((modelType) => result.push(...repository[modelType].values()));
  return result;
}

/**
 *
 */
export function getAllEntitiesForNamespaces(namespaces: Namespace[]): ModelBase[] {
  const result: ModelBase[] = [];
  namespaces.forEach((namespace: Namespace) => {
    result.push(...getAllEntities(namespace.entity));
  });
  return result;
}

/**
 *
 */
export function getAllTopLevelEntities(repository: EntityRepository): TopLevelEntity[] {
  const result: TopLevelEntity[] = [];
  allTopLevelEntityModelTypes.forEach((modelType) => result.push(...repository[modelType].values()));
  return result;
}

/**
 *
 */
export function getAllTopLevelEntitiesForNamespaces(namespaces: Namespace[]): TopLevelEntity[] {
  const result: TopLevelEntity[] = [];
  namespaces.forEach((namespace: Namespace) => {
    result.push(...getAllTopLevelEntities(namespace.entity));
  });
  return result;
}

/**
 *
 */
export function getAllEntitiesNoSimpleTypes(repository: EntityRepository): ModelBase[] {
  const result: ModelBase[] = [];
  allEntityModelTypesNoSimpleTypes.forEach((modelType) => result.push(...repository[modelType].values()));
  return result;
}

/**
 *
 */
export function getAllEntitiesNoSimpleTypesForNamespaces(namespaces: Namespace[]): ModelBase[] {
  const result: ModelBase[] = [];
  namespaces.forEach((namespace: Namespace) => {
    result.push(...getAllEntitiesNoSimpleTypes(namespace.entity));
  });
  return result;
}

/**
 *
 */
export function getEntitiesOfType(repository: EntityRepository, ...modelTypes: ModelType[]): ModelBase[] {
  const result: ModelBase[] = [];
  modelTypes.forEach((modelType) => result.push(...repository[modelType].values()));
  return result;
}

/**
 *
 */
export function getEntitiesOfTypeForNamespaces(namespaces: Namespace[], ...modelTypes: ModelType[]): ModelBase[] {
  const result: ModelBase[] = [];
  namespaces.forEach((namespace: Namespace) => {
    result.push(...getEntitiesOfType(namespace.entity, ...modelTypes));
  });
  return result;
}

/**
 *
 */
export function getAllEntitiesOfType(metaEd: MetaEdEnvironment, ...modelTypes: ModelType[]): ModelBase[] {
  return getEntitiesOfTypeForNamespaces(Array.from(metaEd.namespace.values()), ...modelTypes);
}

/**
 *
 */
export function getEntityFromNamespaceChain(
  entityName: string,
  entityNamespaceName: string,
  workingNamespace: Namespace,
  ...modelTypes: ModelType[]
): ModelBase | null {
  const namespaceChain = [workingNamespace, ...workingNamespace.dependencies];
  // eslint-disable-next-line no-restricted-syntax
  for (const namespaceInChain of namespaceChain) {
    if (namespaceInChain.namespaceName === entityNamespaceName) {
      // eslint-disable-next-line no-restricted-syntax
      for (const modelType of modelTypes) {
        if (namespaceInChain.entity[modelType].has(entityName)) {
          return namespaceInChain.entity[modelType].get(entityName);
        }
      }
    }
  }

  return null;
}

/**
 *
 */
export function getEntityFromNamespace(
  entityName: string,
  namespace: Namespace,
  ...modelTypes: ModelType[]
): ModelBase | null {
  // eslint-disable-next-line no-restricted-syntax
  for (const modelType of modelTypes) {
    if (namespace.entity[modelType].has(entityName)) {
      return namespace.entity[modelType].get(entityName);
    }
  }

  return null;
}

/**
 * Returns the first matching entity.
 */
export function findFirstEntity(entityName: string, namespaces: Namespace[], ...modelTypes: ModelType[]): ModelBase | null {
  // eslint-disable-next-line no-restricted-syntax
  for (const namespace of namespaces) {
    const firstEntity = getEntityFromNamespace(entityName, namespace, ...modelTypes);
    if (firstEntity != null) return firstEntity;
  }
  return null;
}

/**
 *
 */
function addEntity(repository: EntityRepository, entity: ModelBase) {
  repository[entity.type].set(entity.metaEdName, entity);
}

/**
 *
 */
export function addEntityForNamespace(entity: ModelBase) {
  addEntity(entity.namespace.entity, entity);
}
