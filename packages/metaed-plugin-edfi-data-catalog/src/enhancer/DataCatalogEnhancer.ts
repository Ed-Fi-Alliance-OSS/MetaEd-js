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
  const entityRows: EntityRow[] = [];

  namespace.entity.domain.forEach((domain: Domain) => {
    entityRows.push(...mapDomainToEntities(namespace, domain));

    domain.subdomains.forEach((subdomain) => {
      entityRows.push(...mapDomainToEntities(namespace, subdomain));
    });
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
  const elementRows: ElementRow[] = [];

  namespace.entity.domain.forEach((domain: Domain) => {
    elementRows.push(...mapDomainToElements(namespace, domain));

    domain.subdomains.forEach((subDomain: Subdomain) => {
      elementRows.push(...mapDomainToElements(namespace, subDomain));
    });
  });

  return R.sortWith([orderByProp('domainEntityName'), orderByProp('elementName')])(elementRows);
}

/**
 * Enhancer that extracts domain, entity, and element data from each namespace
 * and stores it on the namespace for consumption by the generator.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.namespace.forEach((namespace: Namespace) => {
    const domainRows = extractDomainsFromNamespace(namespace);
    const entityRows = extractEntitiesFromNamespace(namespace);
    const elementRows = extractElementsFromNamespace(namespace);

    if (namespace.data.edfiDataCatalog == null) namespace.data.edfiDataCatalog = {};

    (namespace.data.edfiDataCatalog as NamespaceDataCatalogData).domainRows = domainRows;
    (namespace.data.edfiDataCatalog as NamespaceDataCatalogData).entityRows = entityRows;
    (namespace.data.edfiDataCatalog as NamespaceDataCatalogData).elementRows = elementRows;
  });

  return {
    enhancerName: 'DataCatalogEnhancer',
    success: true,
  };
}
