// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/**
 * Represents a single property row in the Properties worksheet
 */
export type PropertyRow = {
  project: string;
  version: string;
  resourceName: string;
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
 * Represents a single resource row in the Resources worksheet
 */
export type ResourceRow = {
  project: string;
  version: string;
  resourceName: string;
  resourceDescription: string;
  domains: string;
};

/**
 * Schema definition for Properties worksheet
 */
export const propertiesSchema = [
  {
    column: 'Project',
    type: String,
    width: 20,
    value: (row: PropertyRow) => row.project,
  },
  {
    column: 'Version',
    type: String,
    width: 15,
    value: (row: PropertyRow) => row.version,
  },
  {
    column: 'Resource Name',
    type: String,
    width: 30,
    value: (row: PropertyRow) => row.resourceName,
  },
  {
    column: 'Property Name',
    type: String,
    width: 30,
    value: (row: PropertyRow) => row.propertyName,
  },
  {
    column: 'Property Description',
    type: String,
    width: 50,
    value: (row: PropertyRow) => row.description,
  },
  {
    column: 'Data Type',
    type: String,
    width: 20,
    value: (row: PropertyRow) => row.dataType,
  },
  {
    column: 'Min Length',
    type: Number,
    width: 15,
    value: (row: PropertyRow) => row.minLength,
  },
  {
    column: 'Max Length',
    type: Number,
    width: 15,
    value: (row: PropertyRow) => row.maxLength,
  },
  {
    column: 'Validation RegEx',
    type: String,
    width: 40,
    value: (row: PropertyRow) => row.validationRegEx,
  },
  {
    column: 'Is Identity Key',
    type: Boolean,
    width: 15,
    value: (row: PropertyRow) => row.isIdentityKey,
  },
  {
    column: 'Is Nullable',
    type: Boolean,
    width: 15,
    value: (row: PropertyRow) => row.isNullable,
  },
  {
    column: 'Is Required',
    type: Boolean,
    width: 15,
    value: (row: PropertyRow) => row.isRequired,
  },
];

/**
 * Schema definition for Resources worksheet
 */
export const resourcesSchema = [
  {
    column: 'Project',
    type: String,
    width: 20,
    value: (row: ResourceRow) => row.project,
  },
  {
    column: 'Version',
    type: String,
    width: 15,
    value: (row: ResourceRow) => row.version,
  },
  {
    column: 'Resource Name',
    type: String,
    width: 30,
    value: (row: ResourceRow) => row.resourceName,
  },
  {
    column: 'Resource Description',
    type: String,
    width: 60,
    value: (row: ResourceRow) => row.resourceDescription,
  },
  {
    column: 'Domains',
    type: String,
    width: 40,
    value: (row: ResourceRow) => row.domains,
  },
];

export const propertiesWorksheetName = 'Properties';
export const resourcesWorksheetName = 'Resources';
