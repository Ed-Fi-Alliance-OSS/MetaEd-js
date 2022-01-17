import {
  DomainItem,
  EntityProperty,
  EntityRepository,
  EnumerationItem,
  InterchangeItem,
  MetaEdEnvironment,
  ModelBase,
  ValidationFailure,
  TopLevelEntity,
  Namespace,
} from '@edfi/metaed-core';
import { getAllEntitiesNoSimpleTypesForNamespaces, getAllPropertiesForNamespaces } from '@edfi/metaed-core';

function getDomainItems(entity: EntityRepository): DomainItem[] {
  const result: DomainItem[] = [];
  entity.domain.forEach((domain) => result.push(...domain.domainItems));
  entity.subdomain.forEach((subdomain) => result.push(...subdomain.domainItems));
  return result;
}

function getDomainItemsForNamespaces(namespaces: Namespace[]): DomainItem[] {
  const result: DomainItem[] = [];
  namespaces.forEach((namespace: Namespace) => {
    result.push(...getDomainItems(namespace.entity));
  });
  return result;
}

function getEnumerationItems(entity: EntityRepository): EnumerationItem[] {
  const result: EnumerationItem[] = [];
  entity.enumeration.forEach((enumeration) => result.push(...enumeration.enumerationItems));
  entity.mapTypeEnumeration.forEach((mapType) => result.push(...mapType.enumerationItems));
  entity.schoolYearEnumeration.forEach((schoolYear) => result.push(...schoolYear.enumerationItems));
  return result;
}

function getEnumerationItemsForNamespaces(namespaces: Namespace[]): EnumerationItem[] {
  const result: EnumerationItem[] = [];
  namespaces.forEach((namespace: Namespace) => {
    result.push(...getEnumerationItems(namespace.entity));
  });
  return result;
}

function getInterchangeItems(entity: EntityRepository): InterchangeItem[] {
  const result: InterchangeItem[] = [];
  entity.interchange.forEach((interchange) => result.push(...interchange.elements, ...interchange.identityTemplates));
  entity.interchangeExtension.forEach((extension) => result.push(...extension.elements, ...extension.identityTemplates));
  return result;
}

function getInterchangeItemsForNamespaces(namespaces: Namespace[]): InterchangeItem[] {
  const result: InterchangeItem[] = [];
  namespaces.forEach((namespace: Namespace) => {
    result.push(...getInterchangeItems(namespace.entity));
  });
  return result;
}

export function validate(metaEd: MetaEdEnvironment): ValidationFailure[] {
  const failures: ValidationFailure[] = [];
  const namespaces: Namespace[] = Array.from(metaEd.namespace.values());
  const index: (DomainItem | EntityProperty | EnumerationItem | InterchangeItem | ModelBase | TopLevelEntity)[] = [
    ...getAllEntitiesNoSimpleTypesForNamespaces(namespaces),
    ...getAllPropertiesForNamespaces(metaEd.propertyIndex, namespaces),
    ...getDomainItemsForNamespaces(namespaces),
    ...getEnumerationItemsForNamespaces(namespaces),
    ...getInterchangeItemsForNamespaces(namespaces),
  ];

  const metaEdIdMap: Record<string, any> = {};
  index.forEach((item) => {
    if (!item.metaEdId) return;
    metaEdIdMap[item.metaEdId] = metaEdIdMap[item.metaEdId] || [];
    metaEdIdMap[item.metaEdId].push(item);
  });

  Object.keys(metaEdIdMap).forEach((metaEdId) => {
    if (metaEdIdMap[metaEdId].length <= 1) return;
    metaEdIdMap[metaEdId].forEach((entity) => {
      const metaEdName: string = entity.metaEdName ? entity.metaEdName : entity.shortDescription;
      failures.push({
        validatorName: 'MustNotDuplicateMetaEdId',
        category: 'warning',
        message: `MetaEdId '${entity.metaEdId}' on ${entity.typeHumanizedName} ${metaEdName} already exists on another entity. All MetaEdIds must be globally unique.`,
        sourceMap: entity.sourceMap.metaEdId,
        fileMap: null,
      });
    });
  });

  return failures;
}
