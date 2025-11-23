// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import { orderByProp } from '@edfi/metaed-core';
import { MetaEdEnvironment, GeneratedOutput, GeneratorResult, Namespace, Domain, EntityProperty } from '@edfi/metaed-core';
import writeXlsxFile from 'write-excel-file';
import { umlDatatypeMatrix } from '../enhancer/DatatypeLookup';
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
      domainName: domain.metaEdName,
      domainDescription: domain.documentation || '',
    });
  });

  return domainRows;
}

function extractEntitiesFromNamespace(namespace: Namespace): EntityRow[] {
  const entityRows: EntityRow[] = [];

  namespace.entity.domain.forEach((domain: Domain) => {
    // Add entities directly in domain
    domain.entities.forEach((entity) => {
      entityRows.push({
        projectVersion: namespace.projectVersion,
        domainName: domain.metaEdName,
        domainEntityName: entity.metaEdName,
        domainEntityDescription: entity.documentation || '',
      });
    });

    // Add entities in subdomains
    domain.subdomains.forEach((subdomain) => {
      subdomain.entities.forEach((entity) => {
        entityRows.push({
          projectVersion: namespace.projectVersion,
          domainName: domain.metaEdName,
          domainEntityName: entity.metaEdName,
          domainEntityDescription: entity.documentation || '',
        });
      });
    });
  });

  return entityRows;
}

function extractElementsFromNamespace(namespace: Namespace): ElementRow[] {
  const elementRows: ElementRow[] = [];

  namespace.entity.domain.forEach((domain: Domain) => {
    // Process entities directly in domain
    domain.entities.forEach((entity) => {
      entity.properties.forEach((property: EntityProperty) => {
        elementRows.push({
          projectVersion: namespace.projectVersion,
          domainName: domain.metaEdName,
          domainEntityName: entity.metaEdName,
          elementName: property.metaEdName,
          elementDescription: property.documentation || '',
          elementDataType: umlDatatypeMatrix[property.type] || '',
        });
      });
    });

    // Process entities in subdomains
    domain.subdomains.forEach((subdomain) => {
      subdomain.entities.forEach((entity) => {
        entity.properties.forEach((property: EntityProperty) => {
          elementRows.push({
            projectVersion: namespace.projectVersion,
            domainName: domain.metaEdName,
            domainEntityName: entity.metaEdName,
            elementName: property.metaEdName,
            elementDescription: property.documentation || '',
            elementDataType: umlDatatypeMatrix[property.type] || '',
          });
        });
      });
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
