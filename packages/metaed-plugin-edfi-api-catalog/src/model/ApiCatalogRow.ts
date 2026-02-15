// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/**
 * Represents a single row in the API catalog spreadsheet
 */
export type ApiCatalogRow = {
  project: string;
  version: string;
  resourceName: string;
  isDescriptor: boolean;
  propertyName: string;
  description: string;
  dataType: string;
  minLength: number | null;
  maxLength: number | null;
  validationRegEx: string | null;
  isIdentityKey: boolean;
  isNullable: boolean;
  isRequired: boolean;
};

/**
 * Schema definition for Excel export using write-excel-file library
 */
export const apiCatalogSchema = [
  {
    column: 'Project',
    type: String,
    width: 20,
    value: (row: ApiCatalogRow) => row.project,
  },
  {
    column: 'Version',
    type: String,
    width: 15,
    value: (row: ApiCatalogRow) => row.version,
  },
  {
    column: 'Resource Name',
    type: String,
    width: 30,
    value: (row: ApiCatalogRow) => row.resourceName,
  },
  {
    column: 'Is Descriptor',
    type: Boolean,
    width: 15,
    value: (row: ApiCatalogRow) => row.isDescriptor,
  },
  {
    column: 'Property Name',
    type: String,
    width: 30,
    value: (row: ApiCatalogRow) => row.propertyName,
  },
  {
    column: 'Description',
    type: String,
    width: 50,
    value: (row: ApiCatalogRow) => row.description,
  },
  {
    column: 'Data Type',
    type: String,
    width: 20,
    value: (row: ApiCatalogRow) => row.dataType,
  },
  {
    column: 'Min Length',
    type: Number,
    width: 15,
    value: (row: ApiCatalogRow) => row.minLength,
  },
  {
    column: 'Max Length',
    type: Number,
    width: 15,
    value: (row: ApiCatalogRow) => row.maxLength,
  },
  {
    column: 'Validation RegEx',
    type: String,
    width: 40,
    value: (row: ApiCatalogRow) => row.validationRegEx,
  },
  {
    column: 'Is Identity Key',
    type: Boolean,
    width: 15,
    value: (row: ApiCatalogRow) => row.isIdentityKey,
  },
  {
    column: 'Is Nullable',
    type: Boolean,
    width: 15,
    value: (row: ApiCatalogRow) => row.isNullable,
  },
  {
    column: 'Is Required',
    type: Boolean,
    width: 15,
    value: (row: ApiCatalogRow) => row.isRequired,
  },
];

export const apiCatalogWorksheetName = 'API Catalog';
