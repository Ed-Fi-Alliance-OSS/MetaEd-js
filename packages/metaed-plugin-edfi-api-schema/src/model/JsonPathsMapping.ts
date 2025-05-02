// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import type { EntityProperty, MetaEdPropertyPath } from '@edfi/metaed-core';
import type { JsonPath } from './api-schema/JsonPath';
import { FlattenedIdentityProperty } from './FlattenedIdentityProperty';

/**
 * A pairing of a JsonPath for the API document for a resource along with the source property
 * being expressed by that JsonPath.
 */
export type JsonPathPropertyPair = {
  jsonPath: JsonPath;
  sourceProperty: EntityProperty;

  /**
   * The FlattenedIdentityProperty this JsonPathsInfo is derived from. Used for tracking merges.
   */
  flattenedIdentityProperty: FlattenedIdentityProperty;
};

/**
 * For a MetaEdPropertyPath, this is the set of JsonPaths + source properties along with two pieces of additional
 * information. First, whether the paths/properties are "top level", meaning the paths are for a property
 * on the Domain Entity/Association it starts from as a whole (allowing for properties that are on e.g. inline commons to
 * be functionally on the DE/A itself). As an example, domain entity properties
 * have MetaEdPropertyPaths both for the property as a whole as well as separate MetaEdPropertyPaths that descend to the
 * the individual identity properties on the referenced entity.
 */
type BaseJsonPathsInfo = {
  /**
   * The JsonPathPropertyPairs for a MetaEdPropertyPath, in JsonPath sorted order
   */
  jsonPathPropertyPairs: JsonPathPropertyPair[];

  /**
   * The first part of the property path for these JsonPaths
   */
  initialPropertyPath: MetaEdPropertyPath;
  /**
   * Whether this JsonPathInfo is derived from an identity property on a common
   * collection. Only used for AllJsonPathsMapping.
   */
  isArrayIdentity: boolean;
};

/**
 * These JsonPaths are for a property on the entity it starts from as a whole (allowing for properties that
 * are on e.g. inline commons to be functionally on the DE/A itself).
 */
export type TopLevelJsonPathsInfo = BaseJsonPathsInfo & {
  isTopLevel: true;

  /**
   * The final EntityProperty in the MetaEdPropertyPath. This will be a property on the entity
   * itself, or one pulled up from a e.g. inline common or choice.
   */
  terminalProperty: EntityProperty;
};

/**
 * These JsonPaths are NOT for a property on the entity it starts from as a whole, meaning they are on a path
 * further down from the original entity e.g. a scalar identity field on a domain entity property.
 */
type NonTopLevelJsonPathsInfo = BaseJsonPathsInfo & {
  isTopLevel: false;
};

/**
 * The combination of top level and non top level JsonPathsInfo
 */
export type JsonPathsInfo = TopLevelJsonPathsInfo | NonTopLevelJsonPathsInfo;

/**
 * A mapping of dot-separated MetaEd property paths to corresponding JsonPaths of data elements
 * in the API document, along with the MetaEd property or properties that make up that path
 *
 * Includes both paths ending in references and paths ending in scalars. PropertyPaths ending in
 * scalars have a single JsonPath, while PropertyPaths ending in references may have multiple
 * JsonPaths, as document references are often composed of multiple elements.
 *
 * The JsonPaths array is always is sorted order.
 */
export type JsonPathsMapping = { [key: MetaEdPropertyPath]: JsonPathsInfo };
