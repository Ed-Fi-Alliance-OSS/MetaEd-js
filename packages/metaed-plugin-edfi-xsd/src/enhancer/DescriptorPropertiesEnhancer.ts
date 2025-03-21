// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, Descriptor } from '@edfi/metaed-core';
import { getAllEntitiesOfType } from '@edfi/metaed-core';
import { DescriptorEdfiXsd } from '../model/Descriptor';

const enhancerName = 'DescriptorPropertiesEnhancer';

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'descriptor') as Descriptor[]).forEach((descriptor: Descriptor) => {
    const descriptorXsdData = descriptor.data.edfiXsd as DescriptorEdfiXsd;
    descriptorXsdData.xsdDescriptorName = `${descriptor.metaEdName}Descriptor`;
    descriptorXsdData.xsdDescriptorNameWithExtension = descriptor.namespace.projectExtension
      ? `${descriptor.namespace.projectExtension}-${descriptorXsdData.xsdDescriptorName}`
      : descriptorXsdData.xsdDescriptorName;
    descriptorXsdData.xsdIsMapType = descriptor.isMapTypeRequired || descriptor.isMapTypeOptional;
    descriptorXsdData.xsdHasPropertiesOrMapType = descriptorXsdData.xsdIsMapType || descriptor.properties.length > 0;
  });

  return {
    enhancerName,
    success: true,
  };
}
