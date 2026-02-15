// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import {
  DecimalProperty,
  IntegerProperty,
  orderByProp,
  PropertyType,
  StringProperty,
  Subdomain,
  TopLevelEntity,
  MetaEdEnvironment,
  EnhancerResult,
  Namespace,
  Domain,
  EntityProperty,
  Logger,
  getAllTopLevelEntities,
} from '@edfi/metaed-core';
import { DomainRow, EntityRow, ElementRow } from '../model/DataStandardListingRow';
import { NamespaceDataCatalogData } from '../model/NamespaceDataCatalogData';

/**
 * Extract data type string from an entity property
 */
export function extractDataType(property: EntityProperty): string {
  const typeConversion: { [type in PropertyType]: any } = {
    unknown: () => '',
    association: () => 'reference',
    boolean: () => 'Boolean',
    choice: () => 'reference',
    common: () => 'reference',
    currency: () => 'decimal(19,4)',
    date: () => 'date',
    datetime: () => 'timestamp',
    decimal: () => `decimal(${(property as DecimalProperty).totalDigits}, ${(property as DecimalProperty).decimalPlaces})`,
    descriptor: () => 'descriptor',
    domainEntity: () => 'reference',
    duration: () => 'string(30)',
    enumeration: () => 'reference',
    inlineCommon: () => 'reference',
    integer: () => ((property as IntegerProperty).hasBigHint ? 'int64' : 'int32'),
    percent: () => 'decimal(5, 4)',
    schoolYearEnumeration: () => 'reference',
    sharedDecimal: () =>
      `decimal(${(property as DecimalProperty).totalDigits}, ${(property as DecimalProperty).decimalPlaces})`,
    sharedInteger: () => ((property as IntegerProperty).hasBigHint ? 'int64' : 'int32'),
    sharedShort: () => 'int16',
    sharedString: () => `string(${(property as StringProperty).minLength || 0},${(property as StringProperty).maxLength})`,
    short: () => 'int16',
    string: () => `string(${(property as StringProperty).minLength || 0},${(property as StringProperty).maxLength})`,
    time: () => 'time',
    year: () => 'int16',
  };

  return typeConversion[property.type]();
}

/**
 * Extract domain rows from a namespace
 */
function extractDomainsFromNamespace(namespace: Namespace): DomainRow[] {
  const domainRows: DomainRow[] = [];

  namespace.entity.domain.forEach((domain: Domain) => {
    domainRows.push({
      projectVersion: namespace.projectVersion,
      namespace: namespace.namespaceName,
      domainName: domain.metaEdName,
      domainDescription: domain.documentation || '',
    });
  });

  return domainRows;
}

/**
 * Process all domains and subdomains in a namespace using a strategy function
 */
function processDomainsAndSubdomains<T>(
  namespace: Namespace,
  processDomain: (namespace: Namespace, domain: Domain | Subdomain, collectedEntities: Set<string>) => T[],
): { results: T[]; collectedEntities: Set<string> } {
  const results: T[] = [];
  const collectedEntities = new Set<string>();

  namespace.entity.domain.forEach((domain: Domain) => {
    domain.entities.forEach((entity) => collectedEntities.add(entity.metaEdName));
    results.push(...processDomain(namespace, domain, collectedEntities));

    domain.subdomains.forEach((subdomain) => {
      subdomain.entities.forEach((entity) => collectedEntities.add(entity.metaEdName));
      results.push(...processDomain(namespace, subdomain, collectedEntities));
    });
  });

  return { results, collectedEntities };
}

/**
 * Map a domain or subdomain to entity rows
 */
function mapDomainToEntities(namespace: Namespace, domain: Domain | Subdomain): EntityRow[] {
  return domain.entities.map((entity: TopLevelEntity) => ({
    projectVersion: namespace.projectVersion,
    domainName: domain.metaEdName,
    namespace: namespace.namespaceName,
    domainEntityName: entity.metaEdName,
    domainEntityDescription: entity.documentation || '',
  }));
}

/**
 * Extract entity rows from a namespace
 */
function extractEntitiesFromNamespace(namespace: Namespace): EntityRow[] {
  const { results: entityRows, collectedEntities } = processDomainsAndSubdomains(namespace, (ns, domain) => {
    Logger.verbose(`Extracting entities from domain ${domain.metaEdName} in namespace ${ns.namespaceName}...`);
    return mapDomainToEntities(ns, domain);
  });

  // An extension might not place entities into a domain, so we also want to extract any top level entities that are not in a domain
  getAllTopLevelEntities(namespace.entity).forEach((entity) => {
    if (!collectedEntities.has(entity.metaEdName)) {
      Logger.verbose(`Extracting entities that are not in a domain from namespace ${namespace.namespaceName}...`);
      collectedEntities.add(entity.metaEdName);

      entityRows.push({
        projectVersion: namespace.projectVersion,
        domainName: '',
        namespace: namespace.namespaceName,
        domainEntityName: entity.metaEdName,
        domainEntityDescription: entity.documentation || '',
      });
    }
  });

  return entityRows;
}

/**
 * Map a domain or subdomain to element rows
 */
function mapDomainToElements(namespace: Namespace, domain: Domain | Subdomain): ElementRow[] {
  return domain.entities.flatMap((entity) =>
    entity.properties.map((property: EntityProperty) => ({
      projectVersion: namespace.projectVersion,
      domainName: domain.metaEdName,
      namespace: namespace.namespaceName,
      domainEntityName: entity.metaEdName,
      elementName: property.metaEdName,
      elementDescription: property.documentation || '',
      isPartOfIdentity: property.isPartOfIdentity,
      isCollection: property.isCollection,
      isRequired: property.isRequired || property.isRequiredCollection,
      isDeprecated: property.isDeprecated,
      elementDataType: extractDataType(property),
    })),
  );
}

/**
 * Extract element rows from a namespace
 */
function extractElementsFromNamespace(namespace: Namespace): ElementRow[] {
  const { results: elementRows, collectedEntities } = processDomainsAndSubdomains(namespace, (ns, domain) =>
    mapDomainToElements(ns, domain),
  );

  // Include elements for any top-level entities that aren't placed into a domain
  getAllTopLevelEntities(namespace.entity).forEach((entity) => {
    if (!collectedEntities.has(entity.metaEdName)) {
      Logger.verbose(`Extracting elements that are not in a domain from namespace ${namespace.namespaceName}...`);
      collectedEntities.add(entity.metaEdName);

      elementRows.push(
        ...entity.properties.map((property: EntityProperty) => ({
          projectVersion: namespace.projectVersion,
          domainName: '',
          namespace: namespace.namespaceName,
          domainEntityName: entity.metaEdName,
          elementName: property.metaEdName,
          elementDescription: property.documentation || '',
          isPartOfIdentity: property.isPartOfIdentity,
          isCollection: property.isCollection,
          isRequired: property.isRequired || property.isRequiredCollection,
          isDeprecated: property.isDeprecated,
          elementDataType: extractDataType(property),
        })),
      );
    }
  });

  return R.sortWith([orderByProp('domainEntityName'), orderByProp('elementName')])(elementRows);
}

/**
 * Enhancer that extracts domain, entity, and element data from each namespace
 * and stores it on the namespace for consumption by the generator.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    Logger.verbose(`Enhancing namespace ${namespace.namespaceName} with data catalog information...`);

    if (namespace.data.edfiDataCatalog == null) namespace.data.edfiDataCatalog = {};

    const dataCatalog = namespace.data.edfiDataCatalog as NamespaceDataCatalogData;
    dataCatalog.domainRows = extractDomainsFromNamespace(namespace);
    dataCatalog.entityRows = extractEntitiesFromNamespace(namespace);
    dataCatalog.elementRows = extractElementsFromNamespace(namespace);
  });

  return {
    enhancerName: 'DataCatalogEnhancer',
    success: true,
  };
}
