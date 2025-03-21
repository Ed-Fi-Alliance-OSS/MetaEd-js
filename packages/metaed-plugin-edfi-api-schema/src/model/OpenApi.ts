// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

/* eslint-disable no-use-before-define */

/**
 * The set of properties on a OpenApiObject.
 */
export type OpenApiProperties = { [propertyName: string]: OpenApiProperty };

/**
 * The OpenApiProperty representing an object, which has properties
 */
export type OpenApiObject = {
  type: 'object';
  description?: string;
  properties: OpenApiProperties;
  required?: string[];
};

/**
 * The OpenApiProperty representing a reference to another OpenApiObject
 */
export type OpenApiReference = {
  $ref: string;
};

/**
 * The OpenApiProperty representing an array, which has items
 */
export type OpenApiArray = {
  type: 'array';
  description?: string;
  items: OpenApiProperty;
  minItems: number;
  uniqueItems: false;
};

/**
 * OpenApiProperty is either an object, array, reference or simple type
 */
export type OpenApiProperty =
  | OpenApiObject
  | OpenApiArray
  | OpenApiReference
  | {
      type: 'string';
      description: string;
      format?: 'date' | 'date-time' | 'time' | 'int32';
      minLength?: number;
      maxLength?: number;
      pattern?: string;
    }
  | { type: 'integer'; description: string; minimum?: number; maximum?: number }
  | { type: 'number'; description: string; minimum?: number; maximum?: number }
  | { type: 'boolean'; description: string };

/**
 * The null object OpenApiProperty
 */
export const NoOpenApiProperty: OpenApiProperty = Object.freeze({
  type: 'boolean',
  description: 'NoOpenApiProperty',
});

/**
 * The null object OpenApiObject
 */
export const NoOpenApiObject: OpenApiObject = Object.freeze({
  type: 'object',
  description: 'NoOpenApiObject',
  properties: {},
});
