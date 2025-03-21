// SPDX-License-Identifier: Apache-2.0
// Licensed to the Ed-Fi Alliance under one or more agreements.
// The Ed-Fi Alliance licenses this file to you under the Apache License, Version 2.0.
// See the LICENSE and NOTICES files in the project root for more information.

import { MetaEdEnvironment, EnhancerResult, Descriptor, getAllEntitiesOfType } from '@edfi/metaed-core';
import { StringSimpleType, NoStringSimpleType } from './schema/StringSimpleType';

export interface DescriptorEdfiXsd {
  xsdDescriptorName: string;
  xsdDescriptorNameWithExtension: string;
  xsdIsMapType: boolean;
  xsdHasPropertiesOrMapType: boolean;
  xsdDescriptorExtendedReferenceType: StringSimpleType;
}

const enhancerName = 'DescriptorSetupEnhancer';

export function addDescriptorEdfiXsdTo(descriptor: Descriptor) {
  if (descriptor.data.edfiXsd == null) descriptor.data.edfiXsd = {};

  Object.assign(descriptor.data.edfiXsd, {
    xsdDescriptorName: '',
    xsdDescriptorNameWithExtension: '',
    xsdIsMapType: false,
    xsdHasPropertiesOrMapType: false,
    xsdDescriptorExtendedReferenceType: NoStringSimpleType,
  });
}

export function enhance(metaEd: MetaEdEnvironment): EnhancerResult {
  (getAllEntitiesOfType(metaEd, 'descriptor') as Descriptor[]).forEach((descriptor: Descriptor) => {
    addDescriptorEdfiXsdTo(descriptor);
  });

  return {
    enhancerName,
    success: true,
  };
}
