// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, DescriptorProperty } from '@edfi/metaed-core';
import { EntityPropertyEdfiXsd } from './EntityProperty';

export type DescriptorPropertyEdfiXsd = EntityPropertyEdfiXsd & {
  xsdIsDescriptor: boolean;
  xsdDescriptorName: () => string;
  xsdDescriptorNameWithExtension: () => string;
};

// Enhancer for object setup
const enhancerName = 'DescriptorPropertySetupEnhancer';

function xsdDescriptorName(descriptorProperty: DescriptorProperty): () => string {
  return () => descriptorProperty.referencedEntity.data.edfiXsd.xsdDescriptorName;
}

function xsdDescriptorNameWithExtension(descriptorProperty: DescriptorProperty): () => string {
  return () => descriptorProperty.referencedEntity.data.edfiXsd.xsdDescriptorNameWithExtension;
}

export function addDescriptorPropertyEdfiXsdTo(property: DescriptorProperty) {
  if (property.data.edfiXsd == null) property.data.edfiXsd = {};

  Object.assign(property.data.edfiXsd, {
    xsdIsDescriptor: true,
    xsdDescriptorName: xsdDescriptorName(property),
    xsdDescriptorNameWithExtension: xsdDescriptorNameWithExtension(property),
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  metaEd.propertyIndex.descriptor.forEach((property: DescriptorProperty) => {
    addDescriptorPropertyEdfiXsdTo(property);
  });

  return {
    enhancerName,
    success: true,
  };
}
