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

  // Sort elements by entity name followed by property name
  return R.sortWith([orderByProp('domainEntityName'), orderByProp('elementName')])(elementRows);
}

export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const domainRows: DomainRow[] = [];
  const entityRows: EntityRow[] = [];
  const elementRows: ElementRow[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    domainRows.push(...extractDomainsFromNamespace(namespace));
    entityRows.push(...extractEntitiesFromNamespace(namespace));
    elementRows.push(...extractElementsFromNamespace(namespace));
  });

  // Sort rows by appropriate fields
  const orderedDomainRows: DomainRow[] = R.sortWith([orderByProp('projectVersion'), orderByProp('domainName')])(domainRows);

  const orderedEntityRows: EntityRow[] = R.sortWith([
    orderByProp('projectVersion'),
    orderByProp('domainName'),
    orderByProp('domainEntityName'),
  ])(entityRows);

  // @ts-ignore - TypeScript typings here don't recognize Blob return type
  const fileAsBlob: Blob = await writeXlsxFile([orderedDomainRows, orderedEntityRows, elementRows], {
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
