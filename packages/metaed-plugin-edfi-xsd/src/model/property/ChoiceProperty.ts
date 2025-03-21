// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, EntityProperty, ChoiceProperty } from '@edfi/metaed-core';
import { EntityPropertyEdfiXsd } from './EntityProperty';

export type ChoicePropertyEdfiXsd = EntityPropertyEdfiXsd & {
  xsdProperties: EntityProperty[];
  xsdIsChoice: boolean;
};

// Enhancer for object setup
const enhancerName = 'ChoicePropertySetupEnhancer';

export function addChoicePropertyEdfiXsdTo(property: ChoiceProperty) {
  if (property.data.edfiXsd == null) property.data.edfiXsd = {};

  Object.assign(property.data.edfiXsd, {
    xsdProperties: [],
    xsdIsChoice: true,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.choice.forEach((property: ChoiceProperty) => {
    addChoicePropertyEdfiXsdTo(property);
  });

  return {
    enhancerName,
    success: true,
  };
}
