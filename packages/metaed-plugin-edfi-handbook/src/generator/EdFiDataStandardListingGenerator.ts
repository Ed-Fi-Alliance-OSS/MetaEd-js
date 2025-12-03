// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import {
  AssociationExtension,
  DecimalProperty,
  DomainEntityExtension,
  IntegerProperty,
  orderByProp,
  PropertyType,
  StringProperty,
  Subdomain,
  TopLevelEntity,
} from '@edfi/metaed-core';
import { MetaEdEnvironment, GeneratedOutput, GeneratorResult, Namespace, Domain, EntityProperty } from '@edfi/metaed-core';
import writeXlsxFile from 'write-excel-file';

import {
  DomainRow,
  EntityRow,
  ElementRow,
  domainSchema,
  entitySchema,
  elementSchema,
  domainsWorksheetName,
  entitiesWorksheetName,
  elementsWorksheetName,
} from '../model/DataStandardListingRow';

type ExtensionEntity = DomainEntityExtension | AssociationExtension;

function extractDataType(property: EntityProperty): string {
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
 * Finds the domain that contains the given entity by searching through all domains
 * and subdomains in the namespace and its dependencies.
 */
function findDomainForEntity(entity: TopLevelEntity): Domain | Subdomain | null {
  const namespacesToSearch = [entity.namespace, ...entity.namespace.dependencies];

  return namespacesToSearch.reduce((found: Domain | Subdomain | null, namespace) => {
    if (found) return found;

    const domains = Array.from(namespace.entity.domain.values());

    return domains.reduce((domainFound: Domain | Subdomain | null, domain) => {
      if (domainFound) return domainFound;

      // Check if entity is in the domain's entities
      if (domain.entities.includes(entity)) {
        return domain;
      }

      // Check subdomains
      const subdomain = domain.subdomains.find((sub) => sub.entities.includes(entity));
      return subdomain || null;
    }, null);
  }, null);
}

/**
 * Gets all extension entities from the namespace with their resolved domain names.
 */
function getExtensionsWithDomains(namespace: Namespace): Array<{ extension: ExtensionEntity; domainName: string }> {
  const extensions: ExtensionEntity[] = [
    ...namespace.entity.domainEntityExtension.values(),
    ...namespace.entity.associationExtension.values(),
  ];

  return extensions
    .filter((extension) => extension.baseEntity != null)
    .map((extension) => {
      const domain = findDomainForEntity(extension.baseEntity!);
      return { extension, domainName: domain?.metaEdName || 'Unknown' };
    });
}

/**
 * Extracts extension entities (DomainEntityExtension and AssociationExtension) from the namespace.
 * Uses the extension's base entity to determine the domain.
 */
function extractExtensionEntitiesFromNamespace(namespace: Namespace): EntityRow[] {
  return getExtensionsWithDomains(namespace).map(({ extension, domainName }) => ({
    projectVersion: extension.namespace.projectVersion || namespace.projectVersion,
    domainName,
    namespace: extension.namespace.namespaceName || 'extension',
    domainEntityName: extension.metaEdName,
    domainEntityDescription: extension.documentation || '',
  }));
}

/**
 * Extracts elements (properties) from extension entities.
 * Uses the extension's base entity to determine the domain.
 */
function extractExtensionElementsFromNamespace(namespace: Namespace): ElementRow[] {
  return getExtensionsWithDomains(namespace).flatMap(({ extension, domainName }) =>
    extension.properties.map((property: EntityProperty) => ({
      projectVersion: extension.namespace.projectVersion || namespace.projectVersion,
      domainName,
      namespace: extension.namespace.namespaceName || 'extension',
      domainEntityName: extension.metaEdName,
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

function mapDomainToEntities(namespace: Namespace, domain: Domain | Subdomain): EntityRow[] {
  return domain.entities.map((entity: TopLevelEntity) => ({
    projectVersion: namespace.projectVersion,
    domainName: domain.metaEdName,
    namespace: namespace.namespaceName,
    domainEntityName: entity.metaEdName,
    domainEntityDescription: entity.documentation || '',
  }));
}

function extractEntitiesFromNamespace(namespace: Namespace): EntityRow[] {
  const entityRows: EntityRow[] = [];

  namespace.entity.domain.forEach((domain: Domain) => {
    entityRows.push(...mapDomainToEntities(namespace, domain));

    // Add entities in subdomains
    domain.subdomains.forEach((subdomain) => {
      entityRows.push(...mapDomainToEntities(namespace, subdomain));
    });
  });

  return entityRows;
}

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

function extractElementsFromNamespace(namespace: Namespace): ElementRow[] {
  const elementRows: ElementRow[] = [];

  namespace.entity.domain.forEach((domain: Domain) => {
    elementRows.push(...mapDomainToElements(namespace, domain));

    domain.subdomains.forEach((subDomain: Subdomain) => {
      elementRows.push(...mapDomainToElements(namespace, subDomain));
    });
  });

  return elementRows;
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const domainRows: DomainRow[] = [];
  const entityRows: EntityRow[] = [];
  const elementRows: ElementRow[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    domainRows.push(...extractDomainsFromNamespace(namespace));
    entityRows.push(...extractEntitiesFromNamespace(namespace));
    elementRows.push(...extractElementsFromNamespace(namespace));

    // Add extension entities and elements
    entityRows.push(...extractExtensionEntitiesFromNamespace(namespace));
    elementRows.push(...extractExtensionElementsFromNamespace(namespace));
  });

  // Sort rows by appropriate fields
  const orderedDomainRows: DomainRow[] = R.sortWith([orderByProp('projectVersion'), orderByProp('domainName')])(domainRows);

  const orderedEntityRows: EntityRow[] = R.sortWith([
    orderByProp('projectVersion'),
    orderByProp('domainName'),
    orderByProp('domainEntityName'),
  ])(entityRows);

  // Sort elements by entity name followed by property name
  const orderedElementRows: ElementRow[] = R.sortWith([orderByProp('domainEntityName'), orderByProp('elementName')])(
    elementRows,
  );

  // @ts-ignore - TypeScript typings here don't recognize Blob return type
  const fileAsBlob: Blob = await writeXlsxFile([orderedDomainRows, orderedEntityRows, orderedElementRows], {
    buffer: true,
    schema: [domainSchema, entitySchema, elementSchema],
    sheets: [domainsWorksheetName, entitiesWorksheetName, elementsWorksheetName],
  });
  const fileAsArrayBuffer = await fileAsBlob.arrayBuffer();

  const generatedOutput: GeneratedOutput[] = [
    {
      name: 'Data Standard Listing Excel',
      namespace: 'Documentation',
      folderName: 'Data-Standard-Listing',
      fileName: 'Data-Standard-Listing.xlsx',
      resultString: '',
      resultStream: Buffer.from(fileAsArrayBuffer),
    },
  ];

  return {
    generatorName: 'edfiHandbook.DataStandardListingGenerator',
    generatedOutput,
  };
}
