// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

export interface DomainRow {
  projectVersion: string;
  domainName: string;
  domainDescription: string;
}

export interface EntityRow {
  projectVersion: string;
  domainName: string;
  domainEntityName: string;
  domainEntityDescription: string;
}

export interface ElementRow {
  projectVersion: string;
  domainName: string;
  domainEntityName: string;
  elementName: string;
  elementDescription: string;
  elementDataType: string;
}

export const domainSchema = [
  {
    column: 'Project Version',
    type: String,
    width: 20,
    value: (row: DomainRow) => row.projectVersion,
  },
  {
    column: 'Domain name',
    type: String,
    width: 30,
    value: (row: DomainRow) => row.domainName,
  },
  {
    column: 'Domain description',
    type: String,
    width: 50,
    value: (row: DomainRow) => row.domainDescription,
  },
];

export const entitySchema = [
  {
    column: 'Project Version',
    type: String,
    width: 20,
    value: (row: EntityRow) => row.projectVersion,
  },
  {
    column: 'Domain name',
    type: String,
    width: 30,
    value: (row: EntityRow) => row.domainName,
  },
  {
    column: 'Domain entity name',
    type: String,
    width: 30,
    value: (row: EntityRow) => row.domainEntityName,
  },
  {
    column: 'Domain entity description',
    type: String,
    width: 50,
    value: (row: EntityRow) => row.domainEntityDescription,
  },
];

export const elementSchema = [
  {
    column: 'Project Version',
    type: String,
    width: 20,
    value: (row: ElementRow) => row.projectVersion,
  },
  {
    column: 'Domain name',
    type: String,
    width: 30,
    value: (row: ElementRow) => row.domainName,
  },
  {
    column: 'Domain entity name',
    type: String,
    width: 30,
    value: (row: ElementRow) => row.domainEntityName,
  },
  {
    column: 'Element name',
    type: String,
    width: 30,
    value: (row: ElementRow) => row.elementName,
  },
  {
    column: 'Element description',
    type: String,
    width: 50,
    value: (row: ElementRow) => row.elementDescription,
  },
  {
    column: 'Element data type',
    type: String,
    width: 20,
    value: (row: ElementRow) => row.elementDataType,
  },
];

export const domainsWorksheetName = 'Domains';
export const entitiesWorksheetName = 'Entities';
export const elementsWorksheetName = 'Elements';
