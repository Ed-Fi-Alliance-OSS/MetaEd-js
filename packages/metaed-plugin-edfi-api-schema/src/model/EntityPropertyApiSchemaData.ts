// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, EntityProperty, NoEntityProperty, getAllProperties } from '@edfi/metaed-core';
import { ApiPropertyMapping, NoApiPropertyMapping } from './ApiPropertyMapping';
import { NoReferenceElement, ReferenceComponent } from './ReferenceComponent';

export type EntityPropertyApiSchemaData = {
  /**
   * API shape metadata for this property.
   */
  apiMapping: ApiPropertyMapping;
  /**
   * If this property is on a subclass and has a naming collision issue, this is the superclass property
   * it has the naming collision issue with.
   */
  namingCollisionWithSuperclassProperty: EntityProperty;
  /**
   * If this property is on a superclass and has a naming collision issue, these the subclass properties
   * it has the naming collision issue with.
   */
  namingCollisionWithSubclassProperties: EntityProperty[];

  /**
   * The ReferenceComponent object graph for this property.
   */
  referenceComponent: ReferenceComponent;
};

/**
 * Initialize property with ApiSchema data placeholder.
 */
export function addEntityPropertyApiSchemaDataTo(property: EntityProperty) {
  if (property.data.edfiApiSchema == null) property.data.edfiApiSchema = {};

  Object.assign(property.data.edfiApiSchema, {
    apiMapping: NoApiPropertyMapping,
    namingCollisionWithSuperclassProperty: NoEntityProperty,
    namingCollisionWithSubclassProperties: [],
    referenceComponent: NoReferenceElement,
  });
}

/**
 * Initialize all properties with ApiSchema data placeholder.
 */
export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  getAllProperties(metaEd.propertyIndex).forEach((property: EntityProperty) => {
    addEntityPropertyApiSchemaDataTo(property);
  });

  return {
    enhancerName: 'EntityPropertyApiSchemaDataSetupEnhancer',
    success: true,
  };
}
