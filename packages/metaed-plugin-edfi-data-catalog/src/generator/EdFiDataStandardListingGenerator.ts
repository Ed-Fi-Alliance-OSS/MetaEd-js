// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import * as R from 'ramda';
import { orderByProp } from '@edfi/metaed-core';
import { MetaEdEnvironment, GeneratedOutput, GeneratorResult, Namespace } from '@edfi/metaed-core';
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
import { NamespaceDataCatalogData } from '../model/NamespaceDataCatalogData';

/**
 * Generator that creates an Excel file with data standard listing information.
 * Consumes data prepared by the DataCatalogEnhancer.
 */
export async function generate(metaEd: MetaEdEnvironment): Promise<GeneratorResult> {
  const domainRows: DomainRow[] = [];
  const entityRows: EntityRow[] = [];
  const elementRows: ElementRow[] = [];

  metaEd.namespace.forEach((namespace: Namespace) => {
    const dataCatalogData = namespace.data?.edfiDataCatalog as NamespaceDataCatalogData | undefined;
    if (!dataCatalogData) {
      throw new Error(
        `Missing edfiDataCatalog data for namespace "${namespace.namespaceName}". ` +
          'Ensure that the DataCatalogEnhancer has run before the EdFiDataStandardListingGenerator.',
      );
    }

    domainRows.push(...dataCatalogData.domainRows);
    entityRows.push(...dataCatalogData.entityRows);
    elementRows.push(...dataCatalogData.elementRows);
  });

  const orderedDomainRows: DomainRow[] = R.sortWith([orderByProp('projectVersion'), orderByProp('domainName')])(domainRows);

  const orderedEntityRows: EntityRow[] = R.sortWith([
    orderByProp('projectVersion'),
    orderByProp('domainName'),
    orderByProp('domainEntityName'),
  ])(entityRows);

  const orderedElementRows: ElementRow[] = R.sortWith([
    orderByProp('projectVersion'),
    orderByProp('domainName'),
    orderByProp('domainEntityName'),
    orderByProp('elementName'),
  ])(elementRows);

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
      folderName: 'Data-Catalog',
      fileName: 'Data-Catalog.xlsx',
      resultString: '',
      resultStream: Buffer.from(fileAsArrayBuffer),
    },
  ];

  return {
    generatorName: 'edfiDataCatalog.DataStandardListingGenerator',
    generatedOutput,
  };
}
